import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Receives Support a Mission inquiries.
 *
 * Delivery: when RESEND_API_KEY and SUPPORT_TO_EMAIL are set, the message is
 * emailed through Resend's REST API. In every case the inquiry is appended to
 * data/inquiries/<date>.jsonl when the filesystem is writable (local and
 * self-hosted deployments), so nothing is lost while email is not configured.
 */

const REASONS = new Set([
  "campaign",
  "mission",
  "partner",
  "recipient",
  "press",
  "other",
]);

type Payload = {
  name?: string;
  email?: string;
  reason?: string;
  organization?: string;
  message?: string;
  reference?: string;
  referenceLabel?: string;
  page?: string;
  website?: string; // honeypot
};

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Payload;
  try {
    const parsed: unknown = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json(
        { ok: false, error: "Invalid request." },
        { status: 400 },
      );
    }
    body = parsed as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  // Bots fill the hidden field; people never see it.
  if (clean(body.website)) return NextResponse.json({ ok: true });

  const inquiry = {
    receivedAt: new Date().toISOString(),
    name: clean(body.name, 200),
    email: clean(body.email, 200),
    reason: clean(body.reason, 40),
    organization: clean(body.organization, 200),
    message: clean(body.message, 5000),
    reference: clean(body.reference, 200),
    referenceLabel: clean(body.referenceLabel, 300),
    page: clean(body.page, 500),
  };

  if (
    !inquiry.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) ||
    !REASONS.has(inquiry.reason) ||
    inquiry.message.length < 10
  ) {
    return NextResponse.json(
      { ok: false, error: "Please complete name, email, reason and message." },
      { status: 422 },
    );
  }

  const results: string[] = [];

  // 1. Email via Resend when configured.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUPPORT_TO_EMAIL;
  const from =
    process.env.SUPPORT_FROM_EMAIL ??
    "CMAX Foundation website <onboarding@resend.dev>";
  if (apiKey && to) {
    const subject = `[Support a Mission] ${inquiry.reason}${inquiry.referenceLabel ? ` · ${inquiry.referenceLabel}` : ""} · ${inquiry.name}`;
    const text = [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Organization: ${inquiry.organization || "-"}`,
      `Reason: ${inquiry.reason}`,
      `Reference: ${inquiry.referenceLabel || inquiry.reference || "-"}`,
      `Page: ${inquiry.page || "-"}`,
      "",
      inquiry.message,
    ].join("\n");
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: to.split(",").map((s) => s.trim()),
          reply_to: inquiry.email,
          subject,
          text,
        }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      results.push("email");
    } catch (err) {
      console.error("[support] email delivery failed:", err);
    }
  }

  // 2. Local log (best effort).
  try {
    const dir = path.join(process.cwd(), "data", "inquiries");
    await mkdir(dir, { recursive: true });
    const file = path.join(dir, `${inquiry.receivedAt.slice(0, 10)}.jsonl`);
    await appendFile(file, JSON.stringify(inquiry) + "\n", "utf8");
    results.push("log");
  } catch (err) {
    console.error("[support] local log failed:", err);
  }

  if (!results.length) {
    console.error("[support] inquiry could not be stored or delivered");
    return NextResponse.json(
      { ok: false, error: "The message could not be delivered right now." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, delivered: results });
}
