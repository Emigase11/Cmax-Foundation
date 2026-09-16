import type { Metadata } from "next";
import { Container, ExternalLink, PageIntro } from "@/components/ui";
import { getAbout, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Transparency",
  description: "How CMAX Foundation uses donations, selects missions, reviews campaigns and documents outcomes.",
};

export default async function TransparencyPage() {
  const [about, site] = await Promise.all([getAbout(), getSite()]);
  return (
    <Container>
      <PageIntro title="Give. Track. See the result." lede={about.model} />
      <section className="border-t-[3px] border-ink">
        <dl>
          {about.transparency.map((t) => (
            <div key={t.question} className="grid gap-4 border-b border-warm-2 py-8 lg:grid-cols-12">
              <dt className="title text-[1.3rem] lg:col-span-5">{t.question}</dt>
              <dd className="max-w-[60ch] text-[1.05rem] text-ink-2 lg:col-span-7">{t.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="mt-12 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="display-md text-[1.5rem]">Legal status</h2>
        </div>
        <div className="max-w-[60ch] text-ink-2 lg:col-span-7">
          <p>
            {site.legalLine} EIN {site.ein}.
          </p>
          <p className="mt-3">
            <ExternalLink href={site.guidestarUrl}>Public profile on GuideStar</ExternalLink>
          </p>
          <p className="mt-3">
            <ExternalLink href={site.unRegisterUrl}>UN ECOSOC consultative status register</ExternalLink>
          </p>
        </div>
      </section>
    </Container>
  );
}
