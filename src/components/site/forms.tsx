"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, ArrowUpRight, Download, Play } from "lucide-react";
import { EASE } from "@/components/ui";
import { useSubmissions } from "@/lib/store";

/* --------------------------- newsletter ------------------------------ */

export function NewsletterForm({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  const { recordSubmission } = useSubmissions();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    recordSubmission({
      type: "newsletter",
      purpose: "The Briefing newsletter",
      email,
      summary: `${email} — subscribed to The Briefing`,
      detail: { source: compact ? "Footer" : "Page section" },
    });
    setDone(true);
  };

  if (done) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-2 text-sm ${dark ? "text-brass" : "text-gold"}`}
      >
        <span className={`grid size-6 place-items-center rounded-full ${dark ? "bg-ink text-bone" : "bg-gold text-ink"}`}>
          <Check size={12} strokeWidth={3} />
        </span>
        You&apos;re on the list. Watch your inbox.
      </motion.p>
    );
  }

  return (
    <form onSubmit={submit} className={`flex w-full ${compact ? "" : "max-w-xl"}`}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your work email"
        className={`w-full rounded-l-full border border-r-0 bg-transparent px-5 py-3.5 text-sm outline-none transition-colors placeholder:font-light ${
          dark
            ? "border-ink/25 text-ink placeholder:text-ink/40 focus:border-ink"
            : "border-bone/20 text-bone placeholder:text-bone/35 focus:border-gold"
        }`}
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className={`shrink-0 rounded-r-full border px-5 transition-all duration-300 ${
          dark
            ? "border-ink bg-ink text-bone hover:bg-brass hover:border-brass"
            : "border-gold bg-gold text-ink hover:bg-gold-soft"
        }`}
      >
        <ArrowRight size={16} />
      </button>
    </form>
  );
}

/* ------------------------------ lead form ---------------------------- */

const leadFields = [
  { key: "email", label: "Work Email", type: "email", full: true },
  { key: "first", label: "First name", type: "text", full: false },
  { key: "last", label: "Last name", type: "text", full: false },
  { key: "title", label: "Job Title", type: "text", full: false },
  { key: "company", label: "Company name", type: "text", full: false },
];

export function LeadForm({ dark = false }: { dark?: boolean }) {
  const { recordSubmission } = useSubmissions();
  const [done, setDone] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    recordSubmission({
      type: "contact",
      purpose: "Schedule a call",
      email: values.email ?? "",
      summary: `${values.first ?? ""} ${values.last ?? ""} — ${values.company ?? ""} (Home CTA)`.trim(),
      detail: { ...values, source: "Home page CTA" },
    });
    setDone(true);
  };

  const labelCls = `eyebrow !text-[0.6rem] ${dark ? "text-ink/55" : "text-mist"}`;
  const inputCls = `w-full border-b bg-transparent px-0 py-3 text-[0.95rem] outline-none transition-colors duration-300 placeholder:font-light ${
    dark
      ? "border-ink/25 text-ink placeholder:text-ink/35 focus:border-ink"
      : "border-bone/20 text-bone placeholder:text-bone/30 focus:border-gold"
  }`;

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={`rounded-2xl border p-10 text-center ${dark ? "border-ink/15" : "border-gold/30 bg-gold/[0.06]"}`}
        >
          <span className={`mx-auto grid size-12 place-items-center rounded-full ${dark ? "bg-ink text-bone" : "bg-gold text-ink"}`}>
            <Check size={18} strokeWidth={2.5} />
          </span>
          <p className={`mt-6 font-display text-2xl font-light ${dark ? "text-ink" : "text-bone"}`}>
            Thank you — we&apos;ll be in touch within one business day.
          </p>
          <p className={`mt-2 text-sm ${dark ? "text-ink/55" : "text-bone/50"}`}>
            Your inquiry has been routed to the right team at the studio.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={submit}
          exit={{ opacity: 0, y: -12 }}
          className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2"
        >
          {leadFields.map((f) => (
            <label key={f.key} className={f.full ? "sm:col-span-2" : ""}>
              <span className={labelCls}>
                {f.label} <span className={dark ? "text-brass" : "text-gold"}>*</span>
              </span>
              <input
                type={f.type}
                required
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className={inputCls}
              />
            </label>
          ))}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className={`group inline-flex w-full items-center justify-between rounded-full px-7 py-4 text-sm font-semibold transition-all duration-500 sm:w-auto sm:min-w-72 ${
                dark ? "bg-ink text-bone hover:bg-carbon" : "bg-gold text-ink hover:bg-gold-soft"
              }`}
            >
              Start the conversation
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ------------------------- full contact form ------------------------- */

export const PURPOSE_OPTIONS = [
  "Schedule a call",
  "Request for Information",
  "Request for Proposal",
  "Startup",
  "Partnership Inquiry",
  "Career",
  "PR & Media",
  "Other",
];

export const INDUSTRY_OPTIONS = [
  "Food & Beverage",
  "Personal Care & Beauty",
  "Home & Household",
  "Retail",
  "Health & Wellness",
  "Technology",
  "Other",
];

const consentCopy =
  "Pilot44 is committed to protecting and respecting your privacy, and we'll only use your personal information to administer your account and to provide the products and services you requested from us. From time to time, we would like to contact you about our products and services, as well as other content that may be of interest to you. If you consent to us contacting you for this purpose, please tick below to say how you would like us to contact you.";

export function ContactForm() {
  const { recordSubmission } = useSubmissions();
  const [done, setDone] = useState(false);
  const [v, setV] = useState<Record<string, string>>({ purpose: "", industry: "" });
  const [consent, setConsent] = useState(false);

  const set = (k: string, val: string) => setV((p) => ({ ...p, [k]: val }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    recordSubmission({
      type: "contact",
      purpose: v.purpose || "Other",
      email: v.email ?? "",
      summary: `${v.first ?? ""} ${v.last ?? ""} — ${v.company ?? ""} (${v.purpose ?? "Other"})`.trim(),
      detail: {
        "First Name": v.first ?? "",
        "Last Name": v.last ?? "",
        "Job Title": v.title ?? "",
        Company: v.company ?? "",
        Industry: v.industry || "—",
        "Purpose of Contact": v.purpose,
        Message: v.message ?? "",
        Consent: consent ? "Agreed to communications" : "Not opted in",
      },
    });
    setDone(true);
  };

  const labelCls = "eyebrow !text-[0.6rem] text-mist";
  const inputCls =
    "mt-1 w-full border-b border-ink/25 bg-transparent px-0 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-brass placeholder:text-ink/30";
  const selectCls = `${inputCls} appearance-none`;

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-2xl border border-brass/30 bg-bone p-10 text-center"
        >
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-brass text-white">
            <Check size={18} strokeWidth={2.5} />
          </span>
          <p className="mt-6 font-display text-2xl font-light text-ink">
            Thank you — your message is on its way.
          </p>
          <p className="mt-2 text-sm text-ink/50">
            It&apos;s been tagged as <span className="text-brass">{v.purpose}</span> and routed to the right
            team. Expect a reply within one business day.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={submit}
          exit={{ opacity: 0, y: -12 }}
          className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2"
        >
          <label>
            <span className={labelCls}>First Name <span className="text-gold">*</span></span>
            <input required value={v.first ?? ""} onChange={(e) => set("first", e.target.value)} className={inputCls} />
          </label>
          <label>
            <span className={labelCls}>Last Name <span className="text-gold">*</span></span>
            <input required value={v.last ?? ""} onChange={(e) => set("last", e.target.value)} className={inputCls} />
          </label>
          <label>
            <span className={labelCls}>Work Email <span className="text-gold">*</span></span>
            <input type="email" required value={v.email ?? ""} onChange={(e) => set("email", e.target.value)} className={inputCls} />
          </label>
          <label>
            <span className={labelCls}>Job Title <span className="text-gold">*</span></span>
            <input required value={v.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputCls} />
          </label>
          <label>
            <span className={labelCls}>Company <span className="text-gold">*</span></span>
            <input required value={v.company ?? ""} onChange={(e) => set("company", e.target.value)} className={inputCls} />
          </label>
          <label>
            <span className={labelCls}>Industry</span>
            <select value={v.industry} onChange={(e) => set("industry", e.target.value)} className={selectCls}>
              <option value="">Select an industry…</option>
              {INDUSTRY_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className={labelCls}>Purpose of Contact <span className="text-gold">*</span></span>
            <select required value={v.purpose} onChange={(e) => set("purpose", e.target.value)} className={selectCls}>
              <option value="" disabled>
                Select a purpose…
              </option>
              {PURPOSE_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className={labelCls}>Message <span className="text-gold">*</span></span>
            <textarea
              required
              rows={4}
              value={v.message ?? ""}
              onChange={(e) => set("message", e.target.value)}
              className={`${inputCls} resize-y leading-relaxed`}
            />
          </label>

          {/* consent block — legal copy, do not rewrite without sign-off */}
          <div className="sm:col-span-2">
            <p className="text-[0.7rem] leading-relaxed text-ink/40">{consentCopy}</p>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <span
                className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded border transition-all ${
                  consent ? "border-brass bg-brass text-white" : "border-ink/30 bg-transparent"
                }`}
              >
                {consent && <Check size={11} strokeWidth={3.5} />}
              </span>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="sr-only"
              />
              <span className="text-[0.78rem] leading-relaxed text-ink/65">
                I agree to receive other communications from Pilot44.
              </span>
            </label>
            <p className="mt-3 text-[0.7rem] leading-relaxed text-ink/40">
              You can unsubscribe from these communications at any time. For more information on how to
              unsubscribe, our privacy practices, and how we are committed to protecting and respecting your
              privacy, please review our Privacy Policy.
            </p>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-between rounded-full bg-ink px-8 py-4 text-sm font-semibold text-bone transition-all duration-500 hover:bg-brass sm:w-auto sm:min-w-72"
            >
              Send message
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ gated form --------------------------- */

export function GatedForm({
  ctaLabel,
  resourceType,
  title,
  assetUrl,
  gated,
}: {
  ctaLabel: string;
  resourceType: string;
  title: string;
  assetUrl: string;
  gated: boolean;
}) {
  const { recordSubmission } = useSubmissions();
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const isWatch = resourceType === "webinar";
  const unlocked = done || !gated;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    recordSubmission({
      type: "resource",
      purpose: title,
      email,
      summary: `${email} — ${isWatch ? "watched" : "downloaded"} ${title}`,
      detail: { asset: title, type: resourceType },
    });
    setDone(true);
  };

  const assetButton = (
    <a
      href={assetUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink py-3.5 text-sm font-semibold text-bone transition-colors hover:bg-brass"
    >
      {isWatch ? <Play size={15} /> : <Download size={15} />}
      {isWatch ? "Play the webinar" : "Download now"}
    </a>
  );

  return (
    <AnimatePresence mode="wait">
      {unlocked ? (
        <motion.div
          key="unlocked"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="rounded-2xl border border-brass/30 bg-bone p-8"
        >
          <span className="grid size-11 place-items-center rounded-full bg-brass text-white">
            <Check size={17} strokeWidth={2.5} />
          </span>
          <p className="mt-5 font-display text-xl font-light text-ink">
            {gated ? "Unlocked. Enjoy." : "Free to access."}
          </p>
          <p className="mt-1.5 text-sm text-ink/50">
            {gated ? "A copy has also been sent to your inbox." : "No form required for this resource."}
          </p>
          {assetButton}
        </motion.div>
      ) : (
        <motion.form key="gate" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="space-y-5">
          <label className="block">
            <span className="eyebrow !text-[0.6rem] text-mist">
              Work Email <span className="text-brass">*</span>
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border-b border-ink/25 bg-transparent px-0 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-brass"
            />
          </label>
          {["First name", "Company"].map((label) => (
            <label key={label} className="block">
              <span className="eyebrow !text-[0.6rem] text-mist">
                {label} <span className="text-brass">*</span>
              </span>
              <input
                type="text"
                required
                className="mt-1 w-full border-b border-ink/25 bg-transparent px-0 py-3 text-[0.95rem] text-ink outline-none transition-colors focus:border-brass"
              />
            </label>
          ))}
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-ink py-4 text-sm font-semibold text-bone transition-all duration-500 hover:bg-brass"
          >
            {ctaLabel}
            <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
          </button>
          <p className="text-center text-[0.68rem] leading-relaxed text-ink/35">
            By continuing you agree to our Terms &amp; Privacy Policy.
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
