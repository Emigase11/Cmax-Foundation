import type { Metadata } from "next";
import Link from "next/link";
import { SupportForm } from "@/components/support-form";
import { Container } from "@/components/ui";
import { getAction, getCampaign, getProgram, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Support a Mission",
  description:
    "Support a campaign, fund a mission, partner with CMAX Foundation or propose a team, hospital or community that should be prepared.",
};

type Props = { searchParams: Promise<{ ref?: string; reason?: string }> };

export async function resolveReference(ref: string | undefined) {
  if (!ref) return null;
  const [kind, slug] = ref.split(":");
  if (!slug) return null;
  if (kind === "campaign") {
    const c = await getCampaign(slug);
    return c
      ? {
          key: ref,
          label: `Campaign: ${c.title}`,
          href: `/campaigns/${slug}`,
          reason: "campaign",
        }
      : null;
  }
  if (kind === "program") {
    const p = await getProgram(slug);
    return p
      ? {
          key: ref,
          label: `Program: ${p.title}`,
          href: `/our-work/${slug}`,
          reason: "mission",
        }
      : null;
  }
  if (kind === "action") {
    const a = await getAction(slug);
    return a
      ? {
          key: ref,
          label: `Action: ${a.title}`,
          href: `/our-actions/${slug}`,
          reason: "mission",
        }
      : null;
  }
  return null;
}

export default async function SupportPage({ searchParams }: Props) {
  const { ref, reason } = await searchParams;
  const [reference, site] = await Promise.all([
    resolveReference(ref),
    getSite(),
  ]);
  const defaultReason = reason ?? reference?.reason ?? "";

  return (
    <Container>
      <div className="support-grid">
        <div className="support-intro">
          <p className="eyebrow mb-6">Be part of the next response</p>
          <h1 className="display text-[clamp(2.6rem,1.6rem+5vw,5.2rem)]">
            Support a Mission
          </h1>
          <p className="lede mt-6 max-w-[40ch] text-ink-2">
            Tell us what you want to support or propose. CMAX Foundation replies
            by email with the confirmed details and the next step.
          </p>
          {reference && (
            <p className="mt-6 max-w-[40ch] text-[0.98rem] text-ink-2">
              You arrived from{" "}
              <Link href={reference.href} className="u-link font-medium">
                {reference.label.replace(/^(Campaign|Program|Action): /, "")}
              </Link>
              . The reference travels with your message.
            </p>
          )}
        </div>
        <div className="support-contact">
          <p className="eyebrow mb-5">Prefer a conversation?</p>
          <dl className="border-t border-warm-2">
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-warm-2 py-4">
              <dt className="strip pt-1 text-ink-3">Email</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="u-link">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-warm-2 py-4">
              <dt className="strip pt-1 text-ink-3">Phone</dt>
              <dd>
                <a
                  className="u-link"
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                >
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-warm-2 py-4">
              <dt className="strip pt-1 text-ink-3">Office</dt>
              <dd className="whitespace-pre-line">{site.address}</dd>
            </div>
          </dl>
          <p className="mt-6 max-w-[40ch] text-[0.95rem] text-ink-3">
            Every mission starts with a conversation. We’ll confirm the need,
            the recipient and the next step with you.
          </p>
        </div>
        <div className="support-form-panel">
          <SupportForm
            reference={
              reference ? { key: reference.key, label: reference.label } : null
            }
            defaultReason={defaultReason}
          />
        </div>
      </div>
    </Container>
  );
}
