"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, RotateCcw, CloudUpload, Copy, Check, Send, Activity, Inbox } from "lucide-react";
import type { AuditEntry, CaseStudy, Job, SiteContent } from "@/data/content";
import { slugify } from "@/data/content";
import { useAuth, useSubmissions, ROLE_LABELS, readLastLogins, type Role } from "@/lib/store";
import { Field, Text, Area, LinesArea, Select, Toggle, Card } from "@/components/admin/fields";
import { SiteEditor } from "@/components/admin/SiteEditor";
import { TestimonialsEditor } from "@/components/admin/NavTestimonials";

type Updater = (fn: (d: SiteContent) => void) => void;

/* ============================ CASE STUDIES ============================ */

export function CaseStudiesEditor({
  draft,
  update,
  quickAction,
}: {
  draft: SiteContent;
  update: Updater;
  quickAction?: { id: string; token: number } | null;
}) {
  const [sel, setSel] = useState<string | null>(null);
  const cs = draft.caseStudies.find((c) => c.slug === sel) ?? null;

  const patch = (slug: string, fn: (c: CaseStudy) => void) =>
    update((d) => {
      const c = d.caseStudies.find((x) => x.slug === slug);
      if (c) fn(c);
    });

  const create = () => {
    const slug = `case-${Date.now().toString(36)}`;
    update((d) =>
      d.caseStudies.push({
        slug,
        client: "Anonymized Client",
        clientLogo: "AC",
        industry: "Food & Beverage",
        services: ["Venture Studio"],
        headline: "A new engagement headline worth clicking",
        challenge: "What the client was up against when they called us.",
        approach: "What the studio designed and built alongside their team.",
        outcome: "What the numbers decided, and what happened next.",
        metrics: [
          { value: "12 wks", label: "Time to first in-market pilot" },
          { value: "+24%", label: "Lift on the primary KPI" },
          { value: "3", label: "Teams enabled to run it solo" },
        ],
        heroImage:
          "https://images.pexels.com/photos/6727759/pexels-photo-6727759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      })
    );
    setSel(slug);
  };

  /* Cmd+K quick action: jump straight into a fresh case study */
  useEffect(() => {
    if (quickAction?.id === "new-case-study") create();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickAction?.token]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_1fr]">
      <div>
        <button
          onClick={create}
          className="mb-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gold px-4 py-3 text-[0.7rem] font-semibold text-white hover:bg-gold-soft"
        >
          <Plus size={13} /> New case study
        </button>
        <div className="space-y-2.5">
          {draft.caseStudies.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSel(c.slug)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                sel === c.slug ? "border-gold/60 bg-gold/[0.07]" : "border-ink/[0.08] bg-white/60 hover:border-ink/25"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-gold/40 font-display text-[0.7rem] text-gold">
                  {c.clientLogo}
                </span>
                <div className="min-w-0">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-gold">{c.industry}</p>
                  <p className="mt-0.5 line-clamp-1 font-display text-[0.92rem] text-ink">{c.headline}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {cs ? (
        <div className="rounded-2xl border border-ink/[0.08] bg-white/70 p-6 md:p-8">
          <div className="mb-7 flex items-center justify-between">
            <p className="font-mono2 text-[0.65rem] text-ink/35">/case-studies/{cs.slug}</p>
            <button
              onClick={() => {
                update((d) => (d.caseStudies = d.caseStudies.filter((x) => x.slug !== cs.slug)));
                setSel(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3.5 py-2 text-[0.65rem] font-semibold text-red-600 hover:bg-red-400/10"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Headline">
              <Text value={cs.headline} onChange={(v) => patch(cs.slug, (c) => (c.headline = v))} />
            </Field>
            <Field label="Slug">
              <Text value={cs.slug} onChange={(v) => patch(cs.slug, (c) => (c.slug = slugify(v)))} />
            </Field>
            <Field label="Client (use an anonymized descriptor unless cleared to name)">
              <Text value={cs.client} onChange={(v) => patch(cs.slug, (c) => (c.client = v))} />
            </Field>
            <Field label="Client logo monogram (1–2 letters)">
              <Text value={cs.clientLogo} onChange={(v) => patch(cs.slug, (c) => (c.clientLogo = v.slice(0, 2).toUpperCase()))} />
            </Field>
            <Field label="Industry">
              <Text value={cs.industry} onChange={(v) => patch(cs.slug, (c) => (c.industry = v))} />
            </Field>
            <Field label="Services">
              <LinesArea rows={2} value={cs.services} onChange={(v) => patch(cs.slug, (c) => (c.services = v))} hint="One service per line, e.g. Venture Studio" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Hero image URL">
                <Text value={cs.heroImage} onChange={(v) => patch(cs.slug, (c) => (c.heroImage = v))} />
              </Field>
            </div>
            {(["challenge", "approach", "outcome"] as const).map((k) => (
              <div key={k} className="md:col-span-2">
                <Field label={k.charAt(0).toUpperCase() + k.slice(1)}>
                  <Area rows={5} value={cs[k]} onChange={(v) => patch(cs.slug, (c) => (c[k] = v))} />
                </Field>
              </div>
            ))}
            <div className="md:col-span-2">
              <Field label="Metrics (value + label, one per line — e.g. `12 wks | Time to pilot`)">
                <textarea
                  rows={4}
                  className="field-input resize-y font-mono2 text-xs leading-relaxed"
                  value={cs.metrics.map((m) => `${m.value} | ${m.label}`).join("\n")}
                  onChange={(e) =>
                    patch(
                      cs.slug,
                      (c) =>
                        (c.metrics = e.target.value
                          .split("\n")
                          .filter((l) => l.includes("|"))
                          .map((l) => {
                            const [value, ...rest] = l.split("|");
                            return { value: value.trim(), label: rest.join("|").trim() };
                          }))
                    )
                  }
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Toggle
                checked={!!cs.testimonial}
                onChange={(v) =>
                  patch(
                    cs.slug,
                    (c) =>
                      (c.testimonial = v
                        ? { quote: "What the client said about the work.", name: "Their title", title: "Their company" }
                        : undefined)
                  )
                }
                label="Include a client testimonial block"
              />
            </div>
            {cs.testimonial && (
              <>
                <div className="md:col-span-2">
                  <Field label="Testimonial quote">
                    <Area rows={3} value={cs.testimonial.quote} onChange={(v) => patch(cs.slug, (c) => c.testimonial && (c.testimonial.quote = v))} />
                  </Field>
                </div>
                <Field label="Attribution">
                  <Text value={cs.testimonial.name} onChange={(v) => patch(cs.slug, (c) => c.testimonial && (c.testimonial.name = v))} />
                </Field>
                <Field label="Attribution detail">
                  <Text value={cs.testimonial.title} onChange={(v) => patch(cs.slug, (c) => c.testimonial && (c.testimonial.title = v))} />
                </Field>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden min-h-[380px] place-items-center rounded-2xl border border-dashed border-ink/12 lg:grid">
          <p className="font-display text-xl font-light text-ink/50">Select a case study to edit</p>
        </div>
      )}
    </div>
  );
}

/* ============================== CAREERS =============================== */

export function CareersEditor({ draft, update }: { draft: SiteContent; update: Updater }) {
  const patchJob = (id: string, patch: Partial<Job>) =>
    update((d) => {
      const j = d.jobs.find((x) => x.id === id);
      if (j) Object.assign(j, patch);
    });

  return (
    <Card
      title="Job postings"
      description="Open roles render on the Careers page with JobPosting JSON-LD. Close all roles and the page falls back to the no-openings state."
      actions={
        <button
          onClick={() =>
            update((d) =>
              d.jobs.push({
                id: `j${Date.now().toString(36)}`,
                title: "New role",
                team: "Venture Studio",
                location: "San Francisco · Hybrid",
                type: "Full-time",
                description: "Describe the role, the work and what great looks like.",
                applyEmail: "careers@pilot44.com",
                applyUrl: "",
                status: "open",
              })
            )
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3.5 py-2 text-[0.65rem] font-semibold text-ink/70 hover:border-gold hover:text-gold"
        >
          <Plus size={12} /> Add posting
        </button>
      }
    >
      <div className="space-y-5">
        {draft.jobs.map((job) => {
          const i = draft.jobs.indexOf(job);
          return (
            <div key={job.id} className="space-y-4 rounded-xl border border-ink/[0.08] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] ${job.status === "open" ? "bg-emerald-400/15 text-emerald-700" : "bg-ink/[0.08] text-ink/45"}`}>
                  {job.status}
                </span>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={job.status === "open"}
                    onChange={(v) => patchJob(job.id, { status: v ? "open" : "closed" })}
                    label={job.status === "open" ? "Accepting applications" : "Closed"}
                  />
                  <button
                    onClick={() => update((d) => d.jobs.splice(i, 1))}
                    className="grid size-8 place-items-center rounded-lg border border-ink/10 text-ink/40 hover:border-red-400/40 hover:text-red-600"
                    aria-label="Remove posting"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Title">
                  <Text value={job.title} onChange={(v) => patchJob(job.id, { title: v })} />
                </Field>
                <Field label="Department">
                  <Text value={job.team} onChange={(v) => patchJob(job.id, { team: v })} />
                </Field>
                <Field label="Location">
                  <Text value={job.location} onChange={(v) => patchJob(job.id, { location: v })} />
                </Field>
                <Field label="Type">
                  <Text value={job.type} onChange={(v) => patchJob(job.id, { type: v })} />
                </Field>
              </div>
              <Field label="Description">
                <Area rows={4} value={job.description} onChange={(v) => patchJob(job.id, { description: v })} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Apply email">
                  <Text value={job.applyEmail} onChange={(v) => patchJob(job.id, { applyEmail: v })} />
                </Field>
                <Field label="Apply URL (optional, overrides email)">
                  <Text value={job.applyUrl} onChange={(v) => patchJob(job.id, { applyUrl: v })} />
                </Field>
                <Field label="Posted date (JobPosting JSON-LD)">
                  <input
                    type="date"
                    value={job.postedDate ?? ""}
                    onChange={(e) => patchJob(job.id, { postedDate: e.target.value })}
                    className="field-input [color-scheme:dark]"
                  />
                </Field>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ============================= MEDIA LIBRARY =========================== */

export function MediaLibrary({ draft, update }: { draft: SiteContent; update: Updater }) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const add = () => {
    if (!url.trim().startsWith("http")) {
      setErr("Paste a valid hosted image URL (https://…).");
      return;
    }
    if (!alt.trim()) {
      setErr("Alt text is required — it powers accessibility and AI-search readiness.");
      return;
    }
    update((d) => d.media.unshift({ id: `m${Date.now().toString(36)}`, url: url.trim(), alt: alt.trim(), type: "image" }));
    setUrl("");
    setAlt("");
    setErr("");
  };

  const copy = (u: string, id: string) => {
    navigator.clipboard?.writeText(u);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Add media"
        description="In production these uploads live in Cloudflare R2. In this build, add hosted image URLs — every item requires alt text before it can be saved."
      >
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_auto] md:items-end">
          <Field label="Image URL">
            <Text value={url} onChange={setUrl} placeholder="https://images.pexels.com/…" />
          </Field>
          <Field label="Alt text (required)">
            <Text value={alt} onChange={setAlt} placeholder="Describe the image for screen readers & crawlers" />
          </Field>
          <button
            onClick={add}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-[0.7rem] font-semibold text-white hover:bg-gold-soft"
          >
            <CloudUpload size={14} /> Upload
          </button>
        </div>
        {err && <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-xs text-red-600">{err}</p>}
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {draft.media.map((m) => (
          <div key={m.id} className="group overflow-hidden rounded-xl border border-ink/[0.08] bg-white/70">
            <div className="img-frame aspect-[4/3]">
              <img src={m.url} alt={m.alt} loading="lazy" className="size-full object-cover" />
            </div>
            <div className="space-y-3 p-4">
              <p className="line-clamp-2 text-[0.68rem] leading-relaxed text-ink/55" title={m.alt}>
                {m.alt}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copy(m.url, m.id)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink/10 py-2 text-[0.62rem] font-semibold text-ink/60 hover:border-gold hover:text-gold"
                >
                  {copied === m.id ? <Check size={11} /> : <Copy size={11} />}
                  {copied === m.id ? "Copied" : "Copy URL"}
                </button>
                <button
                  onClick={() => update((d) => (d.media = d.media.filter((x) => x.id !== m.id)))}
                  className="grid size-8 shrink-0 place-items-center rounded-lg border border-ink/10 text-ink/40 hover:border-red-400/40 hover:text-red-600"
                  aria-label="Remove media"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================== FORM SUBMISSIONS ========================== */

const typeStyles: Record<string, string> = {
  contact: "bg-gold/15 text-gold",
  newsletter: "bg-sky-400/15 text-sky-700",
  resource: "bg-violet-400/15 text-violet-700",
  career: "bg-emerald-400/15 text-emerald-700",
};

export function SubmissionsLog({ readOnly }: { readOnly: boolean }) {
  const { submissions, resendSync, deleteSubmission, clearSubmissions } = useSubmissions();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const resend = (id: string) => {
    resendSync(id);
    setSent(id);
    window.setTimeout(() => setSent(null), 2000);
  };

  const failed = submissions.filter((s) => s.slack === "failed" || s.pipedrive === "failed").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Total submissions", value: String(submissions.length) },
          { label: "Contact inquiries", value: String(submissions.filter((s) => s.type === "contact").length) },
          { label: "Resource downloads", value: String(submissions.filter((s) => s.type === "resource").length) },
          { label: "Sync issues", value: String(failed), warn: failed > 0 },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-ink/[0.08] bg-white/70 p-5">
            <p className={`font-display text-3xl font-light ${s.warn ? "text-red-600" : "text-ink"}`}>{s.value}</p>
            <p className="mt-1 text-[0.62rem] uppercase tracking-[0.12em] text-ink/40">{s.label}</p>
          </div>
        ))}
      </div>

      <Card
        title="Submission log"
        description="Every contact, newsletter, gated download and application — with Slack + Pipedrive sync status. Purpose-of-contact tags route records to the right pipeline."
        actions={
          !readOnly && submissions.length > 0 ? (
            <button
              onClick={() => {
                if (window.confirm("Delete ALL form submissions? This cannot be undone.")) clearSubmissions();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3.5 py-2 text-[0.65rem] font-semibold text-red-600 transition-colors hover:bg-red-400/10"
            >
              <Trash2 size={12} /> Clear log
            </button>
          ) : undefined
        }
      >
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Inbox size={20} className="text-ink/25" />
            <p className="text-xs text-ink/40">No submissions yet — they appear here the moment a site form is submitted.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {submissions.map((s) => {
              const hasIssue = s.slack === "failed" || s.pipedrive === "failed";
              const open = expanded === s.id;
              return (
                <div key={s.id} className={`rounded-xl border ${hasIssue ? "border-red-400/25" : "border-ink/[0.08]"} bg-ink/[0.02]`}>
                  <button
                    onClick={() => setExpanded(open ? null : s.id)}
                    className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left"
                  >
                    <span className={`rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] ${typeStyles[s.type] ?? "bg-ink/10 text-ink/60"}`}>
                      {s.type}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{s.summary}</span>
                    <span className="hidden text-[0.62rem] text-ink/30 md:block">
                      {new Date(s.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <SyncChip label="Slack" ok={s.slack === "synced"} />
                      <SyncChip label="Pipedrive" ok={s.pipedrive === "synced"} />
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-ink/[0.06] px-5 py-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[0.65rem] uppercase tracking-[0.14em] text-mist">
                          Purpose tag: <span className="text-gold">{s.purpose}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          {hasIssue && !readOnly && (
                            <button
                              onClick={() => resend(s.id)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-[0.62rem] font-semibold text-white hover:bg-gold-soft"
                            >
                              {sent === s.id ? <Check size={11} /> : <Send size={11} />}
                              {sent === s.id ? "Re-sent" : "Re-send sync"}
                            </button>
                          )}
                          {!readOnly && (
                            <button
                              onClick={() => deleteSubmission(s.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3.5 py-1.5 text-[0.62rem] font-semibold text-red-600 transition-colors hover:bg-red-400/10"
                            >
                              <Trash2 size={11} /> Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {Object.entries(s.detail).map(([k, v]) => (
                          <div key={k} className="flex gap-2 text-[0.72rem]">
                            <dt className="shrink-0 font-semibold text-ink/50">{k}:</dt>
                            <dd className="break-words text-ink/75">{v}</dd>
                          </div>
                        ))}
                        <div className="flex gap-2 text-[0.72rem]">
                          <dt className="shrink-0 font-semibold text-ink/50">Email:</dt>
                          <dd className="text-gold">{s.email}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function SyncChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.1em] ${ok ? "bg-emerald-400/10 text-emerald-700" : "bg-red-400/10 text-red-600"}`}>
      <span className={`size-1 rounded-full ${ok ? "bg-emerald-300" : "animate-pulse-soft bg-red-300"}`} />
      {label}
    </span>
  );
}

/* ============================= USERS & ROLES =========================== */

const roleDescriptions: Record<Role, string> = {
  super: "Everything, plus users, navigation, settings & submissions",
  editor: "Create, edit & publish any content type",
  author: "Drafts own posts only; submits for review",
  viewer: "Read-only access to content & submissions",
};

export function UsersRoles() {
  const { users, inviteUser, removeUser, setUserRole, setUserActive, session } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("author");
  const [msg, setMsg] = useState("");
  const logins = useMemo(() => readLastLogins(), []);

  const invite = () => {
    if (!name.trim() || !email.includes("@") || password.length < 6) {
      setMsg("Name, a valid email, and a password of 6+ characters are required.");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setMsg("That email already has an account.");
      return;
    }
    inviteUser({ name: name.trim(), email: email.trim(), password, role, active: true });
    setName("");
    setEmail("");
    setPassword("");
    setMsg("Invitation created — they can sign in immediately.");
  };

  return (
    <div className="space-y-6">
      <Card title="Invite a user" description="New studio accounts take effect immediately.">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto_auto] md:items-end">
          <Field label="Full name">
            <Text value={name} onChange={setName} placeholder="Jordan Lee" />
          </Field>
          <Field label="Email">
            <Text value={email} onChange={setEmail} placeholder="jordan@pilot44.com" />
          </Field>
          <Field label="Temporary password">
            <Text value={password} onChange={setPassword} placeholder="6+ characters" />
          </Field>
          <Field label="Role">
            <Select
              value={role}
              onChange={(v) => setRole(v as Role)}
              options={(Object.keys(ROLE_LABELS) as Role[]).map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
            />
          </Field>
          <button
            onClick={invite}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-[0.7rem] font-semibold text-white hover:bg-gold-soft"
          >
            <Plus size={13} /> Invite
          </button>
        </div>
        {msg && <p className="mt-3 rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-2.5 text-xs text-gold">{msg}</p>}
      </Card>

      <Card title="Studio accounts" description="Assign or change roles, and deactivate accounts. Built-in accounts keep their sign-in details.">
        <div className="space-y-2.5">
          {users.map((u) => (
            <div
              key={u.email}
              className={`flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border p-4 transition-colors ${
                u.active ? "border-ink/[0.08] bg-ink/[0.02]" : "border-ink/[0.05] opacity-50"
              }`}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold/15 font-display text-xs text-gold">
                {u.name.charAt(0)}
              </span>
              <div className="min-w-[11rem]">
                <p className="text-xs font-semibold text-ink">{u.name}</p>
                <p className="font-mono2 text-[0.62rem] text-ink/40">{u.email}</p>
                <p className="mt-1 text-[0.58rem] text-ink/25">
                  {logins[u.email.toLowerCase()]
                    ? `Last login ${new Date(logins[u.email.toLowerCase()]).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
                    : "Never signed in"}
                </p>
              </div>
              <p className="hidden max-w-[15rem] flex-1 text-[0.62rem] leading-relaxed text-ink/35 xl:block">
                {roleDescriptions[u.role]}
              </p>
              <div className="flex items-center gap-2">
                <Select
                  value={u.role}
                  onChange={(v) => setUserRole(u.email, v as Role)}
                  options={(Object.keys(ROLE_LABELS) as Role[]).map((r) => ({ value: r, label: ROLE_LABELS[r] }))}
                />
                <button
                  disabled={u.email === session?.email}
                  onClick={() => setUserActive(u.email, !u.active)}
                  className={`rounded-full px-4 py-2 text-[0.62rem] font-semibold transition-colors disabled:opacity-30 ${
                    u.active
                      ? "border border-red-400/30 text-red-600 hover:bg-red-400/10"
                      : "border border-emerald-400/30 text-emerald-700 hover:bg-emerald-400/10"
                  }`}
                >
                  {u.active ? "Deactivate" : "Reactivate"}
                </button>
                {!u.builtin && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Permanently delete ${u.name}'s account?`)) removeUser(u.email);
                    }}
                    className="grid size-8 place-items-center rounded-lg border border-red-400/25 text-red-600/80 transition-colors hover:bg-red-400/10"
                    aria-label={`Delete ${u.name}`}
                    title="Delete account"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ============================== AUDIT LOG ============================== */

export function AuditLog({
  entries,
  onRevert,
  onDelete,
  onClear,
}: {
  entries: AuditEntry[];
  onRevert: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <Card
      title="Audit log"
      description="Who changed what and when. Each published change carries a snapshot of the previous version — revert any entry to restore that state instantly."
      actions={
        entries.length > 0 ? (
          <button
            onClick={() => {
              if (window.confirm("Clear the entire audit history? Content is not affected, but rollback snapshots are lost.")) onClear();
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-400/30 px-3.5 py-2 text-[0.65rem] font-semibold text-red-600 transition-colors hover:bg-red-400/10"
          >
            <Trash2 size={12} /> Clear history
          </button>
        ) : undefined
      }
    >
      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <Activity size={20} className="text-ink/25" />
          <p className="text-xs text-ink/40">
            No changes recorded yet. The first Save &amp; Publish will appear here, linked to its commit.
          </p>
        </div>
      ) : (
        <div className="relative space-y-0">
          {entries.map((e, i) => (
            <div key={e.id} className="relative flex gap-5 pb-6">
              {i < entries.length - 1 && <span className="absolute left-[15px] top-9 h-full w-px bg-ink/[0.07]" />}
              <span className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-gold/30 bg-ink text-gold">
                <span className="size-1.5 rounded-full bg-gold" />
              </span>
              <div className="min-w-0 flex-1 rounded-xl border border-ink/[0.08] bg-ink/[0.02] px-5 py-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-xs font-semibold text-ink">{e.action}</p>
                  <span className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-gold">
                    {e.module}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono2 text-[0.62rem] text-ink/35">
                    commit
                    <span className="rounded bg-ink/[0.06] px-1.5 py-0.5 text-gold/80">{e.commit}</span>
                  </span>
                </div>
                <p className="mt-1.5 text-[0.65rem] text-ink/40">
                  {e.actor} ({e.role}) ·{" "}
                  {new Date(e.at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {e.snapshot && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Revert site content to the state before this change (${e.action})?`)) {
                          onRevert(e.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-[0.6rem] font-semibold text-ink/60 transition-colors hover:border-gold hover:text-gold"
                    >
                      <RotateCcw size={11} /> Revert to this version
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(e.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-400/25 px-3.5 py-1.5 text-[0.6rem] font-semibold text-red-600/80 transition-colors hover:bg-red-400/10"
                  >
                    <Trash2 size={11} /> Delete entry
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ========================= PAGES (blocks + legal) ====================== */

export function PagesEditor({ draft, update }: { draft: SiteContent; update: Updater }) {
  const [tab, setTab] = useState<"site" | "testimonials" | "terms" | "privacy">("site");

  const legalFor = (key: "terms" | "privacy") => (
    <Card
      title={key === "terms" ? "Terms of Service" : "Privacy Policy"}
      description="Long-form legal content, editable without a developer. Each block renders as a numbered section."
      actions={
        <button
          onClick={() =>
            update((d) => d.legal[key].push({ heading: "New section", body: "Section body text goes here." }))
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3.5 py-2 text-[0.65rem] font-semibold text-ink/70 hover:border-gold hover:text-gold"
        >
          <Plus size={12} /> Add section
        </button>
      }
    >
      <div className="space-y-5">
        {draft.legal[key].map((s, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-ink/[0.08] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono2 text-[0.65rem] text-gold">Section {String(i + 1).padStart(2, "0")}</span>
              <button
                onClick={() => update((d) => d.legal[key].splice(i, 1))}
                className="grid size-8 place-items-center rounded-lg border border-ink/10 text-ink/40 hover:border-red-400/40 hover:text-red-600"
                aria-label="Remove section"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <Field label="Heading">
              <Text value={s.heading} onChange={(v) => update((d) => (d.legal[key][i].heading = v))} />
            </Field>
            <Field label="Body">
              <Area rows={5} value={s.body} onChange={(v) => update((d) => (d.legal[key][i].body = v))} />
            </Field>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "site", label: "Home & About blocks" },
          { id: "testimonials", label: "Testimonials" },
          { id: "terms", label: "Terms of Service" },
          { id: "privacy", label: "Privacy Policy" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`rounded-full border px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-all ${
              tab === t.id ? "border-gold bg-gold/10 text-gold" : "border-ink/15 text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "site" && <SiteEditor draft={draft} update={update} />}
      {tab === "testimonials" && <TestimonialsEditor draft={draft} update={update} />}
      {tab === "terms" && legalFor("terms")}
      {tab === "privacy" && legalFor("privacy")}
    </div>
  );
}
