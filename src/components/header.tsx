"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { nav, site } from "@/lib/site";
import { cities } from "@/data/cities";

const ease = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const light = solid && !open;

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[70] -translate-y-24 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink focus:translate-y-0"
      >
        Перейти к содержанию
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={`mx-auto flex h-14 max-w-[1360px] items-center justify-between rounded-full pl-5 pr-2 transition-[background-color,box-shadow,color] duration-500 ease-out-expo sm:h-16 sm:pl-7 ${
            light
              ? "bg-ink/90 text-paper shadow-[0_10px_40px_-12px_rgba(22,22,22,0.25)] backdrop-blur-xl"
              : "bg-transparent text-ink"
          }`}
        >
          <Link href="/" aria-label="Новый год в новом городе. На главную" className="shrink-0" onClick={() => setOpen(false)}>
            <Logo className="h-[18px] w-auto text-paper sm:h-[22px]" />
          </Link>

          <nav aria-label="Основная навигация" className="hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                  light ? "text-paper/90 hover:bg-paper/10" : "text-ink hover:bg-paper/25"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.gorbilet}
              target="_blank"
              rel="noopener"
              className={`group hidden items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold transition-colors sm:inline-flex ${
                light ? "bg-blue text-ink hover:bg-paper" : "bg-ink text-paper hover:bg-paper hover:text-ink"
              }`}
            >
              На Горбилет
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              className={`grid size-11 place-items-center rounded-full transition-colors lg:hidden ${
                light ? "bg-blue text-ink" : "bg-ink text-paper"
              }`}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-blue text-ink lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.7, ease }}
          >
            <nav aria-label="Мобильная навигация" className="shell flex flex-1 flex-col pt-28">
              <ul className="grid gap-1">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
                  >
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname === n.href ? "page" : undefined}
                      className="display block border-b border-ink/15 py-4 text-[clamp(1.6rem,8vw,2.6rem)]"
                    >
                      {n.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
              >
                <p className="text-sm font-medium text-ink/70">Направления</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cities.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.kind === "list" ? `/goroda/${c.slug}` : `/#${c.slug}`}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-ink/25 px-4 py-2 text-[15px] font-medium"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
              <div className="mt-auto pb-10 pt-12">
                <a
                  href={site.gorbilet}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-between rounded-full bg-ink px-6 py-4 font-semibold text-paper"
                >
                  Все билеты на Горбилете
                  <ArrowUpRight className="size-5" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
