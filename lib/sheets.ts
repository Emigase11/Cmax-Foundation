import { createSign } from "node:crypto";

/**
 * Appends one row to a Google Sheet through the REST API.
 *
 * Signs a JWT with the service account key and trades it for an access token
 * by hand, so the site does not depend on the `googleapis` package: that
 * bundle is large enough to slow cold starts for one call per inquiry.
 *
 * Server-only: never import this from a "use client" component.
 */

type ServiceAccount = { client_email: string; private_key: string };

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

/** Tokens last an hour and Fluid Compute reuses instances, so caching pays. */
let cached: { token: string; expiresAt: number } | null = null;

const b64url = (input: string) => Buffer.from(input).toString("base64url");

/**
 * A key that is present but unusable must not look like an absent one: that
 * silence sends you hunting through Google's console for a fault that is
 * really a botched paste into the host's dashboard.
 */
function credentials(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
    if (!parsed.client_email || !parsed.private_key) {
      console.error(
        "[support] GOOGLE_SERVICE_ACCOUNT_JSON parsed but carries no client_email or private_key. Paste the whole key file.",
      );
      return null;
    }
    return {
      client_email: parsed.client_email,
      // Some dashboards store the key with its newlines escaped.
      private_key: parsed.private_key.replace(/\\n/g, "\n"),
    };
  } catch {
    console.error(
      "[support] GOOGLE_SERVICE_ACCOUNT_JSON is set but is not valid JSON. Paste the key file whole, braces included.",
    );
    return null;
  }
}

async function accessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expiresAt > now + 60) return cached.token;

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${claim}`)
    .sign(account.private_key, "base64url");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
  });
  if (!res.ok) throw new Error(`Google token request failed (${res.status})`);

  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!json.access_token) throw new Error("Google returned no access token.");

  cached = {
    token: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600),
  };
  return json.access_token;
}

/**
 * Returns false when no spreadsheet is configured, true once the row lands,
 * and throws when Google refuses it, so the caller can fall back to email.
 */
export async function appendInquiryRow(values: string[]): Promise<boolean> {
  const account = credentials();
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!account || !sheetId) return false;

  const range = process.env.GOOGLE_SHEETS_RANGE ?? "A:H";
  const token = await accessToken(account);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}` +
    `/values/${encodeURIComponent(range)}:append` +
    // RAW keeps a message that opens with "=" as text instead of a formula.
    `?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
  });
  if (!res.ok) {
    cached = null; // A revoked key must not be retried from the cache.
    throw new Error(`Google Sheets responded ${res.status}`);
  }
  return true;
}
