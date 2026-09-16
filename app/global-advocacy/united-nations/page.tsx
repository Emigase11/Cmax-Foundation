import type { Metadata } from "next";
import Link from "next/link";
import { ActivityRow } from "@/components/records";
import { ButtonLink, Container, ExternalLink } from "@/components/ui";
import { getActivities, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Work at the United Nations",
  description:
    "CMAX Foundation has held special consultative status with the United Nations Economic and Social Council (ECOSOC) since 2021. Meetings, interventions and documents.",
};

export default async function UnitedNationsPage() {
  const [activities, site] = await Promise.all([getActivities(), getSite()]);
  const un = activities.filter((a) => a.entry.unitedNations);

  return (
    <>
      <section className="bg-ink text-paper">
        <Container className="py-14 sm:py-20">
          <h1 className="display max-w-[14ch] text-[clamp(2.6rem,1.6rem+5vw,5.6rem)]">Our Work at the United Nations</h1>
          <p className="display-md mt-10 max-w-[30ch] text-[clamp(1.4rem,1.1rem+1.4vw,2.3rem)] text-paper">
            {site.unStatement}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <ExternalLink href={site.unRegisterUrl} className="text-paper">
              Confirmed in the UN Integrated Civil Society Organizations System
            </ExternalLink>
          </div>
        </Container>
      </section>

      <Container>
        <section className="grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <h2 className="display-md text-[1.7rem] lg:col-span-4">What consultative status means</h2>
          <div className="max-w-[62ch] space-y-4 text-[1.08rem] text-ink-2 lg:col-span-8">
            <p>
              Special consultative status is granted by ECOSOC to non-governmental organizations with recognized
              competence in specific fields covered by the Council. It gives the Foundation access to ECOSOC and its
              subsidiary bodies, to the human rights mechanisms of the United Nations, and to events organized by the
              President of the General Assembly.
            </p>
            <p>
              For CMAX Foundation it is the channel through which field experience in preparedness, rapid habitat and
              emergency response reaches the institutions that set humanitarian priorities. The record below lists what
              the Foundation has brought to that conversation, with dates, participants and documents.
            </p>
          </div>
        </section>

        <section className="border-t-[3px] border-ink pt-8">
          <h2 className="display-md text-[1.7rem]">Meetings, interventions and documents</h2>
          <ul className="mt-6 border-b border-warm-2">
            {un.map((a) => (
              <ActivityRow key={a.slug} activity={a} />
            ))}
          </ul>
          <p className="mt-6 max-w-[64ch] text-[0.95rem] text-ink-3">
            Photographs and documents from these activities are being added as their attribution is confirmed. New
            meetings, statements and publications are published here by the Foundation.
          </p>
        </section>

        <section className="mt-16 grid gap-8 border-t border-warm-2 pt-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display-md text-[1.5rem]">Institutional partners and UN agencies</h2>
            <p className="mt-3 max-w-[56ch] text-ink-2">
              CMAX Foundation works with governments, universities, companies and foundations. If your institution is
              preparing for complex emergencies, the Foundation can bring field-tested solutions to the table.
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-9 lg:items-end">
            <ButtonLink href="/support?reason=partner">Partner with us</ButtonLink>
            <Link href="/global-advocacy" className="u-link text-[0.95rem]">
              Full institutional record
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
