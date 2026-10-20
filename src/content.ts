// All copy, links and data for the site live here.
// Edit words in this file; components only handle layout.

export type Img = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** A heading split around the part that gets the lilac highlight block. */
export type Highlighted = { before: string; highlight: string; after: string };

export const site = {
  name: "Tuleen Rowaihy",
  url: "https://tuleenhr.github.io",
  // Browser tab and og:title: just the name. The headline lives in the description (link previews, search results).
  title: "Tuleen Rowaihy",
  description:
    "From “what if” to “it’s live.” I'm Tuleen, a software engineer and founder studying Computer Science with Management at King's College London, on exchange at UC\u00a0San\u00a0Diego.",
  email: "tuleenhr@gmail.com",
  resume: "/docs/resume.pdf",
  resumes: [
    { label: "UK CV (A4)", href: "/docs/cv-uk.pdf" },
    { label: "US résumé (Letter)", href: "/docs/resume.pdf" },
  ],
  /** Public repo for this site. Leave empty and the footer shows no source link. */
  sourceUrl: "",
  copyright: "© 2026 Tuleen Rowaihy",
  ogAlt:
    "Tuleen Rowaihy: From “what if” to “it’s live.”",
};

export const notFound = {
  title: "Page not found · Tuleen Rowaihy",
  eyebrow: "404",
  heading: { before: "This page is ", highlight: "still a what if", after: "." },
  body: "There's nothing at this address. The work is all on the home page.",
  cta: "Back to the home page",
};

export const nav = {
  links: [
    { label: "Startup", id: "startup" },
    { label: "Projects", id: "projects" },
    { label: "About", id: "about" },
    { label: "Journey", id: "journey" },
  ],
  cta: { label: "Let's talk", href: `mailto:${site.email}` },
};

export const images = {
  heroFigure: {
    src: "/kbt/kbt-fit-hero.jpg",
    alt: "KBT's 3D fit figure with each body area labelled: shoulders Fitted, chest Good fit, waist Relaxed, thigh Good fit.",
    width: 591,
    height: 560,
  },
  kbtCatalogue: {
    src: "/kbt/kbt-catalogue.jpg",
    alt: "KBT catalogue on a phone: “Find your size before you buy.” above a grid of Hajruss Summer 2026 shirts, each with a “Find my size” button.",
    width: 600,
    height: 1298,
  },
  kbtSizeResult: {
    src: "/kbt/kbt-size-result.jpg",
    alt: "KBT size result for a long sleeve black shirt: “Size M”, a note that size L also fits for a roomier feel, and chest rated Good, bicep More fitted.",
    width: 600,
    height: 1298,
  },
  kbtOutsideRange: {
    src: "/kbt/kbt-outside-range.jpg",
    alt: "KBT result when a shopper is outside the size range: “Closest fit S” and “This style runs large on you”, explaining their measurements are below the brand's sizing for this shirt so S is the closest and will fit loose, with a “Get size S on Hajruss” button.",
    width: 600,
    height: 1302,
  },
  kbtFitDetails: {
    src: "/kbt/kbt-fit-details.jpg",
    alt: "KBT fit details screen: tabs for the recommended size M and alternate size L above the 3D figure, with chest and bicep fit labels.",
    width: 600,
    height: 1298,
  },
  kbtBackToBrand: {
    src: "/kbt/kbt-back-to-brand.jpg",
    alt: "KBT “Return to Hajruss” screen: the black shirt with the recommended size M, “Also consider size L”, and a “Buy on Hajruss” button.",
    width: 600,
    height: 1334,
  },
  fiddlieStepImport: {
    src: "/fiddlie/fiddlie-step-import.jpg",
    alt: "Fiddlie proposal import: the proposal text on the left and the extracted workstreams, milestones and agreed deliverables on the right, ready to review.",
    width: 1400,
    height: 787,
  },
  fiddlieStepTimeline: {
    src: "/fiddlie/fiddlie-step-timeline.jpg",
    alt: "Fiddlie workstream editor: a phase timeline with “service agreement signed” complete, “UX designs approved” in progress, and two parallel upcoming milestones.",
    width: 1400,
    height: 787,
  },
  fiddlieStepShare: {
    src: "/fiddlie/fiddlie-step-share.jpg",
    alt: "Fiddlie “share with client” dialog with three choices: post an update, share files, or request feedback.",
    width: 1400,
    height: 787,
  },
  fiddlieStepFeedback: {
    src: "/fiddlie/fiddlie-step-feedback.jpg",
    alt: "Fiddlie feedback tab on a milestone: a direction waiting for client feedback, the attached file version, and a box for the team's response.",
    width: 1400,
    height: 787,
  },
  fiddlieStepHandover: {
    src: "/fiddlie/fiddlie-step-handover.jpg",
    alt: "Fiddlie deliverables tab: “handover complete” with a full progress bar, above a handover checklist of delivered and optional items.",
    width: 1400,
    height: 787,
  },
  fiddlieProgress: {
    src: "/fiddlie/fiddlie-progress.jpg",
    alt: "Fiddlie client view: a project's stage timeline with the Design review milestone open, showing the latest update, feedback, linked files and deliverables",
    width: 1100,
    height: 639,
  },
  fiddlieAllProjects: {
    src: "/fiddlie/fiddlie-all-projects.jpg",
    alt: "Fiddlie studio view listing all client projects",
    width: 1100,
    height: 688,
  },
  // Top 45% of fiddlie-client-dashboard.jpg (header through the "ready for your feedback" card),
  // pre-cropped so the browser never downloads the full-length screenshot.
  fiddlieClientDashboardTop: {
    src: "/fiddlie/fiddlie-client-dashboard-top.jpg",
    alt: "Fiddlie client dashboard for the Modular Coffee Station project, with an assembly guide ready for client feedback",
    width: 1100,
    height: 812,
  },
  // Optional: renders only if public/me.jpg exists.
  me: {
    src: "/me.jpg",
    alt: "Portrait of Tuleen Rowaihy.",
    width: 900,
    height: 1100,
  },
} satisfies Record<string, Img>;

/** A screenshot shown in a browser-window frame with a small label pill above it. */
export type BrowserShot = {
  label: string;
  image: Img;
  /** Show only the top part of the image (0–1 of its height). */
  cropTop?: number;
};

/** Home Fiddlie card (a desktop web app): studio view behind, client view in front. */
export const fiddlieWindows: { studio: BrowserShot; client: BrowserShot } = {
  studio: { label: "Studio view", image: images.fiddlieAllProjects },
  // Shown whole: cropping this wider screenshot to the old window shape cut off its headings.
  client: { label: "Client view", image: images.fiddlieProgress },
};

export const kbtVideo = {
  src: "/kbt/kbt-flow.mp4",
  poster: "/kbt/kbt-flow-poster.jpg",
  label:
    "KBT demo: scan intro, scan complete, size recommendation, 3D fit details, then the brand's store",
};

export const liveKbtUrl = "https://fit.kbtcloset.com/hajruss";

export const hero = {
  status: "Looking for a summer 2027 internship",
  headline: {
    before: "From “what if” to “",
    highlight: "it’s live",
    after: ".”",
  } satisfies Highlighted,
  sub: "I'm Tuleen, a software engineer and founder studying Computer Science with Management at King's College London, on exchange at UC\u00a0San\u00a0Diego.",
  primary: { label: "See my work", href: "#startup" },
  secondary: { label: "Résumé", href: site.resume },
  note: "this is what my startup does ↘",
};

/**
 * Hero fit figure: S / M / L toggle with per-area fit (demo values, not a real scan).
 * Positions are in the figure image's own pixels (591 × 560).
 */
export const fitFigure = {
  image: {
    src: "/kbt/kbt-figure-clean.jpg",
    alt: "KBT's 3D reference figure",
    width: 591,
    height: 560,
  },
  groupLabel: "Garment size",
  sizes: ["S", "M", "L"] as const,
  defaultSize: "M" as const,
  caption: "Demo values · try it live for your real size",
  areas: [
    { id: "shoulders", label: "Shoulders", side: "left", card: [12, 139], dot: [250, 164] },
    { id: "chest", label: "Chest", side: "right", card: [452, 154], dot: [290, 179] },
    { id: "waist", label: "Waist", side: "left", card: [12, 242], dot: [290, 267] },
    { id: "thigh", label: "Thigh", side: "right", card: [452, 310], dot: [283, 336] },
  ] as const,
  /** Fit per area for each size. */
  fits: {
    S: { shoulders: "fitted", chest: "fitted", waist: "good", thigh: "fitted" },
    M: { shoulders: "fitted", chest: "good", waist: "relaxed", thigh: "good" },
    L: { shoulders: "good", chest: "relaxed", waist: "relaxed", thigh: "relaxed" },
  } as const,
  fitLabels: { good: "Good fit", fitted: "Fitted", relaxed: "Relaxed" },
};

/** "Now" line under the hero sub-line. Items are joined with " · ". */
export const now = {
  label: "Now",
  items: [
    "getting KBT ready for brand #2",
    "data science at UCSD",
    // TODO(Tuleen): baking item to come ([BAKE]); add it here when it's sent.
  ],
};

export const startup = {
  eyebrow: "01 · STARTUP",
  heading: "KBT",
  tagline: "Find your size before you buy.",
  body: "Brands add a “Check My Fit” button, you scan once with your phone, and you get your size for that exact piece. I co-founded it and lead product and engineering.",
  role: "Co-founder & CTO · Mar 2026 – now",
  live: { label: "Try it live", href: liveKbtUrl },
  story: { label: "Read the full story", href: "/kbt" },
  note: "live with our first brand partner",
  qr: { url: liveKbtUrl, caption: "Scan to try it on your phone" },
};

export const projectCodeLabel = "Code";

/** Respawn card: log habits for XP and watch the level bar fill (state is in memory only). */
export const respawnDemo = {
  habits: ["Study", "Movement", "Language", "Books", "Fun"],
  baseXp: 10,
  /** Logging the same habit again in a row: 10 → 8 → 5 → 3 XP. Switching habit resets to 10. */
  repeatMultipliers: [1, 0.75, 0.5, 0.25],
  xpPerLevel: 50,
  rareDropChance: 0.1,
  rareDrop: "✨ Rare drop! +1 credit",
  diminishing: "Diminishing returns: try another habit.",
  levelUp: "Level up!",
  barLabel: "Respawn level progress",
  groupLabel: "Log a habit",
  caption: "Demo: the real app has nine categories",
};

/** Sidekick card: an example of the morning brief. */
export const sidekickDemo = {
  open: "See a sample brief",
  close: "Back to the card",
  skip: "Show all",
  label: "Sample brief (not real data)",
  text: "Morning. Two things matter today: send the COGS 108 draft before 5pm, and reply to the landlord about the move-out date. You're free 2–4pm, so that's your writing block. First step: open the draft and fix the intro.",
};

export type Project = {
  title: string;
  description: string;
  stack: string[];
  label: string;
  /** Public code link. Leave null and the card shows no link. */
  href: string | null;
  /** Small interactive touch on the card. */
  demo?: "respawn" | "sidekick";
};

// Shared by the featured project card and the Fiddlie case study.
// The portal launches to clients in early 2027, so nothing here should say clients already use it.
const fiddlieOutcome = "It's Fiddlie's first client portal, and it goes out to all their clients in early 2027.";

export const projects = {
  eyebrow: "02 · PROJECTS",
  heading: "Things I've built",
  note: "some with a team, some just for me",
  featured: {
    label: "Software Engineering Intern · Summer 2026",
    title: "Fiddlie client portal",
    description:
      "Fiddlie is a product studio, and their client work was spread across email, shared drives and PDFs. I spent my summer building them one portal for all of it, from the first proposal to the final handover.",
    windows: fiddlieWindows,
    pills: ["6 weeks", "Sole developer"],
    outcomeLabel: "Outcome",
    outcome: fiddlieOutcome,
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Postgres", "Vercel"],
    cta: { label: "Read the case study", href: "/fiddlie" },
  },
  grid: [
    {
      title: "Respawn",
      description:
        "My paper sticker journal, turned into a game. Log habits across nine areas of life for XP, beat a daily boss made from whatever I've been neglecting, and let AI turn a goal into a quest line.",
      stack: ["Next.js", "Prisma", "PostgreSQL", "Groq", "PWA"],
      label: "Personal project",
      href: "https://github.com/tuleenhr/respawn",
      demo: "respawn",
    },
    {
      title: "Sidekick",
      description:
        "An AI chief of staff I built for myself. Every morning it turns my inbox, calendar and deadlines into one paragraph and up to three priorities. Tell it “block two hours tomorrow morning” and it's in my calendar.",
      stack: ["Next.js", "Supabase", "Llama 3.3 (Groq)", "Gmail API", "iCloud CalDAV"],
      label: "Personal project",
      href: "https://github.com/tuleenhr/sidekick",
      demo: "sidekick",
    },
    {
      title: "Live classroom polling",
      description:
        "Teachers run live sessions and students join with a room code or QR. My parts: the live stats, the points and leaderboard system, and ordering questions.",
      stack: ["React", "Django Channels", "PostgreSQL"],
      label: "Team project · 2026",
      href: null,
    },
    {
      title: "Recipe discovery",
      description:
        "A recipe platform where I built the search, filters, favourites and the featured-recipes carousel.",
      stack: ["Python", "Django"],
      label: "Team project · 2025",
      href: null,
    },
    {
      title: "London air-pollution explorer",
      description:
        "Air pollution across 30+ London boroughs, shown as heat maps and charts over time.",
      stack: ["Java", "JavaFX"],
      label: "2025",
      href: null,
    },
  ] satisfies Project[],
};

export const about = {
  eyebrow: "03 · ABOUT",
  heading: "Hi, I'm Tuleen.",
  body: "My favourite part of building is the bit before the code: working out what someone actually needs. Most of what I build starts as a small annoyance in my own life. When I'm not building, I'm usually baking, planning my next trip, or halfway through a film.",
  note: "home is a bit of everywhere",
  /** Sticker sheet in the About section (draggable on desktop, a static row on mobile). */
  stickers: [
    { id: "plane", label: "Plane sticker (I love travelling)" },
    { id: "star", label: "Gold star sticker (from my sticker journal)" },
    { id: "helloArabic", label: "Speech bubble saying hello in Arabic" },
    { id: "bus", label: "London bus sticker" },
    { id: "palm", label: "Palm tree sticker (Riyadh and San Diego)" },
    { id: "pan", label: "Frying pan sticker (I love cooking)" },
    { id: "clapper", label: "Film clapper sticker (I love films)" },
    { id: "helloMandarin", label: "Speech bubble saying hello in Mandarin" },
  ] as const,
  stickerHint: "Drag, or use the arrow keys, to move it.",
  route: {
    label: "San Diego, London and Riyadh, with current local times",
    current: "now",
    // West to east.
    cities: [
      { name: "San Diego", timeZone: "America/Los_Angeles", current: true },
      { name: "London", timeZone: "Europe/London" },
      { name: "Riyadh", timeZone: "Asia/Riyadh" },
    ],
  },
  details: "London & San Diego · English and Arabic · learning Mandarin and French",
};

export const journey = {
  eyebrow: "04 · JOURNEY",
  heading: "My journey",
  note: "still building…",
  rows: [
    {
      dates: "2026 – now",
      title: "Co-founder & CTO",
      place: "KBT",
    },
    {
      dates: "2026 – 2027",
      title: "Exchange year",
      place: "UC San Diego",
    },
    {
      dates: "Jul – Aug 2026",
      title: "Software Engineering Intern",
      place: "Fiddlie, London",
    },
    {
      dates: "2024 – 2028",
      title: "BSc Computer Science with Management",
      place: "King's College London",
    },
    {
      dates: "2023 – now",
      title: "Computer Science Student Representative",
      place: "King's College London",
    },
    {
      dates: "2023 – 2024",
      title: "International Foundation Programme",
      place: "King's College London",
    },
    {
      dates: "Aug 2023",
      title: "Consulting Intern",
      place: "Pure Group Consulting, Riyadh",
    },
  ],
};

export const contact = {
  eyebrow: "05 · CONTACT",
  heading: "Let's build something together.",
  body: "Looking for a summer 2027 software engineering internship, or just up for a chat about fit tech and startups.",
  links: [
    { icon: "mail", label: "Email", value: "tuleenhr@gmail.com", href: "mailto:tuleenhr@gmail.com" },
    {
      icon: "linkedin",
      label: "LinkedIn",
      value: "linkedin.com/in/tuleen-rowaihy",
      href: "https://www.linkedin.com/in/tuleen-rowaihy",
    },
    { icon: "github", label: "GitHub", value: "github.com/tuleenhr", href: "https://github.com/tuleenhr" },
  ] as const,
  copyEmail: { label: "Copy email", done: "Copied ✓" },
};

export const footer = {
  copyright: site.copyright,
  resumeLabel: "Résumé (PDF)",
  backToTop: "Back to top",
  builtWith: "Built with Next.js",
  lastUpdated: "Last updated",
  viewSource: "View the source",
};

/* ---------- Case studies ---------- */

export type CaseBlock = {
  title: string;
  /** What the shopper, team or client sees (plain body text, no label). */
  lead: string;
  /** The engineering underneath. */
  built: string;
  /** Leave out for a step whose screenshot isn't ready yet: the device shows an empty screen. */
  image?: Img;
  /** Portrait screenshot in the browser frame: letterbox it instead of cropping. */
  contain?: boolean;
  /** Small interactive demo under the step text (the "pins" demo becomes the screen if the step has no image). */
  demo?: "reorder" | "pins";
};

export type CaseStudy = {
  backHref: string;
  eyebrow: string;
  heading: Highlighted;
  intro: string;
  pills: string[];
  facts: { title: string; text: string }[];
  /** Device used by the "How it works" demo. */
  device: "phone" | "browser";
  blocks: CaseBlock[];
  stack: string;
  /** Optional muted line under the stack bar. */
  stackNote?: string;
  challenges: { title: string; text: string }[];
  /** Small mono chips under "How it works". */
  alsoBuilt?: string[];
  next: { label: string; href: string };
};

/** /fiddlie demos (sample content only, state in memory). */
export const fiddlieDemos = {
  reorder: {
    eyebrow: "PRODUCT DESIGN · WORKSTREAM",
    caption: "Try it: drag a milestone to reorder",
    undo: "Undo",
    milestones: ["Concept sketches", "Design review", "Final CAD"],
    /** Statuses belong to the slot, not the milestone: slot 1 is complete, 2 in progress, 3 upcoming. */
    statuses: ["Complete", "In progress", "Upcoming"],
    listLabel: "Product design milestones",
    hint: "Drag, or use the arrow keys, to move this milestone.",
    moved: (name: string, pos: number, total: number) => `${name} moved to stage ${pos} of ${total}.`,
  },
  pins: {
    caption: "Try it: click to leave feedback",
    reset: "Reset",
    comments: ["Can we try this in blue?", "Love this corner radius", "Logo feels a bit small"],
    surfaceLabel: (n: number, max: number) =>
      n < max ? `Sample design. Click, or press Enter, to pin comment ${n + 1} of ${max}.` : "Sample design. All three comments pinned.",
    designLabel: "Sample packaging artwork (demo only)",
  },
};

export const caseStudyLabels = {
  back: "← All work",
  howItWorks: "How it works",
  whatIBuilt: "What I built",
  alsoBuilt: "Also built",
  prevStep: "Previous step",
  nextStep: "Next step",
  underTheHood: "Under the hood",
  challenges: "Key challenges",
  outcome: "Outcome",
  whatsNext: "What's next",
  notLive: "Not live yet",
  next: "Next case study",
};

export const fiddlieCase: CaseStudy & {
  heroImage: Img;
  outcome: { text: string; small: string };
} = {
  backHref: "/#projects",
  eyebrow: "CASE STUDY · SOFTWARE ENGINEERING INTERN · SUMMER 2026",
  heading: {
    before: "A client portal that turns a proposal into a ",
    highlight: "live project",
    after: ".",
  },
  intro:
    "A client portal for Fiddlie, a product and innovation studio, from the first proposal to the final handover. I was the only developer.",
  pills: ["6 weeks", "Sole developer", "Next.js", "Supabase", "Postgres", "Vercel"],
  heroImage: images.fiddlieClientDashboardTop,
  facts: [
    {
      title: "The problem",
      text: "Client work was scattered across email, shared drives and PDFs.",
    },
    {
      title: "What I built",
      text: "One app, two sides: the studio runs projects, and clients see progress and give feedback.",
    },
    {
      title: "My role",
      text: "The only developer, from database design to deployment, working directly with the founder.",
    },
  ],
  device: "browser",
  blocks: [
    {
      title: "Paste a proposal, get a plan.",
      lead: "Upload the PDF and the portal pulls out workstreams, milestones and deliverables to review.",
      built: "Every agreed deliverable becomes a suggested handover item.",
      image: images.fiddlieStepImport,
    },
    {
      title: "Plan in lanes.",
      lead: "Drag milestones across a stage timeline to reorder or regroup them.",
      built: "Keyboard moves, undo, autosave, and no gaps allowed.",
      image: images.fiddlieStepTimeline,
      demo: "reorder",
    },
    {
      title: "Share it with the client.",
      lead: "Clients get a calm dashboard: current work, updates, files and feedback requests.",
      built: "The team chooses what's shared, and clients only ever see their own company.",
      image: images.fiddlieStepShare,
    },
    {
      title: "Feedback in rounds.",
      lead: "Clients pin comments on images and PDFs and pick between concepts. Round 2 builds on round 1.",
      built: "Comments are tied to an exact file version, so they never land on the wrong draft.",
      image: images.fiddlieStepFeedback,
      demo: "pins",
    },
    {
      title: "One-click handover.",
      lead: "Every file is versioned. Mark a deliverable ready and hand it over in one click.",
      built: "Each deliverable locks to the version that was agreed.",
      image: images.fiddlieStepHandover,
    },
  ],
  alsoBuilt: [
    "Invite-only accounts",
    "Team roles & deactivation",
    "Project versions (V1, V2)",
    "Status & archive",
    "Activity feed from database triggers",
    "Daily email digest (gated)",
    "No-login demo mode",
    "Dark mode",
    "Shared design tokens",
  ],
  stack:
    "Next.js 16 · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, Storage, Realtime) · PDF.js · Vitest · GitHub Actions · Vercel",
  challenges: [
    {
      title: "Clients must never see each other's work.",
      text: "Access rules live in Postgres, not the UI, so even a front-end bug can't leak data.",
    },
    {
      title: "Dragging without breaking the timeline.",
      text: "Every move is checked so stages stay in order, with undo and autosave so nothing gets lost halfway.",
    },
    {
      title: "Big design files, serverless host.",
      text: "Files go straight from the browser to storage, skipping server size limits, with versions tracked in the database.",
    },
  ],
  next: { label: "KBT", href: "/kbt" },
  outcome: {
    text: fiddlieOutcome,
    small: "I demoed the finished portal to the whole team, with the technical design and the business case behind it.",
  },
};

export const kbtCase: CaseStudy & {
  whatsNext: string;
  live: { label: string; href: string };
} = {
  backHref: "/#startup",
  eyebrow: "CASE STUDY · CO-FOUNDER & CTO · 2026 – NOW",
  heading: { before: "Find ", highlight: "your size", after: " before you buy." },
  intro:
    "KBT gives fashion brands a “Check My Fit” button. Scan once with your phone and get your size, area by area, for every piece. It's live with our first brand partner, Hajruss.",
  pills: ["Co-founder & CTO", "Live pilot", "Next.js", "Postgres", "AWS"],
  facts: [
    {
      title: "The problem",
      text: "Every brand sizes differently, so people order two sizes and send one back.",
    },
    {
      title: "My role",
      text: "I lead product and engineering: the fit engine, API, shopper flow, brand dashboard and deployment.",
    },
  ],
  device: "phone",
  blocks: [
    {
      title: "Scan once.",
      lead: "Scan with your phone from any product. On a laptop, a QR code hands you over.",
      built: "One scan covers the whole visit and survives a refresh.",
      image: images.kbtCatalogue,
    },
    {
      title: "Your size, and a backup.",
      lead: "Your best size, a roomier option, and how it fits each area.",
      built: "Every size is compared across six body areas, with rules for each garment type.",
      image: images.kbtSizeResult,
    },
    {
      title: "Honest when it can't tell.",
      lead: "Bad scan, or outside the size range? It tells you and lets you retry.",
      built: "The engine stops rather than guessing when a measurement is missing.",
      image: images.kbtOutsideRange,
    },
    {
      title: "See where it fits.",
      lead: "A labelled 3D figure next to the garment's real measurements.",
      built: "It only colours areas that really exist on the model. It's a reference figure, not your body.",
      image: images.kbtFitDetails,
    },
    {
      title: "Back to the brand.",
      lead: "One tap to the brand's store with your size.",
      built: "17 pilot products and 90 variant SKUs matched to their fit rules.",
      image: images.kbtBackToBrand,
    },
  ],
  alsoBuilt: [
    "Excel size-chart import",
    "Background import worker",
    "Brand admin dashboard",
    "Privacy-first pilot analytics",
    "Feature-flagged recommender",
    "650+ automated tests",
    "AWS App Runner + RDS",
  ],
  stack:
    "Next.js · TypeScript · PostgreSQL · Prisma · Bodygram · AWS App Runner · RDS · Secrets Manager",
  stackNote: "Raw scan data stays on the server; body measurements and IP addresses are never stored.",
  challenges: [
    {
      title: "Half a chest isn't a chest.",
      text: "Brands measure garments flat, at half width. The size-chart import doubles them into full circumferences so they can actually be compared with a body.",
    },
    {
      title: "A swim short isn't a jacket.",
      text: "So fit bands and rules are set per garment type, instead of one tolerance for everything.",
    },
    {
      title: "Mid-thigh isn't thigh.",
      text: "The body scanner returns thigh and mid-thigh as different measurements. The engine refuses to treat one as the other, and asks for better data instead of guessing.",
    },
  ],
  next: { label: "Fiddlie", href: "/fiddlie" },
  whatsNext:
    "More brands, a widget brands can embed in their own sites, and more body areas on the 3D figure.",
  live: { label: "Try it live", href: liveKbtUrl },
};
