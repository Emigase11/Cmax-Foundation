// Shared types, labels and helpers with no server-only dependencies (safe in client components).

export type DisplacementPoint = { year: number; value: number };
export type DisplacementData =
  | { mode: "api"; points: DisplacementPoint[] }
  | { mode: "saved"; point: DisplacementPoint; source: string }
  | { mode: "pending" };

export type Figure = {
  image: string | null;
  alt: string;
  caption: string;
  credit: string;
  illustrative: boolean;
};

export type Stage = "before" | "during" | "after";

export const STAGE_LABEL: Record<Stage, string> = {
  before: "Before",
  during: "During",
  after: "After",
};

export const ACTION_STATUS: Record<string, { label: string; tone: "ink" | "orange" | "muted" }> = {
  documented: { label: "Documented", tone: "ink" },
  ongoing: { label: "Ongoing", tone: "orange" },
  historical: { label: "Archive", tone: "muted" },
  pending: { label: "Documentation in progress", tone: "muted" },
};

export const CAMPAIGN_STATUS: Record<string, { label: string; tone: "ink" | "orange" | "muted" }> = {
  proposed: { label: "Proposed", tone: "ink" },
  review: { label: "Under review", tone: "muted" },
  active: { label: "Active", tone: "orange" },
  completed: { label: "Completed", tone: "ink" },
  pending: { label: "Content pending", tone: "muted" },
};

export const MATURITY: Record<string, { label: string; tone: "ink" | "orange" | "muted" }> = {
  proposed: { label: "Proposed capability", tone: "muted" },
  demonstrated: { label: "Demonstrated", tone: "ink" },
  deployed: { label: "Deployed and documented", tone: "orange" },
};

export const ACTIVITY_TYPE: Record<string, string> = {
  meeting: "Meeting",
  presentation: "Intervention",
  statement: "Statement",
  publication: "Publication",
  recognition: "Recognition",
};

export const ATTRIBUTION: Record<string, string> = {
  foundation: "CMAX Foundation",
  partners: "CMAX Foundation with partners",
  "cmax-system": "Cmax System",
  founder: "Founder, personal capacity",
};

/** Keystatic stores /images/content/ paths; legacy relative values still render. */
export function imgSrc(value: string | null | undefined): string | null {
  if (!value || value.endsWith("/")) return null;
  if (value.startsWith("/") || value.startsWith("http")) return value;
  return `/images/content/${value}`;
}

export function hasImage(fig: Figure | null | undefined): fig is Figure & { image: string } {
  return Boolean(fig && imgSrc(fig.image));
}


export function formatDate(value: string | null | undefined, label?: string | null) {
  if (label) return label;
  if (!value) return "";
  const d = new Date(value + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" });
}

/** "Mexico — Social Innovation Lab" → "Social Innovation Lab" when the country already leads the record. */
export function stripCountry(title: string, country: string) {
  const prefix = `${country} — `;
  return country && title.startsWith(prefix) ? title.slice(prefix.length) : title;
}
