import Link from "next/link";
import { ArrowIcon } from "./icons";
import {
  ActionRow,
  CampaignCard,
  type ActionEntry,
  type CampaignEntry,
} from "./records";
import { ButtonLink, Container } from "./ui";
import {
  MedInterior,
  MedHeroStage,
  MedReadiness,
  MedScenarios,
} from "./med-experience";
import { MATURITY, type getProgram } from "@/lib/content";
import "./cmax-med.css";

type Props = {
  program: NonNullable<Awaited<ReturnType<typeof getProgram>>>;
  actions: ActionEntry[];
  campaigns: CampaignEntry[];
};

const unitFacts = [
  { label: "Folded, for transport", value: '37"' },
  { label: "Living space, deployed", value: "14 ft" },
  { label: "People it sleeps", value: "8" },
  { label: "Assembly, two people", value: "11 min" },
];

const unitFeatures = [
  { title: "Raised from the ground", text: "Telescopic legs lift the rigid floor off mud, water and uneven terrain." },
  { title: "No tools needed", text: "Legs, sides and crossbar lock by hand. Nothing to lose, nothing to bring." },
  { title: "Resistant to strong winds", text: "A rigid frame and raised floor that will not collapse the way a tent does." },
  { title: "Ships and stores flat", text: "Folded, it fits in a pickup bed. Dozens stack in a single container." },
  { title: "Biosecurity with nanotechnology", text: "Surfaces treated for clinical and isolation use." },
  { title: "Lockable, powered, cooled", text: "Fit an A/C unit for hot climates, charge your devices, lock the door." },
];

export function CmaxMedPage({ program, actions, campaigns }: Props) {
  const maturity = MATURITY[program.maturity] ?? MATURITY.proposed;
  return (
    <article className="med-page">
      <section className="med-hero">
        <Container>
          <div className="med-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Humanitarian innovation</span>
            <span>/</span>
            <span>Cmax Med</span>
          </div>
          <div className="med-hero-masthead">
            <div>
              <p className="med-eyebrow"><span className="med-cross" aria-hidden="true" /> Deployable medical spaces</p>
              <h1>Cmax <em>Med.</em></h1>
            </div>
            <div className="med-hero-intro">
              <h2>Room to care.<br /><em>Where it matters.</em></h2>
              <p>A foldable medical unit for health teams working beyond the walls of a hospital.</p>
              <div className="med-hero-actions">
                <a className="med-primary" href="#med-inside">Explore the unit <ArrowIcon /></a>
                <Link href="/support?ref=program:cmax-med">Support a mission <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
          </div>
          <MedHeroStage />
          <div className="med-hero-footer">
            <span className="med-hero-status"><span aria-hidden="true" />{maturity.label}</span>
            <p>Developed by Cmax System.<br />Humanitarian access through CMAX Foundation.</p>
            <a href="#med-inside">Discover the details <span aria-hidden="true">↓</span></a>
          </div>
        </Container>
      </section>

      <nav className="med-wayfinding" aria-label="Explore Cmax Med">
        <Container>
          <a href="#med-inside">
            <span>01</span> Inside the unit
          </a>
          <a href="#med-settings">
            <span>02</span> Possible settings
          </a>
          <a href="#med-readiness">
            <span>03</span> From readiness to response
          </a>
        </Container>
      </nav>

      <section id="med-inside" className="med-section med-inside">
        <Container>
          <div className="med-section-heading" data-reveal>
            <div>
              <p className="med-eyebrow">01 / Designed around people</p>
              <h2>
                Small details.
                <br />
                <em>Human difference.</em>
              </h2>
            </div>
            <p>
              Take a look inside.
              <br />
              Select a marker to explore the layout.
            </p>
          </div>
          <MedInterior />
          <section className="med-built" aria-labelledby="med-built-title">
            <div className="med-built-heading" data-reveal>
              <h2 id="med-built-title">Built to move,<br /><em>built to stay.</em></h2>
              <p>A rigid, raised unit that travels on any pickup and stores in a garage — then opens into a room you can stand up in.</p>
            </div>
            <dl className="med-built-facts">
              {unitFacts.map((fact) => <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>)}
            </dl>
            <div className="med-built-features">
              {unitFeatures.map((feature, index) => <div key={feature.title} className="med-built-feature" data-reveal>
                <span className="med-built-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>)}
            </div>
          </section>
        </Container>
      </section>

      <section id="med-settings" className="med-section med-settings">
        <Container>
          <div className="med-section-heading" data-reveal>
            <div>
              <p className="med-eyebrow">02 / Explore the possibilities</p>
              <h2>
                One space.
                <br />
                <em>Different needs.</em>
              </h2>
            </div>
            <p>
              From hospital support to a wider response.
              <br />
              Choose a setting to explore.
            </p>
          </div>
          <MedScenarios />
        </Container>
      </section>

      <section id="med-readiness" className="med-section med-sequence">
        <Container>
          <div className="med-section-heading" data-reveal>
            <div>
              <p className="med-eyebrow">03 / Before. During.</p>
              <h2>
                A response starts
                <br />
                <em>before the call.</em>
              </h2>
            </div>
            <p>
              Space is only part of the answer.
              <br />
              People, preparation and logistics bring it to life.
            </p>
          </div>
          <MedReadiness />
        </Container>
      </section>

      <section className="med-section med-evidence">
        <Container className="med-evidence-grid">
          <div>
            <p className="med-eyebrow">The work behind the image</p>
            <h2>
              Clear purpose.
              <br />
              <em>Clear record.</em>
            </h2>
            <p>
              CMAX Foundation connects documented needs with support,
              coordinates delivery with partners and publishes the results.
            </p>
          </div>
          <div className="med-details">
            <details>
              <summary>
                Who is this for?<span aria-hidden="true">+</span>
              </summary>
              <ul>
                {program.whoBenefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </details>
            <details>
              <summary>
                What has been demonstrated?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Current program status: {maturity.label.toLowerCase()}. Concept
                images show possible uses; they are not records of Foundation
                deployments.
              </p>
              {program.safetyNote && <p>{program.safetyNote}</p>}
            </details>
            <details>
              <summary>
                How does the Foundation help?<span aria-hidden="true">+</span>
              </summary>
              <p>
                The Foundation does not sell units. It identifies institutions
                with a documented need, raises support, and coordinates delivery
                with Cmax System and partners.
              </p>
            </details>
            <details>
              <summary>
                Documented actions<span aria-hidden="true">+</span>
              </summary>
              {actions.length ? (
                <ul className="med-action-list">
                  {actions.map((action) => (
                    <ActionRow key={action.slug} action={action} />
                  ))}
                </ul>
              ) : (
                <p>
                  No Foundation deployment is documented here yet. Published
                  records will include the location, date, recipient and
                  photographs.
                </p>
              )}
              <Link className="med-evidence-link" href="/our-actions">
                Explore our actions <ArrowIcon />
              </Link>
            </details>
          </div>
        </Container>
      </section>

      {campaigns.length > 0 && (
        <section className="med-section">
          <Container>
            <div className="med-section-heading">
              <h2>
                Put possibility
                <br />
                <em>into motion.</em>
              </h2>
            </div>
            <div className="med-campaigns">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.slug} campaign={campaign} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="med-join">
        <Container>
          <p className="med-eyebrow">There is a role for you</p>
          <div className="med-join-grid">
            <h2>
              Help make room
              <br />
              <em>for care.</em>
            </h2>
            <div>
              <p>
                Support a unit, propose a receiving institution or help with
                transport and installation.
              </p>
              <ButtonLink href="/support?ref=program:cmax-med">
                Support a mission <ArrowIcon />
              </ButtonLink>
              <Link
                href="/support?ref=program:cmax-med&reason=recipient"
                className="med-recipient"
              >
                Propose a recipient <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="med-bottom">
            <span>
              Technology by Cmax System · Humanitarian work by CMAX Foundation
            </span>
            <Link href="/">Back to Home ↑</Link>
          </div>
        </Container>
      </section>
    </article>
  );
}
