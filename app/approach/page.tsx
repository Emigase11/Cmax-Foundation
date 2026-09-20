import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { Figure } from "@/components/figure";
import { ArrowIcon } from "@/components/icons";
import { getHome, getVisual } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our approach",
  description:
    "Prepare before. Respond during. Protect after. The full sequence of CMAX Foundation's humanitarian approach.",
};

const stageNotes = ["Readiness begins long before the call.", "Practical capacity, where it is needed.", "Dignity belongs in every next step."];

export default async function ApproachPage() {
  const [home, visual] = await Promise.all([getHome(), getVisual()]);
  return (
    <div className="approach-page">
      <header className="approach-opening">
        <Container>
          <p className="eyebrow approach-opening-label"><span />Our approach / A continuous commitment</p>
          <div className="approach-opening-main">
            <h1>Ready <em>before.</em><br />Present<br /><em>throughout.</em></h1>
            <div className="approach-opening-aside">
              <span className="approach-orbit" aria-hidden="true"><span>People<br /><em>at the centre.</em></span></span>
              <p>{home.positioning}</p>
            </div>
          </div>
          <nav className="approach-chapters" aria-label="Explore our approach">
            {home.sequence.map((stage, i) => <a key={stage.stage} href={`#${stage.stage}`}>
              <span className="approach-chapter-index">0{i + 1}</span>
              <span><strong>{stage.title}</strong><span>{stage.stage} the emergency</span></span>
              <ArrowIcon />
            </a>)}
          </nav>
        </Container>
      </header>
      {home.sequence.map((stage, i) => (
        <section id={stage.stage} className={`approach-chapter approach-chapter-${stage.stage}`} key={stage.stage} aria-labelledby={`approach-${stage.stage}-title`}>
          <Container>
            <div className="approach-chapter-top"><span className="eyebrow">0{i + 1} / {stage.stage} the emergency</span><span>{stageNotes[i]}</span></div>
            <div className="approach-chapter-layout">
              <div className="approach-chapter-copy">
                <span className="approach-large-index" aria-hidden="true">0{i + 1}</span>
                <h2 id={`approach-${stage.stage}-title`}>{stage.title}<em>.</em></h2>
                <p>{stage.text}</p>
                <a href={i < home.sequence.length - 1 ? `#${home.sequence[i + 1].stage}` : "#real-needs"} className="approach-next">
                  {i < home.sequence.length - 1 ? `Next: ${home.sequence[i + 1].title}` : "Explore the solutions"}<span><ArrowIcon /></span>
                </a>
              </div>
              {visual.approachImages[i] && <Figure figure={visual.approachImages[i]}
                aspect="aspect-[1672/941]" className="approach-chapter-image"
                sizes={i === 1 ? "(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)" : "(min-width: 1320px) 760px, (min-width: 1024px) 60vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"} />}
            </div>
          </Container>
        </section>
      ))}
      <section id="real-needs" className="approach-real-needs" aria-labelledby="real-needs-title">
        <Container>
          <div className="approach-needs-intro"><p className="eyebrow">One purpose / Human dignity</p><h2 id="real-needs-title">Real needs.<br /><em>Practical possibilities.</em></h2></div>
          <div className="approach-need-cards">
            {home.needs.map((need, i) => <article key={need.title}>
              <span className="approach-need-index">0{i + 1}</span><h3>{need.title}</h3><p>{need.text}</p>
              <Link href={`/our-work/${need.program || "community-preparedness"}`}>Explore the response <span><ArrowIcon /></span></Link>
            </article>)}
          </div>
          <div className="approach-partnership">
            <div><p className="eyebrow">Preparedness takes a network</p><h2>Be part of<br /><em>what comes next.</em></h2></div>
            <div><p>{home.partnersLine}</p><Link href="/support" className="editorial-button editorial-button-cream">Support a Mission<span><ArrowIcon /></span></Link></div>
          </div>
        </Container>
      </section>
    </div>
  );
}
