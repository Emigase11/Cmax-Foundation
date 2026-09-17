"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ArrowIcon, CloseIcon, MenuIcon } from "./icons";
import { ButtonLink, Container } from "./ui";

const NAV = [
  { href: "/our-work", label: "Our Work" },
  { href: "/our-actions", label: "Our Actions" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/about", label: "About us" },
];

/**
 * CMAX Foundation lockup: the official figures mark plus the name.
 *
 * The mark comes from the Foundation's own brand file (504x451, transparent),
 * so it stays sharp at any header size. The full lockup with the wordmark baked
 * in only exists at 85px on the current site, which is too small to render
 * crisply here; `cmax-foundation-lockup.png` is kept alongside for when a
 * vector or high-resolution original arrives.
 */
export function Wordmark({
  className = "",
  height = 40,
}: {
  className?: string;
  height?: number;
}) {
  const width = Math.round((height * 504) / 451);
  return (
    <Link
      href="/"
      className={`wordmark ${className}`}
      aria-label="CMAX Foundation, home"
    >
      <Image
        src="/images/content/brand/cmax-foundation-mark.png"
        alt=""
        width={width}
        height={height}
        sizes={`${width}px`}
        priority
        style={{ width, height: "auto" }}
      />
      <span className="wordmark-name">
        <span className="wordmark-cmax">cmax</span>
        <span className="wordmark-foundation">Foundation</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);
  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (breakpoint.matches) dialog.current?.close();
    };
    breakpoint.addEventListener("change", closeOnDesktop);
    return () => breakpoint.removeEventListener("change", closeOnDesktop);
  }, []);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="site-header">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Container className="header-inner">
          <Wordmark height={34} />
          <nav aria-label="Main" className="desktop-nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <ButtonLink href="/support" className="header-support">
              <span className="hidden sm:inline">Support a Mission</span>
              <span className="sm:hidden">Support</span>
              <ArrowIcon width={17} height={17} />
            </ButtonLink>
            <button
              ref={trigger}
              type="button"
              aria-label="Open navigation menu"
              aria-haspopup="dialog"
              aria-controls="mobile-menu"
              className="menu-trigger"
              onClick={(event) => {
                const menu = dialog.current;
                if (!menu) return;
                menu.dataset.instant = String(event.detail === 0);
                menu.showModal();
              }}
            >
              <MenuIcon />
            </button>
          </div>
        </Container>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="Navigation"
        onClose={() => trigger.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="mobile-menu-inner">
          <div className="flex items-center justify-between gap-4">
            <Wordmark height={30} />
            <button
              type="button"
              className="menu-trigger"
              aria-label="Close navigation menu"
              onClick={() => dialog.current?.close()}
            >
              <CloseIcon />
            </button>
          </div>
          <p className="eyebrow mt-12">Explore the foundation</p>
          <nav
            aria-label="Main, mobile"
            className="mobile-nav"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a"))
                dialog.current?.close();
            }}
          >
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <span className="eyebrow">0{index + 1}</span>
                {item.label}
                <ArrowIcon />
              </Link>
            ))}
            <Link
              href="/global-advocacy/united-nations"
              className="mobile-un-link"
            >
              Our work at the United Nations <ArrowIcon />
            </Link>
            <ButtonLink href="/support">
              Support a Mission <ArrowIcon />
            </ButtonLink>
          </nav>
          <p className="mt-auto pt-12 text-sm text-ink-3">
            Before. During. After. Always with people.
          </p>
        </div>
      </dialog>
    </>
  );
}
