import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Figure } from "@/components/figure";
import { MarkdocContent } from "@/components/markdoc-content";
import { ActionRow, CampaignCard } from "@/components/records";
import { StageChips } from "@/components/stage-rail";
import { ButtonLink, Container, EmptyNote, Tag } from "@/components/ui";
import { MATURITY, getActions, getCampaigns, getProgram, getPrograms, hasImage, type Stage } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return {};
  return { title: program.title, description: program.tagline };
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const [actions, campaigns] = await Promise.all([getActions(), getCampaigns()]);
  const relatedActions = actions.filter((a) => a.entry.solutions.includes(slug));
  const relatedCampaigns = campaigns.filter((c) => c.entry.response === slug);
  const maturity = MATURITY[program.maturity] ?? MATURITY.proposed;

  return (
    <article>
      <Container>
        <header className="grid gap-8 pt-10 sm:pt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="display text-[clamp(2.6rem,1.6rem+5vw,5.6rem)]">{program.title}</h1>
            <p className="lede mt-6 max-w-[40ch] text-ink-2">{program.tagline}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Tag tone={maturity.tone}>{maturity.label}</Tag>
              <StageChips stages={program.stages as Stage[]} />
            </div>
            <div className="mt-9">
              <ButtonLink href={`/support?ref=program:${slug}`} size="lg">
                Support a Mission
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            {hasImage(program.hero) && (
              <Figure figure={program.hero} aspect="aspect-[4/3]" priority sizes="(min-width: 1024px) 40vw, 100vw" />
            )}
          </div>
        </header>

        <section className="mt-16 grid gap-10 border-t-[3px] border-ink pt-8 lg:mt-20 lg:grid-cols-12">
          <h2 className="display-md text-[1.7rem] lg:col-span-4">The need</h2>
          <p className="max-w-[60ch] text-[1.1rem] text-ink-2 lg:col-span-8">{program.need}</p>
        </section>

        <section className="mt-12 grid gap-10 border-t border-warm-2 pt-8 lg:grid-cols-12">
          <h2 className="display-md text-[1.7rem] lg:col-span-4">Who benefits</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {program.whoBenefits.map((w) => (
              <li key={w} className="flex gap-3 text-ink-2">
                <span aria-hidden className="mt-[0.65em] h-[3px] w-4 shrink-0 bg-orange" />
                {w}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 grid gap-10 border-t border-warm-2 pt-8 lg:grid-cols-12">
          <h2 className="display-md text-[1.7rem] lg:col-span-4">What CMAX brings</h2>
          <div className="lg:col-span-8">
            <p className="max-w-[60ch] text-[1.1rem] text-ink-2">{program.capability}</p>
            {program.safetyNote && (
              <p className="mt-5 max-w-[60ch] border-l-[3px] border-orange pl-4 text-[0.95rem] text-ink-3">
                {program.safetyNote}
              </p>
            )}
          </div>
        </section>

        {program.gallery.length > 0 && (
          <section className="mt-16 lg:mt-20">
            <h2 className="sr-only">Images</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {program.gallery.map((g, i) => (
                <Figure key={i} figure={g} aspect={i % 3 === 2 ? "aspect-[4/3]" : "aspect-[3/2]"} sizes="(min-width: 640px) 50vw, 100vw" />
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 grid gap-10 border-t-[3px] border-ink pt-8 lg:mt-20 lg:grid-cols-12">
          <h2 className="display-md text-[1.7rem] lg:col-span-4">How to take part</h2>
          <div className="lg:col-span-8">
            <ol className="space-y-4">
              {program.participation.map((p, i) => (
                <li key={p} className="flex gap-4 text-[1.05rem]">
                  <span className="display text-[1.4rem] leading-[1.2] text-orange" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="text-ink-2">{p}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href={`/support?ref=program:${slug}`}>Support a Mission</ButtonLink>
              <ButtonLink href={`/support?ref=program:${slug}&reason=recipient`} variant="secondary">
                Propose a recipient
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="mt-16 border-t border-warm-2 pt-8 lg:mt-20">
          <MarkdocContent body={program.body} className="text-[1.05rem]" />
        </section>

        <section className="mt-16 border-t-[3px] border-ink pt-8 lg:mt-20">
          <h2 className="display-md text-[1.7rem]">Documented actions with {program.title}</h2>
          {relatedActions.length ? (
            <ul className="mt-6 border-b border-warm-2">
              {relatedActions.map((a) => (
                <ActionRow key={a.slug} action={a} />
              ))}
            </ul>
          ) : (
            <div className="mt-6">
              <EmptyNote>
                No deployment of {program.title} by the Foundation has been documented yet. When one is, it appears
                here with location, date, recipient and photographs.
              </EmptyNote>
            </div>
          )}
        </section>

        {relatedCampaigns.length > 0 && (
          <section className="mt-16 border-t border-warm-2 pt-8">
            <h2 className="display-md text-[1.7rem]">Campaigns proposing {program.title}</h2>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {relatedCampaigns.map((c) => (
                <CampaignCard key={c.slug} campaign={c} />
              ))}
            </div>
          </section>
        )}

        <p className="mt-16 text-[0.95rem] text-ink-3">
          <Link href="/our-work" className="u-link">
            Back to Our Work
          </Link>
        </p>
      </Container>
    </article>
  );
}
