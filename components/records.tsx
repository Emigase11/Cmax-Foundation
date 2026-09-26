import Image from "next/image";
import Link from "next/link";
import {
  ACTIVITY_TYPE,
  ATTRIBUTION,
  MATURITY,
  formatDate,
  hasImage,
  imgSrc,
  stripCountry,
  type Figure,
} from "@/lib/labels";
import { Strip, Tag } from "./ui";
import { ArrowIcon } from "./icons";
import "./records.css";

export type ActionEntry = {
  slug: string;
  entry: {
    title: string; country: string; place: string; date: string | null;
    dateLabel: string; status: string; attribution: string; summary: string;
    hero: Figure; outcomes: readonly string[];
  };
};
export type CampaignEntry = {
  slug: string;
  entry: {
    title: string; status: string; country: string; place: string; summary: string;
    recipients: string; recipientConfirmed: boolean; hero: Figure;
  };
};

function RecordCard({ title, location, country, summary, hero, href, context, support }: {
  title: string; location: string; country: string; summary: string; hero: Figure; href: string;
  context: React.ReactNode; support?: string;
}) {
  const src = hasImage(hero) ? imgSrc(hero.image) : null;
  return (
    <article className="unified-record">
      <div className="unified-record-image">
        {src ? <Image src={src} alt={hero.alt} fill quality={90}
          sizes="(min-width: 1320px) 580px, (min-width: 768px) 45vw, calc(100vw - 32px)"
          className="object-contain" /> : <div className="record-poster h-full"><span className="eyebrow">CMAX Foundation</span><p className="record-poster-title">{country}</p></div>}
        {hero.illustrative && <span className="unified-record-image-note">Illustrative render</span>}
      </div>
      <div className="unified-record-copy">
        <p className="strip text-ink-3">{location}</p>
        <h3 className="title"><Link href={href}>{title}</Link></h3>
        <p className="unified-record-summary">{summary}</p>
        <div className="unified-record-context">{context}</div>
        <div className="unified-record-links">
          <Link href={href} className="u-link">Read more <span aria-hidden="true">&#8599;</span><span className="sr-only">: {title}</span></Link>
          {support && <Link href={support} className="u-link">Support this Mission<span className="sr-only">: {title}</span></Link>}
        </div>
      </div>
    </article>
  );
}

export function ActionFeature({ action }: { action: ActionEntry }) {
  const { slug, entry } = action;
  return <RecordCard title={stripCountry(entry.title, entry.country)}
    location={[...new Set([entry.place, entry.country].filter(Boolean))].join(", ")} country={entry.country}
    summary={entry.summary} hero={entry.hero} href={`/our-actions/${slug}`}
    context={<>
      <p>{formatDate(entry.date, entry.dateLabel)}{ATTRIBUTION[entry.attribution] ? ` · ${ATTRIBUTION[entry.attribution]}` : ""}</p>
      {entry.outcomes.length === 0 && <p>Documentation is being compiled. Confirmed results are not yet published for this record.</p>}
    </>} />;
}
export function ActionRow({ action }: { action: ActionEntry }) {
  return <li><ActionFeature action={action} /></li>;
}
export function CampaignCard({ campaign }: { campaign: CampaignEntry }) {
  const { slug, entry } = campaign;
  return <RecordCard title={entry.title}
    location={[...new Set([entry.place, entry.country].filter(Boolean))].join(", ")} country={entry.country}
    summary={entry.summary} hero={entry.hero} href={`/campaigns/${slug}`}
    support={`/support?ref=campaign:${slug}`}
    context={entry.recipients && <p>Recipient: {entry.recipients}{!entry.recipientConfirmed && " Confirmation pending."}</p>} />;
}

/* ---------- Programs ---------- */

export type ProgramEntry = {
  slug: string;
  entry: {
    title: string;
    tagline: string;
    summary: string;
    maturity: string;
    hero: Figure;
  };
};

export function ProgramPanel({
  program,
  priority,
}: {
  program: ProgramEntry;
  priority?: boolean;
}) {
  const { slug, entry } = program;
  const m = MATURITY[entry.maturity] ?? MATURITY.proposed;
  const src = hasImage(entry.hero) ? imgSrc(entry.hero.image) : null;
  return (
    <article className="program-panel group">
      <Link href={`/our-work/${slug}`} className="block">
        <div className="frame relative aspect-[1.95]">
          {src && (
            <Image
              src={src}
              alt={entry.hero.alt}
              fill
              preload={priority}
              quality={90}
              sizes="(min-width: 1320px) 600px, (min-width: 1024px) calc((100vw - 112px) / 2), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              className="object-contain"
            />
          )}
          {src && entry.hero.illustrative && (
            <span className="absolute left-3 top-3">
              <Tag tone="muted">Illustrative render</Tag>
            </span>
          )}
        </div>
        <div className="program-meta mt-5 flex flex-wrap items-center justify-between gap-3">
          <h3 className="program-title display-md text-[clamp(1.8rem,1.5rem+1.2vw,2.6rem)]">
            {entry.title}
          </h3>
          <span className="program-arrow">
            <ArrowIcon />
          </span>
        </div>
        <p className="program-description mt-4 max-w-[50ch] text-[1.05rem] text-ink-2">
          {entry.tagline}
        </p>
        <div className="mt-4">
          <Tag tone={m.tone}>{m.label}</Tag>
        </div>
      </Link>
    </article>
  );
}

/* ---------- Activities ---------- */

export type ActivityEntry = {
  slug: string;
  entry: {
    title: string;
    date: string | null;
    dateLabel: string;
    type: string;
    venue: string;
    unitedNations: boolean;
    attribution: string;
    participants: readonly string[];
    contribution: string;
    documents: readonly { title: string; url: string | null }[];
  };
};

export function ActivityRow({ activity }: { activity: ActivityEntry }) {
  const { entry } = activity;
  return (
    <li className="grid gap-x-8 gap-y-3 border-t border-warm-2 py-7 md:grid-cols-12">
      <div className="md:col-span-3">
        <p className="display-md text-[1.4rem] leading-none">
          {formatDate(entry.date, entry.dateLabel)}
        </p>
        <p className="strip mt-3 text-ink-3">
          {ACTIVITY_TYPE[entry.type] ?? entry.type}
          {entry.unitedNations ? " · United Nations" : ""}
        </p>
      </div>
      <div className="md:col-span-9">
        <h3 className="title text-[1.3rem]">{entry.title}</h3>
        <Strip
          className="mt-2"
          items={[
            entry.venue,
            entry.participants.join(", "),
            ATTRIBUTION[entry.attribution],
          ]}
        />
        {entry.contribution && (
          <p className="mt-3 max-w-[64ch] text-ink-2">{entry.contribution}</p>
        )}
        {entry.documents.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]">
            {entry.documents.map((d) =>
              d.url ? (
                <li key={d.url}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="u-link"
                  >
                    {d.title}
                  </a>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </div>
    </li>
  );
}
