import type { Metadata } from "next";
import Link from "next/link";
import { ProgramPanel } from "@/components/records";
import { StageChips } from "@/components/stage-rail";
import { Container, PageIntro } from "@/components/ui";
import { getPrograms, type Stage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "How CMAX Foundation helps: deployable medical capacity, evacuation support and temporary protection, and the community preparedness that comes before any deployment.",
};

export default async function OurWorkPage() {
  const programs = await getPrograms();
  return (
    <Container>
      <PageIntro
        title="How we help, before, during and after."
        lede="Three programs, one sequence. Each page explains the need, the people it serves, the capacity CMAX brings, and how to take part. Each also says plainly whether that capacity is proposed, demonstrated, or deployed and documented."
      />
      <div className="grid gap-12 pb-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-16">
        {programs.map((p, i) => (
          <div key={p.slug}>
            <ProgramPanel program={p} priority={i < 2} />
            <div className="mt-4">
              <StageChips stages={p.entry.stages as Stage[]} />
            </div>
          </div>
        ))}
      </div>
      <section className="mt-16 border-t-[3px] border-ink pt-8 lg:mt-24">
        <h2 className="display-md text-[1.6rem]">What the labels mean</h2>
        <dl className="mt-6 grid gap-6 md:grid-cols-3">
          <div>
            <dt className="strip text-ink">Proposed capability</dt>
            <dd className="mt-2 text-ink-2">A design or prototype whose humanitarian use is proposed. No field figures are published.</dd>
          </div>
          <div>
            <dt className="strip text-ink">Demonstrated</dt>
            <dd className="mt-2 text-ink-2">Units have been built and shown working. Deployments by the Foundation are documented separately.</dd>
          </div>
          <div>
            <dt className="strip text-ink">Deployed and documented</dt>
            <dd className="mt-2 text-ink-2">
              Used in the field by the Foundation, with a record under{" "}
              <Link href="/our-actions" className="u-link">
                Our Actions
              </Link>
              .
            </dd>
          </div>
        </dl>
      </section>
    </Container>
  );
}
