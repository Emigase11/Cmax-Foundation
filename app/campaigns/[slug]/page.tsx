import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Figure } from "@/components/figure";
import { MarkdocContent } from "@/components/markdoc-content";
import { ButtonLink, Container, EmptyNote, ExternalLink, Strip, Tag } from "@/components/ui";
import { VideoOnDemand } from "@/components/video-on-demand";
import { CAMPAIGN_STATUS, formatDate, getCampaign, getCampaigns, getProgram, hasImage } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const campaigns = await getCampaigns();
  return campaigns.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCampaign(slug);
  if (!c) return {};
  return { title: c.title, description: c.summary };
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await getCampaign(slug);
  if (!campaign || !campaign.published) notFound();

  const program = campaign.response ? await getProgram(campaign.response) : null;
  const status = CAMPAIGN_STATUS[campaign.status] ?? CAMPAIGN_STATUS.proposed;
  const pending = campaign.status === "pending";

  return (
    <article>
      <Container>
        <header className="pt-10 sm:pt-16">
          <div className="flex flex-wrap items-center gap-3">
            <Tag tone={status.tone}>{status.label}</Tag>
            <Strip items={[[campaign.place, campaign.country].filter(Boolean).join(", ")]} />
          </div>
          <h1 className="display mt-5 max-w-[16ch] text-[clamp(2.4rem,1.5rem+4.4vw,5.4rem)]">{campaign.title}</h1>
          <p className="lede mt-7 max-w-[60ch] text-ink-2">{campaign.summary}</p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <ButtonLink href={`/support?ref=campaign:${slug}`} size="lg">
              Support this Mission
            </ButtonLink>
            <span className="max-w-[36ch] text-[0.95rem] text-ink-3">
              No online payment in this version. You write; CMAX Foundation replies with the next step.
            </span>
          </div>
        </header>

        {hasImage(campaign.hero) && (
          <div className="mt-12">
            <Figure figure={campaign.hero} priority sizes="(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" />
          </div>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <section>
              <h2 className="display-md text-[1.6rem]">The need</h2>
              {campaign.need ? (
                <p className="mt-3 max-w-[62ch] text-[1.08rem] text-ink-2">{campaign.need}</p>
              ) : (
                <div className="mt-3">
                  <EmptyNote>Pending confirmation by CMAX Foundation.</EmptyNote>
                </div>
              )}
            </section>
            <section className="mt-10">
              <h2 className="display-md text-[1.6rem]">Who receives the support</h2>
              {campaign.recipients ? (
                <p className="mt-3 max-w-[62ch] text-[1.08rem] text-ink-2">
                  {campaign.recipients}
                  {!campaign.recipientConfirmed && (
                    <span className="mt-2 block text-[0.95rem] text-ink-3">
                      Community-led campaign. Recipient confirmation pending.
                    </span>
                  )}
                </p>
              ) : (
                <div className="mt-3">
                  <EmptyNote>Pending confirmation by CMAX Foundation.</EmptyNote>
                </div>
              )}
            </section>
            <section className="mt-10">
              <h2 className="display-md text-[1.6rem]">Proposed response</h2>
              {campaign.responseNote || program ? (
                <div className="mt-3 max-w-[62ch] text-[1.08rem] text-ink-2">
                  {campaign.responseNote && <p>{campaign.responseNote}</p>}
                  {program && (
                    <p className="mt-3">
                      <Link href={`/our-work/${campaign.response}`} className="u-link font-medium">
                        About {program.title}
                      </Link>
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-3">
                  <EmptyNote>Pending confirmation by CMAX Foundation.</EmptyNote>
                </div>
              )}
            </section>

            {campaign.videos.length > 0 && (
              <section className="mt-12">
                <h2 className="display-md text-[1.6rem]">Videos</h2>
                <div className="mt-6 space-y-8">
                  {campaign.videos.map((v) =>
                    v.url ? (
                      <VideoOnDemand key={v.url} url={v.url} title={v.title} context={v.context} captions={v.captions || null} />
                    ) : null,
                  )}
                </div>
              </section>
            )}

            <section className="mt-12 border-t border-warm-2 pt-8">
              <MarkdocContent body={campaign.body} className="text-[1.05rem]" />
            </section>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-24">
              <h2 className="strip text-ink-3">Updates</h2>
              {campaign.updates.length ? (
                <ol className="mt-3">
                  {campaign.updates
                    .slice()
                    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
                    .map((u, i) => (
                      <li key={i} className="border-t border-warm-2 py-4">
                        <p className="strip text-ink-3">{formatDate(u.date)}</p>
                        <p className="mt-1.5 text-[0.98rem]">{u.text}</p>
                      </li>
                    ))}
                </ol>
              ) : (
                <div className="mt-3">
                  <EmptyNote>No updates yet.</EmptyNote>
                </div>
              )}
              {campaign.documents.length > 0 && (
                <>
                  <h2 className="strip mt-8 text-ink-3">Documents</h2>
                  <ul className="mt-3 space-y-2">
                    {campaign.documents.map((d) =>
                      d.url ? (
                        <li key={d.url}>
                          <ExternalLink href={d.url}>{d.title}</ExternalLink>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </>
              )}
              <div className="mt-8 border-t-[3px] border-ink pt-5">
                <ButtonLink href={`/support?ref=campaign:${slug}`} className="w-full">
                  {pending ? "Ask about this initiative" : "Support this Mission"}
                </ButtonLink>
              </div>
            </div>
          </aside>
        </div>

        <p className="mt-16 text-[0.95rem] text-ink-3">
          <Link href="/campaigns" className="u-link">
            Back to Campaigns
          </Link>
        </p>
      </Container>
    </article>
  );
}
