"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultContent,
  type AuditEntry,
  type SiteContent,
  type Submission,
} from "@/data/content";

/* ------------------------------------------------------------------ */
/*  Keys                                                               */
/* ------------------------------------------------------------------ */

const CONTENT_KEY = "p44:site-content:v2";
const AUTH_KEY = "p44:auth:v2";
const USERS_KEY = "p44:users:v2";
const SUBS_KEY = "p44:submissions:v1";
const AUDIT_KEY = "p44:audit:v1";
const ATTEMPTS_KEY = "p44:attempts:v1";
const LOGINS_KEY = "p44:lastlogins:v1";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function ls<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function shortHash(): string {
  return Math.random().toString(16).slice(2, 9);
}

/* ------------------------------------------------------------------ */
/*  Content store                                                      */
/* ------------------------------------------------------------------ */

interface ContentCtx {
  content: SiteContent;
  overridesActive: boolean;
  hydrated: boolean;
  publish: (next: SiteContent, meta?: { module: string; action?: string }) => void;
  resetContent: () => void;
}

const Ctx = createContext<ContentCtx | null>(null);

/** Set by the admin shell so publish() can attribute audit entries. */
let auditActor: { name: string; role: string } = { name: "System", role: "system" };
export function setAuditActor(actor: { name: string; role: string }) {
  auditActor = actor;
}

/** Shallow-merge stored overrides over defaults so newly added schema
    keys (socials, faq…) exist even for snapshots saved before they did. */
export function mergeWithDefaults(parsed: SiteContent): SiteContent {
  const d = clone(defaultContent);
  return {
    ...d,
    ...parsed,
    general: { ...d.general, ...(parsed.general ?? {}) },
    home: { ...d.home, ...(parsed.home ?? {}) },
    about: { ...d.about, ...(parsed.about ?? {}) },
    legal: {
      terms: parsed.legal?.terms ?? d.legal.terms,
      privacy: parsed.legal?.privacy ?? d.legal.privacy,
    },
    socials: Array.isArray(parsed.socials) ? parsed.socials : d.socials,
  };
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [overridesActive, setOverridesActive] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const parsed = ls<SiteContent>(CONTENT_KEY);
    if (parsed && parsed.general && parsed.home && Array.isArray(parsed.posts)) {
      setContent(mergeWithDefaults(parsed));
      setOverridesActive(true);
    }
    setHydrated(true);
  }, []);

  const publish = useCallback((next: SiteContent, meta?: { module: string; action?: string }) => {
    setContent((prev) => {
      const stamped = { ...next, publishedAt: new Date().toISOString() };
      lsSet(CONTENT_KEY, stamped);
      // audit trail with snapshot of previous version for one-click revert
      const entry: AuditEntry = {
        id: `a${Date.now().toString(36)}`,
        at: stamped.publishedAt!,
        actor: auditActor.name,
        role: auditActor.role,
        action: meta?.action ?? "Published changes",
        module: meta?.module ?? "Site",
        commit: shortHash(),
        snapshot: clone(prev),
      };
      const log = [entry, ...(ls<AuditEntry[]>(AUDIT_KEY) ?? [])].slice(0, 25);
      lsSet(AUDIT_KEY, log);
      return stamped;
    });
    setOverridesActive(true);
  }, []);

  const resetContent = useCallback(() => {
    const fresh = { ...clone(defaultContent), publishedAt: new Date().toISOString() };
    setContent(fresh);
    try {
      window.localStorage.removeItem(CONTENT_KEY);
    } catch {
      /* ignore */
    }
    setOverridesActive(false);
  }, []);

  const value = useMemo(
    () => ({ content, overridesActive, hydrated, publish, resetContent }),
    [content, overridesActive, hydrated, publish, resetContent]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent(): ContentCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Auth — roles: super / editor / author / viewer                     */
/* ------------------------------------------------------------------ */

export type Role = "super" | "editor" | "author" | "viewer";

export const ROLE_LABELS: Record<Role, string> = {
  super: "Super Admin",
  editor: "Editor",
  author: "Author",
  viewer: "Viewer",
};

export interface Session {
  name: string;
  email: string;
  role: Role;
}

export interface PanelUser {
  email: string;
  password: string;
  name: string;
  role: Role;
  active: boolean;
  builtin?: boolean;
}

export const BUILTIN_USERS: PanelUser[] = [
  {
    email: "admin@pilot44.com",
    password: "studio-admin",
    name: "Ava Sterling",
    role: "super",
    active: true,
    builtin: true,
  },
];

/** Demo 2FA code required for Super Admin sign-in. */
export const DEMO_2FA_CODE = "440044";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 60_000;

interface LoginResult {
  outcome: "ok" | "2fa" | "invalid" | "locked";
  lockRemainingMs?: number;
}

interface AuthCtx {
  session: Session | null;
  ready: boolean;
  pending2FA: Session | null;
  login: (email: string, password: string) => LoginResult;
  verify2FA: (code: string) => boolean;
  cancel2FA: () => void;
  logout: () => void;
  lockUntil: number;
  users: PanelUser[];
  inviteUser: (u: Omit<PanelUser, "builtin">) => void;
  removeUser: (email: string) => void;
  setUserRole: (email: string, role: Role) => void;
  setUserActive: (email: string, active: boolean) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [pending2FA, setPending2FA] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [lockUntil, setLockUntil] = useState(0);
  const [users, setUsers] = useState<PanelUser[]>(BUILTIN_USERS);

  useEffect(() => {
    const s = ls<Session>(AUTH_KEY);
    if (s) {
      const adminSession: Session = { ...s, role: "super" };
      setSession(adminSession);
      lsSet(AUTH_KEY, adminSession);
    }
    const invited = ls<PanelUser[]>(USERS_KEY);
    if (invited) {
      setUsers(mergeUsers(invited));
    }
    const attempts = ls<{ lockUntil: number }>(ATTEMPTS_KEY);
    if (attempts && attempts.lockUntil > Date.now()) setLockUntil(attempts.lockUntil);
    setReady(true);
  }, []);

  function mergeUsers(custom: PanelUser[]): PanelUser[] {
    const customByEmail = new Map(custom.map((u) => [u.email.toLowerCase(), u]));
    const builtins = BUILTIN_USERS.map((b) => {
      const over = customByEmail.get(b.email.toLowerCase());
      return over ? { ...b, role: over.role, active: over.active } : b;
    });
    const invited = custom.filter((u) => !BUILTIN_USERS.some((b) => b.email.toLowerCase() === u.email.toLowerCase()));
    return [...builtins, ...invited];
  }

  const persistCustom = (all: PanelUser[]) => {
    // store invited users + any role/active overrides of builtins
    const nonDefault = all.filter((u) => {
      const builtin = BUILTIN_USERS.find((b) => b.email.toLowerCase() === u.email.toLowerCase());
      if (!builtin) return true;
      return builtin.role !== u.role || builtin.active !== u.active;
    });
    lsSet(USERS_KEY, nonDefault);
  };

  const recordFailure = () => {
    const attempts = ls<{ count: number; lockUntil: number }>(ATTEMPTS_KEY) ?? { count: 0, lockUntil: 0 };
    const count = attempts.count + 1;
    const lock = count >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : 0;
    lsSet(ATTEMPTS_KEY, { count: lock ? 0 : count, lockUntil: lock });
    if (lock) setLockUntil(lock);
  };

  const clearFailures = () => lsSet(ATTEMPTS_KEY, { count: 0, lockUntil: 0 });

  const login = useCallback(
    (email: string, password: string): LoginResult => {
      const now = Date.now();
      const locked = lockUntil > now;
      if (locked) return { outcome: "locked", lockRemainingMs: lockUntil - now };

      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password &&
          u.active
      );
      if (!user) {
        recordFailure();
        return { outcome: "invalid" };
      }
      clearFailures();
      const s: Session = { name: user.name, email: user.email, role: user.role };
      if (user.role === "super") {
        setPending2FA(s);
        return { outcome: "2fa" };
      }
      completeLogin(s);
      return { outcome: "ok" };
    },
    [users, lockUntil]
  );

  const completeLogin = (s: Session) => {
    setSession(s);
    lsSet(AUTH_KEY, s);
    setAuditActor({ name: s.name, role: s.role });
    const logins = ls<Record<string, string>>(LOGINS_KEY) ?? {};
    logins[s.email.toLowerCase()] = new Date().toISOString();
    lsSet(LOGINS_KEY, logins);
  };

  const verify2FA = useCallback(
    (code: string) => {
      if (!pending2FA) return false;
      if (code.trim() !== DEMO_2FA_CODE) return false;
      completeLogin(pending2FA);
      setPending2FA(null);
      return true;
    },
    [pending2FA]
  );

  const cancel2FA = useCallback(() => setPending2FA(null), []);

  const logout = useCallback(() => {
    setSession(null);
    try {
      window.localStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const inviteUser = useCallback((u: Omit<PanelUser, "builtin">) => {
    setUsers((prev) => {
      const next = [...prev, u];
      persistCustom(next);
      return next;
    });
  }, []);

  const setUserRole = useCallback((email: string, role: Role) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.email === email ? { ...u, role } : u));
      persistCustom(next);
      return next;
    });
  }, []);

  const setUserActive = useCallback((email: string, active: boolean) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.email === email ? { ...u, active } : u));
      persistCustom(next);
      return next;
    });
  }, []);

  const removeUser = useCallback((email: string) => {
    setUsers((prev) => {
      const next = prev.filter((u) => u.email !== email || u.builtin);
      persistCustom(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      session, ready, pending2FA, login, verify2FA, cancel2FA, logout,
      lockUntil, users, inviteUser, removeUser, setUserRole, setUserActive,
    }),
    [session, ready, pending2FA, login, verify2FA, cancel2FA, logout, lockUntil, users, inviteUser, removeUser, setUserRole, setUserActive]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Form submissions log (contact / newsletter / resource / career)    */
/* ------------------------------------------------------------------ */

interface SubsCtx {
  submissions: Submission[];
  recordSubmission: (s: Omit<Submission, "id" | "createdAt" | "slack" | "pipedrive">) => void;
  resendSync: (id: string) => void;
  deleteSubmission: (id: string) => void;
  clearSubmissions: () => void;
}

const SubsContext = createContext<SubsCtx | null>(null);

const seedSubmissions: Submission[] = [
  {
    id: "seed1",
    type: "contact",
    purpose: "Request for Proposal",
    email: "k.morrison@brighthousefoods.com",
    summary: "Kate Morrison — Brighthouse Foods (Request for Proposal)",
    detail: { company: "Brighthouse Foods", industry: "Food & Beverage", message: "RFP for 2026 innovation portfolio support…", purpose: "Request for Proposal" },
    createdAt: "2026-01-30T14:22:00.000Z",
    slack: "synced",
    pipedrive: "synced",
  },
  {
    id: "seed2",
    type: "resource",
    purpose: "The 2030 Consumer — Foresight Report",
    email: "dev.patel@aurorabeauty.com",
    summary: "Dev Patel — downloaded The 2030 Consumer report",
    detail: { company: "Aurora Beauty", asset: "consumer-2030-report" },
    createdAt: "2026-01-31T09:05:00.000Z",
    slack: "failed",
    pipedrive: "synced",
  },
];

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const stored = ls<Submission[]>(SUBS_KEY);
    if (stored) setSubmissions(stored);
    else {
      setSubmissions(seedSubmissions);
      lsSet(SUBS_KEY, seedSubmissions);
    }
  }, []);

  const recordSubmission = useCallback(
    (s: Omit<Submission, "id" | "createdAt" | "slack" | "pipedrive">) => {
      const entry: Submission = {
        ...s,
        id: `s${Date.now().toString(36)}${Math.floor(Math.random() * 99)}`,
        createdAt: new Date().toISOString(),
        slack: "synced",
        pipedrive: "synced",
      };
      setSubmissions((prev) => {
        const next = [entry, ...prev];
        lsSet(SUBS_KEY, next);
        return next;
      });
    },
    []
  );

  const resendSync = useCallback((id: string) => {
    setSubmissions((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, slack: "synced" as const, pipedrive: "synced" as const } : p));
      lsSet(SUBS_KEY, next);
      return next;
    });
  }, []);

  const deleteSubmission = useCallback((id: string) => {
    setSubmissions((prev) => {
      const next = prev.filter((p) => p.id !== id);
      lsSet(SUBS_KEY, next);
      return next;
    });
  }, []);

  const clearSubmissions = useCallback(() => {
    setSubmissions([]);
    lsSet(SUBS_KEY, []);
  }, []);

  const value = useMemo(
    () => ({ submissions, recordSubmission, resendSync, deleteSubmission, clearSubmissions }),
    [submissions, recordSubmission, resendSync, deleteSubmission, clearSubmissions]
  );
  return <SubsContext.Provider value={value}>{children}</SubsContext.Provider>;
}

export function useSubmissions(): SubsCtx {
  const ctx = useContext(SubsContext);
  if (!ctx) throw new Error("useSubmissions must be used inside SubmissionsProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Audit log access (reads what publish() writes)                     */
/* ------------------------------------------------------------------ */

export function readAuditLog(): AuditEntry[] {
  return ls<AuditEntry[]>(AUDIT_KEY) ?? [];
}

export function deleteAuditEntry(id: string): void {
  lsSet(AUDIT_KEY, readAuditLog().filter((e) => e.id !== id));
}

export function clearAuditLog(): void {
  lsSet(AUDIT_KEY, []);
}

/** email -> ISO timestamp of last successful sign-in. */
export function readLastLogins(): Record<string, string> {
  return ls<Record<string, string>>(LOGINS_KEY) ?? {};
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ContentProvider>
      <AuthProvider>
        <SubmissionsProvider>{children}</SubmissionsProvider>
      </AuthProvider>
    </ContentProvider>
  );
}
