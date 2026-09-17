import { config, fields, collection, singleton } from "@keystatic/core";

/**
 * CMAX Foundation content model.
 *
 * Every record type the site publishes is defined here so CMAX can add an
 * action, a campaign, a meeting or a profile from /keystatic without code.
 *
 * Storage: local files in development. Once the project lives in a GitHub
 * repository, set KEYSTATIC_GITHUB_REPO="owner/repo" (plus the Keystatic
 * GitHub app secrets) and the same admin works in production.
 */

const githubRepo = process.env.KEYSTATIC_GITHUB_REPO;

const image = (label: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: "public/images/content",
    publicPath: "/images/content/",
  });

const figure = (label: string) =>
  fields.object(
    {
      image: image("Image"),
      alt: fields.text({
        label: "Alt text",
        description: "What the image shows, for screen readers.",
      }),
      caption: fields.text({ label: "Caption" }),
      credit: fields.text({
        label: "Credit",
        description: "Photographer, partner or 'Cmax System'.",
      }),
      illustrative: fields.checkbox({
        label: "Illustrative render",
        description:
          "Tick when the image is a render, composite or concept rather than a documented photograph. The site labels it.",
        defaultValue: false,
      }),
    },
    { label },
  );

const videoList = (label = "Videos") =>
  fields.array(
    fields.object({
      title: fields.text({ label: "Title" }),
      context: fields.text({
        label: "Context",
        description: "Where and when it was filmed, and what it shows.",
        multiline: true,
      }),
      url: fields.url({
        label: "Video URL",
        description: "YouTube or Vimeo link, or a path under /video/.",
      }),
      captions: fields.text({
        label: "Subtitles file (VTT) path",
        description: "Optional, for local videos. Example: /video/clip.en.vtt",
      }),
    }),
    { label, itemLabel: (p) => p.fields.title.value || "Video" },
  );

const documentList = fields.array(
  fields.object({
    title: fields.text({ label: "Title" }),
    url: fields.url({ label: "Link" }),
  }),
  {
    label: "Documents and links",
    itemLabel: (p) => p.fields.title.value || "Document",
  },
);

const stringList = (label: string, description?: string) =>
  fields.array(fields.text({ label }), {
    label,
    description,
    itemLabel: (p) => p.value || label,
  });

export default config({
  storage: githubRepo
    ? { kind: "github", repo: githubRepo as `${string}/${string}` }
    : { kind: "local" },
  ui: {
    brand: { name: "CMAX Foundation" },
    navigation: {
      Publish: ["actions", "campaigns", "activities", "press"],
      Programs: ["programs"],
      People: ["people"],
      Pages: ["home", "visual", "about", "site"],
    },
  },
  collections: {
    press: collection({
      label: "Press coverage",
      path: "content/press/*",
      slugField: "title",
      format: { data: "yaml" },
      schema: {
        title: fields.slug({ name: { label: "Article headline" } }),
        outlet: fields.text({ label: "Media outlet" }),
        date: fields.date({ label: "Publication date" }),
        url: fields.url({ label: "Direct article URL" }),
        logo: image("Outlet logo"),
        published: fields.checkbox({
          label: "Verified and ready to publish",
          defaultValue: false,
        }),
      },
    }),
    programs: collection({
      label: "Programs (Our Work)",
      path: "content/programs/*",
      slugField: "title",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Public name" } }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
        tagline: fields.text({ label: "One-line tagline" }),
        summary: fields.text({ label: "Summary", multiline: true }),
        stages: fields.multiselect({
          label: "Stages covered",
          options: [
            { label: "Before", value: "before" },
            { label: "During", value: "during" },
            { label: "After", value: "after" },
          ],
          defaultValue: ["before"],
        }),
        maturity: fields.select({
          label: "Maturity of the capability",
          description:
            "Proposed = design or prototype; Demonstrated = built and shown; Deployed = documented field use by the Foundation.",
          options: [
            { label: "Proposed capability", value: "proposed" },
            { label: "Demonstrated", value: "demonstrated" },
            { label: "Deployed and documented", value: "deployed" },
          ],
          defaultValue: "proposed",
        }),
        need: fields.text({ label: "The need", multiline: true }),
        whoBenefits: stringList("Who benefits"),
        capability: fields.text({ label: "What CMAX brings", multiline: true }),
        safetyNote: fields.text({
          label: "Safety or scope note",
          description:
            "Shown near the capability. Example: not a life-saving device.",
          multiline: true,
        }),
        participation: stringList("How to participate"),
        hero: figure("Main image"),
        gallery: fields.array(figure("Image"), {
          label: "Gallery",
          itemLabel: (p) => p.fields.caption.value || "Image",
        }),
        body: fields.markdoc({ label: "Detailed narrative" }),
      },
    }),

    actions: collection({
      label: "Actions (case records)",
      path: "content/actions/*",
      slugField: "title",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        featured: fields.checkbox({
          label: "Featured on home",
          defaultValue: false,
        }),
        country: fields.text({ label: "Country" }),
        mapCountries: fields.multiselect({
          label: "Countries explicitly confirmed for the map",
          description:
            "Leave empty until confirmed. Regions and campaigns are not mapped as actions.",
          options: [
            { label: "Argentina", value: "ARG" },
            { label: "Haiti", value: "HTI" },
            { label: "Mexico", value: "MEX" },
            { label: "Ukraine", value: "UKR" },
            { label: "United States", value: "USA" },
            { label: "Venezuela", value: "VEN" },
          ],
          defaultValue: [],
        }),
        place: fields.text({ label: "Place (city, region)" }),
        date: fields.date({ label: "Date (for ordering)" }),
        dateLabel: fields.text({
          label: "Date as shown",
          description: "Example: January 2019, or 2022 – ongoing.",
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Documented", value: "documented" },
            { label: "Ongoing", value: "ongoing" },
            { label: "Historical (archive)", value: "historical" },
            { label: "Documentation in progress", value: "pending" },
          ],
          defaultValue: "pending",
        }),
        attribution: fields.select({
          label: "Attribution",
          options: [
            { label: "CMAX Foundation", value: "foundation" },
            { label: "CMAX Foundation with partners", value: "partners" },
            { label: "Cmax System (company)", value: "cmax-system" },
          ],
          defaultValue: "foundation",
        }),
        summary: fields.text({
          label: "Summary (one or two sentences)",
          multiline: true,
        }),
        context: fields.text({
          label: "Context of the emergency",
          multiline: true,
        }),
        participation: fields.text({
          label: "What the Foundation and partners did",
          multiline: true,
        }),
        supported: stringList("People or institutions supported"),
        partners: stringList("Partners"),
        solutions: fields.array(
          fields.relationship({ label: "Program", collection: "programs" }),
          { label: "Related programs", itemLabel: (p) => p.value || "Program" },
        ),
        outcomes: stringList(
          "Confirmed results",
          "Only results that CMAX can back with documents or photographs.",
        ),
        hero: figure("Main image"),
        media: fields.array(figure("Image"), {
          label: "Photographs",
          itemLabel: (p) => p.fields.caption.value || "Image",
        }),
        videos: videoList(),
        documents: documentList,
        supportFuture: fields.checkbox({
          label: "Visitors can support future actions here",
          defaultValue: true,
        }),
        body: fields.markdoc({ label: "Full account" }),
      },
    }),

    campaigns: collection({
      label: "Campaigns",
      path: "content/campaigns/*",
      slugField: "title",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        featured: fields.checkbox({
          label: "Featured on home",
          defaultValue: false,
        }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Proposed", value: "proposed" },
            { label: "Under review", value: "review" },
            { label: "Active", value: "active" },
            { label: "Completed", value: "completed" },
            { label: "Content pending", value: "pending" },
          ],
          defaultValue: "proposed",
        }),
        country: fields.text({ label: "Country" }),
        place: fields.text({ label: "Place" }),
        need: fields.text({ label: "The need", multiline: true }),
        recipients: fields.text({
          label: "Who receives the support",
          multiline: true,
        }),
        recipientConfirmed: fields.checkbox({
          label: "Recipient institution confirmed by CMAX",
          defaultValue: false,
        }),
        response: fields.relationship({
          label: "Proposed response (program)",
          collection: "programs",
        }),
        responseNote: fields.text({
          label: "Response in one sentence",
          multiline: true,
        }),
        summary: fields.text({ label: "Summary", multiline: true }),
        hero: figure("Main image"),
        updates: fields.array(
          fields.object({
            date: fields.date({ label: "Date" }),
            text: fields.text({ label: "Update", multiline: true }),
          }),
          {
            label: "Updates",
            itemLabel: (p) => p.fields.date.value || "Update",
          },
        ),
        videos: videoList(),
        documents: documentList,
        body: fields.markdoc({ label: "Full description" }),
      },
    }),

    activities: collection({
      label: "Institutional activities",
      path: "content/activities/*",
      slugField: "title",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        published: fields.checkbox({ label: "Published", defaultValue: true }),
        date: fields.date({ label: "Date" }),
        dateLabel: fields.text({ label: "Date as shown" }),
        type: fields.select({
          label: "Type",
          options: [
            { label: "Meeting", value: "meeting" },
            { label: "Intervention or presentation", value: "presentation" },
            { label: "Statement", value: "statement" },
            { label: "Publication", value: "publication" },
            { label: "Recognition", value: "recognition" },
          ],
          defaultValue: "meeting",
        }),
        unitedNations: fields.checkbox({
          label: "United Nations related",
          defaultValue: false,
        }),
        venue: fields.text({ label: "Venue or forum" }),
        attribution: fields.select({
          label: "Attribution",
          options: [
            { label: "CMAX Foundation", value: "foundation" },
            { label: "Founder (personal capacity)", value: "founder" },
            { label: "Cmax System (company)", value: "cmax-system" },
          ],
          defaultValue: "foundation",
        }),
        participants: stringList("Participants"),
        contribution: fields.text({
          label: "Contribution to the humanitarian mission",
          multiline: true,
        }),
        relatedActions: fields.array(
          fields.relationship({ label: "Action", collection: "actions" }),
          { label: "Related actions", itemLabel: (p) => p.value || "Action" },
        ),
        hero: figure("Image"),
        documents: documentList,
        body: fields.markdoc({ label: "Notes" }),
      },
    }),

    people: collection({
      label: "People",
      path: "content/people/*",
      slugField: "name",
      format: { data: "yaml" },
      schema: {
        name: fields.slug({ name: { label: "Full name" } }),
        role: fields.text({ label: "Role" }),
        group: fields.select({
          label: "Group",
          options: [
            { label: "Founder and leadership", value: "leadership" },
            { label: "Core team", value: "team" },
            { label: "Strategic advisors", value: "advisors" },
            { label: "Volunteers and project network", value: "network" },
          ],
          defaultValue: "team",
        }),
        order: fields.integer({ label: "Order", defaultValue: 10 }),
        verified: fields.checkbox({
          label: "Confirmed as currently active (shown on the site)",
          defaultValue: false,
        }),
        bio: fields.text({ label: "Short bio", multiline: true }),
        photo: image("Photo"),
        linkedin: fields.url({ label: "LinkedIn" }),
      },
    }),
  },

  singletons: {
    visual: singleton({
      label: "Visual home: media and figures",
      path: "content/site/visual",
      format: { data: "yaml" },
      schema: {
        unImage: figure("UN section image (used until a video is supplied)"),
        unVideo: videoList("United Nations video"),
        heroVideos: videoList("Deployment videos"),
        comparisonBefore: figure("Comparison: folded"),
        comparisonAfter: figure("Comparison: opened"),
        approachImages: fields.array(figure("Stage photograph"), {
          label: "Approach photographs, in stage order",
          itemLabel: (p) => p.fields.caption.value || "Photograph",
        }),
        needsImages: fields.array(figure("Need image"), {
          label: "Three needs images, in order",
          itemLabel: (p) => p.fields.caption.value || "Image",
        }),
        displacement: fields.object(
          {
            value: fields.integer({
              label: "Official fallback total",
              validation: { min: 1 },
            }),
            year: fields.integer({ label: "Reference year" }),
            source: fields.url({ label: "Official source URL" }),
            // Global totals require IDMC and UNRWA plus the published overlap adjustment.
            overlapYear: fields.integer({
              label: "Year of verified overlap adjustment",
            }),
            overlap: fields.integer({
              label:
                "People counted in both IDMC and UNRWA (official adjustment)",
              validation: { min: 0 },
            }),
          },
          { label: "UNHCR data and fallback" },
        ),
        fundraising: fields.object(
          {
            published: fields.checkbox({
              label: "Confirmed and ready to publish",
              defaultValue: false,
            }),
            amount: fields.integer({
              label: "Total raised (whole currency units)",
              validation: { min: 0 },
            }),
            currency: fields.select({
              label: "Currency",
              options: [
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
                { label: "ARS", value: "ARS" },
              ],
              defaultValue: "USD",
            }),
            date: fields.date({ label: "Reporting cutoff" }),
            financed: fields.text({
              label: "What this funded",
              multiline: true,
            }),
            source: fields.url({ label: "Public report or source" }),
          },
          { label: "Funds raised" },
        ),
      },
    }),
    site: singleton({
      label: "Site settings",
      path: "content/site/settings",
      format: { data: "yaml" },
      schema: {
        orgName: fields.text({ label: "Organization name" }),
        tagline: fields.text({ label: "Tagline" }),
        email: fields.text({ label: "Contact email" }),
        phone: fields.text({ label: "Phone" }),
        address: fields.text({ label: "Address", multiline: true }),
        ein: fields.text({ label: "EIN" }),
        legalLine: fields.text({ label: "Legal status line" }),
        unStatement: fields.text({
          label: "United Nations statement",
          multiline: true,
        }),
        unRegisterUrl: fields.url({ label: "UN register URL" }),
        guidestarUrl: fields.url({ label: "GuideStar profile URL" }),
        social: fields.object({
          facebook: fields.url({ label: "Facebook" }),
          instagram: fields.url({ label: "Instagram" }),
          linkedin: fields.url({ label: "LinkedIn" }),
          x: fields.url({ label: "X / Twitter" }),
          youtube: fields.url({ label: "YouTube" }),
        }),
      },
    }),
    home: singleton({
      label: "Home page",
      path: "content/site/home",
      format: { data: "yaml" },
      schema: {
        headline: fields.text({ label: "Headline" }),
        description: fields.text({ label: "Description", multiline: true }),
        positioning: fields.text({
          label: "Positioning line",
          multiline: true,
        }),
        hero: figure("Hero image"),
        heroVideo: fields.object(
          {
            src: fields.text({ label: "Video path or URL" }),
            title: fields.text({ label: "Title" }),
            context: fields.text({ label: "Context", multiline: true }),
            captions: fields.text({ label: "Subtitles (VTT) path" }),
          },
          { label: "Hero video (plays on demand)" },
        ),
        sequence: fields.array(
          fields.object({
            stage: fields.select({
              label: "Stage",
              options: [
                { label: "Before", value: "before" },
                { label: "During", value: "during" },
                { label: "After", value: "after" },
              ],
              defaultValue: "before",
            }),
            title: fields.text({ label: "Title" }),
            text: fields.text({ label: "Text", multiline: true }),
          }),
          {
            label: "Sequence (before / during / after)",
            itemLabel: (p) => p.fields.title.value,
          },
        ),
        needs: fields.array(
          fields.object({
            title: fields.text({ label: "Need" }),
            text: fields.text({ label: "Text", multiline: true }),
            program: fields.relationship({
              label: "Program",
              collection: "programs",
            }),
          }),
          { label: "Three needs", itemLabel: (p) => p.fields.title.value },
        ),
        transparency: fields.text({
          label: "Transparency line",
          multiline: true,
        }),
        partnersLine: fields.text({
          label: "Partnership line",
          multiline: true,
        }),
      },
    }),
    about: singleton({
      label: "About page",
      path: "content/site/about",
      format: { data: "yaml" },
      schema: {
        intro: fields.text({ label: "Intro", multiline: true }),
        mission: fields.text({ label: "Mission", multiline: true }),
        vision: fields.text({ label: "Vision", multiline: true }),
        values: fields.array(
          fields.object({
            name: fields.text({ label: "Value" }),
            text: fields.text({ label: "Text", multiline: true }),
          }),
          { label: "Values", itemLabel: (p) => p.fields.name.value },
        ),
        history: fields.array(
          fields.object({
            year: fields.text({ label: "Year" }),
            text: fields.text({ label: "Milestone", multiline: true }),
          }),
          {
            label: "History and milestones",
            itemLabel: (p) => p.fields.year.value,
          },
        ),
        model: fields.text({
          label: "Funding model statement",
          multiline: true,
        }),
        transparency: fields.array(
          fields.object({
            question: fields.text({ label: "Question" }),
            answer: fields.text({ label: "Answer", multiline: true }),
          }),
          {
            label: "Transparency: how it works",
            itemLabel: (p) => p.fields.question.value,
          },
        ),
        teamNote: fields.text({ label: "Team page note", multiline: true }),
      },
    }),
  },
});
