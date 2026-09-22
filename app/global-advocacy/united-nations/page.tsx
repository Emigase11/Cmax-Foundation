import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gallery } from "@/components/gallery";
import { UNHeroVideo } from "@/components/un-hero-video";
import { ArrowIcon } from "@/components/icons";
import { ButtonLink, Container, ExternalLink } from "@/components/ui";
import {
  ACTIVITY_TYPE,
  formatDate,
  getActivities,
  getSite,
} from "@/lib/content";
import "./united-nations.css";

export const metadata: Metadata = {
  title: "Our Work at the United Nations",
  description:
    "From local preparedness to global dialogue. Explore CMAX Foundation’s work at the United Nations, its ECOSOC consultative status and its photographic archive.",
};

const photographs = [
  {
    name: "un-intervention-cmax-nameplate",
    alt: "Nicolás García Mayor speaking behind the CMAX Foundation nameplate.",
    caption: "A voice for humanitarian innovation.",
  },
  {
    name: "un-panel-intervention",
    alt: "Nicolás García Mayor speaking into a microphone during a panel intervention.",
    caption: "Bringing preparedness into the conversation.",
  },
  {
    name: "un-ecosoc-chamber-delegates",
    alt: "Three attendees photographed inside the ECOSOC chamber.",
    caption: "Connections inside the ECOSOC chamber.",
  },
  {
    name: "unhcr-office-meeting",
    alt: "Nicolás García Mayor and a meeting participant shaking hands in front of UNHCR office signage.",
    caption: "A meeting at the UNHCR office.",
  },
].map(({ name, ...photo }) => ({
  ...photo,
  image: `/images/content/stories/${name}.webp`,
  credit: "CMAX archive",
  illustrative: false,
}));

export default async function UnitedNationsPage() {
  const [activities, site] = await Promise.all([getActivities(), getSite()]);
  const un = activities.filter((a) => a.entry.unitedNations);

  return (
    <div className="un-story">
      <section className="un-story-hero" aria-labelledby="un-title">
        <div className="un-story-shade" aria-hidden="true" />
        <Container className="un-story-hero-content">
          <Link href="/global-advocacy" className="un-back">
            Global advocacy <span aria-hidden="true">/</span> United Nations
          </Link>
          <div className="un-hero-copy">
            <p className="eyebrow">CMAX Foundation at the United Nations</p>
            <h1 id="un-title">
              A global voice.
              <br />
              <em>A human purpose.</em>
            </h1>
            <p>
              Bringing the realities of communities into the conversations that
              shape humanitarian priorities.
            </p>
            <a href="#un-purpose" className="un-explore">
              Explore our role <span aria-hidden="true">↓</span>
            </a>
          </div>
          <span className="un-film-credit">United Nations · CMAX archive</span>
        </Container>
        <UNHeroVideo />
      </section>
      <div className="un-status-band">
        <Container className="un-status-inner">
          <p className="un-status-year">
            <span className="eyebrow">Since</span>2021
          </p>
          <div>
            <p>Special consultative status</p>
            <span>United Nations Economic and Social Council (ECOSOC)</span>
          </div>
          <ExternalLink href={site.unRegisterUrl}>
            View official UN register
          </ExternalLink>
        </Container>
      </div>
      <nav className="un-chapters" aria-label="On this page">
        <Container>
          <a href="#un-purpose">
            <span>01</span> Our role
          </a>
          <a href="#un-archive">
            <span>02</span> In the room
          </a>
          <a href="#un-record">
            <span>03</span> The record
          </a>
        </Container>
      </nav>
      <section id="un-purpose" className="un-story-section">
        <Container className="un-purpose-grid">
          <div>
            <p className="eyebrow un-kicker">01 / Our role</p>
            <h2>
              Local experience.
              <br />
              <em>Global perspective.</em>
            </h2>
            <p className="un-lead">
              Preparedness starts with people. Our role is to bring that
              perspective to the international table.
            </p>
            <div className="un-explain">
              <details open>
                <summary>
                  What does consultative status mean?
                  <span aria-hidden="true" />
                </summary>
                <p>
                  A formal channel for CMAX Foundation to contribute its
                  expertise to ECOSOC and related UN processes.
                </p>
              </details>
              <details>
                <summary>
                  What do we bring to the conversation?
                  <span aria-hidden="true" />
                </summary>
                <p>
                  Experience in preparedness, rapid habitat and emergency
                  response, grounded in the needs of communities facing complex
                  emergencies.
                </p>
              </details>
              <details>
                <summary>
                  Where can you explore our work?
                  <span aria-hidden="true" />
                </summary>
                <p>
                  Browse the photographs below, then open the dated records for
                  participants, contributions and original sources.
                </p>
              </details>
            </div>
          </div>
          <figure className="un-feature-photo">
            <div>
              <Image
                src={photographs[1].image}
                alt={photographs[1].alt}
                fill
                sizes="(min-width: 1320px) 490px, (min-width: 900px) 42vw, calc(100vw - 48px)"
              />
            </div>
            <figcaption>
              <span>From the field to the floor.</span>
              <span>CMAX archive ↗</span>
            </figcaption>
          </figure>
        </Container>
      </section>
      <section id="un-archive" className="un-story-section un-archive">
        <Container>
          <div className="un-section-heading">
            <div>
              <p className="eyebrow un-kicker">02 / In the room</p>
              <h2>
                Dialogue, <em>in focus.</em>
              </h2>
            </div>
            <p>
              People. Interventions. Shared perspectives.
              <br />
              Select a photograph to take a closer look.
            </p>
          </div>
          <Gallery
            figures={photographs}
            sizes="(min-width: 1320px) 610px, (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)"
          />
        </Container>
      </section>
      <section id="un-record" className="un-story-section">
        <Container>
          <div className="un-section-heading">
            <div>
              <p className="eyebrow un-kicker">03 / The record</p>
              <h2>
                Our work.
                <br />
                <em>On the record.</em>
              </h2>
            </div>
            <p>
              Explore the milestones.
              <br />
              Open each entry for context and sources.
            </p>
          </div>
          <div className="un-records">
            {un.map(({ slug, entry }) => (
              <details key={slug} className="un-record">
                <summary>
                  <span className="un-record-date">
                    {formatDate(entry.date, entry.dateLabel)}
                  </span>
                  <span>
                    <span className="eyebrow">
                      {ACTIVITY_TYPE[entry.type] ?? entry.type}
                    </span>
                    <span className="un-record-title">{entry.title}</span>
                  </span>
                  <span className="un-record-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="un-record-body">
                  <p>{entry.contribution}</p>
                  <dl>
                    <div>
                      <dt>Where</dt>
                      <dd>{entry.venue}</dd>
                    </div>
                    <div>
                      <dt>Who</dt>
                      <dd>{entry.participants.join(", ")}</dd>
                    </div>
                  </dl>
                  <ul>
                    {entry.documents.map(
                      (document) =>
                        document.url && (
                          <li key={document.url}>
                            <ExternalLink href={document.url}>
                              {document.title}
                            </ExternalLink>
                          </li>
                        ),
                    )}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>
      <section className="un-partner">
        <Container>
          <p className="eyebrow">The next conversation starts with you</p>
          <div>
            <h2>
              Shared challenges.
              <br />
              <em>Common ground.</em>
            </h2>
            <div>
              <p>
                Working on preparedness or humanitarian response? Let’s bring
                our experience to the same table.
              </p>
              <ButtonLink href="/support?reason=partner">
                Start a conversation <ArrowIcon />
              </ButtonLink>
              <Link href="/global-advocacy" className="un-all-records">
                Explore all global advocacy <ArrowIcon />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
