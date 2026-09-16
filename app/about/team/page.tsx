import type { Metadata } from "next";
import Image from "next/image";
import { LinkedInIcon } from "@/components/icons";
import { Container, EmptyNote, PageIntro } from "@/components/ui";
import { getAbout, getPeople, imgSrc } from "@/lib/content";

export const metadata: Metadata = {
  title: "Leadership and team",
  description: "The people behind CMAX Foundation: founder, core team and strategic advisors.",
};

const GROUPS: { key: string; label: string }[] = [
  { key: "leadership", label: "Founder and leadership" },
  { key: "team", label: "Core team" },
  { key: "advisors", label: "Strategic advisors" },
  { key: "network", label: "Volunteers and project network" },
];

export default async function TeamPage() {
  const [people, about] = await Promise.all([getPeople(), getAbout()]);

  return (
    <Container>
      <PageIntro title="The people who make preparedness practical." lede={about.teamNote} />
      {GROUPS.map((g) => {
        const members = people.filter((p) => p.entry.group === g.key);
        return (
          <section key={g.key} className="border-t-[3px] border-ink py-8 first-of-type:border-t-[3px]">
            <h2 className="display-md text-[1.7rem]">{g.label}</h2>
            {members.length ? (
              <ul className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((p) => {
                  const src = imgSrc(p.entry.photo);
                  return (
                    <li key={p.slug} className="grid grid-cols-[6rem_1fr] gap-5">
                      <div className="frame relative aspect-square rounded-[4px]">
                        {src ? (
                          <Image src={src} alt={p.entry.name} fill sizes="96px" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="display text-[1.6rem] text-ink-3" aria-hidden>
                              {p.entry.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="title text-[1.15rem]">{p.entry.name}</h3>
                        <p className="mt-1 text-[0.95rem] text-ink-3">{p.entry.role}</p>
                        {p.entry.bio && <p className="mt-2 max-w-[36ch] text-[0.95rem] text-ink-2">{p.entry.bio}</p>}
                        {p.entry.linkedin && (
                          <a
                            href={p.entry.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-[0.9rem] text-ink-2 hover:text-orange-deep"
                          >
                            <LinkedInIcon width={16} height={16} /> LinkedIn
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="mt-4">
                <EmptyNote>Profiles in this group are being confirmed by CMAX Foundation.</EmptyNote>
              </div>
            )}
          </section>
        );
      })}
    </Container>
  );
}
