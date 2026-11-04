"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { cities, leadHref, type City, type ListCity } from "@/data/cities";
import { IdeasList, Progress, useChecklist } from "./checklist";
import { SplitFlap } from "./motion";

const ease = [0.16, 1, 0.3, 1] as const;

export function Departures() {
  const [open, setOpen] = useState<string | null>(null);

  // открыть город по якорю, например /#kazan из меню или из карты
  useEffect(() => {
    const fromHash = () => {
      const slug = location.hash.slice(1);
      if (cities.some((c) => c.slug === slug && c.kind === "list")) setOpen(slug);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <div role="list" className="border-t-2 border-ink">
      <div aria-hidden className="hidden grid-cols-12 gap-6 border-b border-line py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-mist md:grid">
        <span className="col-span-2">Рейс</span>
        <span className="col-span-5">Направление</span>
        <span className="col-span-3">Что ждёт</span>
        <span className="col-span-2 text-right">Посадка</span>
      </div>
      {cities.map((c, i) => (
        <Row key={c.slug} city={c} index={i} open={open === c.slug} onToggle={() => setOpen((o) => (o === c.slug ? null : c.slug))} />
      ))}
    </div>
  );
}

function Codes({ code, delay }: { code: string; delay: number }) {
  return (
    <SplitFlap
      text={code}
      cells
      delay={delay}
      className="flex gap-1"
      cellClassName="relative grid h-9 w-7 place-items-center overflow-hidden rounded-md bg-ink font-display text-[15px] text-paper after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-paper/15 sm:h-10 sm:w-8 sm:text-base"
    />
  );
}

function Row({ city, index, open, onToggle }: { city: City; index: number; open: boolean; onToggle: () => void }) {
  const reduce = useReducedMotion();
  const isList = city.kind === "list";
  const panelId = `panel-${city.slug}`;

  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 -z-10 origin-left bg-blue transition-transform duration-700 ease-out-expo ${
          open ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        }`}
      />
      <span className="col-span-12 flex items-center justify-between md:col-span-2 md:justify-start">
        <Codes code={city.code} delay={0.1 * index} />
        <span className="md:hidden">
          <Action isList={isList} open={open} />
        </span>
      </span>
      <span
        className={`display col-span-12 text-[clamp(1.6rem,7.4vw,2.6rem)] transition-colors duration-500 md:col-span-5 md:text-[clamp(1.5rem,2.7vw,2.9rem)] ${
          open ? "text-blue-deep" : ""
        }`}
      >
        {city.name}
      </span>
      <span className="col-span-12 text-[15px] leading-snug text-mist transition-colors duration-500 group-hover:text-ink/80 md:col-span-3 md:text-base">
        {city.tagline}
      </span>
      <span className="col-span-2 hidden items-center justify-end gap-3 md:flex">
        <span
          className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold transition-colors duration-500 ${
            open ? "bg-blue text-ink" : "bg-blush text-blue-deep group-hover:bg-paper"
          }`}
        >
          {isList ? `${(city as ListCity).ideas.length} идей` : "Готовый гид"}
        </span>
        <Action isList={isList} open={open} />
      </span>
    </>
  );

  const rowCls =
    "group relative isolate grid w-full grid-cols-12 items-center gap-x-6 gap-y-3 overflow-hidden px-1 py-6 text-left outline-none md:py-7";

  return (
    <motion.div
      role="listitem"
      id={city.slug}
      className={`-mx-3 border-b border-line px-3 transition-colors duration-500 sm:-mx-6 sm:px-6 ${open ? "rounded-b-[28px] bg-blush" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, delay: index * 0.06, ease }}
    >
      {isList ? (
        <h3>
          <button type="button" className={rowCls} aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
            {inner}
          </button>
        </h3>
      ) : (
        <h3>
          <a href={leadHref(city)} target="_blank" rel="noopener" className={rowCls}>
            {inner}
            <span className="sr-only">. Откроется гид в новой вкладке</span>
          </a>
        </h3>
      )}

      {isList && (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              role="region"
              aria-label={`Идеи для поездки, ${city.name}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.7, ease }}
              className="overflow-hidden"
            >
              <Panel city={city as ListCity} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

function Action({ isList, open }: { isList: boolean; open: boolean }) {
  return (
    <span
      aria-hidden
      className={`grid size-11 shrink-0 place-items-center rounded-full transition-all duration-500 ease-out-expo ${
        open ? "bg-blue text-ink" : "bg-ink text-paper group-hover:bg-paper group-hover:text-ink"
      }`}
    >
      {isList ? (
        <Plus className={`size-5 transition-transform duration-500 ease-out-expo ${open ? "rotate-45" : "group-hover:rotate-90"}`} />
      ) : (
        <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      )}
    </span>
  );
}

function Panel({ city }: { city: ListCity }) {
  const { done, toggle } = useChecklist(city.slug, city.ideas.length);
  return (
    <div className="grid grid-cols-1 gap-8 px-1 pb-10 pt-2 lg:grid-cols-12 lg:gap-10 lg:pb-14">
      <div className="min-w-0 lg:col-span-4">
        <p className="text-[17px] leading-[1.5] text-ink/80">{city.intro}</p>
        <div className="mt-6">
          <Progress done={done} />
        </div>
        <Link
          href={`/goroda/${city.slug}`}
          className="group mt-7 inline-flex items-center gap-2 border-b-2 border-blue pb-1 font-semibold text-blue-deep"
        >
          Открыть план поездки {city.inName}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="min-w-0 lg:col-span-8">
        <IdeasList city={city} done={done} toggle={toggle} />
      </div>
    </div>
  );
}
