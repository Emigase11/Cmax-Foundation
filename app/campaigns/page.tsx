import type { Metadata } from "next";
import Link from "next/link";
import { CampaignCard } from "@/components/records";
import { ButtonLink, Container, PageIntro, Tag } from "@/components/ui";
import { CAMPAIGN_STATUS, getCampaigns } from "@/lib/content";

export const metadata: Metadata = {
  title: "Campaigns",
  description:
    "Missions that need support: the need, the place, who receives the support, the proposed response and the current status.",
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  return (
    <Container>
      <PageIntro
        title="Fund preparedness. Protect a community."
        lede="Each campaign describes a concrete need and the response CMAX Foundation proposes. In this first version, support starts with a message: the Foundation replies with the confirmed details and the next step. Online donations and community-created campaigns are planned for a later stage."
      />
      <div className="grid gap-12 pb-8 md:grid-cols-2 lg:gap-x-12">
        {campaigns.map((c) => (
          <CampaignCard key={c.slug} campaign={c} />
        ))}
      </div>

      <section className="mt-16 grid gap-10 border-t-[3px] border-ink pt-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="display-md text-[clamp(1.6rem,1.3rem+1.2vw,2.3rem)]">Want a campaign for your community?</h2>
          <p className="mt-4 max-w-[46ch] text-ink-2">
            A fire company, a hospital, a municipality or a group of neighbors can ask CMAX Foundation to open a
            campaign. The Foundation confirms the recipient before the campaign uses its name.
          </p>
          <div className="mt-6">
            <ButtonLink href="/support?reason=recipient">Propose a campaign</ButtonLink>
          </div>
        </div>
        <dl className="grid gap-5 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {Object.entries(CAMPAIGN_STATUS).map(([key, s]) => (
            <div key={key}>
              <dt>
                <Tag tone={s.tone}>{s.label}</Tag>
              </dt>
              <dd className="mt-2 text-[0.95rem] text-ink-2">
                {key === "proposed" && "Need identified and response proposed. Recipient confirmation may be pending."}
                {key === "review" && "Being reviewed by the Foundation before it opens."}
                {key === "active" && "Open for support, with a confirmed recipient."}
                {key === "completed" && "Delivered. The result is documented under Our Actions."}
                {key === "pending" && "The page exists, but the content is still being confirmed."}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <p className="mt-12 text-[0.95rem] text-ink-3">
        Completed campaigns get a public result page under{" "}
        <Link href="/our-actions" className="u-link">
          Our Actions
        </Link>
        .
      </p>
    </Container>
  );
}
