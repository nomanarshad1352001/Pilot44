"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SiteContent } from "@/data/content";
import { Field, Text, Area, LinesArea, Select, Card } from "@/components/admin/fields";

const iconOptions = [
  { value: "rocket", label: "Rocket — Entrepreneurial" },
  { value: "layers", label: "Layers — Hybrid Delivery" },
  { value: "cpu", label: "CPU — Digital Infrastructure" },
  { value: "sparkles", label: "Sparkles — Innovation" },
];

export function SiteEditor({
  draft,
  update,
}: {
  draft: SiteContent;
  update: (fn: (d: SiteContent) => void) => void;
}) {
  const [activeTab, setActiveTab] = useState(draft.home.tabs[0]?.id ?? "");
  const tab = draft.home.tabs.find((t) => t.id === activeTab) ?? draft.home.tabs[0];

  return (
    <div className="space-y-6">
      <Card title="General" description="Brand name and contact details shown across the site and footer.">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Brand name">
            <Text value={draft.general.brandName} onChange={(v) => update((d) => (d.general.brandName = v))} />
          </Field>
          <Field label="Contact email">
            <Text value={draft.general.contactEmail} onChange={(v) => update((d) => (d.general.contactEmail = v))} />
          </Field>
          <Field label="Phone">
            <Text value={draft.general.phone} onChange={(v) => update((d) => (d.general.phone = v))} />
          </Field>
          <Field label="Address">
            <Text value={draft.general.address} onChange={(v) => update((d) => (d.general.address = v))} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Footer tagline">
              <Text value={draft.general.tagline} onChange={(v) => update((d) => (d.general.tagline = v))} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Home — Hero" description="The first thing visitors see. Headline words Innovation / Venture / Building / Studio are auto-accented in gold italic.">
        <div className="grid gap-6">
          <Field label="Eyebrow">
            <Text value={draft.home.eyebrow} onChange={(v) => update((d) => (d.home.eyebrow = v))} />
          </Field>
          <Field label="Headline">
            <Area rows={3} value={draft.home.headline} onChange={(v) => update((d) => (d.home.headline = v))} />
          </Field>
          <Field label="Subhead">
            <Area rows={3} value={draft.home.subhead} onChange={(v) => update((d) => (d.home.subhead = v))} />
          </Field>
        </div>
      </Card>

      <Card title="Home — CTA section" description="The closing lead-capture block ('Ready to get started?').">
        <div className="grid gap-6">
          <Field label="Heading">
            <Text value={draft.home.ctaHeading} onChange={(v) => update((d) => (d.home.ctaHeading = v))} />
          </Field>
          <Field label="Supporting line">
            <Area rows={2} value={draft.home.ctaSub} onChange={(v) => update((d) => (d.home.ctaSub = v))} />
          </Field>
        </div>
      </Card>

      <Card title="Home — Mission" description="Two editorial paragraphs. Each line becomes its own paragraph block.">
        <LinesArea
          rows={5}
          value={draft.home.mission}
          onChange={(v) => update((d) => (d.home.mission = v))}
          hint="Each line renders as one large paragraph."
        />
      </Card>

      <Card title="Home — Stats band" description="Four proof points beneath the mission.">
        <div className="grid gap-5 md:grid-cols-2">
          {draft.home.stats.map((s, i) => (
            <div key={i} className="grid grid-cols-[5rem_1fr] gap-3 rounded-xl border border-ink/[0.08] p-4">
              <Field label="Value">
                <Text
                  value={s.value}
                  onChange={(v) => update((d) => (d.home.stats[i].value = v))}
                />
              </Field>
              <Field label="Label">
                <Text
                  value={s.label}
                  onChange={(v) => update((d) => (d.home.stats[i].label = v))}
                />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Home — Client marquee"
        description="Names shown in the trusted-by strip under the hero."
        actions={
          <button
            onClick={() => update((d) => d.clients.push("New Client"))}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3.5 py-2 text-[0.65rem] font-semibold text-ink/70 hover:border-gold hover:text-gold"
          >
            <Plus size={12} /> Add client
          </button>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {draft.clients.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={c}
                onChange={(e) => update((d) => (d.clients[i] = e.target.value))}
                className="field-input"
              />
              <button
                onClick={() => update((d) => d.clients.splice(i, 1))}
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-ink/10 text-ink/40 hover:border-red-400/40 hover:text-red-600"
                aria-label="Remove client"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Home — Capability tabs" description="Overview / Research Lab / Venture Studio / Digital Accelerator panels. Select a tab to edit its content.">
        <div className="mb-6 flex flex-wrap gap-2">
          {draft.home.tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`rounded-full border px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.1em] transition-all ${
                tab?.id === t.id ? "border-gold bg-gold/10 text-gold" : "border-ink/15 text-ink/50 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab && (
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Tab label">
              <Text value={tab.label} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.label = v; })} />
            </Field>
            <Field label="Kicker">
              <Text value={tab.kicker} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.kicker = v; })} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Title">
                <Text value={tab.title} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.title = v; })} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Description">
                <Area rows={4} value={tab.description} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.description = v; })} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Bullets">
                <LinesArea rows={4} value={tab.bullets} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.bullets = v; })} />
              </Field>
            </div>
            <Field label="Stat value">
              <Text value={tab.stat.value} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.stat.value = v; })} />
            </Field>
            <Field label="Stat label">
              <Text value={tab.stat.label} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.stat.label = v; })} />
            </Field>
            <div className="md:col-span-2">
              <Field label="Panel image URL">
                <Text value={tab.image} onChange={(v) => update((d) => { const t2 = d.home.tabs.find((x) => x.id === tab.id); if (t2) t2.image = v; })} />
              </Field>
            </div>
          </div>
        )}
      </Card>

      <Card title="Home — Service blocks" description="The three capability blocks with bullet lists.">
        <div className="grid gap-6 lg:grid-cols-3">
          {draft.home.services.map((block, i) => (
            <div key={block.index} className="space-y-5 rounded-xl border border-ink/[0.08] p-5">
              <Field label={`Block ${block.index} — title`}>
                <Text value={block.title} onChange={(v) => update((d) => (d.home.services[i].title = v))} />
              </Field>
              <Field label="Intro">
                <Area rows={4} value={block.intro} onChange={(v) => update((d) => (d.home.services[i].intro = v))} />
              </Field>
              <Field label="Service bullets">
                <LinesArea rows={5} value={block.items} onChange={(v) => update((d) => (d.home.services[i].items = v))} />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="About page — Value cards"
        description="Repeatable card block — add a fifth value without a developer."
        actions={
          <button
            onClick={() =>
              update((d) => d.about.values.push({ icon: "sparkles", title: "New value", description: "Describe what this value means in practice." }))
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3.5 py-2 text-[0.65rem] font-semibold text-ink/70 hover:border-gold hover:text-gold"
          >
            <Plus size={12} /> Add value
          </button>
        }
      >
        <div className="grid gap-5 lg:grid-cols-2">
          {draft.about.values.map((v, i) => (
            <div key={i} className="space-y-4 rounded-xl border border-ink/[0.08] p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono2 text-[0.65rem] text-gold">0{i + 1}</span>
                <button
                  onClick={() => update((d) => d.about.values.splice(i, 1))}
                  className="grid size-8 place-items-center rounded-lg border border-ink/10 text-ink/40 hover:border-red-400/40 hover:text-red-600"
                  aria-label="Remove value"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <Field label="Icon">
                <Select value={v.icon} onChange={(x) => update((d) => (d.about.values[i].icon = x))} options={iconOptions} />
              </Field>
              <Field label="Title">
                <Text value={v.title} onChange={(x) => update((d) => (d.about.values[i].title = x))} />
              </Field>
              <Field label="Description">
                <Area rows={3} value={v.description} onChange={(x) => update((d) => (d.about.values[i].description = x))} />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      <Card title="About page — Story" description="Headline and body paragraphs.">
        <div className="grid gap-6">
          <Field label="Headline">
            <Text value={draft.about.headline} onChange={(v) => update((d) => (d.about.headline = v))} />
          </Field>
          <Field label="Body paragraphs">
            <LinesArea rows={6} value={draft.about.body} onChange={(v) => update((d) => (d.about.body = v))} hint="Each line becomes a paragraph." />
          </Field>
        </div>
      </Card>
    </div>
  );
}
