import type { Metadata } from "next";
import Image from "next/image";
import { Container, PageIntro, ButtonLink } from "@/components/ui";
import { getPress, imgSrc } from "@/lib/content";

export const metadata: Metadata = {
  title: "Press",
  description:
    "Media coverage, reporting and press contacts for CMAX Foundation.",
};
export default async function PressPage() {
  const press = await getPress();
  return (
    <Container>
      <PageIntro
        title="In the public conversation."
        lede="Reporting and perspectives on humanitarian innovation, preparedness and the people behind CMAX."
      />
      {press.length ? (
        <div className="press-archive">
          {press.map((p) => (
            <article key={p.slug}>
              {imgSrc(p.entry.logo) && (
                <Image
                  src={imgSrc(p.entry.logo)!}
                  alt={p.entry.outlet}
                  width={270}
                  height={100}
                  unoptimized
                />
              )}
              <div>
                <p className="eyebrow">
                  {p.entry.outlet} ·{" "}
                  <time dateTime={p.entry.date!}>{p.entry.date}</time>
                </p>
                <h2>{p.entry.title}</h2>
                <a
                  href={p.entry.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  Read the article ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="press-archive-empty contour-surface">
          <p className="eyebrow">The archive is being prepared</p>
          <h2 className="editorial-title">
            A closer look
            <br />
            at our work.
          </h2>
          <p>
            Verified articles will appear here with their publication date and a
            direct link to the original reporting.
          </p>
        </section>
      )}
      <div className="visual-section">
        <h2 className="editorial-title mb-6">Working on a story?</h2>
        <ButtonLink href="/support?reason=press">
          Contact the Foundation ↗
        </ButtonLink>
      </div>
    </Container>
  );
}
