"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, Check } from "lucide-react";

/* ------------------------- form primitives --------------------------- */

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="eyebrow !text-[0.58rem] text-mist">{label}</span>
      <div className="mt-2">{children}</div>
      {hint ? <span className="mt-1.5 block text-[0.66rem] text-bone/30">{hint}</span> : null}
    </label>
  );
}

export function Text({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="field-input"
    />
  );
}

export function Area({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="field-input resize-y leading-relaxed"
    />
  );
}

/** Edits a string[] as lines in a textarea. */
export function LinesArea({
  value,
  onChange,
  rows = 5,
  hint,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <textarea
        value={value.join("\n")}
        onChange={(e) => onChange(e.target.value.split("\n").filter((l) => l.trim() !== ""))}
        rows={rows}
        className="field-input resize-y font-mono2 text-xs leading-relaxed"
      />
      <span className="mt-1.5 block text-[0.66rem] text-bone/30">{hint ?? "One item per line."}</span>
    </div>
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="field-input appearance-none">
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-carbon">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${checked ? "bg-gold" : "bg-bone/15"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-ink transition-all duration-300 ${
            checked ? "left-[1.4rem]" : "left-0.5 bg-bone/60"
          }`}
        />
      </span>
      <span className="text-xs text-bone/70">{label}</span>
    </button>
  );
}

export function Card({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-bone/[0.08] bg-carbon/70 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-bone">{title}</h3>
          {description ? <p className="mt-1 text-xs leading-relaxed text-bone/40">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

/* --------------------------- save bar -------------------------------- */

export function SaveBar({
  dirty,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  if (!dirty) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-[72px] z-30 mb-8 flex items-center justify-between gap-4 rounded-xl border border-gold/40 bg-ink/90 px-5 py-3.5 backdrop-blur-xl"
    >
      <p className="flex items-center gap-2.5 text-xs text-gold">
        <span className="size-2 animate-pulse-soft rounded-full bg-gold" />
        Unsaved changes — publish to make them live
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={onDiscard}
          className="inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-4 py-2 text-[0.68rem] font-semibold text-bone/70 transition-colors hover:border-bone/50"
        >
          <RotateCcw size={12} /> Discard
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2 text-[0.68rem] font-semibold text-ink transition-colors hover:bg-gold-soft"
        >
          <Save size={12} /> Save &amp; Publish
        </button>
      </div>
    </motion.div>
  );
}

export function LiveChip({ live }: { live: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] ${
        live ? "bg-gold/15 text-gold" : "bg-bone/[0.07] text-bone/45"
      }`}
    >
      <Check size={11} strokeWidth={3} />
      {live ? "Live on site" : "Defaults"}
    </span>
  );
}
