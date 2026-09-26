"use client";

import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import type { NavLink, SiteContent } from "@/data/content";
import { Field, Text, Area, Select, Toggle, Card } from "@/components/admin/fields";

type Updater = (fn: (d: SiteContent) => void) => void;

/* --------------------------- link list editor ------------------------ */

function LinkListEditor({
  title,
  description,
  links,
  setLinks,
  newLabel,
}: {
  title: string;
  description: string;
  links: NavLink[];
  setLinks: (links: NavLink[]) => void;
  newLabel: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const next = [...links];
    const [item] = next.splice(i, 1);
    next.splice(i + dir, 0, item);
    setLinks(next);
  };

  return (
    <Card
      title={title}
      description={description}
      actions={
        <button
          onClick={() => setLinks([...links, { label: newLabel, href: "/" }])}
          className="inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-3.5 py-2 text-[0.65rem] font-semibold text-bone/70 hover:border-gold hover:text-gold"
        >
          <Plus size={12} /> Add link
        </button>
      }
    >
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2.5">
            <span className="font-mono2 text-[0.62rem] text-bone/25">{String(i + 1).padStart(2, "0")}</span>
            <input
              value={link.label}
              onChange={(e) => setLinks(links.map((l, j) => (j === i ? { ...l, label: e.target.value } : l)))}
              className="field-input"
              placeholder="Label"
            />
            <input
              value={link.href}
              onChange={(e) => setLinks(links.map((l, j) => (j === i ? { ...l, href: e.target.value } : l)))}
              className="field-input font-mono2 text-xs"
              placeholder="/path"
            />
            <div className="flex items-center gap-1">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="grid size-8 place-items-center rounded-lg border border-bone/10 text-bone/50 hover:border-gold hover:text-gold disabled:opacity-25"
                aria-label="Move up"
              >
                <ArrowUp size={12} />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === links.length - 1}
                className="grid size-8 place-items-center rounded-lg border border-bone/10 text-bone/50 hover:border-gold hover:text-gold disabled:opacity-25"
                aria-label="Move down"
              >
                <ArrowDown size={12} />
              </button>
              <button
                onClick={() => setLinks(links.filter((_, j) => j !== i))}
                className="grid size-8 place-items-center rounded-lg border border-bone/10 text-bone/40 hover:border-red-400/40 hover:text-red-300"
                aria-label="Remove link"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        {links.length === 0 && (
          <p className="rounded-xl border border-dashed border-bone/15 p-6 text-center text-xs text-bone/35">
            No links yet — add one above.
          </p>
        )}
      </div>
    </Card>
  );
}

export function NavigationEditor({ draft, update }: { draft: SiteContent; update: Updater }) {
  return (
    <div className="space-y-6">
      <LinkListEditor
        title="Header navigation"
        description="Links shown in the top navigation bar on every page. Add, remove or reorder — no code change required."
        links={draft.nav}
        setLinks={(links) => update((d) => (d.nav = links))}
        newLabel="New page"
      />
      <LinkListEditor
        title="Footer — Company column"
        description="The Company links in the footer."
        links={draft.footerCompany}
        setLinks={(links) => update((d) => (d.footerCompany = links))}
        newLabel="New link"
      />
      <LinkListEditor
        title="Footer — Resources column"
        description="Gated resources promoted in the footer."
        links={draft.footerResources}
        setLinks={(links) => update((d) => (d.footerResources = links))}
        newLabel="New resource"
      />
      <LinkListEditor
        title="Social links"
        description="Shown as pill links in the footer and referenced by the site's Organization JSON-LD."
        links={draft.socials}
        setLinks={(links) => update((d) => (d.socials = links))}
        newLabel="New platform"
      />
    </div>
  );
}

/* ---------------------------- testimonials --------------------------- */

export function TestimonialsEditor({ draft, update }: { draft: SiteContent; update: Updater }) {
  return (
    <Card
      title="Testimonials"
      description="Quotes rotate in the Client Voices section on the home page. Add more over time — the carousel handles it."
      actions={
        <button
          onClick={() =>
            update((d) =>
              d.testimonials.push({ quote: "A standout quote from a happy client.", name: "Client name or role", title: "Title", company: "Company" })
            )
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-3.5 py-2 text-[0.65rem] font-semibold text-bone/70 hover:border-gold hover:text-gold"
        >
          <Plus size={12} /> Add testimonial
        </button>
      }
    >
      <div className="space-y-5">
        {draft.testimonials.map((t, i) => (
          <div key={i} className="space-y-4 rounded-xl border border-bone/[0.08] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono2 text-[0.65rem] text-gold">Quote {i + 1}</span>
              <button
                onClick={() => update((d) => d.testimonials.splice(i, 1))}
                className="grid size-8 place-items-center rounded-lg border border-bone/10 text-bone/40 hover:border-red-400/40 hover:text-red-300"
                aria-label="Remove testimonial"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <Field label="Quote">
              <Area rows={3} value={t.quote} onChange={(v) => update((d) => (d.testimonials[i].quote = v))} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name / attribution">
                <Text value={t.name} onChange={(v) => update((d) => (d.testimonials[i].name = v))} />
              </Field>
              <Field label="Title">
                <Text value={t.title} onChange={(v) => update((d) => (d.testimonials[i].title = v))} />
              </Field>
              <Field label="Company">
                <Text value={t.company} onChange={(v) => update((d) => (d.testimonials[i].company = v))} />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ----------------------------- resources ----------------------------- */

export function ResourcesEditor({ draft, update }: { draft: SiteContent; update: Updater }) {
  const typeOptions = [
    { value: "webinar", label: "Webinar — Watch Now" },
    { value: "report", label: "Foresight Report — Download" },
    { value: "guide", label: "Strategic Guide — Download" },
  ];

  return (
    <Card
      title="Gated resources"
      description="Landing pages with lead-capture forms, linked from Insights and the footer."
      actions={
        <button
          onClick={() =>
            update((d) =>
              d.resources.push({
                slug: `resource-${Date.now().toString(36)}`,
                type: "guide",
                title: "New resource",
                description: "What this resource contains and who it's for — this summary is always public, only the asset sits behind the form.",
                meta: "Guide · 12 pages",
                image:
                  "https://images.pexels.com/photos/6727759/pexels-photo-6727759.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                ctaLabel: "Download",
                gated: true,
                assetUrl: "/new-resource.pdf",
              })
            )
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-3.5 py-2 text-[0.65rem] font-semibold text-bone/70 hover:border-gold hover:text-gold"
        >
          <Plus size={12} /> Add resource
        </button>
      }
    >
      <div className="space-y-5">
        {draft.resources.map((r, i) => (
          <div key={r.slug} className="space-y-4 rounded-xl border border-bone/[0.08] p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono2 text-[0.65rem] text-bone/35">/resources/{r.slug}</span>
              <button
                onClick={() => update((d) => d.resources.splice(i, 1))}
                className="grid size-8 place-items-center rounded-lg border border-bone/10 text-bone/40 hover:border-red-400/40 hover:text-red-300"
                aria-label="Remove resource"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <Text value={r.title} onChange={(v) => update((d) => (d.resources[i].title = v))} />
              </Field>
              <Field label="Type & CTA">
                <Select
                  value={r.type}
                  onChange={(v) =>
                    update((d) => {
                      d.resources[i].type = v as typeof r.type;
                      d.resources[i].ctaLabel = v === "webinar" ? "Watch Now" : "Download";
                    })
                  }
                  options={typeOptions}
                />
              </Field>
              <Field label="Meta">
                <Text value={r.meta} onChange={(v) => update((d) => (d.resources[i].meta = v))} />
              </Field>
              <Field label="Hero image URL">
                <Text value={r.image} onChange={(v) => update((d) => (d.resources[i].image = v))} />
              </Field>
              <Field label="Asset URL" hint="The PDF or video delivered after the form.">
                <Text value={r.assetUrl} onChange={(v) => update((d) => (d.resources[i].assetUrl = v))} />
              </Field>
              <div className="flex items-end pb-1">
                <Toggle
                  checked={r.gated}
                  onChange={(v) => update((d) => (d.resources[i].gated = v))}
                  label="Gated — require the lead form before access"
                />
              </div>
            </div>
            <Field label="Description — always public" hint="The summary of what's inside is never gated; only the asset is. This keeps the page AI-search-ready.">
              <Area rows={3} value={r.description} onChange={(v) => update((d) => (d.resources[i].description = v))} />
            </Field>
          </div>
        ))}
      </div>
    </Card>
  );
}
