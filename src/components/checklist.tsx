"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { discountLabel, ideaHref, type ListCity } from "@/data/cities";
import { OfferPhoto } from "./offer-photo";

const KEY = (slug: string) => `ngvng:checklist:${slug}`;

/** Состояние чек-листа хранится только в этом браузере */
export function useChecklist(slug: string, size: number) {
  const [done, setDone] = useState<boolean[]>(() => Array(size).fill(false));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY(slug));
      if (!raw) return;
      const parsed = JSON.parse(raw) as boolean[];
      // восстанавливаем отметки после гидратации, на сервере localStorage нет
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(parsed)) setDone(Array.from({ length: size }, (_, i) => !!parsed[i]));
    } catch {
      /* хранилище недоступно, работаем без него */
    }
    const sync = (e: StorageEvent) => {
      if (e.key !== KEY(slug) || !e.newValue) return;
      try {
        setDone(JSON.parse(e.newValue));
      } catch {}
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [slug, size]);

  const toggle = useCallback(
    (i: number) =>
      setDone((prev) => {
        const next = prev.map((v, j) => (j === i ? !v : v));
        try {
          localStorage.setItem(KEY(slug), JSON.stringify(next));
        } catch {}
        return next;
      }),
    [slug],
  );

  const reset = useCallback(() => {
    setDone(Array(size).fill(false));
    try {
      localStorage.removeItem(KEY(slug));
    } catch {}
  }, [slug, size]);

  return { done, toggle, reset, count: done.filter(Boolean).length };
}

export function Progress({ done, tone = "light" }: { done: boolean[]; tone?: "light" | "dark" }) {
  const count = done.filter(Boolean).length;
  const total = done.length;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className={`text-sm font-medium ${tone === "dark" ? "text-paper/80" : "text-mist"}`}>
          Отмечено <span className={tone === "dark" ? "text-paper" : "text-ink"}>{count}</span> из {total}
        </p>
        <AnimatePresence mode="wait">
          {count === total && (
            <motion.p
              key="ready"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-semibold ${tone === "dark" ? "text-paper" : "text-blue-deep"}`}
            >
              Чемодан собран
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3 flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count} aria-label="Сколько идей отмечено">
        {done.map((d, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
              d ? (tone === "dark" ? "bg-paper" : "bg-blue") : tone === "dark" ? "bg-paper/25" : "bg-ink/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function IdeasList({
  city,
  done,
  toggle,
  columns = 2,
}: {
  city: ListCity;
  done: boolean[];
  toggle: (i: number) => void;
  columns?: 1 | 2;
}) {
  return (
    <ul className={`grid grid-cols-1 gap-3 ${columns === 2 ? "md:grid-cols-2" : ""}`}>
      {city.ideas.map((idea, i) => {
        const href = ideaHref(city, idea);
        const discount = discountLabel(idea);
        const id = `${city.slug}-idea-${i}`;
        const checked = done[i];
        return (
          <motion.li
            key={id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`group/idea relative flex min-w-0 flex-col rounded-[22px] border bg-paper transition-[border-color,box-shadow] duration-300 ${
              checked ? "border-blue/40" : "border-line hover:border-ink/15 hover:shadow-[0_18px_40px_-24px_rgba(22,22,22,0.35)]"
            }`}
          >
            <label htmlFor={id} className="flex cursor-pointer items-start gap-4 p-5 pb-4">
              <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggle(i)} />
              <span
                aria-hidden
                className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 ${
                  checked ? "scale-105 border-blue bg-blue text-ink" : "border-ink/20 text-transparent group-hover/idea:border-blue/60"
                }`}
              >
                <Check className="size-4" strokeWidth={3} />
              </span>
              <span className={`min-w-0 text-[17px] font-medium leading-[1.3] transition-colors ${checked ? "text-ink/45 line-through decoration-blue/60 decoration-2" : "text-ink"}`}>
                {idea.text}
              </span>
            </label>
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener"
                className="group/t mx-3 mb-3 mt-auto grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 rounded-2xl bg-blush p-3.5 transition-colors duration-300 hover:bg-blue sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              >
                <span className="col-span-2 mb-2 overflow-hidden rounded-xl sm:col-span-3">
                  <OfferPhoto href={idea.href} alt={idea.ticket ?? idea.text} />
                </span>
                {discount ? (
                  <span className="w-fit rounded-lg bg-blue px-2 py-1 font-display text-[15px] leading-none text-ink transition-colors duration-300 group-hover/t:bg-ink group-hover/t:text-paper">
                    {discount}
                  </span>
                ) : (
                  <span />
                )}
                <span className="col-span-2 row-start-3 min-w-0 text-[15px] font-semibold leading-snug sm:col-span-1 sm:row-auto">{idea.ticket ?? "Билет на Горбилете"}</span>
                <span className="col-start-2 row-start-2 grid size-8 place-items-center rounded-full bg-paper text-ink transition-colors duration-300 group-hover/t:bg-ink group-hover/t:text-paper sm:col-start-auto sm:row-auto">
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/t:-translate-y-0.5 group-hover/t:translate-x-0.5" />
                </span>
                {idea.note && <span className="col-span-2 text-[13px] leading-snug text-ink/70 sm:col-span-3">{idea.note}</span>}
                <span className="sr-only">. Купить билет со скидкой на Горбилете, откроется в новой вкладке</span>
              </a>
            )}
          </motion.li>
        );
      })}
    </ul>
  );
}
