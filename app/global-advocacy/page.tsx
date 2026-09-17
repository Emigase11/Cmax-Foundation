import type { Metadata } from "next";
import Image from "next/image";
import { ActivityRow } from "@/components/records";
import {
  ButtonLink,
  Container,
  ExternalLink,
  PageIntro,
} from "@/components/ui";
import { getActivities, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Global Advocacy",
  description:
    "From the field to the global conversation: CMAX Foundation's meetings, interventions, statements and publications, with dates, participants and documents.",
};

export default async function GlobalAdvocacyPage() {
  const [activities, site] = await Promise.all([getActivities(), getSite()]);
  return (
    <Container>
      <PageIntro
        title="From the field to the global conversation."
        lede="CMAX Foundation brings practical experience in rapid habitat, emergency response and preparedness to global forums, partnerships and policy conversations. This is the institutional record: each activity with its date, venue, participants, documents and what it contributed to the mission."
      />
      <section className="grid gap-8 border-t-[3px] border-ink pt-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="display-md text-[clamp(1.4rem,1.1rem+1.3vw,2.2rem)]">
            {site.unStatement}
          </p>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9 lg:items-end">
          <ButtonLink href="/global-advocacy/united-nations">
            Our Work at the United Nations
          </ButtonLink>
          <ExternalLink href={site.unRegisterUrl}>
            Entry in the UN register
          </ExternalLink>
        </div>
      </section>
      <div className="advocacy-archive mt-16" data-reveal>
        <figure>
          <div className="frame relative aspect-[4/3]">
            <Image
              src="/images/content/stories/humanitarian-innovation.webp"
              alt="Nicolás García Mayor speaking at the Inter-American Development Bank."
              fill
              quality={90}
              sizes="(min-width: 1320px) 744px, (min-width: 768px) 60vw, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-xs text-ink-3">
            Humanitarian innovation at the Inter-American Development Bank ·
            CMAX archive
          </figcaption>
        </figure>
        <figure>
          <div className="frame relative aspect-[4/3]">
            <Image
              src="/images/content/stories/meeting-pope-francis.webp"
              alt="Nicolás García Mayor meeting Pope Francis."
              fill
              quality={90}
              sizes="(min-width: 1320px) 434px, (min-width: 768px) 35vw, calc(100vw - 32px)"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-xs text-ink-3">
            Meeting with Pope Francis · CMAX archive
          </figcaption>
        </figure>
      </div>
      <section className="mt-16">
        <h2 className="display-md text-[1.7rem]">Institutional record</h2>
        <ul className="mt-6 border-b border-warm-2">
          {activities.map((a) => (
            <ActivityRow key={a.slug} activity={a} />
          ))}
        </ul>
      </section>
    </Container>
  );
}
