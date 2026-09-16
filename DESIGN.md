# Design system

<!-- impeccable:design-schema 1 -->

## World

An editorial portrait of a humanitarian foundation. Large archival photography, considered typography and generous space connect human stories to practical preparedness. Numbered section labels organize the homepage, while dated entries, places and status stamps keep the institutional record precise. Photographs never stand in for evidence of undocumented outcomes.

## Color

Strategy: restrained. White ground, charcoal ink, one accent.

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#fffefa` | Page ground |
| `--color-warm` | `#f2f0e9` | Secondary sections and image frames |
| `--color-warm-2` | `#e6e0d6` | Hairline rules |
| `--color-ink` | `#1c1b19` | Text, structure, dark bands, 3px section rules |
| `--color-ink-2` | `#3f3d39` | Body text on white |
| `--color-ink-3` | `#66625b` | Metadata, captions (≥4.5:1 on white) |
| `--color-orange` | `#e87722` | CMAX orange (Pantone 158 C). Primary buttons, stage rail, numerals, link underlines, dots |
| `--color-orange-deep` | `#d66a1b` | Button hover |
| `--color-orange-soft` | `#fbe9dc` | Focus halo on fields |

Orange buttons carry **ink text**. The masthead and deployment video use charcoal; the closing invitation uses CMAX orange. Orange body text needs the darker `#b84e0b` used by the hero emphasis.

## Type

**Archivo** (variable, width axis) is loaded through `next/font`. An occasional **Georgia italic** phrase adds a human editorial voice without another downloaded font. Use it selectively in display headlines, never in controls or long paragraphs.

| Role | Class | Spec |
|---|---|---|
| Display | `.display` | 650, stretch 100%, tracking −0.055em, line-height 1.02 |
| Display medium | `.display-md` | 600, stretch 100%, tracking −0.045em |
| Editorial title | `.editorial-title` | 550, 36–57px fluid, tracking −0.052em, line-height 1.08 |
| Eyebrow | `.eyebrow` | 650, 9–10px, uppercase, tracking 0.14em |
| Title | `.title` | 700, stretch 102%, tracking −0.02em |
| Record strip | `.strip` | 600, stretch 78%, uppercase, tracking 0.08em, 0.78rem |
| Lede | `.lede` | 450, 1.15–1.45rem fluid |
| Body | base | 1.0625rem / 1.55, tabular numerals |

Measure: 66ch (`--measure`). Prose from Markdoc gets `.prose`.

## Structure

- Container 1320px, gutters 16 / 24 / 40px.
- The homepage uses **1px warm rules**, numbered section headings, asymmetric image compositions and open panels. Detail pages retain stronger rules around their factual record.
- Record anatomy: big country or date in display, title, status Tag, Strip of metadata, summary. Detail pages put facts in a sticky left column and narrative on the right.
- Status stamps (`Tag`): 1.5px border, condensed uppercase. Tones: ink (documented / proposed), orange filled (active / ongoing / deployed), muted (pending / archive / illustrative).
- Images sit in `.frame` (warm ground, cover). Every `Figure` prints caption, credit, and an "Illustrative render" stamp when flagged.

## Motion

The hero image settles once on entry. Sections marked `data-reveal` enter with a small 22px translation and opacity change, driven by one IntersectionObserver and the Web Animations API. Content is visible in server HTML and remains readable without JavaScript. The sequence rail draws once in 900ms. Buttons respond to press in 150ms; image and arrow hover effects only run on devices with a fine pointer. Reduced-motion preferences disable decorative movement. Observers and animations are cleaned up on route changes.

The mobile navigation uses a native modal `dialog` for focus containment, Escape dismissal and an inert background. It closes after navigation and when resizing to desktop. The support form focuses the first invalid field and appears before secondary contact details on mobile.

## Images and verification

`npm run images:prepare` builds nine WebP derivatives from `assets/imagenes/`, preserving every original. Concept images remain explicitly labeled. Asset provenance is documented in `public/images/content/stories/README.md`.

Use `npm run lint` and `npm run build`. With the site running, `npm run check:site` checks public pages, internal links, image assets, invalid support payloads and the missing-program response. Visual checks should cover 360–390px phones, 768px tablets and desktop, including navigation, disclosures and contact validation.

## Browser surfaces

Selection is orange with ink text; focus rings are 2px orange offset 3px; scrollbars are ink-3 on warm; `accent-color` is orange; form fields are 1.5px ink borders with an orange focus halo.

## Components

`components/ui.tsx` (Tag, Strip, ButtonLink, ExternalLink, Container, SectionTitle, PageIntro, Rule, EmptyNote), `figure.tsx`, `stage-rail.tsx` (StageRail, StageChips), `video-on-demand.tsx`, `records.tsx` (ActionRow, ActionFeature, CampaignCard, ProgramPanel, ActivityRow), `support-form.tsx`, `site-header.tsx`, `site-footer.tsx`, `icons.tsx` (1.75 stroke, 24 grid).
