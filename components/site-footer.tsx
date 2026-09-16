import Link from "next/link";
import { getSite } from "@/lib/content";
import { Container, ExternalLink } from "./ui";
import { Wordmark } from "./site-header";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/our-work", label: "Our Work" },
      { href: "/our-actions", label: "Our Actions" },
      { href: "/campaigns", label: "Campaigns" },
      { href: "/global-advocacy", label: "Global Advocacy" },
      {
        href: "/global-advocacy/united-nations",
        label: "Our Work at the United Nations",
      },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Mission, vision and history" },
      { href: "/about/team", label: "Leadership and team" },
      { href: "/about/transparency", label: "Transparency" },
      { href: "/support", label: "Support a Mission" },
      { href: "/support?reason=partner", label: "Partner with us" },
    ],
  },
];

export async function SiteFooter() {
  const site = await getSite();
  const socials = [
    ["Facebook", site.social.facebook],
    ["Instagram", site.social.instagram],
    ["LinkedIn", site.social.linkedin],
    ["X", site.social.x],
    ["YouTube", site.social.youtube],
  ].filter(([, url]) => url) as [string, string][];

  return (
    <footer className="site-footer">
      <Container className="grid gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Wordmark height={36} />
          <p className="mt-4 max-w-[34ch] text-ink-2">
            Preparing communities, first responders and institutions for complex
            emergencies. {site.tagline}.
          </p>
          <p className="mt-6 text-[0.95rem] text-ink-2">{site.unStatement}</p>
        </div>

        {COLUMNS.map((col) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className="md:col-span-2 lg:col-span-2"
          >
            <h2 className="strip text-ink">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.98rem] hover:text-orange-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-4">
          <h2 className="strip text-ink">Contact</h2>
          <address className="mt-4 not-italic text-[0.98rem] leading-relaxed text-ink-2">
            <a href={`mailto:${site.email}`} className="u-link text-ink">
              {site.email}
            </a>
            <br />
            {site.phone}
            <br />
            <span className="whitespace-pre-line">{site.address}</span>
          </address>
          {socials.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {socials.map(([label, url]) => (
                <li key={label}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="strip text-ink hover:text-orange-deep"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
      <div className="footer-bottom border-t border-warm-2">
        <Container className="flex flex-col gap-3 py-6 text-[0.85rem] text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>
            {site.legalLine} EIN {site.ein}.{" "}
            <ExternalLink href={site.guidestarUrl}>
              GuideStar profile
            </ExternalLink>
          </p>
          <p>
            Cmax Med and AeroCabin™ are developed by Cmax System. ©{" "}
            {new Date().getFullYear()} {site.orgName}.
          </p>
        </Container>
      </div>
    </footer>
  );
}
