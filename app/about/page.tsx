import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ButtonLink, Container, PageIntro } from "@/components/ui";
import { getAbout, getPeople, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mission, vision, values and history of CMAX Foundation, a humanitarian organization preparing communities for complex emergencies.",
};

export default async function AboutPage() {
  const [about, site, people] = await Promise.all([
    getAbout(),
    getSite(),
    getPeople(),
  ]);
  const leadership = people.filter((p) => p.entry.group === "leadership");

  return (
    <Container>
      <PageIntro
        title="A humanitarian organization built to prepare, not only to react."
        lede={about.intro}
      />

      <figure
        className="about-photo frame relative mb-14 aspect-[16/7]"
        data-reveal
      >
        <Image
          src="/images/content/stories/community-together.webp"
          alt="Nicolás García Mayor with a large community group gathered outdoors."
          fill
          quality={90}
          sizes="(min-width: 1320px) 1240px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
          preload
          className="object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-5 pt-12 text-xs text-white">
          Together with communities · From the CMAX archive
        </figcaption>
      </figure>

      <section className="grid gap-10 border-t-[3px] border-ink pt-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="display-md text-[1.7rem]">Mission</h2>
          <p className="mt-3 max-w-[52ch] text-[1.08rem] text-ink-2">
            {about.mission}
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="display-md text-[1.7rem]">Vision</h2>
          <p className="mt-3 max-w-[44ch] text-[1.08rem] text-ink-2">
            {about.vision}
          </p>
        </div>
      </section>

      <section className="mt-16 border-t border-warm-2 pt-8 lg:mt-20">
        <h2 className="display-md text-[1.7rem]">Values</h2>
        <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v) => (
            <div key={v.name} className="border-t border-warm-2 pt-4">
              <dt className="title text-[1.15rem]">{v.name}</dt>
              <dd className="mt-1.5 text-[0.98rem] text-ink-2">{v.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 grid gap-10 border-t-[3px] border-ink pt-8 lg:mt-20 lg:grid-cols-12">
        <h2 className="display-md text-[1.7rem] lg:col-span-4">
          History and milestones
        </h2>
        <ol className="lg:col-span-8">
          {about.history.map((h) => (
            <li
              key={h.year}
              className="grid grid-cols-[5.5rem_1fr] gap-4 border-t border-warm-2 py-4 first:border-t-0 first:pt-0"
            >
              <span className="display-md text-[1.5rem] leading-none text-orange">
                {h.year}
              </span>
              <p className="max-w-[58ch] text-ink-2">{h.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-10 border-t border-warm-2 pt-8 lg:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="display-md text-[1.7rem]">Leadership and team</h2>
          {leadership.length > 0 && (
            <ul className="mt-4 space-y-2">
              {leadership.map((p) => (
                <li key={p.slug}>
                  <span className="font-semibold">{p.entry.name}</span>
                  <span className="text-ink-3"> · {p.entry.role}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 max-w-[50ch] text-[0.98rem] text-ink-2">
            {about.teamNote}
          </p>
          <Link
            href="/about/team"
            className="u-link mt-4 inline-block font-medium"
          >
            Leadership, team and advisors
          </Link>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <h2 className="display-md text-[1.7rem]">Transparency</h2>
          <p className="mt-3 max-w-[46ch] text-[0.98rem] text-ink-2">
            {about.model}
          </p>
          <p className="mt-3 max-w-[46ch] text-[0.95rem] text-ink-3">
            {site.legalLine}
          </p>
          <Link
            href="/about/transparency"
            className="u-link mt-4 inline-block font-medium"
          >
            How donations, missions and campaigns are reviewed
          </Link>
        </div>
      </section>

      <section className="mt-16 border-t-[3px] border-ink pt-8 lg:mt-20">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="display-md max-w-[24ch] text-[clamp(1.5rem,1.2rem+1.4vw,2.4rem)]">
            Work with us on the next emergency, before it happens.
          </p>
          <div className="flex flex-wrap gap-4">
            <ButtonLink href="/support?reason=partner">
              Partner with us
            </ButtonLink>
            <ButtonLink href="/support" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </section>
    </Container>
  );
}
