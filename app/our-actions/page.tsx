import type { Metadata } from "next";
import { ActionRow, CampaignCard } from "@/components/records";
import { ButtonLink, Container, PageIntro } from "@/components/ui";
import { getActions, getCampaigns } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Actions",
  description: "Explore CMAX Foundation's action records and proposed initiatives seeking support.",
};
export default async function OurActionsPage() {
  const [actions, campaigns] = await Promise.all([getActions(), getCampaigns()]);
  return <Container>
    <PageIntro title="Our actions. Our next possibilities."
      lede="Explore the work on record and the initiatives we propose with communities. Documentation and recipient confirmation are made clear in each story." />
    <nav className="action-group-nav" aria-label="Explore our work">
      <a href="#action-records">What has happened <span aria-hidden="true">&#8595;</span></a>
      <a href="#proposals">What we propose <span aria-hidden="true">&#8595;</span></a>
    </nav>
    <section id="action-records" className="action-group" aria-labelledby="action-records-title">
      <header><p className="eyebrow">01 / The record</p><h2 id="action-records-title">What has happened</h2>
        <p>Action records and the documentation behind them. Where confirmed results are not yet available, we say so.</p></header>
      <ul className="unified-record-list">{actions.map(action => <ActionRow key={action.slug} action={action} />)}</ul>
    </section>
    <section id="proposals" className="action-group" aria-labelledby="proposals-title">
      <header><p className="eyebrow">02 / Possibilities for support</p><h2 id="proposals-title">What we propose</h2>
        <p>Proposed responses seeking support. Recipient confirmation is still pending for the initiatives shown here.</p></header>
      <ul className="unified-record-list">{campaigns.map(campaign => <li key={campaign.slug}><CampaignCard campaign={campaign} /></li>)}</ul>
    </section>
    <section className="action-group">
      <header><h2>Want a campaign for your community?</h2><p>A fire company, a hospital, a municipality or a group of neighbors can ask CMAX Foundation to open a campaign. The Foundation confirms the recipient before the campaign uses its name.</p></header>
      <ButtonLink href="/support?reason=recipient">Propose a campaign</ButtonLink>
    </section>
  </Container>;
}
