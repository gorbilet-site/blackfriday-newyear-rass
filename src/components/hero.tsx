"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { MaskLines } from "./motion";
import { BoardingPass } from "./boarding-pass";
import { cities } from "@/data/cities";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;
const MotionLink = motion.create(Link);

/** Проекция координат в систему viewBox 1000 × 360 */
const W = 1000;
const H = 360;
const project = (lon: number, lat: number) => ({
  x: ((lon - 18) / 34) * W,
  y: ((61 - lat) / 8) * H,
});

const order = ["kaliningrad", "peterburg", "moskva", "nizhnij-novgorod", "kazan"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const passY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);

  const pts = order.map((slug) => {
    const c = cities.find((x) => x.slug === slug)!;
    return { c, ...project(c.lon, c.lat) };
  });
  const [k, l, m, n, z] = pts;
  const route = `M${k.x} ${k.y} C ${k.x + 70} ${k.y - 170}, ${l.x - 120} ${l.y + 10}, ${l.x} ${l.y} C ${l.x + 110} ${l.y - 8}, ${m.x - 60} ${m.y - 90}, ${m.x} ${m.y} C ${m.x + 60} ${m.y + 70}, ${n.x - 70} ${n.y - 50}, ${n.x} ${n.y} C ${n.x + 60} ${n.y + 45}, ${z.x - 70} ${z.y - 40}, ${z.x} ${z.y}`;

  return (
    <section ref={ref} className="grain relative isolate overflow-hidden bg-blue text-ink">
      {/* мягкая глубина фона: только оттенки фирменного красного */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[20%] -top-[30%] size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_60%)]" />
        <div className="absolute -bottom-[40%] -left-[20%] size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(20,80,190,0.35),transparent_65%)]" />
      </div>

      <div className="shell relative pt-28 sm:pt-36 lg:pt-40">
        <motion.p
          className="inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-paper/30 py-1.5 pl-2 pr-4 text-[13px] font-medium backdrop-blur sm:text-sm"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <span className="whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-paper">
            Black Friday
          </span>
          {site.tagline}
        </motion.p>

        <div className="relative mt-7 sm:mt-10">
          <motion.h1 style={{ y: titleY }} className="display relative z-10 text-[clamp(2rem,11.4vw,9.6rem)] lg:text-[clamp(5rem,8.6vw,9.6rem)]">
            <MaskLines onLoad delay={0.15} lines={["Новый год", "в новом", "городе"]} />
          </motion.h1>

          <motion.div
            style={{ y: passY }}
            className="pointer-events-none absolute right-0 top-[2em] z-20 hidden w-[min(380px,30vw)] text-[clamp(5rem,8.6vw,9.6rem)] lg:block"
            initial={reduce ? false : { opacity: 0, rotate: 14, x: 80 }}
            animate={{ opacity: 1, rotate: 0, x: 0 }}
            transition={{ duration: 1.3, delay: 0.5, ease }}
          >
            <div className="pointer-events-auto animate-float text-base [--r:4deg]">
              <BoardingPass />
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:mt-10 sm:flex-row sm:items-end sm:justify-between lg:max-w-[52%]">
          <motion.p
            className="max-w-sm text-lg font-medium leading-[1.35] text-ink/85 sm:text-xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
          >
            {site.lead}. Выбирайте город, отмечайте идеи и покупайте билеты дешевле.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease }}
            className="shrink-0"
          >
            <Link
              href="#kuda"
              className="group relative inline-flex h-14 shrink-0 items-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-ink pl-7 pr-2 text-[17px] font-semibold text-paper"
            >
              <span className="relative z-10 transition-colors duration-500 group-hover:text-ink">Куда поехать?</span>
              <span className="relative z-10 grid size-10 place-items-center rounded-full bg-blue text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
                <ArrowDown className="size-5 transition-transform duration-500 group-hover:translate-y-0.5" />
              </span>
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
              />
            </Link>
          </motion.div>
        </div>

        <div className="mt-8 lg:hidden">
          <div className="mx-auto max-w-[420px] rotate-[-3deg]">
            <BoardingPass />
          </div>
        </div>

        {/* карта маршрута */}
        <motion.div style={{ y: mapY }} className="relative mt-10 pb-10 sm:mt-6 sm:pb-16">
          <div className="relative aspect-[1000/360] w-full">
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
              <defs>
                <mask id="route-mask" maskUnits="userSpaceOnUse" x="-50" y="-50" width={W + 100} height={H + 100}>
                  <motion.path
                    d={route}
                    fill="none"
                    stroke="white"
                    strokeWidth="14"
                    strokeLinecap="round"
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.4, delay: 0.8, ease: "easeInOut" }}
                  />
                </mask>
              </defs>
              <path
                d={route}
                mask="url(#route-mask)"
                fill="none"
                stroke="white"
                strokeOpacity="0.9"
                strokeWidth="2.5"
                strokeDasharray="1 9"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
              {!reduce && (
                <circle r="5" fill="white">
                  <animateMotion dur="9s" begin="3.2s" repeatCount="indefinite" path={route} rotate="auto" />
                </circle>
              )}
            </svg>
            {pts.map(({ c, x, y }, i) => {
              const below = c.slug === "peterburg" || c.slug === "kaliningrad";
              return (
                <MotionLink
                  key={c.slug}
                  href={c.kind === "list" ? `/goroda/${c.slug}` : `#${c.slug}`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
                  initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.35, duration: 0.6, ease }}
                  aria-label={`${c.name}, направление`}
                >
                  <span className="relative grid size-6 place-items-center">
                    <span className="absolute inset-0 rounded-full bg-paper/50 animate-pulse-ring" style={{ animationDelay: `${i * 0.4}s` }} />
                    <span className="relative size-3 rounded-full bg-paper ring-4 ring-blue transition-transform duration-300 group-hover:scale-150" />
                  </span>
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper px-2 py-0.5 text-[11px] font-bold tracking-wide text-blue-deep shadow-lg transition-transform duration-300 group-hover:scale-110 sm:px-3 sm:py-1 sm:text-[13px] ${
                      below ? "top-8" : "bottom-8"
                    }`}
                  >
                    <span className="sm:hidden">{c.code}</span>
                    <span className="hidden font-semibold text-ink sm:inline">{c.name}</span>
                  </span>
                </MotionLink>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* волна-переход в белую секцию, как в рекламных макетах брендбука */}
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-10 w-full text-paper sm:h-16">
        <path d="M0 80V40C240 0 480 0 720 30C960 60 1200 70 1440 20V80Z" fill="currentColor" />
      </svg>
    </section>
  );
}
