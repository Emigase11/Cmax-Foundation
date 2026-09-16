# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: Next.js 16 (App Router, TypeScript) + Tailwind CSS v4 + Keystatic (git-based content manager, local storage in development, GitHub storage once a repository exists). Chosen because the plan requires a content manager CMAX can use without development, a first version without payments or user accounts, and a stack that deploys to Vercel or any Node host. The current site is WordPress; its hosting was not reviewed in this session (inferred from `wp-content` paths on cmaxfoundation.org).

## Users

- Individual and institutional supporters (donors, companies, foundations, governments, UN agencies) evaluating whether CMAX Foundation is credible and where support would go. Situation: arriving from a referral, a UN listing, or a campaign share, usually on a phone.
- Partners and first-responder institutions (firefighters, civil defense, hospitals) looking for how a mission or campaign works and how to ask for one.
- CMAX Foundation staff publishing actions, campaigns and institutional activities without developer help.

## Product Purpose

Explain how CMAX Foundation helps prepare populations for complex emergencies, following the sequence prepare before → respond during → protect after, and let visitors support a concrete mission through a contact form. Success: a visitor understands what CMAX does, what it has already done (territorial actions, UN work), and how to help, within seconds, and a "Support a Mission" inquiry reaches CMAX with its campaign or program context intact.

## Positioning

A humanitarian organization with a record of action and a practical model of preparedness, built around deployable humanitarian solutions (Cmax Med, AeroCabin™) that link first responders, communities and institutions. Not a charity catalog and not a product store. Special consultative status with UN ECOSOC since 2021 (confirmed in the UN iCSO register, profile 673354).

## Operating Context

- First version in English only. Staged launch: contact to support missions, no online payments, no public campaign creation, no user accounts.
- Content is published through the content manager: programs, actions (case studies), campaigns, institutional activities (meetings, statements, publications), people profiles, site settings.
- Technical documents (Cmax Med CX20 and AeroCabin™ Cmax Air X2 brochures) are reference only; their commercial claims and performance figures do not transfer automatically to the institutional site.

## Capabilities and Constraints

- Navigation: Our Work · Our Actions · Campaigns · About. Primary button: Support a Mission. Discreet but visible access: Our Work at the United Nations (home and footer).
- Public solution names: **Cmax Med** and **AeroCabin™** (no technical variant such as "HD" or "X2 SD" on the site).
- Every page distinguishes proposed capabilities, demonstrations and documented deployments. Illustrative images are labeled. Performance figures need backing before publication. No training programs attributed to CMAX unless confirmed.
- Each action keeps correct attribution to the Foundation, Cmax System (the company) or participants.
- Support form: name, email, reason, message, automatic reference to originating campaign or program.
- Undecided: email delivery provider for form submissions (Resend supported via env var; falls back to local log); production hosting; final Venezuela campaign content and two videos (not retrievable in this review); which team members remain formally active (staff list on the current site is unverified).

## Brand Commitments

- Name: CMAX Foundation. Tagline in use on current materials: "Innovation for Humanity".
- Palette pinned by the brief: white background, deep charcoal type and structure, CMAX orange (Pantone 158 C) as the single accent and CTA color, warm light gray for secondary sections. Documentary photography; no exploitative crisis imagery; no generic charity stock.
- Voice: humanitarian, global, credible, action-oriented, transparent, direct, hopeful. Use: rapid habitat, emergency readiness, dignity, preparedness, first responders, complex emergencies, community resilience. Avoid "shelters" as the main narrative and excessive corporate language.
- Mobile-first. Videos play on demand with title, context and subtitles available.

## Evidence on Hand

- `C:\Users\Emiliano\Downloads\Cmax Foundation WEB - redesign 2026.pdf` — CMAX's own brief (headline "Prepared before disaster strikes.", copy for sections, CTAs).
- `C:\Users\Emiliano\Downloads\Cmax Med CX20.pdf`, `C:\Users\Emiliano\Downloads\AeroCabin™ Cmax Air X2 HD.pdf` — product brochures; page images extracted to `public/images/solutions/` (renders labeled illustrative; warehouse photos are real Cmax System photos).
- Local media: `public/images/actions/cmax-airlift-loading.jpg`, `public/images/solutions/cmax-unit-deployed.png`, `public/images/solutions/cmax-camp-render.jpg`, `public/video/cmax-deployment.mp4` (short deployment clip; context to be confirmed by CMAX).
- Current site cmaxfoundation.org (WordPress): mission/vision/values text, staff list (unverified), news archive (UN Dec 9 2019 talk, ECOSOC status May 2021, Mexico DRR network Jan 2019, LISE Oaxaca July 2018, Pope Francis 2015), 100% Model wording, COVID-19 page (contains lorem ipsum placeholders; no unit counts).
- UN iCSO register profile 673354: "ECOSOC Special since 2021".
- Absent (do not fabricate): unit counts, families served, amounts raised, donor counts, Ukraine delivery details, Haiti/Argentina case documentation, Venezuela campaign content, team confirmations.

## Product Principles

1. Prove before persuading: every claim on the site is backed by a document, a photo or a date, or it is labeled as proposed.
2. The story is a sequence, not a catalog: before, during, after; people and contexts first, solutions as the capacity behind them.
3. One clear action everywhere: Support a Mission, carrying the context it came from.
4. Publishable without a developer: every record type has a template CMAX can fill in.
5. Institutional weight without bureaucracy: the UN work is one click from the home page and reads as contribution, not attendance.

## Accessibility & Inclusion

Keyboard-operable navigation, forms and video controls; visible focus; text contrast ≥ 4.5:1; captions/subtitles available for embedded videos; layouts work at 360 px width.
