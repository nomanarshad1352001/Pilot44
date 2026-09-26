"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ShieldCheck, Eye, EyeOff, Lock, MailCheck, KeyRound, Timer } from "lucide-react";
import { useAuth, BUILTIN_USERS, DEMO_2FA_CODE } from "@/lib/store";
import { Logo, EASE } from "@/components/ui";

type Stage = "credentials" | "2fa" | "forgot" | "forgotSent";

export function AdminLogin() {
  const { login, verify2FA, cancel2FA, pending2FA, lockUntil } = useAuth();
  const [stage, setStage] = useState<Stage>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // rate-limit countdown
  useEffect(() => {
    const tick = () => {
      const remain = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));
      setCountdown(remain);
    };
    tick();
    const t = window.setInterval(tick, 1000);
    return () => window.clearInterval(t);
  }, [lockUntil]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.outcome === "2fa") setStage("2fa");
    else if (res.outcome === "invalid") setError("Those credentials don't match any active studio account.");
    else if (res.outcome === "locked") setError("");
  };

  const submit2FA = (e: FormEvent) => {
    e.preventDefault();
    if (!verify2FA(code)) setError("Incorrect verification code.");
  };

  const locked = countdown > 0;

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-2">
      {/* brand side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="https://images.pexels.com/photos/9881353/pexels-photo-9881353.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt="Studio installation"
          className="img-duotone absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-paper via-paper/85 to-paper/40" />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(176,138,62,0.28), transparent 62%)" }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo />
          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
              className="eyebrow text-gold"
            >
              Studio Control
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.35 }}
              className="mt-6 max-w-md font-display text-[3.4rem] font-light leading-[1.05] text-ink"
            >
              Run the site <em className="italic text-gold">without a developer.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
              className="mt-6 max-w-sm text-sm font-light leading-relaxed text-ink/55"
            >
              Edit pages, publish insights, triage form submissions — every change is permission-checked,
              instantly live, and always reversible.
            </motion.p>
          </div>
          <p className="text-[0.68rem] uppercase tracking-[0.14em] text-ink/35">Pilot44 · Admin Panel v2.0</p>
        </div>
      </div>

      {/* form side */}
      <div className="relative flex items-center justify-center px-6 py-16">
        <a
          href="/"
          className="group absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[0.68rem] font-semibold text-ink/50 transition-all duration-300 hover:border-gold hover:text-gold md:left-10 md:top-8"
        >
          <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to site
        </a>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="w-full max-w-md pt-10 md:pt-0"
        >
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>

          <AnimatePresence mode="wait">
            {stage === "credentials" && (
              <motion.div key="creds" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.4 }}>
                <p className="eyebrow text-gold">Welcome back</p>
                <h2 className="mt-4 font-display text-3xl font-light text-ink">Sign in to Studio Control</h2>

                {locked ? (
                  <div className="mt-10 flex items-start gap-4 rounded-xl border border-red-400/30 bg-red-400/[0.07] p-6">
                    <Timer size={18} className="mt-0.5 shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-ink">Too many failed attempts</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink/50">
                        For security, sign-in is paused. Try again in{" "}
                        <span className="font-mono2 text-gold">{countdown}s</span>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-10 space-y-6">
                    <label className="block">
                      <span className="eyebrow !text-[0.6rem] text-mist">Email</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="you@pilot44.com"
                        className="mt-1.5 w-full rounded-lg border border-ink/15 bg-ink/[0.04] px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-gold"
                      />
                    </label>
                    <label className="block">
                      <span className="eyebrow !text-[0.6rem] text-mist">Password</span>
                      <span className="relative mt-1.5 block">
                        <input
                          type={showPw ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          placeholder="••••••••••••"
                          className="w-full rounded-lg border border-ink/15 bg-ink/[0.04] px-4 py-3.5 pr-12 text-sm text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-gold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-gold"
                          aria-label="Toggle password visibility"
                        >
                          {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </span>
                    </label>

                    {error && (
                      <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-600">
                        <Lock size={13} /> {error}
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-gold py-4 text-sm font-semibold text-white transition-colors hover:bg-gold-soft"
                    >
                      Continue
                      <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setStage("forgot")}
                      className="w-full text-center text-xs text-ink/40 transition-colors hover:text-gold"
                    >
                      Forgot your password?
                    </button>
                  </form>
                )}

                {/* demo accounts */}
                {!locked && (
                  <div className="mt-10">
                    <p className="eyebrow !text-[0.58rem] text-ink/30">Demo accounts — click to autofill</p>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {BUILTIN_USERS.map((u) => (
                        <button
                          key={u.email}
                          onClick={() => { setEmail(u.email); setPassword(u.password); setError(""); }}
                          className="group rounded-xl border border-ink/10 bg-ink/[0.03] p-3.5 text-left transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.05]"
                        >
                          <span className="flex items-center gap-2 text-xs font-semibold text-ink">
                            {u.role === "super" ? <ShieldCheck size={12} className="text-gold" /> : <KeyRound size={12} className="text-gold" />}
                            {u.name}
                          </span>
                          <span className="mt-1 block font-mono2 text-[0.62rem] text-ink/40">{u.email}</span>
                          <span className="mt-2 inline-block rounded-full bg-ink/[0.06] px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-gold">
                            Administrator
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {stage === "2fa" && (
              <motion.div key="2fa" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.4 }}>
                <span className="grid size-12 place-items-center rounded-full border border-gold/40 text-gold">
                  <ShieldCheck size={20} />
                </span>
                <h2 className="mt-6 font-display text-3xl font-light text-ink">Two-factor verification</h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-ink/50">
                  Super Admin accounts require a verification code{pending2FA ? ` — sent to ${pending2FA.email}` : ""}.
                </p>
                <p className="mt-3 rounded-lg border border-gold/25 bg-gold/[0.06] px-4 py-3 text-xs text-gold/90">
                  Demo mode: your authenticator code is <span className="font-mono2 font-semibold">{DEMO_2FA_CODE}</span>
                </p>

                <form onSubmit={submit2FA} className="mt-8 space-y-6">
                  <label className="block">
                    <span className="eyebrow !text-[0.6rem] text-mist">6-digit code</span>
                    <input
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                      placeholder="••••••"
                      className="mt-1.5 w-full rounded-lg border border-ink/15 bg-ink/[0.04] px-4 py-3.5 text-center font-mono2 text-lg tracking-[0.5em] text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-gold"
                    />
                  </label>
                  {error && (
                    <p className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs text-red-600">
                      <Lock size={13} /> {error}
                    </p>
                  )}
                  <button type="submit" className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gold py-4 text-sm font-semibold text-white transition-colors hover:bg-gold-soft">
                    Verify &amp; sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => { cancel2FA(); setStage("credentials"); setCode(""); }}
                    className="flex w-full items-center justify-center gap-2 text-xs text-ink/40 transition-colors hover:text-gold"
                  >
                    <ArrowLeft size={12} /> Back to sign-in
                  </button>
                </form>
              </motion.div>
            )}

            {stage === "forgot" && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.4 }}>
                <p className="eyebrow text-gold">Password reset</p>
                <h2 className="mt-4 font-display text-3xl font-light text-ink">Forgot your password?</h2>
                <p className="mt-3 text-sm font-light leading-relaxed text-ink/50">
                  Enter your studio email and we&apos;ll send you a secure reset link.
                </p>
                <form
                  onSubmit={(e) => { e.preventDefault(); setStage("forgotSent"); }}
                  className="mt-8 space-y-6"
                >
                  <label className="block">
                    <span className="eyebrow !text-[0.6rem] text-mist">Email</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@pilot44.com"
                      className="mt-1.5 w-full rounded-lg border border-ink/15 bg-ink/[0.04] px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-gold"
                    />
                  </label>
                  <button type="submit" className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gold py-4 text-sm font-semibold text-white transition-colors hover:bg-gold-soft">
                    Send reset link
                  </button>
                  <button
                    type="button"
                    onClick={() => setStage("credentials")}
                    className="flex w-full items-center justify-center gap-2 text-xs text-ink/40 transition-colors hover:text-gold"
                  >
                    <ArrowLeft size={12} /> Back to sign-in
                  </button>
                </form>
              </motion.div>
            )}

            {stage === "forgotSent" && (
              <motion.div key="sent" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.4 }} className="text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                  <MailCheck size={22} />
                </span>
                <h2 className="mt-6 font-display text-3xl font-light text-ink">Check your inbox</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm font-light leading-relaxed text-ink/50">
                  If <span className="text-ink">{email}</span> matches a studio account, a reset link is on its
                  way. It expires in 30 minutes.
                </p>
                <button
                  onClick={() => setStage("credentials")}
                  className="mx-auto mt-8 flex items-center justify-center gap-2 rounded-full border border-ink/15 px-6 py-3 text-xs font-semibold text-ink/60 transition-colors hover:border-gold hover:text-gold"
                >
                  <ArrowLeft size={12} /> Back to sign-in
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
