import Link from "next/link";
import { Container, PageIntro } from "./ui";

type LegalContent = {
  title: string;
  intro: string;
  updated: string;
  reviewNote: string;
  sections: readonly { title: string; text: string }[];
};

export function LegalPage({ page }: { page: LegalContent }) {
  return <Container>
    <PageIntro title={page.title} lede={page.intro} />
    <article className="max-w-[76ch] pb-12">
      <p className="text-ink-2">Last updated: <time dateTime={page.updated}>{page.updated}</time></p>
      {page.reviewNote && <p className="mt-6 border-l-4 border-orange bg-warm p-5 text-ink">{page.reviewNote}</p>}
      <div className="prose mt-8">
        {page.sections.map((section, index) => <section key={index}>
          <h2>{section.title}</h2>
          {section.text.split(/\n\s*\n/).filter(Boolean).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        </section>)}
      </div>
      <nav aria-label="Legal information" className="mt-10 flex flex-wrap gap-6">
        <Link className="u-link inline-flex min-h-6 items-center" href="/privacy">Privacy notice</Link>
        <Link className="u-link inline-flex min-h-6 items-center" href="/terms">Terms of use</Link>
      </nav>
    </article>
  </Container>;
}
