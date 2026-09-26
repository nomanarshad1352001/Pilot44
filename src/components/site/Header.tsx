"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight, Lock } from "lucide-react";
import { useContent } from "@/lib/store";
import { Container, Logo, EASE } from "@/components/ui";

export function Header() {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink/[0.08] bg-paper/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <Container>
          <div className="flex h-[76px] items-center justify-between">
            <Link href="/" aria-label="Pilot44 home" className="shrink-0">
              <Logo />
            </Link>

            <nav className="hidden items-center gap-9 md:flex">
              {content.nav.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`gold-underline text-[0.8125rem] font-medium tracking-wide transition-colors ${
                      isActive ? "text-brass" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="hidden items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-[0.72rem] font-semibold text-ink/65 transition-all duration-300 hover:border-brass hover:text-brass lg:inline-flex"
              >
                <Lock size={12} />
                Studio Login
              </Link>
              <Link
                href="/contact"
                className="group hidden items-center gap-2 rounded-full border border-ink/20 bg-white/40 py-2.5 pl-5 pr-2.5 text-[0.8125rem] font-semibold text-ink backdrop-blur-sm transition-all duration-500 hover:border-brass hover:text-brass md:inline-flex"
              >
                Contact
                <span className="grid size-7 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 group-hover:rotate-45 group-hover:bg-brass">
                  <ArrowUpRight size={13} strokeWidth={2.2} />
                </span>
              </Link>
              <button
                onClick={() => setOpen(!open)}
                aria-label="Open menu"
                className="grid size-10 place-items-center rounded-full border border-ink/20 text-ink md:hidden"
              >
                {open ? <X size={17} /> : <Menu size={17} />}
              </button>
            </div>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col bg-paper/97 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {content.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between border-b border-ink/10 py-5 font-display text-4xl font-light text-ink"
                  >
                    {item.label}
                    <span className="text-brass">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-auto grid gap-3"
            >
              <Link
                href="/admin"
                className="flex items-center justify-center gap-2 rounded-full border border-ink/20 py-4 text-sm font-semibold text-ink"
              >
                <Lock size={14} /> Studio Login
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-semibold text-bone"
              >
                Contact <ArrowUpRight size={15} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
