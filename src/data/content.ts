/* ------------------------------------------------------------------ */
/*  Pilot44 — site content model + default content (file-based CMS)    */
/*  The admin panel writes an override of this object to localStorage, */
/*  which the public site reads back — no database required.           */
/* ------------------------------------------------------------------ */

export interface NavLink {
  label: string;
  href: string;
}

export interface CapabilityTab {
  id: string;
  label: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  stat: { value: string; label: string };
  image: string;
}

export interface ServiceBlock {
  index: string;
  title: string;
  intro: string;
  items: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

export type PostStatus = "published" | "draft" | "review";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string; // display name; matches an Author entry when possible
  authorRole: string;
  readTime: string;
  date: string; // ISO (publish / scheduled date)
  updatedDate?: string; // ISO — shown as "Updated …" and used as dateModified in JSON-LD
  image: string;
  featured: boolean;
  status: PostStatus;
  owner?: string; // email of the admin user who created it
  seo?: { title?: string; description?: string };
  body: string[]; // lines starting with "## " render as H2, "### " as H3
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string; // image URL; empty string renders a monogram
  socialLinks?: { label: string; href: string }[];
}

export type ResourceType = "webinar" | "report" | "guide";

export interface Resource {
  slug: string;
  type: ResourceType;
  title: string;
  description: string; // always public — never gated
  meta: string;
  image: string;
  ctaLabel: string;
  gated: boolean; // when false, the asset button shows without a form
  assetUrl: string; // the actual PDF/video behind (or beside) the form
}

export interface Job {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  description: string;
  applyEmail: string;
  applyUrl: string;
  postedDate?: string; // ISO — feeds JobPosting JSON-LD datePosted
  status: "open" | "closed";
}

export interface ValueCard {
  icon: string;
  title: string;
  description: string;
}

export interface CaseStudy {
  slug: string;
  client: string; // anonymized client descriptor + wordmark
  clientLogo: string;
  industry: string;
  services: string[];
  headline: string;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: { value: string; label: string }[];
  heroImage: string;
  testimonial?: { quote: string; name: string; title: string };
}

export interface LegalSection {
  heading: string;
  body: string;
}

export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
}

export interface SiteContent {
  general: {
    brandName: string;
    tagline: string;
    contactEmail: string;
    phone: string;
    address: string;
  };
  nav: NavLink[];
  footerCompany: NavLink[];
  footerResources: NavLink[];
  socials: NavLink[]; // NavigationSettings.socialLinks
  clients: string[];
  home: {
    eyebrow: string;
    headline: string;
    subhead: string;
    missionLabel: string;
    mission: string[];
    stats: { value: string; label: string }[];
    tabs: CapabilityTab[];
    services: ServiceBlock[];
    ctaHeading: string;
    ctaSub: string;
  };
  about: {
    eyebrow: string;
    headline: string;
    body: string[];
    values: ValueCard[];
    faq: { q: string; a: string }[]; // rendered on About + FAQPage JSON-LD
  };
  testimonials: Testimonial[];
  posts: Post[];
  authors: Author[];
  caseStudies: CaseStudy[];
  resources: Resource[];
  jobs: Job[];
  media: MediaItem[];
  legal: { terms: LegalSection[]; privacy: LegalSection[] };
  publishedAt: string | null;
}

/* ------------------------------------------------------------------ */
/*  Submissions + audit — stored client-side by the admin panel        */
/* ------------------------------------------------------------------ */

export type SubmissionType = "contact" | "newsletter" | "resource" | "career";

export interface Submission {
  id: string;
  type: SubmissionType;
  purpose: string; // purpose-of-contact tag, resource title, role applied for…
  email: string;
  summary: string;
  detail: Record<string, string>;
  createdAt: string; // ISO
  slack: "synced" | "failed";
  pipedrive: "synced" | "failed";
}

export interface AuditEntry {
  id: string;
  at: string; // ISO
  actor: string; // display name
  role: string;
  action: string; // "Published changes", "Reset content", …
  module: string; // "Insights", "Navigation", …
  commit: string; // pseudo git hash
  snapshot?: SiteContent; // previous content, for one-click revert
}

/* ---------------------------- image pool --------------------------- */

const img = {
  heroTeam:
    "https://images.pexels.com/photos/7495318/pexels-photo-7495318.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  blackBottles:
    "https://images.pexels.com/photos/13186049/pexels-photo-13186049.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  atelier:
    "https://images.pexels.com/photos/9852966/pexels-photo-9852966.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  colorLab:
    "https://images.pexels.com/photos/8546590/pexels-photo-8546590.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  blueprints:
    "https://images.pexels.com/photos/10375908/pexels-photo-10375908.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  groupStudio:
    "https://images.pexels.com/photos/9850090/pexels-photo-9850090.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  lettering:
    "https://images.pexels.com/photos/8546593/pexels-photo-8546593.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  officeTalk:
    "https://images.pexels.com/photos/6248963/pexels-photo-6248963.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  smallOffice:
    "https://images.pexels.com/photos/7180493/pexels-photo-7180493.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ceramics:
    "https://images.pexels.com/photos/7674643/pexels-photo-7674643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  duoStudio:
    "https://images.pexels.com/photos/8901248/pexels-photo-8901248.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  whiteContainers:
    "https://images.pexels.com/photos/8015461/pexels-photo-8015461.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  skincareMin:
    "https://images.pexels.com/photos/7670737/pexels-photo-7670737.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  squeezeBottles:
    "https://images.pexels.com/photos/8049849/pexels-photo-8049849.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  spaSet:
    "https://images.pexels.com/photos/8015809/pexels-photo-8015809.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  dropperBottles:
    "https://images.pexels.com/photos/6707558/pexels-photo-6707558.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  marbleFlatlay:
    "https://images.pexels.com/photos/6167450/pexels-photo-6167450.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  pumpBottles:
    "https://images.pexels.com/photos/8015790/pexels-photo-8015790.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  hairOil:
    "https://images.pexels.com/photos/7428095/pexels-photo-7428095.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  fiberOptic:
    "https://images.pexels.com/photos/17194838/pexels-photo-17194838.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  neonCity:
    "https://images.pexels.com/photos/18545010/pexels-photo-18545010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  neonWall:
    "https://images.pexels.com/photos/8108654/pexels-photo-8108654.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  rgbScreen:
    "https://images.pexels.com/photos/17279851/pexels-photo-17279851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  neonBlue:
    "https://images.pexels.com/photos/15680091/pexels-photo-15680091.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  lightStreaks:
    "https://images.pexels.com/photos/16708462/pexels-photo-16708462.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  geoLight:
    "https://images.pexels.com/photos/9881353/pexels-photo-9881353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ledCubes:
    "https://images.pexels.com/photos/6727759/pexels-photo-6727759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  ledRoom:
    "https://images.pexels.com/photos/9086767/pexels-photo-9086767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  metalFrame:
    "https://images.pexels.com/photos/6727766/pexels-photo-6727766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  drinkAisle:
    "https://images.pexels.com/photos/33690927/pexels-photo-33690927.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cartPark:
    "https://images.pexels.com/photos/7451964/pexels-photo-7451964.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  emptyShelves:
    "https://images.pexels.com/photos/4437148/pexels-photo-4437148.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  snackShelf:
    "https://images.pexels.com/photos/27939229/pexels-photo-27939229.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  chipsAisle:
    "https://images.pexels.com/photos/21582447/pexels-photo-21582447.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  vintageCans:
    "https://images.pexels.com/photos/35285854/pexels-photo-35285854.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  shopper:
    "https://images.pexels.com/photos/4971967/pexels-photo-4971967.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  flaskBlue:
    "https://images.pexels.com/photos/6608501/pexels-photo-6608501.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  scientistWork:
    "https://images.pexels.com/photos/3861457/pexels-photo-3861457.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  microscope:
    "https://images.pexels.com/photos/4031654/pexels-photo-4031654.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  glassFlasks:
    "https://images.pexels.com/photos/8927674/pexels-photo-8927674.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  coloredFlask:
    "https://images.pexels.com/photos/6608505/pexels-photo-6608505.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
};

export const imagePool = img;

/* --------------------------- default content ------------------------ */

const {
  ledRoom, scientistWork, atelier, fiberOptic, blackBottles, lettering, shopper,
  chipsAisle, rgbScreen, spaSet, squeezeBottles, flaskBlue, neonWall, whiteContainers,
  groupStudio, emptyShelves, smallOffice, dropperBottles, neonBlue, colorLab,
  marbleFlatlay, neonCity, drinkAisle, coloredFlask, blueprints, heroTeam,
  officeTalk, microscope, cartPark, glassFlasks, lightStreaks, ledCubes,
  duoStudio, skincareMin, hairOil, vintageCans, snackShelf,
} = img;

export const defaultContent: SiteContent = {
  general: {
    brandName: "Pilot44",
    tagline: "We build new brands, products, and businesses, and grow existing ones.",
    contactEmail: "hello@pilot44.com",
    phone: "+1 (415) 555-0144",
    address: "44 Tehama Street, San Francisco, CA 94105",
  },

  nav: [
    { label: "About", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Insights", href: "/insights" },
    { label: "Careers", href: "/careers" },
  ],

  footerCompany: [
    { label: "About Us", href: "/about" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Insights", href: "/insights" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],

  footerResources: [
    { label: "Venture Building, Rebuilt for 2026 — Webinar", href: "/resources/venture-building-rebuilt" },
    { label: "The 2030 Consumer — Foresight Report", href: "/resources/consumer-2030-report" },
    { label: "The Corporate Venture Studio Playbook", href: "/resources/venture-studio-playbook" },
  ],

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/pilot44" },
    { label: "X", href: "https://x.com/pilot44" },
    { label: "Instagram", href: "https://www.instagram.com/pilot44" },
  ],

  clients: ["P&G", "Nestlé", "Diageo", "PepsiCo", "Albertsons", "Kellogg's", "Hershey", "Electrolux", "Walgreens"],

  home: {
    eyebrow: "Consumer Brand Innovation & Venture Building",
    headline: "Today's Most Advanced and Integrated Consumer Brand Innovation & Venture Building Studio",
    subhead:
      "We partner with the world's leading consumer companies to research what consumers will want next, build the brands and ventures to meet them there, and accelerate the capabilities that make it repeatable.",
    missionLabel: "Our Mission",
    mission: [
      "Pilot44 exists to close the gap between how fast consumers change and how fast enterprises can respond. We are a new kind of innovation studio — part research lab, part venture builder, part digital accelerator — purpose-built to help the world's most ambitious consumer companies invent what's next.",
      "We don't hand over decks. We hand over evidence: working prototypes, validated demand, in-market pilots, and businesses ready to scale. Every engagement is designed to leave behind not just a result, but a repeatable capability your teams own long after we're gone.",
    ],
    stats: [
      { value: "200+", label: "Growth programs delivered" },
      { value: "40+", label: "New brands & ventures built" },
      { value: "9/10", label: "Top global CPGs served" },
      { value: "12 wks", label: "From insight to in-market pilot" },
    ],
    tabs: [
      {
        id: "overview",
        label: "Overview",
        kicker: "The Studio Model",
        title: "One studio. Three engines of growth.",
        description:
          "Most consultancies advise. Most agencies execute. Pilot44 does both, in one integrated studio model. Research identifies where to play, the Venture Studio builds the answer, and the Digital Accelerator makes sure your organization can run it — connected end-to-end, not handed off between vendors.",
        bullets: [
          "Research Lab — proprietary consumer & market foresight",
          "Venture Studio — new brands, products and businesses",
          "Digital Accelerator — commercial & capability lift",
          "One integrated team, one accountable outcome",
        ],
        stat: { value: "$1B+", label: "In new revenue opportunities identified for partners" },
        image: ledRoom,
      },
      {
        id: "research-lab",
        label: "Research Lab",
        kicker: "Evidence Before Investment",
        title: "See around corners before you spend.",
        description:
          "Our Research Lab combines ethnography, data science and continuous trend tracking to surface the consumer shifts worth betting on — and validate them before a single dollar of brand investment is committed.",
        bullets: [
          "Continuous trends & foresight systems",
          "Ethnographic and quantitative consumer research",
          "Market, category & whitespace mapping",
          "Rapid concept testing & validation sprints",
        ],
        stat: { value: "300+", label: "Field studies conducted across 20+ markets" },
        image: scientistWork,
      },
      {
        id: "venture-studio",
        label: "Venture Studio",
        kicker: "Built to Be Real",
        title: "We build what the brief can't.",
        description:
          "From whitespace to working business. The studio takes a validated opportunity and turns it into a brand, a product and a go-to-market engine — launched as a pilot in-market, with real consumers and real revenue signals, in as little as twelve weeks.",
        bullets: [
          "Venture ideation & business modeling sprints",
          "Brand, product & packaging creation",
          "MVP development and in-market pilots",
          "Incubation, scaling, spin-in & spin-out pathways",
        ],
        stat: { value: "12 wks", label: "Average time from concept to live pilot" },
        image: atelier,
      },
      {
        id: "digital-accelerator",
        label: "Digital Accelerator",
        kicker: "Transformation That Ships",
        title: "Capability, installed — not promised.",
        description:
          "Transformation fails when it lives in slideware. Our Accelerator runs focused sprints that ship working pilots — in ecommerce, retail media, AI-enabled workflows and data — while training your teams to operate them without us.",
        bullets: [
          "Ecommerce, DTC & retail media pilot programs",
          "AI-enabled marketing & insights workflows",
          "Data foundations, dashboards & decision tools",
          "Hands-on capability building for your teams",
        ],
        stat: { value: "6 wks", label: "Average accelerator sprint, from brief to shipped pilot" },
        image: fiberOptic,
      },
    ],
    services: [
      {
        index: "01",
        title: "Research & Strategy",
        intro:
          "Decisions anchored in evidence. We combine proprietary research with category expertise to show you where the consumer is going and exactly how to win there.",
        items: [
          "Consumer & market research",
          "Trends, foresight & scenario planning",
          "Innovation & brand strategy",
          "Opportunity & portfolio mapping",
          "Concept development & testing",
        ],
      },
      {
        index: "02",
        title: "Corporate Venture Building",
        intro:
          "New growth, built not bought. We design, build and launch new brands and businesses alongside your team — from first sketch to in-market revenue.",
        items: [
          "Venture ideation & business modeling",
          "Brand, product & packaging design",
          "MVP development & validation",
          "Go-to-market & pilot launches",
          "Incubation, scaling & spin-offs",
        ],
      },
      {
        index: "03",
        title: "Digital Transformation",
        intro:
          "Modern capabilities, made operational. We install the commerce, data and AI systems — and the team muscle to run them — that legacy organizations need to compete.",
        items: [
          "Ecommerce & DTC acceleration",
          "Retail media & digital commerce",
          "AI & data integration",
          "Marketing technology stack design",
          "Organizational capability building",
        ],
      },
    ],
    ctaHeading: "Ready to get started?",
    ctaSub:
      "Tell us where you want to grow. We'll show you the evidence, the opportunity, and the fastest credible path to building it.",
  },

  about: {
    eyebrow: "About Pilot44",
    headline: "Modern innovation studio for the enterprise",
    body: [
      "Pilot44 was founded on a simple frustration: the world's largest consumer companies had more insight, talent and capital than any startup — yet kept losing to them. Not because they lacked ideas, but because they lacked a way to turn ideas into evidence fast enough to matter.",
      "We built the studio we wished existed: researchers who sit next to designers, strategists who sit next to engineers, and operators who have actually launched brands sitting next to your team. Today we run innovation programs for many of the world's leading consumer companies — from San Francisco to Chicago to New York — united by one belief: the future of consumer brands will be built by those who ship, not those who speculate.",
    ],
    values: [
      {
        icon: "rocket",
        title: "Entrepreneurial Approach",
        description:
          "Every engagement is staffed with builders and operators who have launched brands themselves. We think in bets, pilots and revenue — not billable hours.",
      },
      {
        icon: "layers",
        title: "Hybrid Delivery",
        description:
          "Strategists, researchers, designers and engineers embedded as one team with yours. In the room, in the work, accountable to the same outcome.",
      },
      {
        icon: "cpu",
        title: "Digital Infrastructure",
        description:
          "A proprietary stack of research tools, data pipelines and AI workflows that compresses months of traditional consulting into focused, shippable weeks.",
      },
      {
        icon: "sparkles",
        title: "Interdisciplinary Innovation",
        description:
          "Deep expertise across CPG, retail, ecommerce and emerging technology — remixed per challenge, never per org chart. The right minds for the problem, not the practice.",
      },
    ],
    faq: [
      {
        q: "What does Pilot44 actually build?",
        a: "New brands, products and businesses — plus the research and digital capabilities that make innovation repeatable. Engagements typically end with in-market pilots, validated demand and teams enabled to run the work without us.",
      },
      {
        q: "How is a venture studio different from an agency or consultancy?",
        a: "Consultancies advise, agencies execute campaigns. A venture studio co-builds: we staff builders, researchers and designers inside your team, ship working ventures in twelve-week pilots, and stay accountable to business outcomes, not deliverables.",
      },
      {
        q: "Who is Pilot44 designed for?",
        a: "Enterprise consumer companies — CPG, retail, personal care, home, beverages — typically the top 100 global brand owners, plus private equity platforms that need venture-building capacity across portfolio companies.",
      },
      {
        q: "How long does an engagement take?",
        a: "Research sprints run 4 weeks, accelerator sprints 6, and a full venture build reaches an in-market pilot in about 12 weeks. Programs then extend into incubation or capability handoff depending on the outcome.",
      },
    ],
  },

  testimonials: [
    {
      quote:
        "Pilot44 operates like a true co-founder. They brought the evidence, built the venture alongside us, and shipped an in-market pilot faster than we thought was possible inside a company our size.",
      name: "Chief Growth Officer",
      title: "Office of the CEO",
      company: "Global Snacks Company",
    },
    {
      quote:
        "The Research Lab changed how our teams see the consumer. We stopped debating opinions in boardrooms and started making decisions on evidence. That shift alone was worth the engagement.",
      name: "VP of Innovation",
      title: "Global R&D",
      company: "Fortune 500 CPG",
    },
    {
      quote:
        "Twelve weeks from first workshop to a live pilot with real consumers. No decks, no theater — a working business, with numbers. Pilot44 is the rare partner that ships.",
      name: "SVP, Digital Transformation",
      title: "Commercial Organization",
      company: "Leading Beverage Company",
    },
  ],

  authors: [
    {
      slug: "elena-marsh",
      name: "Elena Marsh",
      role: "Partner, Venture Studio",
      bio: "Elena has spent fifteen years building consumer ventures inside and alongside large companies — from zero-to-one brand creation to the operating models that make corporate venture portfolios actually perform. She leads Pilot44's Venture Studio practice.",
      avatar: "",
    },
    {
      slug: "priya-raman",
      name: "Priya Raman",
      role: "Director, Digital Accelerator",
      bio: "Priya runs Pilot44's Digital Accelerator, installing commerce, AI and data capabilities inside enterprise teams. Previously she led ecommerce transformation for two global CPG portfolios and still believes the fastest way to change an org chart is to ship something together.",
      avatar: "",
    },
    {
      slug: "sofia-lindqvist",
      name: "Sofia Lindqvist",
      role: "Foresight Lead",
      bio: "Sofia heads the Research Lab's foresight program — continuous signal tracking across 20 markets, translated into decisions clients actually make. Her background spans trend ethnography, scenario planning and a brief, instructive detour through fashion forecasting.",
      avatar: "",
    },
    {
      slug: "james-whitfield",
      name: "James Whitfield",
      role: "Senior Strategist",
      bio: "James works across venture strategy and go-to-market for Pilot44 engagements, with a particular obsession: why big organizations kill good ideas, and the structural fixes that stop it. Before Pilot44 he built growth at an enterprise SaaS unicorn and a boutique consultancy.",
      avatar: "",
    },
    {
      slug: "studio-team",
      name: "Studio Team",
      role: "Pilot44 Collective",
      bio: "Written collaboratively by members of the Pilot44 studio — researchers, strategists, designers and operators working on live client programs.",
      avatar: "",
    },
  ],

  posts: [
    {
      slug: "billion-dollar-brand-built-inside-corporation",
      title: "Why the Next Billion-Dollar Brand Will Be Built Inside a Corporation",
      excerpt:
        "The assets that matter in brand building — distribution, data, trust and capital — overwhelmingly sit inside incumbents. What's missing is a repeatable machine for acting on them.",
      category: "Venture Building",
      author: "Elena Marsh",
      authorRole: "Partner, Venture Studio",
      readTime: "8 min",
      date: "2026-01-28",
      updatedDate: "2026-02-02",
      image: blackBottles,
      featured: true,
      status: "published",
      seo: {
        title: "Why the Next Billion-Dollar Brand Will Be Built Inside a Corporation | Pilot44",
        description:
          "Distribution, data, trust and capital sit inside incumbents. What large companies lack is a repeatable venture machine — here's the operating model that closes the gap.",
      },
      body: [
        "For two decades, the story of consumer brands was a story of insurgents: scrappy DTC startups out-executing sleepy incumbents. That era is ending. The cost of digital acquisition has tripled, retail gatekeeping is back, and consumers have re-anchored on trust — all of which favor the balance sheet, distribution and brand equity of large companies.",
        "Yet most corporations still can't build new brands the way startups do. Their innovation processes are designed to de-risk line extensions, not to birth ventures. Stage gates punish ambiguity; annual planning punishes speed. The result is a graveyard of good ideas that were validated too late, funded too cautiously, and launched too small to notice.",
        "## The counter-pattern: venture as operating discipline",
        "The counter-pattern we see working: a venture studio model operating at the edge of the enterprise, with its own decision rights, evidence standards and cadence. It uses corporate assets as unfair advantage — retail relationships, R&D, manufacturing — while behaving with startup economics: small teams, twelve-week pilots, kill-or-scale decisions made on real consumer behavior.",
        "## What this means for incumbents",
        "The next iconic consumer brand will not be discovered in a pitch deck. It will be compound-built inside a company that finally learned to run ventures the way ventures are run. The playbook exists. The only question is who industrializes it first.",
      ],
    },
    {
      slug: "ai-native-consumer-discovery",
      title: "The AI-Native Consumer: How Discovery Is Changing Forever",
      excerpt:
        "A growing share of product discovery now happens inside answer engines, not search boxes. Brands built for shelf and SEO are invisible to the consumer who asks instead of browses.",
      category: "AI",
      author: "Priya Raman",
      authorRole: "Director, Digital Accelerator",
      readTime: "7 min",
      date: "2026-01-15",
      image: fiberOptic,
      featured: true,
      status: "published",
      seo: {
        title: "The AI-Native Consumer: How Discovery Is Changing Forever | Pilot44",
        description:
          "Product discovery is moving into answer engines. Pilot44's research on AI-mediated journeys — and the Answer-First Branding discipline that wins them.",
      },
      body: [
        "Something subtle and enormous is happening in consumer discovery. Millions of purchase journeys now begin with a question asked to an AI assistant — 'What's a good protein snack for long flights?' — and end with a shortlist the consumer never personally assembled. The browsing shelf, digital or physical, is being bypassed.",
        "Our Research Lab tracked 2,400 category journeys across personal care, snacking and home cleaning last quarter. In categories with high consideration and jargon, AI-mediated discovery already influences more than a third of decisions. The brands surfaced share traits that have little to do with media spend: clear ingredient stories, structured claims, abundant third-party validation.",
        "## A new discipline: answer-first branding",
        "This demands a new discipline we're calling Answer-First Branding: engineering your product information, proof points and content so that machines can confidently recommend you. It is technical, unglamorous, and massively underinvested relative to its impact.",
        "The good news for incumbents: decades of research, testing data and quality documentation — usually locked in PDFs — is exactly the raw material answer engines reward. The brands that structure it first will compound an advantage that looks, in hindsight, like the early SEO land grab.",
      ],
    },
    {
      slug: "pilot-to-portfolio-corporate-venture-playbook",
      title: "From Pilot to Portfolio: A Corporate Venture Playbook",
      excerpt:
        "One successful pilot proves a point. A portfolio of ventures proves a strategy. Here's the operating system for getting from the first to the second.",
      category: "Venture Building",
      author: "Elena Marsh",
      authorRole: "Partner, Venture Studio",
      readTime: "10 min",
      date: "2025-12-11",
      image: lettering,
      featured: false,
      status: "published",
      body: [
        "Every large company we work with has at least one fabled pilot — the venture that survived. It gets cited in leadership decks for years. But a single pilot is an anecdote; a portfolio is a growth engine. The distance between the two is almost never creativity. It's operating model.",
        "## Portfolio thinking changes the math",
        "Portfolio thinking changes three things. First, volume: instead of betting the year's innovation budget on two ideas, you run eight to twelve cheap validations and scale only what earns it. Second, cadence: ventures move through fixed twelve-week stages with explicit kill criteria, so failures are fast, small, and educational. Third, ownership: each venture has a builder-in-charge with real decision rights, not a committee liaison.",
        "## Governance that doesn't strangle",
        "The financial governance has to change too. Ventures can't survive on annual budget cycles designed for steady-state brands. The working pattern is tranche-based funding released against evidence milestones — demand signal, unit economics, retention — exactly the way a seed investor operates.",
        "Do this for eighteen months and something remarkable happens: the portfolio starts producing strategic intelligence as a byproduct. You learn which consumer shifts are monetizable, which channels your org can actually execute, and where your moats are real. That's worth more than any single venture.",
      ],
    },
    {
      slug: "gen-alpha-cpg-brand-building",
      title: "What Gen Alpha Means for CPG Brand Building",
      excerpt:
        "The first generation raised entirely inside algorithmic feeds is becoming a purchase influencer. Their instincts about brands, authenticity and ingredients will rewrite category playbooks.",
      category: "Consumer Behavior",
      author: "Sofia Lindqvist",
      authorRole: "Foresight Lead",
      readTime: "6 min",
      date: "2025-12-02",
      image: shopper,
      featured: false,
      status: "published",
      body: [
        "Gen Alpha — born after 2010 — already influences an outsized share of household spending in snacks, personal care and entertainment. They have never known a world without infinite shelf, on-demand everything, and algorithmic curation. Their heuristics for trust are fundamentally different from their parents'.",
        "In our ethnographic work with families across three markets, we saw a consistent pattern: Alpha kids audit brands. They check ingredients because creators taught them to. They distrust polish and trust demonstration. A 12-year-old can articulate the difference between 'marketing' and 'proof' with unnerving precision.",
        "For brand builders, the implication is not 'market to kids.' It's that the pathway into the household basket is shifting. Purchase influence flows from young consumers who discover on feeds, interrogate claims, and lobby parents with receipts. Brands that make their proof legible — sourcing, testing, formulation logic — will inherit the household.",
        "The playbook: build products that survive ingredient scrutiny, show rather than tell in creator-native formats, and design packaging that communicates honestly at a glance. Gen Alpha is not a niche audience. They're the leading indicator of how everyone will shop in five years.",
      ],
    },
    {
      slug: "death-of-the-category",
      title: "The Death of the Category: Designing for Missions, Not Aisles",
      excerpt:
        "Consumers don't buy categories; they complete missions — recover faster, sleep deeper, host better. Brands organizing around aisle logic are optimizing for a map nobody uses.",
      category: "Retail",
      author: "James Whitfield",
      authorRole: "Senior Strategist",
      readTime: "7 min",
      date: "2025-11-18",
      image: chipsAisle,
      featured: false,
      status: "published",
      body: [
        "Walk a supermarket and you see a museum of how companies are organized, not how people live. Beverages here, snacks there, supplements across the store — yet the consumer's actual mission might be 'morning energy,' 'post-workout recovery,' or 'hosting Friday night.' Nobody shops categories. Everybody shops missions.",
        "## Missions redraw the competitive frame",
        "Mission-based thinking reframes competition brutally. Your protein bar isn't competing with other bars; it's competing with cold brew, a nap, and an energy drink for the 3pm slump mission. That shift changes where you place products, who you partner with, how you bundle, and which retailers you prioritize.",
        "Some retailers are already reorganizing around missions: sleep shops, hydration destinations, immunity end-caps. Digital makes missions even more powerful — recommendation naturally clusters by intent, not taxonomy. The leaders we work with now run whitespace analyses in mission space before category space.",
        "The practical move for a CPG portfolio: map your brands against the top consumer missions in your categories, find the missions where you have unfair rights to win, and build — or buy — the missing pieces of the mission solution. Category share follows mission ownership.",
      ],
    },
    {
      slug: "retail-media-eating-the-funnel",
      title: "Retail Media Networks Are Eating the Funnel",
      excerpt:
        "Retail media is no longer a bottom-funnel tax. It's becoming the primary brand-building surface for CPG — with closed-loop measurement that brand TV never had.",
      category: "Advertising",
      author: "Priya Raman",
      authorRole: "Director, Digital Accelerator",
      readTime: "6 min",
      date: "2025-11-04",
      image: rgbScreen,
      featured: false,
      status: "published",
      body: [
        "Retail media passed $140B globally and the growth curve hasn't bent. But the interesting shift isn't the spend — it's the role. What began as search ads on digital shelves has expanded into full-funnel programming: offsite targeting, in-store screens, shoppable streaming, and first-party audience deals that rival broadcast reach.",
        "The closed loop is the killer feature. For the first time, a CPG marketer can connect a brand exposure to a verified household purchase at scale, and optimize weekly. That measurement gravity is pulling budgets out of channels that can't prove the same, regardless of their creative romance.",
        "But there's a trap: retail media priced as a tax on distribution destroys margin without building brands. The winning posture treats RMNs as strategic partners — co-developing audiences, testing creative at retail speed, and insisting on incrementality measurement rather than attributable ROAS theater.",
        "Our guidance to brand teams: centralize retail media strategy, decentralize execution to category pods, and negotiate data access as hard as you negotiate shelf position. The funnel didn't disappear; it moved to where the receipt lives.",
      ],
    },
    {
      slug: "sustainable-packaging-that-scales",
      title: "Sustainable by Design: Packaging Innovation That Actually Scales",
      excerpt:
        "The graveyard of sustainable packaging is full of beautiful compostable concepts that failed at 10 million units. Scale-first design is the difference between virtue and impact.",
      category: "Sustainability",
      author: "James Whitfield",
      authorRole: "Senior Strategist",
      readTime: "8 min",
      date: "2025-10-21",
      image: spaSet,
      featured: false,
      status: "published",
      body: [
        "Every consumer goods company has the same slide: a gorgeous render of a compostable, refillable, ocean-positive package. Most of these concepts die quietly in procurement when three constraints arrive at once — line speed, shelf life, and unit cost. Sustainable packaging fails at scale far more often than it fails in concept.",
        "## Start from infrastructure, not aspiration",
        "The pattern that works starts from infrastructure, not aspiration. The most successful transitions we've helped launch began with the question: what can run on existing filling lines, survive real distribution, and win at shelf within 10% of current cost? Answering that honestly narrows the option space — and dramatically raises the odds of shipping.",
        "Mono-material redesigns, lightweighting, and concentrated formats are unglamorous, but they're where the carbon actually is. Meanwhile, reuse and refill systems can work — when designed for a specific retail partner's logistics rather than a generic circular economy dream.",
        "The strategic unlock is treating packaging as a portfolio of platforms. Build one scale-ready format per product family, prove it in a single region with a single retailer, and expand on evidence. Sustainability that ships beats sustainability that renders.",
      ],
    },
    {
      slug: "the-dtc-correction",
      title: "The DTC Correction: What We Learned Building Direct Brands",
      excerpt:
        "DTC was supposed to disintermediate retail. Instead it repriced truth about acquisition costs, retention economics, and what 'owning the customer' actually requires.",
      category: "DTC",
      author: "Elena Marsh",
      authorRole: "Partner, Venture Studio",
      readTime: "7 min",
      date: "2025-10-07",
      image: squeezeBottles,
      featured: false,
      status: "published",
      body: [
        "Having launched and scaled direct brands inside corporate portfolios, we lived the DTC correction from the inside. The lesson isn't that DTC was a fad — it's that DTC was mis-sold. It was pitched as a disintermediation story: cut out retail, keep the margin. It was actually a data-and-discipline story: own the relationship, earn the repeat.",
        "The economics are unforgiving. Acquisition costs in most CPG categories rose 2–3x since 2019. Brands that treated DTC as a channel discovered diminishing returns at scale. Brands that treated it as a laboratory — for pricing, bundles, claims, creative, retention mechanics — extracted value even when the P&L was thin.",
        "The corporates doing this well now run DTC as a permanent venture capability: a live consumer panel, a pricing sandbox, a launch venue for every new concept. Retail remains the volume engine; DTC is the intelligence engine. When a validated bundle or claim moves from DTC into retail, it arrives with receipts.",
        "So the corrected playbook: DTC for learning velocity, marketplaces for discovery, retail for scale. Stop asking whether DTC 'works.' Ask what it's teaching you that your other channels structurally cannot.",
      ],
    },
    {
      slug: "foresight-not-forecasts",
      title: "Foresight, Not Forecasts: Building a Trend Operating System",
      excerpt:
        "Annual trend decks are where insights go to die. The organizations seeing around corners run foresight as a living system — continuous, quantified, and wired into decision rights.",
      category: "Trends",
      author: "Sofia Lindqvist",
      authorRole: "Foresight Lead",
      readTime: "9 min",
      date: "2025-09-23",
      image: flaskBlue,
      featured: true,
      status: "published",
      body: [
        "Every January, the industry publishes identical trend reports, and by March they're decoration. The failure isn't in the research — it's in the operating model. A trend deck is an artifact; foresight needs to be a system. The difference determines whether your organization sees shifts eighteen months early or six weeks late.",
        "## Anatomy of a trend operating system",
        "A functioning trend OS has four components. A signal layer: continuous monitoring of search, social, patent, publication and startup data, scored for momentum, not hype. A sense-making layer: researchers translating signals into implications for your specific categories. A decision layer: explicit triggers — when a signal crosses threshold X, we run validation sprint Y. And a memory layer: a living repository every team can query.",
        "### Why quantification matters",
        "The quantification matters. 'Wellness is growing' is a horoscope. 'Consumer willingness-to-pay a premium for functional hydration grew 31% in 24 months across three data sources, led by these occasions' is a decision input. Momentum scoring turns trends from opinions into tracks you can bet on.",
        "We've installed versions of this system across beverage, beauty and home care portfolios. The consistent result: innovation pipelines fill with concepts anchored in verified momentum, and the annual strategy offsite gets replaced by a quarterly portfolio review of live signals. Forecasts age. Systems learn.",
      ],
    },
    {
      slug: "agentic-commerce-ai-does-the-shopping",
      title: "Agentic Commerce: When AI Does the Shopping",
      excerpt:
        "The next disruption to retail isn't a new channel — it's a new shopper. When agents research, compare and transact on consumers' behalf, persuasion gives way to machine-legible proof.",
      category: "AI",
      author: "Priya Raman",
      authorRole: "Director, Digital Accelerator",
      readTime: "8 min",
      date: "2025-09-09",
      image: neonWall,
      featured: false,
      status: "published",
      body: [
        "Autonomous shopping agents are moving from demo to deployment. Today they compare and recommend; within eighteen months they'll reorder, negotiate and switch on their users' behalf, governed by preferences rather than impulses. For brands, this is a categorical shift: your next customer may never see your ad.",
        "In an agent-mediated journey, the marketing surface changes completely. Emotional creative yields to structured claims, verified certifications, price-performance ratios, and stock reliability. Brand preference doesn't vanish — humans will still set the preferences agents execute — but it becomes a permission that must be earned in data and re-earned with every transaction.",
        "This creates a real first-mover dynamic. Agents will develop shortlists based on machine-legible trust: complete attributes, consistent imagery, accessible reviews, honest specs. Brands whose product information architecture is agent-ready get shortlisted; the rest get summarized out of existence.",
        "Our recommendation: run an 'agent audit' now — interrogate your category through the leading assistants and see what's surfaced, misrepresented, or invisible. Then fix your data layer before you touch your media plan. In a world of machine shoppers, the spec sheet is the new billboard.",
      ],
    },
    {
      slug: "brand-as-api-modular-identity",
      title: "Brand as API: Modular Identity Systems for Fast Launches",
      excerpt:
        "A venture portfolio can't wait six months per brand identity. The answer is systems, not style guides — componentized brand kits that assemble in days and still feel designed.",
      category: "Branding",
      author: "James Whitfield",
      authorRole: "Senior Strategist",
      readTime: "6 min",
      date: "2025-08-26",
      image: whiteContainers,
      featured: false,
      status: "published",
      body: [
        "Traditional brand development — six months, seven figures, one PDF — made sense when a company launched one brand a decade. A venture studio launching four pilots a quarter needs something else: a systematic way to produce distinctive, coherent, shelf-ready brands in days, not quarters.",
        "The approach that works treats brand as a composable system. A curated library of type pairings, color architectures, photography treatments, voice patterns and packaging scaffolds — each pre-cleared legally and tested for category codes. Identity becomes assembly plus bespoke focal points: the name, the mark, the one decision that makes it unmistakable.",
        "This isn't templated sameness; it's the same discipline design systems brought to software. Constraints accelerate creativity when the commodity decisions are automated and the meaningful ones get full attention. The pilot can go to market looking intentionally designed, because it was — by a system.",
        "For corporate portfolios, there's a bonus: modular brands are easier to retire, merge, or scale. When a venture graduates from pilot to business, the system hands off cleanly to a full identity program. Brand stops being the long pole and becomes an accelerant.",
      ],
    },
    {
      slug: "the-incubator-trap",
      title: "The Incubator Trap: Why Good Ideas Die in Big Companies",
      excerpt:
        "Corporate incubators fail for structural reasons, not talent reasons. Understanding autopsy patterns — zombie projects, missing owners, fake venture economics — is step one to escaping them.",
      category: "Incubation & Growth",
      author: "Elena Marsh",
      authorRole: "Partner, Venture Studio",
      readTime: "8 min",
      date: "2025-08-12",
      image: groupStudio,
      featured: false,
      status: "published",
      body: [
        "We've been called in to restart more corporate incubators than we can count, and the autopsies rhyme. The ideas were good. The talent was real. The structure guaranteed failure: ventures staffed by part-time volunteers, funded by annual budget theater, governed by executives incentivized to protect the core business the venture was designed to disrupt.",
        "## Autopsy pattern one: the zombie project",
        "The most common pattern is the zombie project — a venture that can't get killed and can't get scaled, consuming goodwill in a perpetual pilot. Zombies happen when success criteria were never set, so no evidence can resolve the question. The second pattern is the missing owner: everyone sponsors, nobody owns, so decisions route through consensus until momentum dies.",
        "## Importing venture economics",
        "Escaping the trap requires importing venture economics wholesale. Full-time builder-owners with meaningful upside. Tranche funding released against evidence milestones. A growth board empowered to say no — and to say yes fast. And, critically, a spin-in pathway: ventures that succeed must have a designed route back into the mothership's P&L, or they'll be orphaned at scale.",
        "The uncomfortable truth: an incubator is a strategy statement. Companies that fund them properly grow new revenue lines. Companies that fund them as PR get case studies about why innovation is hard.",
      ],
    },
    {
      slug: "supply-chain-as-brand-feature",
      title: "Supply Chain as a Brand Feature",
      excerpt:
        "Provenance used to be compliance theater. Now it's conversion copy. The brands winning premium shelf space are turning traceability from a cost center into a reason to believe.",
      category: "Supply Chain",
      author: "Sofia Lindqvist",
      authorRole: "Foresight Lead",
      readTime: "5 min",
      date: "2025-07-29",
      image: emptyShelves,
      featured: false,
      status: "published",
      body: [
        "For most of consumer goods history, supply chain was backstage — an efficiency machine consumers weren't meant to see. That wall is coming down. Ingredient-scanning apps, provenance QR codes, and creator-led supply chain exposés have made how a product is made part of what the product is.",
        "The commercial evidence is compelling. Products with specific, verifiable provenance claims — named farms, dated batches, disclosed processes — consistently out-convert vague 'natural' positioning in our testing. Consumers reward receipts. And in an AI-mediated discovery world, structured provenance data becomes machine-legible trust.",
        "This inverts the traditional cost logic. Traceability infrastructure isn't overhead; it's brand equity with a logistics budget. The companies we see doing this well market their supply chain like a product feature — batch-level transparency pages, source-of-the-day storytelling, supplier names on pack.",
        "The move for brand leaders: audit what your supply chain could prove today, make the strongest two or three proofs famous, and feed the structured data layer that both consumers and answer engines increasingly read first. Trust is becoming a specification.",
      ],
    },
    {
      slug: "permissionless-innovation",
      title: "Permissionless Innovation Inside the Enterprise",
      excerpt:
        "The best corporate innovators don't ask for permission; they build evidence. Designing the evidence standards that make that safe is the real work of innovation leadership.",
      category: "Best Practices",
      author: "James Whitfield",
      authorRole: "Senior Strategist",
      readTime: "6 min",
      date: "2025-07-15",
      image: smallOffice,
      featured: false,
      status: "published",
      body: [
        "In every large company there are shadow innovators — people testing landing pages, running customer interviews, building prototypes in their spare cycles. Leadership's instinct is to govern this energy. The better instinct is to channel it: give it standards, tools, and a legitimate path from evidence to investment.",
        "The mechanism that works is a published evidence ladder. Anyone can spend up to $5K and two weeks to produce a demand signal — no approvals needed. Cross that threshold with real behavior data, and you earn the right to a formal validation sprint. Each rung has clear standards for what counts as evidence, so permission is replaced by proof.",
        "This solves two problems at once. It captures entrepreneurial energy that governance would otherwise suppress, and it protects the organization from opinion-driven projects, because everything that gets funded arrives pre-validated by cheap, fast tests.",
        "The cultural shift is subtle but decisive: innovation stops being a department and becomes a protocol. The job of the innovation leader is no longer to have ideas — it's to maintain the ladder, coach the climbers, and make sure evidence actually moves money.",
      ],
    },
    {
      slug: "everyday-luxury-premiumization-cpg",
      title: "The Era of Everyday Luxury: Premiumization in CPG",
      excerpt:
        "Consumers are cutting cars and vacations before $9 olive oil. Small-ticket indulgence is the most durable premium trade in consumer — if your brand earns the price with proof, not veneer.",
      category: "CPG",
      author: "Sofia Lindqvist",
      authorRole: "Foresight Lead",
      readTime: "6 min",
      date: "2025-07-01",
      image: dropperBottles,
      featured: false,
      status: "published",
      body: [
        "Premiumization is the most reliable growth lever in consumer goods, and the current cycle has a specific character: everyday luxury. Consumers economize on big-ticket categories while trading up on small rituals — skincare actives, single-origin coffee, functional beverages, restaurant-grade pantry staples. The $4–$40 band is where trading-up concentrates.",
        "But the bar for premium has moved. Aesthetic packaging and a founder story were enough in 2019. Today's premium buyers — trained on ingredient literacy by skincare TikTok and supplement culture — interrogate formulation logic, sourcing specifics, and dose transparency. Premium is now a proof standard.",
        "The brands capturing this energy share a formula: a star ingredient with a story, clinical or craft proof, and design that signals discernment without shouting. They also respect the ritual: premium small-ticket items sell the transformation of a daily moment, not a feature list.",
        "For portfolio strategy, the play is clear: identify the rituals in your categories where consumers demonstrably trade up, build or buy brands with genuine proof, and price with confidence. Everyday luxury is not recession-proof, but it's the closest thing consumer goods has.",
      ],
    },
    {
      slug: "first-party-data-cookieless",
      title: "First-Party Data Strategies for a Cookieless World",
      excerpt:
        "The cookie deprecation saga ended with a shrug — but the underlying shift is real. Durable first-party data isn't collected; it's earned through explicit value exchange.",
      category: "Digital Marketing",
      author: "Priya Raman",
      authorRole: "Director, Digital Accelerator",
      readTime: "7 min",
      date: "2025-06-17",
      image: neonBlue,
      featured: false,
      status: "published",
      body: [
        "After years of deprecation deadlines that never quite arrived, the industry learned the wrong lesson: that nothing changed. Something did. Privacy regulation tightened, platform walls grew, and the third-party data economy quietly became unreliable. The brands that spent those years building first-party assets now hold a compounding advantage.",
        "The mistake most CPG companies make is treating first-party data as a collection problem — more forms, more QR scans, more sweepstakes. That yields low-intent data that decays. The durable alternative is a value exchange: tools, content and experiences worth an identity. Recipe platforms, shade finders, replenishment reminders, loyalty programs with genuine utility.",
        "The architecture matters as much as the offer. Identity has to resolve across brands and retailers into a usable profile, which usually means a lightweight CDP and ruthless focus on the four or five fields that actually drive activation — not eighty data points nobody queries.",
        "Start with one brand, one genuinely useful exchange, and one activation use case that proves value in ninety days. First-party data strategies die from ambition; they live from utility.",
      ],
    },
    {
      slug: "research-lab-that-actually-ships",
      title: "Building a Research Lab That Actually Ships",
      excerpt:
        "Most corporate research functions produce reports that change roadmaps a quarter at a time. Here's how to build one that changes decisions weekly — and earns its budget every sprint.",
      category: "Digital Technology",
      author: "Sofia Lindqvist",
      authorRole: "Foresight Lead",
      readTime: "8 min",
      date: "2025-06-03",
      image: scientistWork,
      featured: false,
      status: "published",
      body: [
        "Corporate research has a reputation problem: slow, expensive, and safely ignored. The root cause isn't rigor — it's tempo. When insight arrives weeks after the decision it should have informed, research becomes documentation, and teams learn to operate on intuition instead.",
        "The lab model that works inverts this. Research is scheduled to the decision calendar, not vice versa: standing weekly readouts, two-week sprint queues, and a standing panel of category consumers who can be engaged within 48 hours. AI tooling handles the mechanical work — transcription, thematic clustering, survey analysis — so researchers spend their hours on interpretation.",
        "The second inversion is output format. The deliverable isn't a deck; it's a decision. Every readout ends with the three things the evidence supports doing now, with confidence levels attached. Teams may disagree, but they can't ignore it — the research is designed for the meeting where money moves.",
        "Finally, a lab that ships needs a memory. Insights compound when they're queryable — a living repository where last year's ethnography informs this week's sprint. We build this infrastructure for clients precisely because research that compounds is a moat; research that evaporates is a cost.",
      ],
    },
    {
      slug: "creator-led-brands-engagement-stack",
      title: "Creator-Led Brands and the New Consumer Engagement Stack",
      excerpt:
        "Creators stopped being a media buy and became a go-to-market model. The brands compounding fastest treat creator relationships as product development partnerships, not placements.",
      category: "Consumer Engagement",
      author: "James Whitfield",
      authorRole: "Senior Strategist",
      readTime: "6 min",
      date: "2025-05-20",
      image: colorLab,
      featured: false,
      status: "published",
      body: [
        "The creator economy grew up. What began as sponsored posts is now a full commercial stack: creators validate concepts, co-develop products, launch them to built-in demand, and retain audiences brands rent expensively elsewhere. The engagement model inverted — instead of renting attention, you partner with its source.",
        "The implication for incumbents is organizational, not just tactical. Creator partnerships fail when run through ad-review processes designed for 30-second spots. They work when treated as co-ventures: shared revenue, real input on product, creative freedom within clear guardrails, and 6–12 month horizons rather than flight-based campaigns.",
        "The data pattern is consistent across our programs: creator-led launches show stronger early retention than paid-led launches, because the audience arrives with trust and context. The product was explained, demonstrated, and stress-tested in public before launch — feedback loops included.",
        "The stack that matters: a creator scouting and vetting capability, a fast co-development process that can react in weeks, and measurement that credits the compounding halo, not just last-click. Creators are the new shelf — and importantly, they talk back.",
      ],
    },
    {
      slug: "customer-experience-new-shelf-space",
      title: "Customer Experience Is the New Shelf Space",
      excerpt:
        "In a market where product parity arrives in months, the experience wrapper — discovery, service, delivery, community — is the durable differentiator. Treat it with P&L rigor.",
      category: "Customer Experience",
      author: "Elena Marsh",
      authorRole: "Partner, Venture Studio",
      readTime: "7 min",
      date: "2025-05-06",
      image: marbleFlatlay,
      featured: false,
      status: "published",
      body: [
        "Retail fought for shelf space because shelf space was scarce discovery. Digital shelves are infinite, so scarcity moved: to attention, trust, and the feel of the end-to-end experience. The brands breaking out aren't always the ones with superior formulas; they're the ones whose entire journey — discovery to unboxing to support — feels considered.",
        "Experience has become an unfair place to compete precisely because it's unfashionable. Competitors replicate a product in two quarters; they can't clone 400 micro-decisions about tone, packaging, delivery timing, and how problems get fixed. That accumulation is a moat wearing ordinary clothes.",
        "The discipline that makes this investable is treating CX as a P&L line with owners and metrics, not a vibe. Map the journey, find the moments that drive repurchase and referral — usually three to five moments matter disproportionately — and over-engineer exactly those.",
        "We've seen a reorder email redesigned into a genuinely useful ritual out-perform an entire retention campaign. Small surfaces, systematically excellent. Shelf space was won with slotting fees; experience is won with care, at operational scale.",
      ],
    },
    {
      slug: "disruption-roadmap-technologies-cpg",
      title: "The Disruption Roadmap: Technologies CPG Leaders Should Actually Watch",
      excerpt:
        "Cutting signal from noise: the four technology shifts with real consumer-goods impact horizons, ranked by proximity — and the ones you can safely ignore for now.",
      category: "Disruptive Technology",
      author: "Priya Raman",
      authorRole: "Director, Digital Accelerator",
      readTime: "9 min",
      date: "2025-04-22",
      image: neonCity,
      featured: false,
      status: "published",
      body: [
        "Technology foresight for consumer companies suffers from two opposite diseases: breathless futurism and cynical dismissal. The useful discipline is proximities — sorting shifts by when they touch your P&L and what doing something about them actually looks like.",
        "Tier one, acting now: applied AI across content production, media optimization, and demand forecasting — not as experiments but as operating cost reduction and speed. Agentic commerce preparation, covered elsewhere on this site: making product truth machine-legible before agents become the shopper's default interface.",
        "Tier two, piloting: personalization at the product level — micro-batch manufacturing and formulation technology moving from supplements into beauty and food; and smart packaging that closes the loop between physical product and digital identity.",
        "Tier three, monitoring: synthetic biology ingredients, climate-adaptive reformulation, and ambient commerce interfaces. Worth a quarterly signal review, not a task force. The companies that win technology aren't the ones that explored most broadly — they're the ones that mapped proximity honestly and moved first on what was closest.",
      ],
    },
    {
      slug: "ai-merchandising-ecommerce-shelf",
      title: "AI Is Rebuilding the Digital Shelf. Here's the New Merchandising Playbook.",
      excerpt:
        "Search-led ecommerce is giving way to conversation-led commerce. Winning the digital shelf now means winning the data layer underneath it.",
      category: "Ecommerce",
      author: "James Whitfield",
      authorRole: "Senior Strategist",
      readTime: "6 min",
      date: "2025-04-08",
      image: drinkAisle,
      featured: false,
      status: "published",
      body: [
        "The digital shelf was built on search: keywords in, ranked results out. That model is quietly breaking down as retailer and assistant interfaces shift to conversational, curated results. Shoppers increasingly accept a shortlist instead of a page — and shortlists are assembled by models reading product data, not by bids on keywords.",
        "The merchandising levers are changing accordingly. Attribute completeness, review velocity and sentiment quality, media richness, availability reliability — these machine-readable signals now compete with traditional retail media spend for visibility. In our audits, most brands' product data would fail to feed a recommender with confidence.",
        "The playbook that follows: treat product information as a growth asset with a named owner; instrument how platforms and assistants represent your SKUs monthly; fix data before expanding spend; and renegotiate retail media in a world where organic algorithmic placement is increasingly value-dense.",
        "None of this makes creative irrelevant — humans still decide what to buy twice. But the first decision is increasingly computational. Brands that learn to merchandise to machines, without losing the humans, will own the next shelf.",
      ],
    },
  ],

  caseStudies: [
    {
      slug: "venture-launch-global-snacks",
      client: "Fortune 500 Snacking Leader",
      clientLogo: "GS",
      industry: "Food & Beverage",
      services: ["Venture Studio", "Research Lab"],
      headline: "A new plant-forward snacking brand, live in market in twelve weeks",
      challenge:
        "The client's innovation pipeline had validated 'healthier indulgence' concepts for three consecutive years — but every one stalled between concept approval and in-market test. Internal launch timelines stretched past 18 months, and the window on the trend was closing. They needed a venture built and piloted while the insight was still hot.",
      approach:
        "Our Venture Studio ran a twelve-week build sprint alongside a dedicated client squad. The Research Lab pressure-tested the opportunity with a 400-person category panel in week two; brand, product line and packaging were designed in parallel tracks; and the venture launched as a DTC pilot plus a regional retail test with a national grocery partner — all under a standalone brand the parent company could scale or retire cheaply.",
      outcome:
        "The pilot hit its repeat-purchase threshold in week nine and was green-lit for scaled incubation. The venture model is now the client's template for whitespace plays, with two further launches funded through the portfolio board we helped stand up.",
      metrics: [
        { value: "12 wks", label: "From kickoff to live in-market pilot" },
        { value: "68%", label: "Repurchase intent among pilot buyers" },
        { value: "2", label: "Follow-on ventures funded from the same model" },
      ],
      heroImage: duoStudio,
      testimonial: {
        quote:
          "Pilot44 operates like a true co-founder. They brought the evidence, built the venture alongside us, and shipped an in-market pilot faster than we thought was possible inside a company our size.",
        name: "Chief Growth Officer",
        title: "Fortune 500 Snacking Leader",
      },
    },
    {
      slug: "dtc-rebuild-global-beauty",
      client: "Global Beauty Conglomerate",
      clientLogo: "GB",
      industry: "Personal Care & Beauty",
      services: ["Digital Accelerator"],
      headline: "Rebuilding a plateaued DTC business into the portfolio's intelligence engine",
      challenge:
        "A prestige skincare brand's DTC channel had plateaued: acquisition costs up 3x in three years, retention flat, and leadership debating whether to shut the channel down entirely. What the P&L obscured was that DTC was the only place the company could test pricing, claims and bundles in real time.",
      approach:
        "Our Digital Accelerator ran three sequential six-week sprints: first rebuilding the data foundation (identity resolution, cohort reporting), then restructuring the offer architecture around bundles and replenishment, finally retraining the in-house team with weekly trading rituals and an experimentation calendar. Every change shipped in-market — nothing lived in a deck.",
      outcome:
        "DTC revenue grew double digits within two quarters while CAC fell by over a third. More importantly, the channel became the portfolio's testing ground: two claims frameworks validated online moved into retail packaging the following season.",
      metrics: [
        { value: "-39%", label: "Customer acquisition cost within two quarters" },
        { value: "+24%", label: "Repeat purchase rate after offer rebuild" },
        { value: "18 wks", label: "Total program across three sprints" },
      ],
      heroImage: skincareMin,
    },
    {
      slug: "premiumization-beverage-portfolio",
      client: "Leading Beverage Company",
      clientLogo: "LB",
      industry: "Beverages",
      services: ["Research Lab"],
      headline: "Quantifying the everyday-luxury shift — and repositioning a flagship range to own it",
      challenge:
        "Category data showed premium segments growing while the client's flagship range competed on price. Leadership suspected an 'everyday luxury' opportunity but had no evidence of willingness-to-pay, no clarity on which rituals were trade-up-worthy, and no agreement on which brand in the portfolio should carry the premium play.",
      approach:
        "The Research Lab ran a four-week foresight sprint: signal analysis across 20 markets, willingness-to-pay quantification in three core categories, and mission-based consumer research to identify the rituals where trade-up was already happening. We delivered a premiumization thesis plus a ranked portfolio map — then validated three hero-SKU concepts with 1,200 category buyers.",
      outcome:
        "The client green-lit a premium sub-range anchored in the two highest-momentum rituals. Launch pricing carried the validated premium with no promotional support, and the research operating system now feeds the portfolio review every quarter.",
      metrics: [
        { value: "+18%", label: "Validated price premium vs. flagship line" },
        { value: "4 wks", label: "From brief to board-ready premium thesis" },
        { value: "1,200", label: "Category buyers in concept validation" },
      ],
      heroImage: hairOil,
      testimonial: {
        quote:
          "The Research Lab changed how our teams see the consumer. We stopped debating opinions in boardrooms and started making decisions on evidence.",
        name: "VP of Innovation",
        title: "Leading Beverage Company",
      },
    },
    {
      slug: "retail-media-grocery-transformation",
      client: "National Grocery Retailer",
      clientLogo: "NG",
      industry: "Retail",
      services: ["Digital Accelerator"],
      headline: "Standing up a retail media offering brand partners actually want to buy",
      challenge:
        "The retailer had valuable first-party data and prime in-store inventory, but its media offering consisted of ad-hoc placements sold as slotting add-ons. CPG partners were shifting serious budgets to competitor retail media networks with self-serve tooling and closed-loop reporting.",
      approach:
        "We co-built the retail media proposition over one quarter: packaged audience products, a self-serve campaign pilot for five strategic brand partners, incrementality measurement standards, and a go-to-market playbook for the trade team. Pilot campaigns ran live with real budgets — no simulations.",
      outcome:
        "All five pilot brands renewed at higher spend, and the measurement standard became the retailer's default pitching asset. The client team now runs the program internally following a structured handoff.",
      metrics: [
        { value: "+31%", label: "Average ROAS lift vs. legacy placements" },
        { value: "5", label: "Strategic CPG partners in the charter cohort" },
        { value: "90 days", label: "From proposition design to live campaigns" },
      ],
      heroImage: cartPark,
    },
    {
      slug: "connected-appliance-ecosystem",
      client: "European Appliance Manufacturer",
      clientLogo: "EA",
      industry: "Home & Durables",
      services: ["Venture Studio", "Digital Accelerator"],
      headline: "From selling hardware to owning the kitchen's daily rituals",
      challenge:
        "Facing margin compression from connected-hardware commoditization, the client needed recurring-revenue services around its installed base — but had no consumer software capability and a dealer channel nervous about disintermediation.",
      approach:
        "We ran a research-led venture build: ethnography inside 40 connected homes, then a staged service concept (consumable replenishment + guided cooking content) piloted as a lightweight app with 2,000 appliance owners. Crucially, we designed the dealer's role into the model — installation support and replenishment margins — converting channel resistance into distribution.",
      outcome:
        "The pilot service achieved subscription attach rates well above threshold, and the board approved a scaled rollout as the first move in a services portfolio. A dedicated venture team, hired from the client's own high-potential pool, now runs the business.",
      metrics: [
        { value: "23%", label: "Pilot cohort subscription attach rate" },
        { value: "2,000", label: "Appliance owners in the live pilot" },
        { value: "40", label: "In-home ethnographies informing the concept" },
      ],
      heroImage:
        "https://images.pexels.com/photos/6727766/pexels-photo-6727766.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    },
    {
      slug: "wellness-platform-brand-build",
      client: "PE-Backed Wellness Platform",
      clientLogo: "WP",
      industry: "Health & Wellness",
      services: ["Venture Studio", "Research Lab"],
      headline: "Building three brands in nine months for a roll-up that needed proof, not plans",
      challenge:
        "A private equity platform had acquired two wellness brands and needed a third built from scratch — with a unified brand architecture, evidence-backed positioning for each, and launch-ready go-to-market plans, all inside a single fund year.",
      approach:
        "Pilot44 operated as the platform's embedded venture team: a shared research foundation (one category foresight system, three consumer panels), then parallel brand builds with dedicated pods. Each brand shipped with modular identity systems from our brand-as-API library, cutting traditional development timelines by two-thirds.",
      outcome:
      "All three brands launched in market within nine months. The built-from-scratch brand outperformed both acquisitions on velocity of sale, and the platform retained the research system as permanent diligence infrastructure for future acquisitions.",
      metrics: [
        { value: "3", label: "Brands launched inside one fund year" },
        { value: "9 mo", label: "Kickoff to in-market for all three" },
        { value: "66%", label: "Faster than the platform's prior brand builds" },
      ],
      heroImage: vintageCans,
    },
  ],

  resources: [
    {
      slug: "venture-building-rebuilt",
      type: "webinar",
      title: "Venture Building, Rebuilt for 2026 — On-Demand Webinar",
      description:
        "A candid 40-minute session with our studio partners on what's actually working in corporate venture building now: the operating models, funding mechanics and evidence standards separating portfolios from pilot theater. Includes the tranche-funding template we use with every client.",
      meta: "On-demand · 42 min",
      image: groupStudio,
      ctaLabel: "Watch Now",
      gated: true,
      assetUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      slug: "consumer-2030-report",
      type: "report",
      title: "The 2030 Consumer — Foresight Report",
      description:
        "Our Research Lab's flagship report: the eight consumer shifts that will define category growth through 2030, quantified across 20 markets, with momentum scores, category-by-category implications, and the signals dashboard we monitor quarterly. The full methodology is included.",
      meta: "Report · 68 pages",
      image: coloredFlask,
      ctaLabel: "Download",
      gated: true,
      assetUrl: "/pilot44-2030-consumer-report.pdf",
    },
    {
      slug: "venture-studio-playbook",
      type: "guide",
      title: "The Corporate Venture Studio Playbook — Strategic Guide",
      description:
        "The complete operating guide: how to stand up a venture studio inside an enterprise — from governance and tranche funding to evidence ladders, kill criteria, and spin-in pathways. Distilled from forty venture builds across CPG, retail and healthcare.",
      meta: "Strategic guide · 24 pages",
      image: blueprints,
      ctaLabel: "Download",
      gated: true,
      assetUrl: "/pilot44-venture-studio-playbook.pdf",
    },
  ],

  jobs: [
    {
      id: "j1",
      title: "Venture Lead",
      team: "Venture Studio",
      location: "San Francisco · Hybrid",
      type: "Full-time",
      description:
        "Own new venture builds end-to-end: lead twelve-week sprints from validated insight to in-market pilot, directing a pod of strategists, designers and engineers alongside client squads. You're the builder-in-charge — you own the evidence, the cadence, and the kill-or-scale recommendation. Bring 6+ years across venture building, product leadership or early-stage founding, plus the scar tissue to prove it.",
      applyEmail: "careers@pilot44.com",
      applyUrl: "",
      status: "open",
    },
    {
      id: "j2",
      title: "Senior Consumer Researcher",
      team: "Research Lab",
      location: "New York · Hybrid",
      type: "Full-time",
      description:
        "Design and run mixed-methods research that changes decisions weekly, not quarterly: ethnographies, continuous signal tracking, rapid concept validation. Translate findings into implications clients can act on the same day they hear them. 5+ years in consumer research, ideally across CPG categories, with fluency in AI-assisted analysis workflows.",
      applyEmail: "careers@pilot44.com",
      applyUrl: "",
      status: "open",
    },
    {
      id: "j3",
      title: "Brand & Packaging Designer",
      team: "Venture Studio",
      location: "San Francisco · Hybrid",
      type: "Full-time",
      description:
        "Create shelf-ready brand identities and packaging systems at venture speed — sometimes in days, never carelessly. Work inside our modular brand-as-API system while crafting the bespoke focal points that make each brand distinctive. Portfolio required: show us consumer brands you've shipped, not decks you've presented.",
      applyEmail: "careers@pilot44.com",
      applyUrl: "",
      status: "open",
    },
    {
      id: "j4",
      title: "Growth Marketing Manager",
      team: "Digital Accelerator",
      location: "Remote · US",
      type: "Full-time",
      description:
        "Run live growth experiments across ecommerce, retail media and lifecycle for client ventures — with real budgets and weekly trading rhythms. You should be fluent in incrementality, skeptical of attribution theater, and happiest when an experiment you designed is live by Friday.",
      applyEmail: "careers@pilot44.com",
      applyUrl: "",
      status: "open",
    },
    {
      id: "j5",
      title: "Innovation Strategist",
      team: "Strategy",
      location: "Chicago · Hybrid",
      type: "Full-time",
      description:
        "Bridge research and venture: size opportunities, build business models, and turn consumer evidence into fundable theses for enterprise clients. Strong analytical craft plus workshop facilitation instincts. Consulting or corporate-strategy background welcome — but you must want to ship, not advise.",
      applyEmail: "careers@pilot44.com",
      applyUrl: "",
      status: "open",
    },
    {
      id: "j6",
      title: "Design Intern (Summer)",
      team: "Venture Studio",
      location: "San Francisco",
      type: "Internship",
      description: "Our summer internship cohort is currently filled.",
      applyEmail: "careers@pilot44.com",
      applyUrl: "",
      status: "closed",
    },
  ],

  media: [
    { id: "m1", url: lightStreaks, alt: "Abstract green and white light streaks against a dark background", type: "image" },
    { id: "m2", url: blueprints, alt: "Two colleagues reviewing venture design blueprints on an office table", type: "image" },
    { id: "m3", url: microscope, alt: "Researcher analyzing samples under a microscope in the Pilot44 lab", type: "image" },
    { id: "m4", url: glassFlasks, alt: "Glass laboratory flasks filled with blue liquid for formulation research", type: "image" },
    { id: "m5", url: officeTalk, alt: "Cross-functional team brainstorming during a venture sprint", type: "image" },
    { id: "m6", url: ledCubes, alt: "Geometric LED cube installation glowing against a dark background", type: "image" },
    { id: "m7", url: heroTeam, alt: "Pilot44 studio team collaborating around a worktable", type: "image" },
    { id: "m8", url: snackShelf, alt: "Colorful snack packaging displayed on a supermarket shelf", type: "image" },
  ],

  legal: {
    terms: [
      {
        heading: "Use of this site",
        body: "This website is operated by Pilot44, LLC. By accessing or using the site, you agree to these Terms. The site and its content are provided for general informational purposes about our studio, services and thinking. Nothing on this site constitutes a binding offer, professional advice, or a client relationship absent a written agreement signed by both parties.",
      },
      {
        heading: "Intellectual property",
        body: "All content on this site — including text, frameworks, graphics, reports, and the Pilot44 marks — is the property of Pilot44, LLC or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute or create derivative works from site content without our prior written consent, except for personal, non-commercial reference.",
      },
      {
        heading: "Gated resources",
        body: "Certain resources are provided in exchange for business contact information. By submitting a form, you grant us permission to contact you about the resource and related studio updates. Downloads and webinar recordings are licensed for individual business use and may not be redistributed.",
      },
      {
        heading: "Disclaimers & liability",
        body: "The site is provided “as is” without warranties of any kind. Forward-looking statements and research findings reflect our judgment at the time of publication. To the fullest extent permitted by law, Pilot44, LLC disclaims liability for any damages arising from use of, or reliance upon, this site.",
      },
      {
        heading: "Changes",
        body: "We may update these Terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised Terms.",
      },
    ],
    privacy: [
      {
        heading: "What we collect",
        body: "When you submit a form on this site, we collect the business contact details you provide — such as your name, work email, job title and company. We also collect standard technical information (browser, device, pages visited) to understand how the site is used and to improve it.",
      },
      {
        heading: "How we use it",
        body: "We use your information to deliver requested resources, respond to inquiries, send The Briefing newsletter where you have subscribed, and occasionally share relevant studio updates. We do not sell personal information, and we do not share it with third parties for their own marketing.",
      },
      {
        heading: "Storage & retention",
        body: "Information is stored with reputable service providers under appropriate security safeguards. We retain contact details for as long as the relationship is active or as needed for legitimate business purposes, after which they are deleted or anonymized.",
      },
      {
        heading: "Your choices",
        body: "You may unsubscribe from marketing communications at any time via the link in any email, and you may request access, correction, or deletion of your personal information by contacting us. Where required by law, we honor applicable data rights including those under GDPR and CCPA.",
      },
      {
        heading: "Contact",
        body: "For any privacy-related questions or requests, write to hello@pilot44.com or Pilot44, LLC, 44 Tehama Street, San Francisco, CA 94105.",
      },
    ],
  },

  publishedAt: null,
};

/* ------------------------------ helpers ----------------------------- */

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function sortedPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Only posts the public site should show. */
export function publicPosts(posts: Post[]): Post[] {
  const live = posts.filter((p) => !p.status || p.status === "published");
  return sortedPosts(live);
}

export function categoriesInUse(posts: Post[]): string[] {
  const set = new Set(posts.map((p) => p.category));
  return Array.from(set).sort();
}

export function authorSlugByName(authors: Author[], name: string): string {
  const found = authors.find((a) => a.name === name);
  if (found) return found.slug;
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70);
}
