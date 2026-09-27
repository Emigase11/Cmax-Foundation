import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ButtonLink, Container } from "@/components/ui";
import { getAbout, getPeople, getSite, imgSrc } from "@/lib/content";

import { AboutHistory } from "@/components/about-history";
import "./about.css";

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


  return (
    <article className="about-experience"><Container>
      <header className="about-opening">
        <p className="about-kicker">CMAX Foundation / About us</p>
        <div className="about-opening-grid"><h1>Preparedness starts<br /><em>with people.</em></h1><div><p>A humanitarian organization built to prepare, not only to react.</p><ButtonLink href="/about/team">Meet our team <span aria-hidden="true">&#8599;</span></ButtonLink><a href="#about-purpose">Discover our purpose &#8595;</a></div></div>
      </header>
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

      <nav className="about-nav" aria-label="Explore About us"><a href="#about-purpose">01 / Purpose</a><a href="#about-values">02 / Values</a><a href="#about-history">03 / History</a><a href="#about-people">04 / People</a></nav>
      <section id="about-purpose" className="about-purpose">
        <div className="about-heading" data-reveal><p className="about-kicker">01 / Our purpose</p><h2>Before the emergency.<br /><em>Alongside the community.</em></h2><p>{about.intro}</p></div>
        <div className="about-purpose-grid"><div><span>01</span><h3>Our mission</h3><p>{about.mission}</p></div><div><span>02</span><h3>Our vision</h3><p>{about.vision}</p></div></div>
      </section>
      <section id="about-values" className="about-values">
        <div className="about-heading" data-reveal><p className="about-kicker">02 / What guides us</p><h2>Values that shape<br /><em>the work.</em></h2><p>Explore the principles behind our decisions.</p></div>
        <div className="about-values-grid">{about.values.map((v,i)=><details key={v.name} open={i===0}><summary><span>{String(i+1).padStart(2,"0")}</span><h3>{v.name}</h3><b aria-hidden="true">+</b></summary><p>{v.text}</p></details>)}</div>
      </section>
      <section id="about-history" className="about-history">
        <div className="about-heading" data-reveal><p className="about-kicker">03 / History and milestones</p><h2>An idea takes shape.<br /><em>A mission moves forward.</em></h2><p>Select a year to explore our history.</p></div>
        <AboutHistory milestones={about.history} />
      </section>
      <section id="about-people" className="about-people">
        <div className="about-heading"><p className="about-kicker">04 / The people behind CMAX</p><h2>Different perspectives.<br /><em>A shared purpose.</em></h2><p>{about.teamNote}</p><ButtonLink href="/about/team" size="lg">Meet the people behind CMAX <span aria-hidden="true">&#8599;</span></ButtonLink><Link href="/about/team" className="about-team-link">Leadership and advisors &#8594;</Link></div>
        <div className="about-portraits">{people.map(p=>{const src=imgSrc(p.entry.photo);return <figure key={p.slug}>{src ? <Image src={src} alt={p.entry.name} fill sizes="(min-width:1024px) 150px, 23vw" /> : <span>{p.entry.name.split(" ").slice(0,2).map(n=>n[0]).join("")}</span>}<figcaption>{p.entry.name}</figcaption></figure>;})}</div>
      </section>
      <section className="about-trust">
        <div className="about-heading"><p className="about-kicker">Trust is part of the work</p><h2>Clear purpose.<br /><em>Open records.</em></h2></div><div><p>{about.model}</p><p className="about-legal">{site.legalLine}</p><ButtonLink href="/about/transparency" variant="secondary">Explore our transparency</ButtonLink></div>
      </section>
      <section className="about-closing"><h2>Work with us on the next emergency,<br /><em>before it happens.</em></h2><div><ButtonLink href="/support?reason=partner">Partner with us</ButtonLink><ButtonLink href="/support" variant="secondary">Contact us</ButtonLink></div></section>
    </Container></article>
  );
}
