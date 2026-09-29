import Link from "next/link";
import { ArrowIcon } from "./icons";
import { Container, ButtonLink } from "./ui";
import {
  ActionRow,
  CampaignCard,
  type ActionEntry,
  type CampaignEntry,
} from "./records";
import {
  AeroDetails,
  AeroPhoto,
  AeroPurpose,
  AeroSequence,
} from "./aerocabin-experience";
import { aeroImages } from "@/lib/aerocabin";
import { MATURITY, type getProgram } from "@/lib/content";
import "./aerocabin.css";

type Props = {
  program: NonNullable<Awaited<ReturnType<typeof getProgram>>>;
  actions: ActionEntry[];
  campaigns: CampaignEntry[];
};

const cabinFacts = [
  { label: "Approx. weight", value: "40 kg" },
  { label: "Adults + kids", value: "2 + 2" },
  { label: "Max inflation pressure", value: "10 bar" },
  { label: "Cabin warranty", value: "2 years" },
];

const cabinSpecifications = [
  { title: "Dimensions", lines: ['98″ × 49″ × 53″', "248 cm × 125 cm × 135 cm"] },
  { title: "Structure", lines: ["High-pressure drop-stitch inflatable walls", "8 cm reinforced structural thickness", "Thermal welded seams"] },
  { title: "Capacity", lines: ["Designed for up to 2 adults and 2 kids", "Spacious panoramic interior"] },
  { title: "Weight", lines: ["Approx. 40 kg / 88 lbs", "Portable and compact when packed"] },
  { title: "Inflation", lines: ["Rapid inflation system", "Single front inflation valve", "Compatible with electric and manual pumps", "Max inflation 10 bar"] },
  { title: "Floating capability", lines: ["Buoyant inflatable structure", "Designed to float during flood situations"] },
  { title: "Materials", lines: ["Reinforced PVC drop-stitch fabric", "UV and weather resistant components", "High-durability outdoor construction"] },
  { title: "Portability", lines: ["Deflates into a compact transport bag", "Easy to carry, store and deploy", "Packed: 130 × 52 × 32 cm / 51.18 × 20.47 × 12.60 in"] },
];

export function AerocabinPage({ program, actions, campaigns }: Props) {
  return (
    <article className="aero-page">
      <header className="aero-hero">
        <Container>
          <div className="aero-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Humanitarian innovation</span>
            <span>/ AeroCabin™</span>
          </div>
          <div className="aero-hero-heading">
            <div>
              <p className="aero-kicker">
                <span className="aero-signal" aria-hidden="true" /> From water
                to dry land
              </p>
              <h1>
                AeroCabin<span>™</span>
              </h1>
              <h2>
                Protection.
                <br />
                <em>Beyond the shoreline.</em>
              </h2>
            </div>
            <div className="aero-hero-intro">
              <span className="aero-status">
                {(MATURITY[program.maturity] ?? MATURITY.proposed).label}
              </span>
              <p>
                An inflatable cabin proposed for evacuation support and
                temporary protection after a flood.
              </p>
              <a className="aero-primary" href="#aero-design">
                Explore the cabin <ArrowIcon />
              </a>
              <span>Developed by Cmax System</span>
            </div>
          </div>
          <div className="aero-hero-photo">
            <AeroPhoto photo={aeroImages.rescue} priority />
          </div>
          <div className="aero-hero-bottom">
            <span>One cabin. Two proposed roles.</span>
            <a href="#aero-purpose">
              Discover the idea <span aria-hidden="true">↓</span>
            </a>
          </div>
        </Container>
      </header>

      <nav className="aero-nav" aria-label="Explore AeroCabin">
        <Container>
          <a href="#aero-purpose">
            <span>01</span> The idea
          </a>
          <a href="#aero-design">
            <span>02</span> The design
          </a>
          <a href="#aero-sequence">
            <span>03</span> Taking shape
          </a>
          <a href="#aero-gallery">
            <span>04</span> By the water
          </a>
        </Container>
      </nav>

      <section id="aero-purpose" className="aero-section aero-purpose">
        <Container className="aero-purpose-grid">
          <div data-reveal>
            <p className="aero-kicker">01 / A continuous response</p>
            <h2>
              The journey doesn’t
              <br />
              <em>end at the shore.</em>
            </h2>
            <p className="aero-lead">
              Flood response has two challenges: helping people leave danger and
              finding protection once they arrive.
            </p>
            <span className="aero-watermark" aria-hidden="true">
              ≈
            </span>
          </div>
          <AeroPurpose />
        </Container>
      </section>

      <section id="aero-design" className="aero-section aero-design">
        <Container>
          <div className="aero-section-heading" data-reveal>
            <div>
              <p className="aero-kicker">02 / Inside the idea</p>
              <h2>
                A closer look.
                <br />
                <em>A different perspective.</em>
              </h2>
            </div>
            <p>
              Select a point to explore the cabin.
              <br />
              See the whole form, down to the details.
            </p>
          </div>
          <AeroDetails />
          <section className="aero-specs" aria-labelledby="aero-specs-title">
            <div className="aero-section-heading" data-reveal>
              <div>
                <p className="aero-kicker">The cabin in detail</p>
                <h2 id="aero-specs-title">Compact to carry.<br /><em>Room to unfold.</em></h2>
              </div>
              <p>Dimensions, construction and everyday portability.<br />Explore the specifications.</p>
            </div>
            <dl className="aero-spec-facts">
              {cabinFacts.map((fact) => <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>)}
            </dl>
            <div className="aero-spec-grid">
              {cabinSpecifications.map((spec, index) => <div className="aero-spec-card" key={spec.title} data-reveal>
                <span className="aero-kicker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{spec.title}</h3>
                <ul>{spec.lines.map((line) => <li key={line}>{line}</li>)}</ul>
              </div>)}
            </div>
          </section>
        </Container>
      </section>

      <section id="aero-sequence" className="aero-section aero-build">
        <Container>
          <div className="aero-section-heading" data-reveal>
            <div>
              <p className="aero-kicker">03 / Taking shape</p>
              <h2>
                From packed.
                <br />
                <em>To possibility.</em>
              </h2>
            </div>
            <p>
              Explore the illustrated sequence.
              <br />
              One moment at a time.
            </p>
          </div>
          <AeroSequence />
        </Container>
      </section>

      <section id="aero-gallery" className="aero-section aero-gallery">
        <Container>
          <div className="aero-section-heading" data-reveal>
            <div>
              <p className="aero-kicker">04 / By the water</p>
              <h2>
                Real light.
                <br />
                <em>New perspectives.</em>
              </h2>
            </div>
            <p>
              Two views of the cabin beside the lake.
              <br />
              Select an image to see it in full.
            </p>
          </div>
          <div className="aero-lake-pair">
            <div data-reveal>
              <span className="aero-photo-index">01 / Daylight</span>
              <AeroPhoto
                photo={aeroImages.daylight}
                sizes="(min-width: 1320px) 600px, (min-width: 768px) 46vw, calc(100vw - 32px)"
              />
            </div>
            <div data-reveal>
              <span className="aero-photo-index">02 / Dusk</span>
              <AeroPhoto
                photo={aeroImages.dusk}
                sizes="(min-width: 1320px) 600px, (min-width: 768px) 46vw, calc(100vw - 32px)"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="aero-section aero-response">
        <Container>
          <div className="aero-section-heading" data-reveal>
            <div>
              <p className="aero-kicker">People at the center</p>
              <h2>
                A proposal for
                <br />
                <em>the moments between.</em>
              </h2>
            </div>
            <p>
              Between evacuation and shelter.
              <br />
              Between an urgent need and a coordinated response.
            </p>
          </div>
          <AeroPhoto photo={aeroImages.flood} />
          <div className="aero-safety">
            <span className="aero-kicker">Purpose & limits</span>
            <p>{program.safetyNote}</p>
          </div>
        </Container>
      </section>

      <section className="aero-section aero-record">
        <Container className="aero-record-grid">
          <div>
            <p className="aero-kicker">From proposal to action</p>
            <h2>
              Prepared together.
              <br />
              <em>Documented clearly.</em>
            </h2>
            <p>
              Work with a response team before the flood season. Define the
              need, plan a demonstration and document the outcome.
            </p>
          </div>
          <div className="aero-accordions">
            <details>
              <summary>
                Who is it for?<span aria-hidden="true">+</span>
              </summary>
              <ul>
                {program.whoBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
            <details>
              <summary>
                How can a community take part?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Propose a fire department or civil defense team. The Foundation
                confirms the recipient, organizes support and coordinates
                delivery with partners.
              </p>
              <Link href="/support?ref=program:aerocabin&reason=recipient">
                Propose a response team ↗
              </Link>
            </details>
            <details>
              <summary>
                What is the current status?<span aria-hidden="true">+</span>
              </summary>
              <p>
                AeroCabin is presented as a proposed capability. Photographs
                show the unit; concept scenes illustrate potential uses and do
                not document a Foundation rescue operation.
              </p>
            </details>
            <details>
              <summary>
                Explore documented actions<span aria-hidden="true">+</span>
              </summary>
              {actions.length ? (
                <ul className="aero-action-list">
                  {actions.map((action) => (
                    <ActionRow key={action.slug} action={action} />
                  ))}
                </ul>
              ) : (
                <p>
                  No Foundation deployment is documented here yet. Records will
                  include dates, recipients and photographs.
                </p>
              )}
              <Link href="/our-actions">View our actions ↗</Link>
            </details>
          </div>
        </Container>
      </section>

      {campaigns.length > 0 && (
        <section className="aero-section aero-campaign-section">
          <Container>
            <div className="aero-section-heading">
              <div>
                <p className="aero-kicker">A place to begin</p>
                <h2>
                  Support a team.
                  <br />
                  <em>Prepare a community.</em>
                </h2>
              </div>
            </div>
            <div className="aero-campaigns">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.slug} campaign={campaign} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="aero-join">
        <Container>
          <p className="aero-kicker">Before the next flood season</p>
          <div>
            <h2>
              Let’s be ready.
              <br />
              <em>Together.</em>
            </h2>
            <div>
              <p>
                Help a local response team explore what AeroCabin could bring to
                its preparedness.
              </p>
              <ButtonLink href="/support?ref=program:aerocabin">
                Support a mission <ArrowIcon />
              </ButtonLink>
              <Link
                className="aero-partner"
                href="/support?ref=program:aerocabin&reason=partner"
              >
                Become a partner <ArrowIcon />
              </Link>
            </div>
          </div>
          <footer>
            <span>
              Technology by Cmax System · Humanitarian work by CMAX Foundation
            </span>
            <Link href="/">Back to Home ↑</Link>
          </footer>
        </Container>
      </section>
    </article>
  );
}
