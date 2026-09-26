"use client";

import { useMemo } from "react";
import { FileText, Star, BookOpen, MessageSquareQuote, Briefcase, Images, Inbox, History, ShieldCheck, TriangleAlert, ArrowRight, Pencil, Send, Radio, UserRound, Plus, type LucideIcon } from "lucide-react";
import type { AuditEntry, SiteContent } from "@/data/content";
import { formatDate } from "@/data/content";
import { useAuth, useSubmissions } from "@/lib/store";
import { Card } from "@/components/admin/fields";

export function DashboardView({
  content,
  audit,
  go,
  createItems,
  onCreate,
}: {
  content: SiteContent;
  audit: AuditEntry[];
  go: (v: string) => void;
  createItems: { id: string; label: string; icon: LucideIcon }[];
  onCreate: (id: string) => void;
}) {
  const { submissions } = useSubmissions();
  const { session } = useAuth();

  const pendingReview = content.posts.filter((p) => p.status === "review").length;
  const drafts = content.posts.filter((p) => p.status === "draft").length;
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  const subsThisWeek = submissions.filter((s) => new Date(s.createdAt).getTime() > weekAgo).length;

  const stats = [
    { icon: FileText, label: "Posts live", value: String(content.posts.filter((p) => p.status === "published" || !p.status).length), view: "posts" },
    { icon: Star, label: "Featured", value: String(content.posts.filter((p) => p.featured).length), view: "posts" },
    { icon: Send, label: "Pending review", value: String(pendingReview), view: "posts", accent: pendingReview > 0 },
    { icon: BookOpen, label: "Resources", value: String(content.resources.length), view: "resources" },
    { icon: Briefcase, label: "Open roles", value: String(content.jobs.filter((j) => j.status === "open").length), view: "careers" },
    { icon: Inbox, label: "Submissions (7d)", value: String(subsThisWeek), view: "submissions" },
  ];

  const recent = [...content.posts].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => go(s.view)}
            className={`group rounded-2xl border p-5 text-left transition-all duration-300 hover:border-gold/40 ${
              s.accent ? "border-gold/50 bg-gold/[0.06]" : "border-bone/[0.08] bg-carbon/70"
            }`}
          >
            <s.icon size={16} className={s.accent ? "text-gold" : "text-gold/70"} />
            <p className="mt-4 font-display text-3xl font-light text-bone">{s.value}</p>
            <p className="mt-1 text-[0.62rem] uppercase leading-snug tracking-[0.12em] text-bone/40">{s.label}</p>
          </button>
        ))}
      </div>

      {/* quick add — everything an administrator can create */}
      <Card
        title="Add anything"
        description="You have full create rights. Click any type to add it instantly, or press ⌘K anywhere in the panel."
        actions={
          <span className="rounded-full bg-gold/15 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold">
            {createItems.length} content types
          </span>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5">
          {createItems.map((c) => (
            <button
              key={c.id}
              onClick={() => onCreate(c.id)}
              className="group flex items-center gap-2.5 rounded-xl border border-bone/[0.08] bg-bone/[0.02] px-3.5 py-3 text-left transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.06]"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-bone/10 text-bone/45 transition-colors group-hover:border-gold/40 group-hover:text-gold">
                <c.icon size={12} />
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.7rem] font-medium text-bone/75 group-hover:text-bone">
                {c.label}
              </span>
              <Plus size={12} className="shrink-0 text-bone/25 transition-colors group-hover:text-gold" />
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* how publishing works */}
        <Card title="How publishing works" description="Changes are saved to the content store and are instantly live — always reversible.">
          <ol className="space-y-5">
            {[
              { icon: Pencil, step: "Edit", text: "Choose a module from the sidebar and edit content inline. Your role decides what you can change." },
              { icon: Send, step: "Save & Publish", text: "The gold button writes your changes to the live content store with a snapshot for rollback." },
              { icon: Radio, step: "Live", text: "The public site reads the same store, so updates appear instantly. Revert anytime from the Audit Log." },
            ].map((s, i) => (
              <li key={s.step} className="flex items-start gap-4">
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
                  <s.icon size={15} />
                  {i < 2 && <span className="absolute left-1/2 top-full h-5 w-px bg-gold/25" />}
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-bone">
                    <span className="font-mono2 text-[0.6rem] text-gold">{String(i + 1).padStart(2, "0")}</span>
                    {s.step}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-bone/45">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        {/* review queue / latest posts */}
        <Card title="Latest content" description="Most recently dated stories on the site.">
          <div className="space-y-3">
            {recent.map((p) => (
              <button
                key={p.slug}
                onClick={() => go("posts")}
                className="group flex w-full items-center justify-between gap-4 rounded-xl border border-bone/[0.06] bg-bone/[0.02] px-4 py-3.5 text-left transition-all hover:border-gold/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-bone">{p.title}</p>
                  <p className="mt-1 text-[0.65rem] text-bone/35">
                    {p.category} · {formatDate(p.date)}
                    {p.status && p.status !== "published" ? ` · ${p.status.toUpperCase()}` : ""}
                  </p>
                </div>
                <ArrowRight size={13} className="shrink-0 text-bone/25 transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
              </button>
            ))}
          </div>
          <p className="mt-5 border-t border-bone/[0.06] pt-4 text-[0.65rem] leading-relaxed text-bone/35">
            Last published{" "}
            {content.publishedAt
              ? new Date(content.publishedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
              : "— defaults in use"}{" "}
            · {drafts} draft{drafts === 1 ? "" : "s"} in progress
          </p>
        </Card>

        {/* recent activity */}
        <Card title="Recent activity" description="Latest entries from the audit log.">
          {audit.length === 0 ? (
            <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 text-center">
              <History size={18} className="text-bone/25" />
              <p className="max-w-[14rem] text-xs leading-relaxed text-bone/35">
                Nothing yet. Your first publish will land here with a revert snapshot.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {audit.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-start gap-3 rounded-xl border border-bone/[0.06] bg-bone/[0.02] px-4 py-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                    <UserRound size={12} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-bone">
                      {e.action} <span className="text-bone/40">in {e.module}</span>
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-[0.62rem] text-bone/35">
                      {e.actor} · {new Date(e.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      <span className="rounded bg-bone/[0.06] px-1.5 py-0.5 font-mono2 text-gold/70">{e.commit}</span>
                    </p>
                  </div>
                </div>
              ))}
              <button onClick={() => go("audit")} className="text-[0.65rem] font-semibold text-gold hover:underline">
                Open full audit log →
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export function SettingsView({
  content,
  onReset,
}: {
  content: SiteContent;
  onReset: () => void;
}) {
  const { session } = useAuth();

  return (
    <div className="space-y-6">
      <Card
        title="Administrator account"
        description="This panel uses one unrestricted Administrator account. Every module and every add, edit, publish, delete, sync and revert action is available."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-bone/[0.08] p-5">
            <p className="eyebrow !text-[0.58rem] text-mist">Signed in as</p>
            <p className="mt-2.5 font-display text-lg text-bone">{session?.name}</p>
            <p className="mt-1 font-mono2 text-[0.68rem] text-bone/40">{session?.email}</p>
          </div>
          <div className="rounded-xl border border-gold/30 bg-gold/[0.05] p-5">
            <p className="eyebrow !text-[0.58rem] text-gold">Access</p>
            <p className="mt-2.5 flex items-center gap-2 font-display text-lg text-bone">
              <ShieldCheck size={16} className="text-gold" /> Full Administrator
            </p>
            <p className="mt-1 text-[0.65rem] leading-relaxed text-bone/45">
              Nothing is hidden: content, navigation, footer, submissions, sync controls and audit history are all editable.
            </p>
          </div>
          <div className="rounded-xl border border-bone/[0.08] p-5">
            <p className="eyebrow !text-[0.58rem] text-mist">Security</p>
            <p className="mt-2.5 font-display text-lg text-bone">2FA + rate limiting</p>
            <p className="mt-1 text-[0.65rem] leading-relaxed text-bone/45">
              Five failed attempts trigger a 60-second lockout, and sign-in requires a verification code.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Create, edit, publish & delete posts",
            "Manage case studies, resources & careers",
            "Edit every Home, About & legal block",
            "Manage navigation, footer & social links",
            "Delete submissions & retry failed syncs",
            "Delete audit entries or revert any version",
          ].map((capability) => (
            <div key={capability} className="flex items-center gap-2 rounded-lg border border-bone/[0.07] bg-bone/[0.02] px-4 py-3 text-[0.7rem] text-bone/60">
              <span className="size-1.5 shrink-0 rounded-full bg-gold" />
              {capability}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Publishing architecture — Option A (git-backed)" description="Chosen over a live-database model so no database ever serves content in production.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-bone/[0.08] bg-bone/[0.02] p-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold">01 · Commit</p>
            <p className="mt-2.5 text-xs leading-relaxed text-bone/55">
              On Save &amp; Publish, the panel posts the content snapshot to <span className="font-mono2 text-bone/70">/api/publish</span>,
              which writes it to the Pilot44-owned GitHub repo as a real commit. Configure with{" "}
              <span className="font-mono2 text-bone/70">GITHUB_TOKEN</span> +{" "}
              <span className="font-mono2 text-bone/70">GITHUB_REPO</span> (demo commits run without them).
            </p>
          </div>
          <div className="rounded-xl border border-bone/[0.08] bg-bone/[0.02] p-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold">02 · Build</p>
            <p className="mt-2.5 text-xs leading-relaxed text-bone/55">
              The commit triggers the <span className="font-mono2 text-bone/70">NETLIFY_BUILD_HOOK</span>; the
              static site rebuilds in ~30–90 seconds. Every deploy SHA is shown in the panel topbar and Audit Log.
            </p>
          </div>
          <div className="rounded-xl border border-bone/[0.08] bg-bone/[0.02] p-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold">03 · Reversible</p>
            <p className="mt-2.5 text-xs leading-relaxed text-bone/55">
              Git history is the undo button — the Audit Log carries a snapshot of every pre-publish state, and
              one click restores it. Media lives in Cloudflare R2; the admin's own store holds only users,
              sessions, submissions and the audit trail — never page content.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Danger zone" description="Reverts every published change back to the built-in default content.">
        <div className="flex flex-col items-start justify-between gap-5 rounded-xl border border-red-400/25 bg-red-400/[0.05] p-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <TriangleAlert size={16} className="mt-0.5 shrink-0 text-red-300" />
            <div>
              <p className="text-sm font-semibold text-bone">Reset site content to defaults</p>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-bone/45">
                Clears all published overrides. The public site immediately returns to the original content
                shipped with the build. Audit history is preserved.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Reset all site content to defaults? This removes every published change.")) {
                onReset();
              }
            }}
            className="shrink-0 rounded-full border border-red-400/40 px-5 py-2.5 text-[0.7rem] font-semibold text-red-300 transition-colors hover:bg-red-400/10"
          >
            Reset everything
          </button>
        </div>
      </Card>
    </div>
  );
}
