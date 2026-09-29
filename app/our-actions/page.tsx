import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CampaignCard } from "@/components/records";
import { ActionExplorer } from "@/components/action-explorer";
import { ButtonLink, Container } from "@/components/ui";
import { getActions, getCampaigns } from "@/lib/content";
import { hasImage, imgSrc } from "@/lib/labels";
import "./actions.css";

export const metadata: Metadata = {
  title: "Our Actions",
  description: "Explore CMAX Foundation's action records and proposed initiatives seeking support.",
};
export default async function OurActionsPage() {
  const [actions, campaigns] = await Promise.all([getActions(), getCampaigns()]);
  const featured = actions.find(action => action.entry.outcomes.length > 0 && hasImage(action.entry.hero));
  const featuredSrc = featured ? imgSrc(featured.entry.hero.image) : null;
  const countries = new Set(actions.map(action => action.entry.country).filter(Boolean)).size;
  return <div className="actions-page"><Container>
    <header className="actions-hero">
      <Link className="actions-home" href="/">Home <span aria-hidden="true">↗</span></Link>
      <div className="actions-hero-grid">
        <div><p className="eyebrow">People. Places. Purpose.</p>
          <h1>Every action<br />starts with<br /><em>someone.</em></h1>
          <p className="actions-lead">Explore the work on record and the initiatives we propose with communities. A closer look at where support can make a difference.</p>
          <a className="actions-main-link" href="#action-records">Explore the work <span aria-hidden="true">↓</span></a>
        </div>
        {featured && featuredSrc && <figure className="actions-cover">
          <div><Image src={featuredSrc} alt={featured.entry.hero.alt} fill priority sizes="(min-width: 1320px) 580px, (min-width: 768px) 45vw, calc(100vw - 56px)" />
            {featured.entry.hero.illustrative && <span className="actions-image-note">Illustrative render</span>}
          </div>
          <figcaption><span>From the archive · {featured.entry.country}</span><Link href={`/our-actions/${featured.slug}`}>{featured.entry.title} <span aria-hidden="true">↗</span></Link></figcaption>
        </figure>}
      </div>
      <dl className="actions-overview">
        <div><dt>Action records</dt><dd>{String(actions.length).padStart(2, "0")}</dd></div>
        <div><dt>Countries & regions in the archive</dt><dd>{String(countries).padStart(2, "0")}</dd></div>
        <div><dt>Proposals seeking support</dt><dd>{String(campaigns.length).padStart(2, "0")}</dd></div>
      </dl>
    </header>
    <nav className="action-group-nav" aria-label="Explore our work">
      <a href="#action-records">What has happened <span aria-hidden="true">&#8595;</span></a>
      <a href="#proposals">What we propose <span aria-hidden="true">&#8595;</span></a>
    </nav>
    <section id="action-records" className="action-group" aria-labelledby="action-records-title">
      <header><p className="eyebrow">01 / The record</p><h2 id="action-records-title">What has happened</h2>
        <p>Action records and the documentation behind them. Where confirmed results are not yet available, we say so.</p></header>
      <ActionExplorer actions={actions.map(({ slug, entry }) => ({ slug, entry: {
        title: entry.title, country: entry.country, place: entry.place,
        date: entry.date, dateLabel: entry.dateLabel, status: entry.status,
        attribution: entry.attribution, summary: entry.summary,
        hero: entry.hero, outcomes: entry.outcomes,
      } }))} />
    </section>
    <section id="proposals" className="action-group" aria-labelledby="proposals-title">
      <header><p className="eyebrow">02 / Possibilities for support</p><h2 id="proposals-title">What we propose</h2>
        <p>Proposed responses seeking support. Recipient confirmation is still pending for the initiatives shown here.</p></header>
      <ul className="unified-record-list">{campaigns.map(campaign => <li key={campaign.slug}><CampaignCard campaign={campaign} /></li>)}</ul>
    </section>
    <section className="action-group actions-invitation">
      <header><p className="eyebrow">The next conversation</p><h2>Start with<br /><em>your community.</em></h2><p>A fire company, a hospital, a municipality or a group of neighbors can ask CMAX Foundation to open a campaign. The Foundation confirms the recipient before the campaign uses its name.</p></header>
      <ButtonLink href="/support?reason=recipient">Propose a campaign</ButtonLink>
    </section>
  </Container></div>;
}
