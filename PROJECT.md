# Pilot44 — Website + Admin Panel

A fully-owned marketing website and login-gated admin panel for **Pilot44**, the consumer brand innovation & venture building studio. Luxurious white editorial public site, complete CMS-style admin, and a git-backed publishing model — no database serves page content in production.

---

## 1. What's inside

| Area | What it does |
|---|---|
| **Public website** (/ `/about` `/case-studies` `/insights` `/careers` `/contact` + detail pages) | White editorial marketing site: hero animations, client marquee, capability tabs, case studies with count-up metrics, insights with search/filter/pagination, author pages, gated resources, careers, contact with consent copy, legal pages |
| **Admin panel** (`/admin`) | Single-Administrator CMS with every module visible: posts, case studies, resources, careers, pages & legal blocks, media library, navigation & footer, form submissions + sync, audit log with one-click revert, settings |
| **Publish pipeline** (`/api/publish`) | Option A — git-backed publishing. On Save & Publish the panel posts the content snapshot; the route commits it to the Pilot44-owned GitHub repo (when env vars are set) and fires the Netlify build hook. Every deploy shows a visible "committing → building → live" progress state |
| **AI-search layer** | Organization / Article / Person / JobPosting / FAQPage JSON-LD, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, semantic one-H1 + nested H2/H3, visible authors & dates, public resource summaries |

## 2. Demo access

Panel login at `/admin` (the account is click-to-autofill on the login page):

| Access | Email | Password | Powers |
|---|---|---|---|
| **Administrator** | `admin@pilot44.com` | `studio-admin` | Unrestricted: every module and every add, edit, publish, delete, sync and revert action is visible and available (+ 2FA step, demo code **440044**) |

Security behaviors: 5 failed logins → 60-second lockout with countdown · forgot-password flow with reset-link confirmation · 2FA required for the Administrator. The login page includes a **Back to site** action; the admin panel deliberately has no View Live Site shortcut.

## 3. How a change goes live (admin → public site)

1. Edit content in any module (posts, pages, nav, media…)
2. Click **Save & Publish** → the visible pipeline narrates: *serializing → git commit #abc123 → build hook → building → live*
3. The content store updates instantly and the public site renders the change (audit entry + revert snapshot recorded)
4. In production configuration, `/api/publish` writes a real commit to GitHub and fires the Netlify build hook (~30–90s rebuild)
5. **Revert anything** from Audit Log — every entry carries the previous snapshot (git = the undo button)

Optional environment variables (no secrets are hardcoded):

```
GITHUB_TOKEN          # repo write access
GITHUB_REPO           # e.g. "pilot44/website"
GITHUB_CONTENT_PATH   # default: content/site-content.json
NETLIFY_BUILD_HOOK    # fired after every commit
```

## 4. Tech stack

- **Next.js 16 (App Router)** + React 19 — all 50 routes statically pre-rendered (full HTML for humans & AI crawlers)
- **Tailwind CSS v4** design tokens + Framer Motion
- **File-based CMS** — content model + defaults in `src/data/content.ts`; admin edits persist as snapshots (localStorage in this demo build) that deep-merge over defaults
- **No production database for content** — the admin's own store holds only users, sessions, submissions, audit entries

## 5. Content models (`src/data/content.ts`)

- **Post** — slug, title, excerpt, category (single, taxonomy-derived), author, readTime, date, updatedDate, image, featured, status (published/draft/review), owner, seo{title,description}, body (lines; `##`/`###` → H2/H3)
- **Author** — slug, name, role, bio, avatar, socialLinks
- **CaseStudy** — slug, client(+logo monogram), industry, services[], headline, challenge/approach/outcome, metrics[{value,label}], heroImage, testimonial?
- **Resource** — slug, type (webinar/report/guide), gated(bool), assetUrl, image, meta, ctaLabel
- **Job** — title, team, location, type, description, applyEmail/applyUrl, postedDate, status(open/closed)
- **Page blocks** — home (hero/mission/stats/tabs/services/CTA), about (story/values/FAQ), legal (terms/privacy long-form sections)
- **NavigationSettings** — header items, footer columns (Company/Resources), socials
- **FormSubmission / User / AuditEntry** — admin-side only

## 6. Admin modules (§3.3)

Dashboard (review queue, activity, 7-day submissions) · Posts (status workflow, author assignment, SEO card, schedule) · Case Studies · Resources (gated/ungated + asset attach) · Careers (open/closed) · Pages & Legal (Home/About blocks, testimonials, Terms, Privacy) · Media Library (alt text required) · Navigation & Footer (+ socials) · Form Submissions (detail, purpose tags, sync status, re-send, delete, clear) · Audit Log (commit SHA, per-entry delete, clear, one-click revert) · Settings (Administrator capabilities, Option-A architecture, reset). All modules and add/create controls are always visible.

Extras: **⌘K command palette** (new post / new case study / publish / navigation), publish progress modal, deploy chip with last SHA.

## 7. Public design system

- **Palette** — porcelain `#FBFAF6`, ink `#131316`, bronze-gold `#B08A3E`/`#8A6B33`; alternating bone/parchment/sand sections with two dark anchors (testimonial, footer)
- **Type** — Fraunces (display, italic gold accents) + Manrope (body) + IBM Plex Mono (labels)
- **Motion** — staggered hero entrances, scroll-triggered reveals (once, `prefers-reduced-motion` respected), sliding tab indicator + cross-fade panels, marquee that pauses on hover, image zoom hovers, lift+shadow cards, **count-up case metrics**, color-coded category tags (19 hues)

## 8. Scripts & validation

```bash
npm run dev        # develop
npm run build      # production build (50 routes, all static)
npm run start      # serve
npx next typegen && npx tsc --noEmit   # type gates
```

Health check: `/api/health` · Publish endpoint: `POST /api/publish`

## 9. Project structure

```
src/
  app/                 # routes: public pages + /admin + /api/publish + llms.txt / robots / sitemap
  components/
    site/              # header, footer, forms, cards
    home/ about/ insights/ authors/ careers/ contact/ case-studies/ resources/ legal/
    admin/             # login, panel shell, posts editor, modules, dashboard, fields
    ui.tsx             # shared primitives (Reveal, Marquee, Logo, Eyebrow…)
    JsonLd.tsx         # structured-data script helper
  data/content.ts      # types + default content (the file-based CMS)
  lib/store.tsx        # content/auth/submissions providers, audit + 2FA + rate limiting
```

## 10. Acceptance criteria (all verified)

- ✅ Administrator can log in, create content, Publish, and see it live — no developer involved
- ✅ Every admin module and add/create/edit/delete control is visible without role-based hiding
- ✅ Navigation, footer, submissions + sync, and audit history are fully manageable
- ✅ Audit Log shows who published what/when with commit SHAs and reversible snapshots
- ✅ Failed Slack/Pipedrive syncs are visible in the panel and manually retryable
- ✅ Every published change is reversible from the Audit Log
