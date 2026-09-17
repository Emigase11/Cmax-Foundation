import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Figure } from "@/components/figure";
import { Gallery } from "@/components/gallery";
import { MarkdocContent } from "@/components/markdoc-content";
import { ButtonLink, Container, EmptyNote, ExternalLink, Strip, Tag } from "@/components/ui";
import { VideoOnDemand } from "@/components/video-on-demand";
import {
  ACTION_STATUS,
  ATTRIBUTION,
  formatDate,
  getAction,
  getActions,
  getActivities,
  getPrograms,
  hasImage,
  stripCountry,
} from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const actions = await getActions();
  return actions.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const action = await getAction(slug);
  if (!action) return {};
  return { title: action.title, description: action.summary };
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-warm-2 py-3">
      <dt className="strip text-ink-3">{label}</dt>
      <dd className="mt-1.5 text-[0.98rem]">{children}</dd>
    </div>
  );
}

export default async function ActionPage({ params }: Props) {
  const { slug } = await params;
  const action = await getAction(slug);
  if (!action || !action.published) notFound();

  const [programs, activities] = await Promise.all([getPrograms(), getActivities()]);
  const programsById = new Map(programs.map((p) => [p.slug, p.entry.title]));
  const related = activities.filter((a) => a.entry.relatedActions.includes(slug));
  const status = ACTION_STATUS[action.status] ?? ACTION_STATUS.pending;
  const when = formatDate(action.date, action.dateLabel);

  return (
    <article>
      <Container>
        <header className="pt-10 sm:pt-16">
          <p className="display text-[clamp(2rem,1.4rem+2.5vw,3.4rem)] leading-none text-orange">{action.country}</p>
          <h1 className="display-md mt-4 max-w-[22ch] text-[clamp(2rem,1.4rem+3.2vw,4.2rem)]">{stripCountry(action.title, action.country)}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Tag tone={status.tone}>{status.label}</Tag>
            <Strip items={[action.place, when, ATTRIBUTION[action.attribution]]} />
          </div>
          <p className="lede mt-7 max-w-[60ch] text-ink-2">{action.summary}</p>
        </header>

        {hasImage(action.hero) && (
          <div className="mt-12">
            <Figure figure={action.hero} priority sizes="(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" />
          </div>
        )}

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <dl className="lg:sticky lg:top-24">
              <Fact label="Where">{[action.place, action.country].filter(Boolean).join(", ")}</Fact>
              <Fact label="When">{when}</Fact>
              <Fact label="Status">{status.label}</Fact>
              <Fact label="Attribution">{ATTRIBUTION[action.attribution]}</Fact>
              {action.partners.length > 0 && <Fact label="Partners">{action.partners.join(", ")}</Fact>}
              {action.supported.length > 0 && (
                <Fact label="Supported">
                  <ul className="space-y-1">
                    {action.supported.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </Fact>
              )}
              {action.solutions.length > 0 && (
                <Fact label="Programs">
                  <ul className="space-y-1">
                    {action.solutions.map((s) =>
                      s ? (
                        <li key={s}>
                          <Link href={`/our-work/${s}`} className="u-link">
                            {programsById.get(s) ?? s}
                          </Link>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </Fact>
              )}
              {action.documents.length > 0 && (
                <Fact label="Documents">
                  <ul className="space-y-1.5">
                    {action.documents.map((d) =>
                      d.url ? (
                        <li key={d.url}>
                          <ExternalLink href={d.url}>{d.title}</ExternalLink>
                        </li>
                      ) : null,
                    )}
                  </ul>
                </Fact>
              )}
              <div className="border-t border-warm-2 pt-5">
                {action.supportFuture ? (
                  <ButtonLink href={`/support?ref=action:${slug}`} className="w-full">
                    Support the next response
                  </ButtonLink>
                ) : (
                  <ButtonLink href="/support" className="w-full" variant="secondary">
                    Support a Mission
                  </ButtonLink>
                )}
              </div>
            </dl>
          </aside>

          <div className="lg:col-span-8">
            <section>
              <h2 className="display-md text-[1.6rem]">Context</h2>
              <p className="mt-3 max-w-[64ch] text-[1.08rem] text-ink-2">{action.context}</p>
            </section>
            <section className="mt-10">
              <h2 className="display-md text-[1.6rem]">What the Foundation and partners did</h2>
              <p className="mt-3 max-w-[64ch] text-[1.08rem] text-ink-2">{action.participation}</p>
            </section>
            <section className="mt-10">
              <h2 className="display-md text-[1.6rem]">Confirmed results</h2>
              {action.outcomes.length ? (
                <ul className="mt-4 space-y-3">
                  {action.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-[1.05rem]">
                      <span aria-hidden className="mt-[0.7em] h-[3px] w-4 shrink-0 bg-orange" />
                      {o}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4">
                  <EmptyNote>
                    No results are published for this action yet. They will appear here once CMAX Foundation can back
                    them with documents or photographs.
                  </EmptyNote>
                </div>
              )}
            </section>

            {action.media.length > 0 && (
              <section className="mt-12">
                <h2 className="display-md text-[1.6rem]">Photographs</h2>
                <div className="mt-6"><Gallery figures={action.media} sizes="(min-width: 1320px) 380px, (min-width: 1024px) 30vw, (min-width: 640px) calc((100vw - 80px) / 2), calc(100vw - 32px)" /></div>
              </section>
            )}

            {action.videos.length > 0 && (
              <section className="mt-12">
                <h2 className="display-md text-[1.6rem]">Videos</h2>
                <div className="mt-6 space-y-8">
                  {action.videos.map((v) =>
                    v.url ? (
                      <VideoOnDemand key={v.url} url={v.url} title={v.title} context={v.context} captions={v.captions || null} />
                    ) : null,
                  )}
                </div>
              </section>
            )}

            <section className="mt-12 border-t border-warm-2 pt-8">
              <MarkdocContent body={action.body} className="text-[1.05rem]" />
            </section>

            {related.length > 0 && (
              <section className="mt-12 border-t border-warm-2 pt-8">
                <h2 className="display-md text-[1.6rem]">Related institutional activities</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href="/global-advocacy" className="u-link">
                        {r.entry.title}
                      </Link>{" "}
                      <span className="text-ink-3">· {formatDate(r.entry.date, r.entry.dateLabel)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>

        <p className="mt-16 text-[0.95rem] text-ink-3">
          <Link href="/our-actions" className="u-link">
            Back to Our Actions
          </Link>
        </p>
      </Container>
    </article>
  );
}
