import type { ReactNode } from "react";
import { MaskLines, Reveal } from "./motion";

export function PageHero({ eyebrow, lines, children }: { eyebrow: string; lines: string[]; children?: ReactNode }) {
  return (
    <section className="grain relative isolate overflow-hidden bg-blue text-ink">
      <div aria-hidden className="pointer-events-none absolute -left-[20%] -top-[50%] -z-10 size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_60%)]" />
      <div className="shell pb-16 pt-32 sm:pb-24 sm:pt-44">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">{eyebrow}</p>
        <h1 className="display mt-6 text-[clamp(2.4rem,8.6vw,7.6rem)]">
          <MaskLines onLoad lines={lines} />
        </h1>
        {children && (
          <Reveal delay={0.3} className="mt-8 max-w-2xl text-lg leading-[1.5] text-ink/85 sm:text-xl">
            {children}
          </Reveal>
        )}
      </div>
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-10 w-full text-paper sm:h-16">
        <path d="M0 80V30C300 70 600 70 860 40C1100 12 1280 10 1440 40V80Z" fill="currentColor" />
      </svg>
    </section>
  );
}
