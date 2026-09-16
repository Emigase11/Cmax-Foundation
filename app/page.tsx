import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ActionRow, CampaignCard, ProgramPanel } from "@/components/records";
import { StageRail } from "@/components/stage-rail";
import {
  ButtonLink,
  Container,
  ExternalLink,
  SectionTitle,
} from "@/components/ui";
import { VideoOnDemand } from "@/components/video-on-demand";
import {
  getActions,
  getCampaigns,
  getHome,
  getPrograms,
  getSite,
  hasImage,
  imgSrc,
  type Stage,
} from "@/lib/content";

export default async function HomePage() {
  const [home, site, programs, actions, campaigns] = await Promise.all([
    getHome(),
    getSite(),
    getPrograms(),
    getActions(),
    getCampaigns(),
  ]);
  const programBySlug = new Map(
    programs.map((program) => [program.slug, program]),
  );
  const featuredCampaigns = campaigns
    .filter((campaign) => campaign.entry.featured)
    .slice(0, 2);
  const headlineParts = home.headline.split(/\b(before)\b/);
  const heroSrc = hasImage(home.hero) ? imgSrc(home.hero.image) : null;

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <Container className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> A foundation for human dignity
            </p>
            <h1 id="home-title" className="hero-title">
              {headlineParts.map((part, index) =>
                part === "before" ? (
                  <em key={index}>{part}</em>
                ) : (
                  <span key={index}>{part}</span>
                ),
              )}
            </h1>
            <p className="hero-description">{home.description}</p>
            <div className="hero-buttons">
              <ButtonLink href="/support" size="lg">
                Support a Mission <ArrowIcon />
              </ButtonLink>
              <Link href="/our-work" className="text-link">
                Discover our work <ArrowIcon />
              </Link>
            </div>
            <a href="#our-purpose" className="hero-scroll">
              <span aria-hidden>↓</span> A better response begins before.
            </a>
          </div>
          <figure className="hero-figure">
            {heroSrc && (
              <Image
                src={heroSrc}
                alt={home.hero.alt}
                fill
                preload
                sizes="(min-width: 1320px) 650px, (min-width: 1024px) 52vw, 100vw"
                className="hero-image"
              />
            )}
            <div className="hero-image-shade" aria-hidden />
            <span className="image-index" aria-hidden>
              CMAX / HUMANITY IN ACTION
            </span>
            <figcaption className="hero-caption">
              <span className="eyebrow">
                {home.hero.illustrative
                  ? "Illustrative concept"
                  : "From the CMAX archive"}
              </span>
              <p>{home.hero.caption}</p>
              {home.hero.credit && (
                <span className="photo-credit">{home.hero.credit}</span>
              )}
            </figcaption>
            <span className="hero-corner" aria-hidden>
              <ArrowIcon width={30} height={30} />
            </span>
          </figure>
        </Container>
      </section>

      <div className="trust-band">
        <Container className="trust-inner">
          <span className="trust-year">
            2021<span>Since</span>
          </span>
          <p>
            Special consultative status with the
            <br className="hidden sm:block" />{" "}
            <strong>United Nations Economic and Social Council.</strong>
          </p>
          <Link href="/global-advocacy/united-nations" className="text-link">
            Our work at the UN <ArrowIcon />
          </Link>
        </Container>
      </div>

      <section id="our-purpose" className="section-space">
        <Container>
          <div className="section-kicker">
            <span className="eyebrow">01 / Our purpose</span>
            <span className="eyebrow text-ink-3">People first. Always.</span>
          </div>
          <div className="purpose-grid">
            <div className="purpose-images" data-reveal>
              <figure className="purpose-main frame">
                <Image
                  src="/images/content/stories/haiti-community.webp"
                  alt="Nicolás García Mayor sharing a moment with a child during a visit in Haiti."
                  fill
                  sizes="(min-width: 1024px) 38vw, 78vw"
                  className="object-cover"
                />
                <figcaption>Haiti · From the CMAX archive</figcaption>
              </figure>
              <figure className="purpose-inset frame">
                <Image
                  src="/images/content/stories/community-gathering.webp"
                  alt="A community gathering with Nicolás García Mayor, with adults and children holding certificates."
                  fill
                  sizes="(min-width: 1024px) 18vw, 40vw"
                  className="object-cover"
                />
              </figure>
              <span className="purpose-cross" aria-hidden>
                +
              </span>
            </div>
            <div className="purpose-copy" data-reveal>
              <SectionTitle>
                Every emergency
                <br />
                is a human story.
              </SectionTitle>
              <p className="lede mt-7">{home.positioning}</p>
              <p className="mt-5 text-ink-3">
                Behind every response is a person who needs safety, a team that
                needs the right tools, and a community determined to begin
                again. That is where our work starts.
              </p>
              <Link href="/about" className="text-link mt-8">
                Meet the foundation <ArrowIcon />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section
        className="preparedness-section section-space"
        aria-labelledby="preparedness-title"
      >
        <Container>
          <div className="section-kicker">
            <span className="eyebrow">02 / Our approach</span>
            <span className="eyebrow text-ink-3">
              The full sequence of care
            </span>
          </div>
          <div className="section-heading" data-reveal>
            <h2 id="preparedness-title" className="editorial-title">
              Ready before.
              <br />
              Present <em>throughout.</em>
            </h2>
            <p>
              Real preparedness starts long before a crisis. We connect
              communities, first responders and institutions across every stage
              of an emergency.
            </p>
          </div>
          <StageRail
            items={home.sequence.map((item) => ({
              stage: item.stage as Stage,
              title: item.title,
              text: item.text,
            }))}
          />
          <Link
            href="/our-work/community-preparedness"
            className="text-link mt-10"
          >
            Explore community preparedness <ArrowIcon />
          </Link>
        </Container>
      </section>

      <section className="section-space" aria-labelledby="solutions-title">
        <Container>
          <div className="section-kicker">
            <span className="eyebrow">03 / Humanitarian innovation</span>
            <Link href="/our-work" className="text-link">
              All our work <ArrowIcon />
            </Link>
          </div>
          <div className="section-heading" data-reveal>
            <h2 id="solutions-title" className="editorial-title">
              Practical solutions.
              <br />
              <em>Human possibilities.</em>
            </h2>
            <p>
              Medical space when hospitals are overwhelmed. Evacuation support
              when water rises. Dignity when everything changes.
            </p>
          </div>
          <div className="solutions-grid">
            {programs
              .filter((program) => program.slug !== "community-preparedness")
              .map((program, index) => (
                <div key={program.slug} data-reveal>
                  <p className="solution-number">
                    <span>0{index + 1}</span>
                    {index === 0 ? "Space to care" : "A way to safety"}
                  </p>
                  <ProgramPanel program={program} />
                </div>
              ))}
          </div>
          <div className="needs-list" data-reveal>
            <p className="eyebrow">Designed around real needs</p>
            <div>
              {home.needs.map((need) => (
                <details key={need.title}>
                  <summary>
                    {need.title}
                    <span aria-hidden>+</span>
                  </summary>
                  <p>
                    {need.text}{" "}
                    {need.program && programBySlug.has(need.program) && (
                      <Link
                        href={`/our-work/${need.program}`}
                        className="u-link"
                      >
                        Explore {programBySlug.get(need.program)!.entry.title}
                      </Link>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {home.heroVideo.src && (
        <section className="deployment-section">
          <Container className="deployment-grid">
            <div data-reveal>
              <p className="eyebrow">Small footprint. New possibilities.</p>
              <h2 className="editorial-title mt-6">
                From a crate
                <br />
                to a <em>place to care.</em>
              </h2>
              <p className="mt-6 max-w-[38ch] text-paper/70">
                Folded for transport. Opened without tools. See how a CMAX unit
                becomes usable space.
              </p>
              <Link href="/our-work/cmax-med" className="text-link mt-8">
                Discover Cmax Med <ArrowIcon />
              </Link>
            </div>
            <VideoOnDemand
              url={home.heroVideo.src}
              title={home.heroVideo.title}
              context={home.heroVideo.context}
              captions={home.heroVideo.captions || null}
              poster="/images/content/stories/cmax-ready-to-deploy.webp"
            />
          </Container>
        </section>
      )}

      <section className="section-space">
        <Container>
          <div className="section-kicker">
            <span className="eyebrow">04 / In the field</span>
            <Link href="/our-actions" className="text-link">
              All actions <ArrowIcon />
            </Link>
          </div>
          <div className="field-grid">
            <div data-reveal>
              <h2 className="editorial-title">
                Close to people.
                <br />
                <em>Where it matters.</em>
              </h2>
              <p className="mt-6 max-w-[44ch] text-ink-3">
                Every place has its own challenges. Explore the actions,
                partnerships and ongoing work behind our mission.
              </p>
              <figure className="field-photo frame mt-9">
                <Image
                  src="/images/content/stories/community-visit.webp"
                  alt="Nicolás García Mayor meeting families during a community visit."
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <figcaption>Community visit · CMAX archive</figcaption>
              </figure>
            </div>
            <ul className="home-action-list" data-reveal>
              {actions.slice(0, 4).map((action) => (
                <ActionRow key={action.slug} action={action} />
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {featuredCampaigns.length > 0 && (
        <section className="campaigns-section section-space">
          <Container>
            <div className="section-kicker">
              <span className="eyebrow">05 / Take part</span>
              <Link href="/campaigns" className="text-link">
                All campaigns <ArrowIcon />
              </Link>
            </div>
            <div className="section-heading" data-reveal>
              <h2 className="editorial-title">
                The next response
                <br />
                can begin <em>with you.</em>
              </h2>
              <p>
                Help turn a community’s needs into a practical mission. Explore
                each proposal, meet its purpose, and find your way to
                contribute.
              </p>
            </div>
            <div className="campaign-grid">
              {featuredCampaigns.map((campaign) => (
                <div key={campaign.slug} data-reveal>
                  <CampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="advocacy-section section-space">
        <Container className="advocacy-grid">
          <div className="advocacy-visual" data-reveal>
            <Image
              src="/images/content/stories/humanitarian-innovation.webp"
              alt="Nicolás García Mayor speaking about innovation at the Inter-American Development Bank."
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <span className="eyebrow">
              Humanitarian innovation on a global stage
            </span>
          </div>
          <div data-reveal>
            <p className="eyebrow">Local commitment. Global conversation.</p>
            <h2 className="editorial-title mt-6">
              A seat at the table.
              <br />A voice for <em>humanity.</em>
            </h2>
            <p className="mt-6 text-ink-2">{site.unStatement}</p>
            <Link
              href="/global-advocacy/united-nations"
              className="text-link mt-7"
            >
              Our work at the United Nations <ArrowIcon />
            </Link>
            <div className="mt-4 text-sm text-ink-3">
              <ExternalLink href={site.unRegisterUrl}>
                View the official UN register
              </ExternalLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="join-section">
        <Container>
          <div className="join-main" data-reveal>
            <div>
              <p className="eyebrow">There is a role for all of us</p>
              <h2>
                Let’s be ready.
                <br />
                <em>Together.</em>
              </h2>
            </div>
            <div>
              <p>{home.partnersLine}</p>
              <ButtonLink href="/support" className="join-button" size="lg">
                Support a Mission <ArrowIcon />
              </ButtonLink>
              <Link href="/support?reason=partner" className="text-link mt-5">
                Become a partner <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="join-transparency">
            <span className="eyebrow">Trust is part of our mission</span>
            <p>{home.transparency}</p>
            <Link href="/about/transparency" className="text-link">
              Our commitment <ArrowIcon />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
