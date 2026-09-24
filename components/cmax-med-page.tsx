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
  MedPhoto,
  MedReadiness,
  MedScenarios,
} from "./med-experience";
import { medImages } from "@/lib/cmax-med";
import { MATURITY, type getProgram } from "@/lib/content";
import "./cmax-med.css";

type Props = {
  program: NonNullable<Awaited<ReturnType<typeof getProgram>>>;
  actions: ActionEntry[];
  campaigns: CampaignEntry[];
};

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
          <div className="med-hero-grid">
            <div className="med-hero-copy">
              <p className="med-eyebrow">
                <span className="med-cross" aria-hidden="true" /> Deployable
                medical spaces
              </p>
              <h1>
                Cmax <em>Med.</em>
              </h1>
              <h2>
                Room to care.
                <br />
                <em>Where it matters.</em>
              </h2>
              <p>
                A foldable medical unit for health teams working beyond the
                walls of a hospital.
              </p>
              <div className="med-hero-actions">
                <a className="med-primary" href="#med-inside">
                  Explore the unit <ArrowIcon />
                </a>
                <Link href="/support?ref=program:cmax-med">
                  Support a mission <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="med-hero-note">
                <span>{maturity.label}</span>
                <p>
                  Developed by Cmax System.
                  <br />
                  Humanitarian access through CMAX Foundation.
                </p>
              </div>
            </div>
            <div className="med-hero-image">
              <MedPhoto
                photo={medImages.field}
                priority
                sizes="(min-width: 1320px) 520px, (min-width: 900px) 44vw, calc(100vw - 32px)"
              />
            </div>
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
          <div className="med-principles">
            <p>
              <span>Foldable</span>Stored and transported closed.
            </p>
            <p>
              <span>Adaptable</span>Configured around the team’s needs.
            </p>
            <p>
              <span>Relocatable</span>Planned for changing conditions.
            </p>
          </div>
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
