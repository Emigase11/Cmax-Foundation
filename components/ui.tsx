import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalIcon } from "./icons";

type Tone = "ink" | "orange" | "muted";

const toneClass: Record<Tone, string> = {
  ink: "border-ink bg-paper text-ink",
  orange: "border-orange bg-orange text-ink",
  muted: "border-ink-3 bg-paper text-ink-3",
};

/** Status stamp used on every record: Documented, Proposed, Active… */
export function Tag({
  tone = "ink",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`strip inline-flex items-center rounded-[3px] border-[1.5px] px-2 py-[3px] whitespace-nowrap ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

/** Condensed metadata line: place · date · attribution. */
export function Strip({
  items,
  className = "",
}: {
  items: (ReactNode | null | undefined | false)[];
  className?: string;
}) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  return (
    <p
      className={`strip flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-3 ${className}`}
    >
      {list.map((item, i) => (
        <span key={i} className="flex items-center gap-3">
          {i > 0 && (
            <span
              aria-hidden
              className="h-[3px] w-[3px] rounded-full bg-orange"
            />
          )}
          {item}
        </span>
      ))}
    </p>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  size?: "md" | "lg";
};

const variantClass = {
  primary: "bg-orange text-ink hover:bg-orange-deep",
  secondary: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-ink u-link px-0 py-0 rounded-none",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  size = "md",
}: ButtonProps) {
  const pad =
    variant === "ghost"
      ? ""
      : size === "lg"
        ? "px-6 py-3.5 text-[1.05rem]"
        : "px-5 py-3";
  return (
    <Link
      href={href}
      className={`button-link inline-flex items-center justify-center gap-3 rounded-[2px] font-semibold tracking-[-0.01em] transition-[background-color,color,transform] duration-150 ease-out ${pad} ${variantClass[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string | null;
  children: ReactNode;
  className?: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`u-link inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
      <ExternalIcon />
    </a>
  );
}

/** Page container with the site gutter. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  as: As = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <As
      className={`display-md text-[clamp(1.9rem,1.4rem+2.2vw,3.1rem)] ${className}`}
    >
      {children}
    </As>
  );
}

/** Page header for records and index pages. */
export function PageIntro({
  title,
  lede,
  strip,
  tags,
}: {
  title: ReactNode;
  lede?: ReactNode;
  strip?: ReactNode;
  tags?: ReactNode;
}) {
  return (
    <header className="page-intro pt-10 pb-8 sm:pt-16 sm:pb-12" data-reveal>
      <h1 className="display text-[clamp(2.4rem,1.6rem+4vw,5.2rem)] max-w-[20ch]">
        {title}
      </h1>
      {(strip || tags) && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {tags}
          {strip}
        </div>
      )}
      {lede && <p className="lede mt-7 max-w-[62ch] text-ink-2">{lede}</p>}
    </header>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <hr className={`border-0 border-t border-warm-2 ${className}`} />;
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[4px] border border-dashed border-ink-3 px-4 py-3 text-[0.95rem] text-ink-3">
      {children}
    </p>
  );
}
