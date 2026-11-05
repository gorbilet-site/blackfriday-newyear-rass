"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import { MaskLines } from "./motion";
import { BoardingPass } from "./boarding-pass";
import { site } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const passY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);

  return (
    <section ref={ref} className="grain relative isolate overflow-hidden bg-blue text-ink">
      {/* мягкая глубина фона: только оттенки фирменного красного */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[20%] -top-[30%] size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_60%)]" />
        <div className="absolute -bottom-[40%] -left-[20%] size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(20,80,190,0.35),transparent_65%)]" />
      </div>

      <div className="shell relative pb-14 pt-28 sm:pb-20 sm:pt-36 lg:pb-32 lg:pt-40">
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

      </div>

      {/* волна-переход в белую секцию, как в рекламных макетах брендбука */}
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-10 w-full text-paper sm:h-16">
        <path d="M0 80V40C240 0 480 0 720 30C960 60 1200 70 1440 20V80Z" fill="currentColor" />
      </svg>
    </section>
  );
}
