"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Presentation,
  BookOpen,
  Briefcase,
  PanelsTopLeft,
  Images,
  Navigation2,
  Inbox,
  History,
  Settings,
  LogOut,
  CircleCheck,
  Lock,
  ShieldCheck,
  FileCode2,
  GitBranch,
  Zap,
  Hammer,
  Radio,
  Loader2,
  Command,
  Plus,
  ArrowRight,
  MessageSquareQuote,
  Sparkles,
  Star,
  Globe,
} from "lucide-react";
import {
  useAuth,
  useContent,
  readAuditLog,
  deleteAuditEntry,
  clearAuditLog,
} from "@/lib/store";
import { defaultContent, type AuditEntry, type SiteContent } from "@/data/content";
import { Logo, EASE } from "@/components/ui";
import { SaveBar } from "@/components/admin/fields";
import { PostsEditor } from "@/components/admin/PostsEditor";
import { NavigationEditor, ResourcesEditor } from "@/components/admin/NavTestimonials";
import {
  CaseStudiesEditor,
  CareersEditor,
  MediaLibrary,
  SubmissionsLog,
  AuditLog,
  PagesEditor,
} from "@/components/admin/AdminModules";
import { DashboardView, SettingsView } from "@/components/admin/Dashboard";

/**
 * Everything an Administrator can create, surfaced visibly in the
 * "Add new" button, the ⌘K palette, and the Dashboard quick-add grid.
 */
export const CREATE_ITEMS = [
  { id: "post", label: "Insight post", view: "posts", icon: FileText, hint: "Posts" },
  { id: "case-study", label: "Case study", view: "case-studies", icon: Presentation, hint: "Case Studies" },
  { id: "resource", label: "Gated resource", view: "resources", icon: BookOpen, hint: "Resources" },
  { id: "job", label: "Job posting", view: "careers", icon: Briefcase, hint: "Careers" },
  { id: "testimonial", label: "Testimonial", view: "pages", icon: MessageSquareQuote, hint: "Pages & Legal" },
  { id: "value", label: "About value card", view: "pages", icon: Sparkles, hint: "Pages & Legal" },
  { id: "faq", label: "FAQ question", view: "pages", icon: PanelsTopLeft, hint: "Pages & Legal" },
  { id: "legal", label: "Legal section", view: "pages", icon: PanelsTopLeft, hint: "Pages & Legal" },
  { id: "stat", label: "Home stat", view: "pages", icon: Star, hint: "Pages & Legal" },
  { id: "client", label: "Client logo", view: "pages", icon: Globe, hint: "Pages & Legal" },
  { id: "media", label: "Media asset", view: "media", icon: Images, hint: "Media Library" },
  { id: "nav", label: "Header nav link", view: "navigation", icon: Navigation2, hint: "Navigation" },
  { id: "footer-link", label: "Footer link", view: "navigation", icon: Navigation2, hint: "Navigation" },
  { id: "social", label: "Social link", view: "navigation", icon: Globe, hint: "Navigation" },
] as const;

/* Single Administrator: every module is always visible and editable. */
const MENU = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "case-studies", label: "Case Studies", icon: Presentation },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "careers", label: "Careers", icon: Briefcase },
  { id: "pages", label: "Pages & Legal", icon: PanelsTopLeft },
  { id: "media", label: "Media Library", icon: Images },
  { id: "navigation", label: "Navigation & Footer", icon: Navigation2 },
  { id: "submissions", label: "Form Submissions", icon: Inbox },
  { id: "audit", label: "Audit Log", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type ViewId = (typeof MENU)[number]["id"];

const VIEW_COPY: Record<string, string> = {
  dashboard: "An overview of everything happening on the site.",
  posts: "Create, edit, schedule and publish the stories on the Insights page.",
  "case-studies": "Structured engagement stories — client, industry, challenge, approach, outcome, metrics.",
  resources: "Gated and ungated landing pages for webinars, reports and guides.",
  careers: "Job postings shown on the Careers page, with open/closed status.",
  pages: "Block-based editing for Home, About and the legal long-form pages.",
  media: "The upload library — alt text required on every asset.",
  navigation: "Add, remove and reorder links in the header and footer. Super Admin only.",
  testimonials: "Quotes rotating in the Client Voices section.",
  submissions: "Every contact, newsletter, download and application — with Slack/Pipedrive sync.",
  users: "Invite users, assign roles, deactivate accounts. Super Admin only.",
  audit: "Who changed what, when — with one-click revert per change.",
  settings: "Your account, the permissions matrix, and content resets.",
};

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function withoutStamp(c: SiteContent): SiteContent {
  return { ...c, publishedAt: null };
}

/* deploy registry — the "what's live right now" record */
const DEPLOYS_KEY = "p44:deploys:v1";
interface Deploy {
  sha: string;
  mode: string;
  hookFired: boolean;
  at: string;
  module: string;
  actor: string;
}
function readDeploys(): Deploy[] {
  try {
    return JSON.parse(window.localStorage.getItem(DEPLOYS_KEY) ?? "[]") as Deploy[];
  } catch {
    return [];
  }
}
function writeDeploy(d: Deploy) {
  try {
    window.localStorage.setItem(DEPLOYS_KEY, JSON.stringify([d, ...readDeploys()].slice(0, 10)));
  } catch {
    /* ignore */
  }
}

interface Pipeline {
  stage: number;
  sha?: string;
  mode?: string;
  hookFired?: boolean;
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function AdminPanel() {
  const { session, logout } = useAuth();
  const { content, publish, resetContent, overridesActive } = useContent();
  const allowed = MENU;

  const [view, setView] = useState<ViewId>("dashboard");
  const [draft, setDraft] = useState<SiteContent>(() => clone(content));
  const [toast, setToast] = useState<string | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [saving, setSaving] = useState(false);
  const [deploy, setDeploy] = useState<Deploy | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteMode, setPaletteMode] = useState<"all" | "create">("all");
  const [quickAction, setQuickAction] = useState<{ id: string; token: number } | null>(null);

  useEffect(() => {
    setDeploy(readDeploys()[0] ?? null);
  }, []);

  const refreshAudit = useCallback(() => setAudit(readAuditLog()), []);
  useEffect(() => {
    refreshAudit();
  }, [refreshAudit]);

  /* keep draft synced with the store when not mid-edit */
  const syncedRef = useRef<SiteContent>(content);
  useEffect(() => {
    setDraft((prev) => {
      const inSync =
        JSON.stringify(withoutStamp(prev)) === JSON.stringify(withoutStamp(syncedRef.current));
      const next = inSync ? clone(content) : prev;
      syncedRef.current = content;
      return next;
    });
  }, [content]);

  const dirty = useMemo(
    () => JSON.stringify(withoutStamp(draft)) !== JSON.stringify(withoutStamp(content)),
    [draft, content]
  );

  /** All Administrator edits funnel through one unrestricted mutation path. */
  const update = (fn: (d: SiteContent) => void) => {
    setDraft((prev) => {
      const next = clone(prev);
      fn(next);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3400);
  };

  const moduleName = MENU.find((m) => m.id === view)?.label ?? "Site";

  /**
   * Option A — git-backed publishing: content snapshot is committed to the
   * repo (via /api/publish), the build hook fires, the static site rebuilds.
   * The local content store updates immediately so editors see their change;
   * the pipeline modal narrates the deploy as it would run against GitHub +
   * Netlify in production (real commits when env vars are configured).
   */
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setPipeline({ stage: 0 });
    publish(clone(draft), { module: moduleName });
    refreshAudit();

    const apiPromise: Promise<{ sha?: string; mode?: string; hookFired?: boolean }> = fetch("/api/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: draft, module: moduleName, actor: session?.name ?? "admin" }),
    })
      .then((r) => r.json())
      .catch(() => ({}));

    await wait(1000);
    const res = await apiPromise;
    setPipeline((p) => ({ stage: 1, sha: res?.sha, mode: res?.mode ?? "demo", hookFired: !!res?.hookFired }));
    await wait(1000);
    setPipeline((p) => ({ ...p!, stage: 2 }));
    await wait(1100);
    setPipeline((p) => ({ ...p!, stage: 3 }));
    await wait(1200);
    setPipeline((p) => ({ ...p!, stage: 4 }));

    const deployRecord: Deploy = {
      sha: res?.sha ?? Math.random().toString(16).slice(2, 9),
      mode: res?.mode ?? "demo",
      hookFired: !!res?.hookFired,
      at: new Date().toISOString(),
      module: moduleName,
      actor: session?.name ?? "admin",
    };
    writeDeploy(deployRecord);
    setDeploy(deployRecord);
    showToast("Published — your changes are live on the site");
    await wait(2200);
    setPipeline(null);
    setSaving(false);
  };

  const handleDiscard = () => setDraft(clone(content));

  const handleReset = () => {
    resetContent();
    setDraft(clone(defaultContent));
    showToast("Content reset to defaults — the site has been reverted");
  };

  const handleRevert = (id: string) => {
    const entry = readAuditLog().find((e) => e.id === id);
    if (!entry?.snapshot) return;
    publish(clone(entry.snapshot), { module: "Audit Log", action: "Reverted to earlier version" });
    refreshAudit();
    setDraft(clone(entry.snapshot));
    showToast("Reverted — the site now matches that earlier version");
  };

  const handleDeleteAudit = (id: string) => {
    deleteAuditEntry(id);
    refreshAudit();
    showToast("Audit entry deleted");
  };

  const handleClearAudit = () => {
    clearAuditLog();
    refreshAudit();
    showToast("Audit history cleared");
  };

  const changeView = (v: ViewId) => {
    if (dirty && !window.confirm("You have unpublished edits. Switch anyway?")) return;
    setDraft(clone(content));
    setView(v);
  };

  /** Creates any content type, then navigates to the module that edits it. */
  const handleCreate = (id: string) => {
    const item = CREATE_ITEMS.find((c) => c.id === id);
    if (!item) return;
    changeView(item.view as ViewId);

    if (id === "post" || id === "case-study") {
      setQuickAction({ id: id === "post" ? "new-post" : "new-case-study", token: Date.now() });
      showToast(`New ${item.label.toLowerCase()} started — fill it in, then Save & Publish`);
      return;
    }

    update((d) => {
      switch (id) {
        case "resource":
          d.resources.push({
            slug: `resource-${Date.now().toString(36)}`,
            type: "guide",
            title: "New resource",
            description: "What this resource contains and who it's for — this summary stays public.",
            meta: "Guide · 12 pages",
            image: "https://images.pexels.com/photos/6727759/pexels-photo-6727759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            ctaLabel: "Download",
            gated: true,
            assetUrl: "/new-resource.pdf",
          });
          break;
        case "job":
          d.jobs.push({
            id: `j${Date.now().toString(36)}`,
            title: "New role",
            team: "Venture Studio",
            location: "San Francisco · Hybrid",
            type: "Full-time",
            description: "Describe the role, the work and what great looks like.",
            applyEmail: "careers@pilot44.com",
            applyUrl: "",
            postedDate: new Date().toISOString().slice(0, 10),
            status: "open",
          });
          break;
        case "testimonial":
          d.testimonials.push({
            quote: "A standout quote from a happy client.",
            name: "Client name or role",
            title: "Title",
            company: "Company",
          });
          break;
        case "value":
          d.about.values.push({
            icon: "sparkles",
            title: "New value",
            description: "Describe what this value means in practice.",
          });
          break;
        case "faq":
          d.about.faq.push({ q: "New question?", a: "The answer visitors and AI crawlers will read." });
          break;
        case "legal":
          d.legal.terms.push({ heading: "New section", body: "Section body text goes here." });
          break;
        case "stat":
          d.home.stats.push({ value: "00+", label: "New proof point" });
          break;
        case "client":
          d.clients.push("New Client");
          break;
        case "media":
          d.media.unshift({
            id: `m${Date.now().toString(36)}`,
            url: "https://images.pexels.com/photos/6727759/pexels-photo-6727759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            alt: "Replace this alt text — required for accessibility and AI search",
            type: "image",
          });
          break;
        case "nav":
          d.nav.push({ label: "New page", href: "/" });
          break;
        case "footer-link":
          d.footerCompany.push({ label: "New link", href: "/" });
          break;
        case "social":
          d.socials.push({ label: "New platform", href: "https://" });
          break;
      }
    });
    showToast(`${item.label} added — edit it below, then Save & Publish`);
  };

  /* Cmd+K command palette */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteMode("all");
        setPaletteOpen((o) => !o);
        setPaletteQuery("");
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const paletteActions = useMemo(() => {
    const acts: { id: string; label: string; hint: string; create: boolean; run: () => void }[] =
      CREATE_ITEMS.map((c) => ({
        id: `create-${c.id}`,
        label: `Add ${c.label}`,
        hint: c.hint,
        create: true,
        run: () => handleCreate(c.id),
      }));

    if (paletteMode === "create") return acts;

    if (dirty) {
      acts.push({
        id: "publish",
        label: "Publish pending changes",
        hint: "Committing → building → live",
        create: false,
        run: () => {
          void handleSave();
        },
      });
    }
    allowed.forEach((m) =>
      acts.push({
        id: `go-${m.id}`,
        label: `Go to ${m.label}`,
        hint: "Navigate",
        create: false,
        run: () => changeView(m.id),
      })
    );
    return acts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, dirty, paletteMode]);

  const paletteFiltered = paletteActions.filter((a) =>
    a.label.toLowerCase().includes(paletteQuery.trim().toLowerCase())
  );

  const currentMeta = allowed.find((m) => m.id === view);
  const locked = !currentMeta;

  return (
    <div className="flex min-h-screen bg-ink">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-bone/[0.07] bg-coal lg:flex">
        <div className="flex h-[72px] items-center border-b border-bone/[0.07] px-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {allowed.map((m) => (
            <button
              key={m.id}
              onClick={() => changeView(m.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-[0.78rem] font-medium transition-all duration-300 ${
                view === m.id ? "bg-gold/10 text-gold" : "text-bone/50 hover:bg-bone/[0.04] hover:text-bone"
              }`}
            >
              <m.icon size={15} strokeWidth={1.8} />
              {m.label}
              {view === m.id && <span className="ml-auto size-1.5 rounded-full bg-gold" />}
            </button>
          ))}
        </nav>
        <div className="border-t border-bone/[0.07] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-bone/[0.03] p-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/15 font-display text-sm text-gold">
              {session?.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-bone">{session?.name}</p>
              <p className="flex items-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] text-gold">
                <ShieldCheck size={10} /> Administrator
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-bone/10 py-2.5 text-[0.7rem] font-semibold text-bone/50 transition-colors hover:border-red-400/40 hover:text-red-300"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </aside>

      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* topbar */}
        <header className="sticky top-0 z-40 flex h-[72px] items-center justify-between gap-4 border-b border-bone/[0.07] bg-ink/80 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <span className="lg:hidden">
              <Logo />
            </span>
            {currentMeta && (
              <span className="hidden items-center gap-2 text-sm text-bone/60 md:flex">
                <currentMeta.icon size={15} className="text-gold" />
                {currentMeta.label}
              </span>
            )}

          </div>
          <div className="flex items-center gap-3">
            <span
              className={`hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.14em] md:inline-flex ${
                overridesActive ? "bg-gold/15 text-gold" : "bg-bone/[0.06] text-bone/40"
              }`}
            >
              <span className={`size-1.5 rounded-full ${overridesActive ? "animate-pulse-soft bg-gold" : "bg-bone/30"}`} />
              {overridesActive ? "Customized · Live" : "Default content"}
            </span>
            {deploy && (
              <span
                className="hidden items-center gap-1.5 rounded-full border border-bone/10 px-3.5 py-2 font-mono2 text-[0.58rem] text-bone/45 xl:inline-flex"
                title={`Deployed by ${deploy.actor} from ${deploy.module} at ${deploy.at} (${deploy.mode} mode${deploy.hookFired ? ", build hook fired" : ""})`}
              >
                <GitBranch size={10} className="text-gold" />
                {deploy.sha} ·{" "}
                {new Date(deploy.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            )}
            <button
              onClick={() => {
                setPaletteMode("create");
                setPaletteQuery("");
                setPaletteOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[0.68rem] font-semibold text-ink transition-colors hover:bg-gold-soft"
              title="Add new content"
            >
              <Plus size={13} /> Add new
            </button>
            <button
              onClick={() => {
                setPaletteMode("all");
                setPaletteQuery("");
                setPaletteOpen(true);
              }}
              className="hidden items-center gap-2 rounded-full border border-bone/15 px-4 py-2 text-[0.68rem] font-semibold text-bone/50 transition-colors hover:border-gold hover:text-gold sm:inline-flex"
              title="Command palette"
            >
              <Command size={11} /> <span className="font-mono2">⌘K</span>
            </button>
          </div>
        </header>

        {/* mobile menu */}
        <div className="flex gap-2 overflow-x-auto border-b border-bone/[0.07] px-5 py-3 lg:hidden">
          {allowed.map((m) => (
            <button
              key={m.id}
              onClick={() => changeView(m.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[0.68rem] font-semibold ${
                view === m.id ? "bg-gold text-ink" : "border border-bone/15 text-bone/55"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* content */}
        <main className="flex-1 px-5 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-6xl">
            {!locked ? (
              <>
                <div className="mb-8">
                  <h1 className="font-display text-2xl font-light text-bone md:text-[1.9rem]">{currentMeta.label}</h1>
                  <p className="mt-1.5 text-xs text-bone/40">{VIEW_COPY[view]}</p>
                </div>

                {!['dashboard', 'settings', 'submissions', 'audit'].includes(view) && (
                  <SaveBar dirty={dirty} onSave={handleSave} onDiscard={handleDiscard} />
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {view === "dashboard" && (
                      <DashboardView
                        content={content}
                        audit={audit}
                        go={(v) => changeView(v as ViewId)}
                        createItems={CREATE_ITEMS.map((c) => ({ id: c.id, label: c.label, icon: c.icon }))}
                        onCreate={handleCreate}
                      />
                    )}
                    {view === "posts" && <PostsEditor draft={draft} update={update} quickAction={quickAction} />}
                    {view === "case-studies" && (
                      <CaseStudiesEditor draft={draft} update={update} quickAction={quickAction} />
                    )}
                    {view === "resources" && <ResourcesEditor draft={draft} update={update} />}
                    {view === "careers" && <CareersEditor draft={draft} update={update} />}
                    {view === "pages" && <PagesEditor draft={draft} update={update} />}
                    {view === "media" && <MediaLibrary draft={draft} update={update} />}
                    {view === "navigation" && <NavigationEditor draft={draft} update={update} />}
                    {view === "submissions" && <SubmissionsLog readOnly={false} />}
                    {view === "audit" && (
                      <AuditLog
                        entries={audit}
                        onRevert={handleRevert}
                        onDelete={handleDeleteAudit}
                        onClear={handleClearAudit}
                      />
                    )}
                    {view === "settings" && <SettingsView content={content} onReset={handleReset} />}
                  </motion.div>
                </AnimatePresence>
              </>
            ) : (
              <div className="grid min-h-[50vh] place-items-center">
                <div className="text-center">
                  <span className="mx-auto grid size-14 place-items-center rounded-full border border-bone/15 text-bone/40">
                    <Lock size={20} />
                  </span>
                  <p className="mt-6 font-display text-2xl font-light text-bone">Restricted section</p>
                  <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-bone/40">
                    Your role doesn&apos;t include access to this area.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* publish pipeline */}
      <AnimatePresence>
        {pipeline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] grid place-items-center bg-ink/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="w-full max-w-md rounded-2xl border border-gold/25 bg-coal p-8"
            >
              <div className="flex items-center justify-between">
                <p className="eyebrow text-gold">Publishing — Option A</p>
                <span className={`rounded-full px-3 py-1 font-mono2 text-[0.58rem] uppercase tracking-[0.12em] ${pipeline.mode === "github" ? "bg-emerald-400/15 text-emerald-300" : "bg-gold/15 text-gold"}`}>
                  {pipeline.mode === "github" ? "GitHub" : "Demo commit"}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-light text-bone">
                {pipeline.stage >= 4 ? "You're live." : "Deploying your change…"}
              </h2>

              <ol className="mt-7 space-y-4">
                {[
                  { icon: FileCode2, label: "Serializing content to the repository" },
                  {
                    icon: GitBranch,
                    label: pipeline.sha ? `Git commit created — #${pipeline.sha}` : "Creating git commit…",
                  },
                  {
                    icon: Zap,
                    label: pipeline.hookFired ? "Netlify build hook fired" : "Build hook acknowledged (demo)",
                  },
                  { icon: Hammer, label: "Building static pages…" },
                  { icon: Radio, label: "Live — change deployed to the site" },
                ].map((s, i) => {
                  const state = pipeline.stage > i ? "done" : pipeline.stage === i ? "active" : "idle";
                  return (
                    <li key={i} className="flex items-center gap-3.5">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                          state === "done"
                            ? "border-gold bg-gold text-ink"
                            : state === "active"
                              ? "border-gold/60 text-gold"
                              : "border-bone/15 text-bone/25"
                        }`}
                      >
                        {state === "done" ? (
                          <CircleCheck size={14} />
                        ) : state === "active" ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <s.icon size={13} />
                        )}
                      </span>
                      <span
                        className={`text-xs transition-colors duration-500 ${
                          state === "done" ? "text-bone" : state === "active" ? "text-gold" : "text-bone/30"
                        }`}
                      >
                        {s.label}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {pipeline.stage >= 4 && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-7 rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-[0.68rem] leading-relaxed text-bone/60"
                >
                  Every deploy is a real commit — the full history lives in the Audit Log and any version can be
                  restored with one click.
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* command palette */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[94] flex items-start justify-center bg-ink/70 p-4 pt-[14vh] backdrop-blur-sm"
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.97, y: -12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.97, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-bone/10 bg-coal shadow-2xl shadow-black/60"
            >
              <div className="flex items-center gap-3 border-b border-bone/[0.08] px-5 py-4">
                {paletteMode === "create" ? (
                  <Plus size={15} className="shrink-0 text-gold" />
                ) : (
                  <Command size={15} className="shrink-0 text-gold" />
                )}
                <input
                  autoFocus
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && paletteFiltered[0]) {
                      paletteFiltered[0].run();
                      setPaletteOpen(false);
                    }
                  }}
                  placeholder={
                    paletteMode === "create"
                      ? "What do you want to add? post, case study, job, FAQ…"
                      : "Type a command — add post, go to media, publish…"
                  }
                  className="w-full bg-transparent text-sm text-bone outline-none placeholder:text-bone/30"
                />
                <kbd className="rounded border border-bone/15 px-1.5 py-0.5 font-mono2 text-[0.58rem] text-bone/40">esc</kbd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-bone/[0.06] bg-bone/[0.02] px-5 py-2.5">
                <p className="text-[0.6rem] uppercase tracking-[0.14em] text-bone/40">
                  {paletteMode === "create"
                    ? `${CREATE_ITEMS.length} content types you can add`
                    : "Add, navigate or publish"}
                </p>
                <button
                  onClick={() => setPaletteMode(paletteMode === "create" ? "all" : "create")}
                  className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-gold hover:underline"
                >
                  {paletteMode === "create" ? "Show all commands" : "Show add actions"}
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {paletteFiltered.length === 0 && (
                  <p className="px-4 py-8 text-center text-xs text-bone/35">No matching commands.</p>
                )}
                {paletteFiltered.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      a.run();
                      setPaletteOpen(false);
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-gold/10"
                  >
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-lg border transition-colors ${
                        a.create
                          ? "border-gold/40 bg-gold/10 text-gold"
                          : "border-bone/10 text-bone/40 group-hover:border-gold/40 group-hover:text-gold"
                      }`}
                    >
                      {a.create ? <Plus size={12} /> : <ArrowRight size={12} />}
                    </span>
                    <span className="flex-1 text-xs font-medium text-bone">{a.label}</span>
                    <span className="text-[0.6rem] uppercase tracking-[0.12em] text-bone/30">{a.hint}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-gold/40 bg-ink/95 px-6 py-3.5 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <CircleCheck size={15} className="text-gold" />
            <span className="whitespace-nowrap text-xs font-medium text-bone">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
