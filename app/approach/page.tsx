import type { Metadata } from "next";
import Link from "next/link";
import { Container, ButtonLink, PageIntro } from "@/components/ui";
import { Figure } from "@/components/figure";
import { getHome, getVisual } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our approach",
  description:
    "Prepare before. Respond during. Protect after. The full sequence of CMAX Foundation's humanitarian approach.",
};
export default async function ApproachPage() {
  const [home, visual] = await Promise.all([getHome(), getVisual()]);
  return (
    <div className="approach-page">
      <Container>
        <PageIntro
          title="Ready before. Present throughout."
          lede={home.positioning}
        />
      </Container>
      {home.sequence.map((stage, i) => (
        <section
          className={`approach-stage visual-section ${i === 1 ? "visual-dark" : "contour-surface"}`}
          key={stage.stage}
        >
          <Container>
            <div className="approach-stage-heading">
              <span className="approach-number">0{i + 1}</span>
              <div>
                <p className="eyebrow">{stage.stage} the emergency</p>
                <h2 className="editorial-title">{stage.title}.</h2>
                <p>{stage.text}</p>
              </div>
            </div>
            {visual.approachImages[i] && (
              <Figure
                figure={visual.approachImages[i]}
                sizes="(min-width: 1320px) 1240px, calc(100vw - 48px)"
              />
            )}
          </Container>
        </section>
      ))}
      <section className="visual-section">
        <Container>
          <h2 className="editorial-title">Designed around real needs.</h2>
          <div className="approach-needs">
            {home.needs.map((need) => (
              <article key={need.title}>
                <h3>{need.title}</h3>
                <p>{need.text}</p>
                <Link
                  href={`/our-work/${need.program || "community-preparedness"}`}
                  className="text-link"
                >
                  Explore the response ↗
                </Link>
              </article>
            ))}
          </div>
          <p className="max-w-[65ch] mb-8">{home.partnersLine}</p>
          <ButtonLink href="/support">Support a Mission ↗</ButtonLink>
        </Container>
      </section>
    </div>
  );
}
