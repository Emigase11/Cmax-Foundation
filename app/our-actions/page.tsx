import type { Metadata } from "next";
import { ActionFeature, ActionRow } from "@/components/records";
import { Container, PageIntro, Tag } from "@/components/ui";
import { ACTION_STATUS, getActions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Actions",
  description:
    "A record of what CMAX Foundation has done on the ground: country, date, context, what was done, who was supported, and the confirmed results.",
};

export default async function OurActionsPage() {
  const actions = await getActions();
  const featured = actions.find((a) => a.entry.featured);
  const rest = actions.filter((a) => a.slug !== featured?.slug);

  const countries = Array.from(new Set(actions.map((a) => a.entry.country)));

  return (
    <Container>
      <PageIntro
        title="Real support. Real communities. A record you can check."
        lede="Every action has a place, a date, a context, the people involved and the results CMAX Foundation can confirm. Where the documentation is still being compiled, the record says so."
        strip={<p className="strip text-ink-3">{countries.join(" · ")}</p>}
      />
      {featured && (
        <div className="pb-12">
          <ActionFeature action={featured} />
        </div>
      )}
      <ul className="border-b border-warm-2">
        {rest.map((a) => (
          <ActionRow key={a.slug} action={a} />
        ))}
      </ul>
      <section className="mt-16 grid gap-6 border-t-[3px] border-ink pt-8 md:grid-cols-12">
        <h2 className="display-md text-[1.5rem] md:col-span-4">How records are marked</h2>
        <dl className="grid gap-5 sm:grid-cols-2 md:col-span-8">
          {Object.entries(ACTION_STATUS).map(([key, s]) => (
            <div key={key} className="flex flex-col gap-2">
              <dt>
                <Tag tone={s.tone}>{s.label}</Tag>
              </dt>
              <dd className="text-[0.95rem] text-ink-2">
                {key === "documented" && "What was done, where and with whom is confirmed and linked to sources."}
                {key === "ongoing" && "Work in progress. Results are added as they are confirmed."}
                {key === "historical" && "Institutional history kept for the record."}
                {key === "pending" && "The Foundation is compiling the documentation before publishing details."}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  );
}
