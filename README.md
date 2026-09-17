# CMAX Foundation — website (2026 redesign)

Institutional site for CMAX Foundation, built around one story: **prepare before → respond during → protect after**. First version in English, staged launch: visitors support missions through a contact form (no online payments yet).

- **Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Keystatic (git-based content manager), Markdoc for long text.
- **Design system:** see [DESIGN.md](DESIGN.md). Product truth: [PRODUCT.md](PRODUCT.md).
- **Visual redesign and publishing handoff:** see [REDESIGN.md](REDESIGN.md), including image limits, UNHCR methodology and pending CMAX materials.

## Run it

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Content manager: http://localhost:3000/keystatic

Production build: `npm run build` then `npm start`.

## Site map

| Route | What it is | Content source |
|---|---|---|
| `/` | Home: headline, before/during/after sequence, three needs, solutions, actions, campaigns, UN, transparency | `content/site/home.yaml` + collections |
| `/our-work`, `/our-work/[slug]` | Programs: Cmax Med, AeroCabin™, Community preparedness | `content/programs/*.mdoc` |
| `/our-actions`, `/our-actions/[slug]` | Case records by country (Ukraine, Mexico, Haiti, Argentina, COVID-19) | `content/actions/*.mdoc` |
| `/campaigns`, `/campaigns/[slug]` | Campaigns with need, place, recipients, response, status, updates | `content/campaigns/*.mdoc` |
| `/global-advocacy` | Institutional record (meetings, interventions, statements, publications) | `content/activities/*.mdoc` |
| `/global-advocacy/united-nations` | ECOSOC statement + UN-related activities | same, filtered by `unitedNations` |
| `/about`, `/about/team`, `/about/transparency` | Mission, vision, values, history; verified people; funding model and review process | `content/site/about.yaml`, `content/people/*.yaml` |
| `/support` | Support a Mission form. Accepts `?ref=campaign:slug`, `program:slug`, `action:slug` and `?reason=…` | — |
| `/api/support` | Form endpoint (validation, honeypot, email via Resend, local JSONL log) | — |

Old WordPress paths (`/allstaff`, `/impact`, `/100model`, news posts…) redirect to the new pages; see `next.config.ts`.

## Publishing content (no code needed)

Open `/keystatic`. Every record type has a template:

- **Actions (case records):** country, place, date, status (*Documented / Ongoing / Archive / Documentation in progress*), attribution (Foundation / with partners / Cmax System), context, what was done, who was supported, partners, related programs, **confirmed results**, photographs, videos, documents.
- **Campaigns:** status (*Proposed / Under review / Active / Completed / Content pending*), need, recipients (+ "recipient confirmed" switch), proposed response, updates, videos, documents.
- **Institutional activities:** date, type, venue, participants, contribution to the mission, related actions, documents, "United Nations related" switch.
- **Programs:** maturity label (*Proposed capability / Demonstrated / Deployed and documented*), stages covered, need, who benefits, what CMAX brings, safety note, participation, gallery.
- **People:** shown on the site only when **"Confirmed as currently active"** is ticked. The founder is confirmed; everyone from the previous site is loaded unconfirmed.
- **Pages:** Home, About, Site settings (contact, socials, UN statement, legal line).

Rules built into the templates:

- Every image has an **"Illustrative render"** switch. Tick it for concept renders; the site labels them.
- Results, figures and deliveries appear only where CMAX enters them. Empty fields render as "pending" notes, never as claims.
- Videos never autoplay. Each has a title and context; local videos accept a subtitles (`.vtt`) file.

### Content manager in production

In development Keystatic writes to the local files. For editing on the live site:

1. Push this project to a GitHub repository.
2. Create the Keystatic GitHub app (`npx keystatic` walks through it) and set `KEYSTATIC_GITHUB_REPO`, `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` in the host.
3. Each save becomes a commit; the host redeploys.

## Support form delivery

Set in `.env` (see `.env.example`):

```
RESEND_API_KEY=…
SUPPORT_TO_EMAIL=info@cmaxfoundation.org
SUPPORT_FROM_EMAIL="CMAX Foundation website <web@cmaxfoundation.org>"
```

Without them, inquiries are appended to `data/inquiries/<date>.jsonl` (git-ignored). On serverless hosts the filesystem is read-only, so configure email before launch.

## Media

- `public/images/content/solutions/` — product photographs and renders extracted from Cmax System brochures (renders are flagged illustrative in content).
- `public/images/content/actions/` — action imagery.
- `public/video/cmax-deployment.mp4` — deployment clip (context to be confirmed).
- `public/images/content/brand/cmax-foundation-mark.png` — the Foundation's transparent figures mark, paired with live text in the header and footer.
- `public/images/content/stories/` — nine optimized WebP images from the project's archive. `npm run images:prepare` regenerates them without changing the originals. Concept images retain their illustrative labels.

## Verification

Run `npm run lint` and `npm run build`. With the local server running, `npm run check:site` checks public pages, internal links, image availability, invalid form requests and the missing-program response. It does not create inquiries or send email. Set `CHECK_SITE_URL` to check a different local port.

The design and motion conventions are documented in `DESIGN.md`. Navigation uses a native modal dialog, animations respect reduced motion, and page content remains readable before JavaScript loads.

## Before launch (open items)

1. Confirm Ukraine delivery details, recipients and photographs; publish them on the Ukraine record.
2. Review the Venezuela initiative page and the two videos; complete the campaign.
3. Confirm the Bahía Blanca recipient before the campaign opens.
4. Confirm which team members and advisors are active; tick "confirmed" and add photos.
5. Add photographs to Mexico, LISE and UN records once attribution is confirmed.
6. Review archival photo captions and provide higher-resolution originals when available.
7. Configure email delivery for the form and test receipt.
8. Decide hosting (Vercel or Node host) and set `NEXT_PUBLIC_SITE_URL`.

## Later stage (not in this version)

Online donations, public campaign creation, donor visibility options, delivery tracking and recipient review workflow.
