import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ButtonLink, Container, ExternalLink, Tag } from "@/components/ui";
import { Figure } from "@/components/figure";
import { VideoOnDemand } from "@/components/video-on-demand";
import { DisplacementHistory } from "@/components/displacement-history";
import { AnimatedNumber } from "@/components/animated-number";
import { ImageComparison } from "@/components/image-comparison";
import { FieldMap } from "@/components/field-map";
import {
  getActions,
  getCampaigns,
  getHome,
  getPrograms,
  getSite,
  getVisual,
  getPress,
  imgSrc,
  MATURITY,
  CAMPAIGN_STATUS,
} from "@/lib/content";
import { getDisplacement } from "@/lib/displacement";
import { getFundraising } from "@/lib/fundraising";

export const revalidate = 86400;

export default async function HomePage() {
  const [home, site, programs, actions, campaigns, visual, press] =
    await Promise.all([
      getHome(),
      getSite(),
      getPrograms(),
      getActions(),
      getCampaigns(),
      getVisual(),
      getPress(),
    ]);
  const displacement = await getDisplacement(visual.displacement);
  const funds = getFundraising(visual.fundraising);
  const heroSrc = imgSrc(home.hero.image);
  const unVideo = visual.unVideo.find((v) => v.url);
  const featured = campaigns.filter((c) => c.entry.featured).slice(0, 2);
  return (
    <div className="visual-home">
      <section className="visual-hero" aria-labelledby="home-title">
        {heroSrc && (
          <Image
            src={heroSrc}
            alt={home.hero.alt}
            fill
            preload
            quality={90}
            sizes="(max-width: 767px) 1140px, (max-width: 1023px) 1100px, (max-width: 1150px) 1150px, 100vw"
            className="visual-hero-photo"
          />
        )}
        <div className="visual-hero-shade" aria-hidden="true" />
        <Container className="visual-hero-content">
          <p className="eyebrow">
            <span className="status-dot" /> Innovation for humanity
          </p>
          <h1 id="home-title">
            {home.headline
              .split(/\b(before)\b/)
              .map((part, i) =>
                part === "before" ? (
                  <em key={i}>{part}</em>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
          </h1>
          <p className="hero-one-line">
            Practical solutions. Human dignity. Before, during and after.
          </p>
          <div className="visual-hero-actions">
            <ButtonLink href="/support" size="lg">
              Support a Mission <ArrowIcon />
            </ButtonLink>
            <Link href="/approach" className="text-link">
              Discover our approach <ArrowIcon />
            </Link>
          </div>
          <div className="visual-hero-bottom">
            <a href="#united-nations" className="eyebrow">
              Explore our mission ↓
            </a>
            <span>
              {home.hero.illustrative ? "Illustrative render" : "CMAX archive"}{" "}
              · {home.hero.credit}
            </span>
          </div>
        </Container>
      </section>
      <section
        id="united-nations"
        className="visual-section visual-dark un-section"
      >
        <Container className="un-grid">
          <div>
            <p className="eyebrow">01 / A global voice</p>
            <h2 className="editorial-title">
              Local commitment.
              <br />
              <em>Global conversation.</em>
            </h2>
            <p className="un-statement">{site.unStatement}</p>
            <Link href="/global-advocacy/united-nations" className="text-link">
              Our work at the United Nations <ArrowIcon />
            </Link>
            <div className="un-register">
              <ExternalLink href={site.unRegisterUrl}>
                Official UN register
              </ExternalLink>
            </div>
          </div>
          {unVideo?.url ? (
            <VideoOnDemand
              url={unVideo.url}
              title={unVideo.title}
              context={unVideo.context}
              captions={unVideo.captions}
              poster={imgSrc(visual.unImage.image)}
            />
          ) : (
            <Figure
              figure={visual.unImage}
              sizes="(min-width: 1320px) 570px, (min-width: 1024px) calc((100vw - 160px) / 2), calc(100vw - 48px)"
            />
          )}
        </Container>
      </section>
      <section className="visual-section displacement-section contour-surface">
        <Container>
          <div className="section-kicker">
            <p className="eyebrow">02 / The scale of the need</p>
            <span className="eyebrow">Every number is a human story</span>
          </div>
          <DisplacementHistory data={displacement} />
        </Container>
      </section>
      <section className="innovation-section" aria-labelledby="innovation-title">
        <Container>
          <div className="innovation-heading">
            <div>
              <p className="eyebrow innovation-eyebrow"><span />03 / Humanitarian innovation</p>
              <h2 id="innovation-title">Practical solutions.<br /><em>Human possibilities.</em></h2>
            </div>
            <div className="innovation-intro">
              <p>Thoughtful design.<br />For the moments that matter most.</p>
              <Link href="/our-work" className="innovation-all">Explore our work <ArrowIcon /></Link>
            </div>
          </div>
          <div className="innovation-collection">
            {programs
              .filter((p) => p.slug !== "community-preparedness")
              .map((program, i) => {
                const med = program.slug === "cmax-med";
                const figure = med && visual.cmaxMedSolutionImage.image
                  ? visual.cmaxMedSolutionImage : program.entry.hero;
                const src = imgSrc(figure.image);
                return (
                  <article key={program.slug} className={`innovation-card ${med ? "innovation-med" : "innovation-air"}`}>
                    <Link href={`/our-work/${program.slug}`} className="innovation-card-link" aria-labelledby={`solution-${program.slug}`} aria-describedby={`solution-status-${program.slug} solution-description-${program.slug} solution-image-${program.slug}`}>
                      <figure className="innovation-visual">
                        <div className="innovation-photo">
                          {src && <Image src={src} alt={figure.alt} fill quality={90}
                            sizes="(min-width: 1320px) 760px, (min-width: 1024px) 60vw, (min-width: 640px) calc(100vw - 80px), calc(100vw - 56px)" />}
                          <span id={`solution-image-${program.slug}`} className="innovation-image-label">{figure.illustrative ? "Illustrative concept" : "CMAX archive"}</span>
                        </div>
                        {figure.credit && <figcaption>{figure.credit}</figcaption>}
                      </figure>
                      <div className="innovation-copy">
                        <div className="innovation-meta"><span>0{i + 1}</span><span id={`solution-status-${program.slug}`} className="innovation-status"><span />{MATURITY[program.entry.maturity].label}</span></div>
                        <div className="innovation-story">
                          <p className="innovation-purpose">{med ? "Space to care" : "A way to safety"}</p>
                          <h3 id={`solution-${program.slug}`}>{program.entry.title}</h3>
                          <p id={`solution-description-${program.slug}`} className="innovation-description">{program.entry.tagline}</p>
                        </div>
                        <span className="innovation-cta">Discover {program.entry.title}<span className="innovation-arrow"><ArrowIcon /></span></span>
                      </div>
                    </Link>
                  </article>
                );
              })}
          </div>
          <div className="innovation-footnote"><span>Designed around people.</span><span>Technology developed by Cmax System</span></div>
        </Container>
      </section>
      <section className="visual-section visual-dark">
        <Container>
          <div className="section-kicker">
            <p className="eyebrow">04 / Built to unfold</p>
            <span className="eyebrow">Cmax Med</span>
          </div>
          <h2 className="editorial-title section-title-space">
            Small footprint.
            <br />
            <em>New possibilities.</em>
          </h2>
          <ImageComparison
            before={visual.comparisonBefore}
            after={visual.comparisonAfter}
          />
        </Container>
      </section>
      <section className="visual-section map-section contour-surface">
        <Container>
          <div className="section-kicker">
            <p className="eyebrow">05 / In the field</p>
            <Link href="/our-actions" className="text-link">
              All actions <ArrowIcon />
            </Link>
          </div>
          <h2 className="editorial-title section-title-space">
            Close to people.
            <br />
            <em>Where it matters.</em>
          </h2>
          <FieldMap
            records={actions.map((a) => ({
              slug: a.slug,
              title: a.entry.title,
              countries: a.entry.mapCountries,
              status: a.entry.status,
              hero: a.entry.hero,
            }))}
          />
        </Container>
      </section>
      <section className="visual-section visual-light">
        <Container>
          <div className="section-kicker">
            <p className="eyebrow">06 / Campaigns</p>
            <Link href="/campaigns" className="text-link">
              All campaigns <ArrowIcon />
            </Link>
          </div>
          <h2 className="editorial-title section-title-space">
            The next response
            <br />
            can begin <em>with you.</em>
          </h2>
          <div className="visual-campaigns">
            {featured.map((c) => (
              <article key={c.slug}>
                <Link
                  href={`/campaigns/${c.slug}`}
                  className="campaign-visual-link"
                >
                  {imgSrc(c.entry.hero.image) ? (
                    <Figure
                      figure={c.entry.hero}
                      sizes="(min-width: 1320px) 600px, (min-width: 768px) calc((100vw - 112px) / 2), calc(100vw - 32px)"
                    />
                  ) : (
                    <div className="campaign-editorial">
                      <span className="eyebrow">A developing initiative</span>
                      <span>{c.entry.country}</span>
                      <span className="eyebrow">CMAX Foundation ↗</span>
                    </div>
                  )}
                </Link>
                <div className="campaign-short-copy">
                  <Tag tone={CAMPAIGN_STATUS[c.entry.status].tone}>
                    {CAMPAIGN_STATUS[c.entry.status].label}
                  </Tag>
                  <h3>
                    <Link href={`/campaigns/${c.slug}`}>{c.entry.title}</Link>
                  </h3>
                  <Link href={`/campaigns/${c.slug}`} className="text-link">
                    Explore this mission <ArrowIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="visual-section funding-section contour-surface">
        <Container>
          <p className="eyebrow">07 / Support into action</p>
          {funds ? (
            <>
              <p className="funding-number">
                <span className="eyebrow">{funds.currency}</span>
                <AnimatedNumber value={funds.amount!} />
              </p>
              <h2>{funds.financed}</h2>
              <p className="source-line">
                <ExternalLink href={funds.source}>
                  Funds raised · As of {funds.date}
                </ExternalLink>
              </p>
            </>
          ) : (
            <>
              <h2 className="editorial-title">
                Every contribution.
                <br />
                <em>A practical purpose.</em>
              </h2>
              <p>
                Our next fundraising report will share the amount raised and the
                work it made possible.
              </p>
            </>
          )}
          <Link href="/about/transparency" className="text-link">
            Our commitment to transparency <ArrowIcon />
          </Link>
        </Container>
      </section>
      <section className="visual-section press-section contour-surface">
        <Container>
          <div className="section-kicker">
            <p className="eyebrow">08 / In the public conversation</p>
            <Link href="/about/press" className="text-link">
              Press archive <ArrowIcon />
            </Link>
          </div>
          {press.length ? (
            <div className="press-logos">
              {press.map((p) => (
                <a
                  key={p.slug}
                  href={p.entry.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.entry.outlet}: ${p.entry.title}`}
                >
                  {imgSrc(p.entry.logo) ? (
                    <Image
                      src={imgSrc(p.entry.logo)!}
                      alt={p.entry.outlet}
                      width={270}
                      height={100}
                      sizes="150px"
                      unoptimized
                    />
                  ) : (
                    <span>{p.entry.outlet}</span>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div className="press-empty">
              <h2 className="editorial-title">
                Stories worth
                <br />
                <em>bringing to light.</em>
              </h2>
              <Link href="/support?reason=press" className="text-link">
                Press and media inquiries <ArrowIcon />
              </Link>
            </div>
          )}
        </Container>
      </section>
      <section className="join-section visual-join">
        <Container>
          <div className="join-main">
            <div>
              <p className="eyebrow">09 / There is a role for all of us</p>
              <h2>
                Let’s be ready.
                <br />
                <em>Together.</em>
              </h2>
            </div>
            <div>
              <ButtonLink href="/support" className="join-button" size="lg">
                Support a Mission <ArrowIcon />
              </ButtonLink>
              <Link href="/support?reason=partner" className="text-link mt-5">
                Become a partner <ArrowIcon />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
