"use client";

import { useAuth } from "@/lib/store";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default function AdminRoute() {
  const { session, ready } = useAuth();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink">
        <div className="flex flex-col items-center gap-4">
          <span className="size-8 animate-spin rounded-full border-2 border-bone/15 border-t-gold" />
          <p className="eyebrow !text-[0.58rem] text-bone/40">Loading Studio Control</p>
        </div>
      </div>
    );
  }

  return session ? <AdminPanel /> : <AdminLogin />;
}
