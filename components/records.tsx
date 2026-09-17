import Image from "next/image";
import Link from "next/link";
import {
  ACTION_STATUS,
  ACTIVITY_TYPE,
  ATTRIBUTION,
  CAMPAIGN_STATUS,
  MATURITY,
  formatDate,
  hasImage,
  imgSrc,
  stripCountry,
  type Figure,
} from "@/lib/content";
import { Strip, Tag } from "./ui";
import { ArrowIcon } from "./icons";

/* ---------- Actions ---------- */

export type ActionEntry = {
  slug: string;
  entry: {
    title: string;
    country: string;
    place: string;
    date: string | null;
    dateLabel: string;
    status: string;
    attribution: string;
    summary: string;
    hero: Figure;
  };
};

export function ActionRow({ action }: { action: ActionEntry }) {
  const { slug, entry } = action;
  const status = ACTION_STATUS[entry.status] ?? ACTION_STATUS.pending;
  return (
    <li className="group border-t border-warm-2">
      <Link
        href={`/our-actions/${slug}`}
        className="grid gap-x-8 gap-y-3 py-6 md:grid-cols-12 md:items-baseline"
      >
        <p className="display-md text-[1.5rem] leading-none md:col-span-2">
          {entry.country}
        </p>
        <div className="md:col-span-7">
          <h3 className="title text-[1.25rem] transition-colors group-hover:text-orange-deep">
            {stripCountry(entry.title, entry.country)}
          </h3>
          <p className="mt-2 max-w-[62ch] text-[0.98rem] text-ink-2">
            {entry.summary}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:col-span-3 md:justify-end">
          <span className="strip text-ink-3">
            {formatDate(entry.date, entry.dateLabel)}
          </span>
          <Tag tone={status.tone}>{status.label}</Tag>
        </div>
      </Link>
    </li>
  );
}

export function ActionFeature({ action }: { action: ActionEntry }) {
  const { slug, entry } = action;
  const status = ACTION_STATUS[entry.status] ?? ACTION_STATUS.pending;
  const src = hasImage(entry.hero) ? imgSrc(entry.hero.image) : null;
  return (
    <Link
      href={`/our-actions/${slug}`}
      className="group grid gap-8 border-t-[3px] border-ink pt-6 lg:grid-cols-12"
    >
      <div className="lg:col-span-7">
        <p className="display text-[clamp(2.6rem,2rem+3vw,4.5rem)] leading-none">
          {entry.country}
        </p>
        <h3 className="title mt-5 max-w-[24ch] text-[clamp(1.4rem,1.2rem+1vw,2rem)] transition-colors group-hover:text-orange-deep">
          {stripCountry(entry.title, entry.country)}
        </h3>
        <p className="mt-4 max-w-[58ch] text-ink-2">{entry.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Tag tone={status.tone}>{status.label}</Tag>
          <Strip
            items={[
              formatDate(entry.date, entry.dateLabel),
              ATTRIBUTION[entry.attribution],
            ]}
          />
        </div>
        <span className="u-link mt-6 inline-block font-medium">
          Read the record
        </span>
      </div>
      <div className="lg:col-span-5">
        {src ? (
          <div className="frame relative aspect-[1.95]">
            <Image
              src={src}
              alt={entry.hero.alt}
              fill
              quality={90}
              sizes="(min-width: 1320px) 490px, (min-width: 1024px) calc((100vw - 128px) * .417), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="record-poster aspect-[4/3]">
            <span className="eyebrow">CMAX Foundation / Field record</span>
            <p className="record-poster-title">{entry.country}</p>
            <span className="eyebrow">{status.label}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

/* ---------- Campaigns ---------- */

export type CampaignEntry = {
  slug: string;
  entry: {
    title: string;
    status: string;
    country: string;
    place: string;
    summary: string;
    recipients: string;
    recipientConfirmed: boolean;
    hero: Figure;
  };
};

export function CampaignCard({ campaign }: { campaign: CampaignEntry }) {
  const { slug, entry } = campaign;
  const status = CAMPAIGN_STATUS[entry.status] ?? CAMPAIGN_STATUS.proposed;
  const src = hasImage(entry.hero) ? imgSrc(entry.hero.image) : null;
  return (
    <article className="campaign-card flex flex-col border-t-[3px] border-ink pt-5">
      <div className="frame relative aspect-[1.95]">
        {src ? (
          <Image
            src={src}
            alt={entry.hero.alt}
            fill
            quality={90}
            sizes="(min-width: 1320px) 600px, (min-width: 768px) calc((100vw - 112px) / 2), (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
            className="object-contain"
          />
        ) : (
          <div className="record-poster h-full">
            <span className="eyebrow">CMAX Foundation / Initiative</span>
            <p className="record-poster-title">{entry.country}</p>
            <span className="eyebrow">{status.label}</span>
          </div>
        )}
        {src && entry.hero.illustrative && (
          <span className="absolute left-3 top-3">
            <Tag tone="muted">Illustrative render</Tag>
          </span>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Tag tone={status.tone}>{status.label}</Tag>
        <Strip
          items={[[entry.place, entry.country].filter(Boolean).join(", ")]}
        />
      </div>
      <h3 className="title mt-4 text-[1.5rem]">
        <Link href={`/campaigns/${slug}`} className="hover:text-orange-deep">
          {entry.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-[56ch] text-ink-2">{entry.summary}</p>
      {entry.recipients && (
        <p className="mt-3 text-[0.95rem] text-ink-3">
          Recipient: {entry.recipients}
          {!entry.recipientConfirmed && " Confirmation pending."}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={`/support?ref=campaign:${slug}`}
          className="inline-flex items-center justify-center rounded-[4px] bg-orange px-5 py-3 font-semibold text-ink transition-colors hover:bg-orange-deep"
        >
          Support this Mission
        </Link>
        <Link
          href={`/campaigns/${slug}`}
          className="u-link self-center font-medium"
        >
          Details
        </Link>
      </div>
    </article>
  );
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
