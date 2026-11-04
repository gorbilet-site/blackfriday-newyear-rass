import { ArrowUpRight } from "lucide-react";
import { daysWord, tourHref, tours } from "@/data/tours";
import { MaskLines, Reveal } from "./motion";
import { OfferPhoto } from "./offer-photo";

export function Tours() {
  return (
    <section id="tury" className="relative isolate overflow-hidden bg-ink py-24 text-paper sm:py-32" aria-labelledby="tury-title">
      <div aria-hidden className="pointer-events-none absolute -right-[25%] -top-[30%] -z-10 size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(59,139,235,0.28),transparent_62%)]" />
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue">Отправление из Петербурга</p>
            <h2 id="tury-title" className="display mt-5 text-[clamp(1.15rem,6vw,3rem)] sm:text-[clamp(1.6rem,7.4vw,3rem)] lg:text-[clamp(2rem,4.5vw,4.2rem)]">
              <MaskLines lines={["Готовые туры", "на новогодние", "из Петербурга"]} />
            </h2>
          </div>
          <Reveal className="lg:col-span-4 lg:pb-3">
            <p className="max-w-sm text-lg leading-[1.5] text-paper/75">
              Поездки на три и четыре дня, когда не хочется собирать маршрут самому. Даты и программа на странице тура.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {tours.map((t, i) => (
            <Reveal as="li" key={t.href} delay={(i % 3) * 0.08}>
              <a
                href={tourHref(t)}
                target="_blank"
                rel="noopener"
                className="ticket group relative isolate flex h-full min-h-[340px] flex-col overflow-hidden rounded-[28px] bg-ink-2 p-6 ring-1 ring-paper/10 transition-[color,transform] duration-500 ease-out-expo [--notch-y:58%] hover:-translate-y-1.5 hover:text-ink sm:p-7"
              >
                <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-blue transition-transform duration-700 ease-out-expo group-hover:scale-y-100" />

                <span className="mb-7 block overflow-hidden rounded-2xl">
                  <OfferPhoto href={t.href} alt={t.title} className="transition-transform duration-700 group-hover:scale-105" />
                </span>

                <div className="flex items-start justify-between gap-3">
                  <p className="flex items-baseline gap-3">
                    <span className="display text-[4.5rem] leading-[0.8] text-blue transition-colors duration-500 group-hover:text-ink">{t.days}</span>
                    <span className="text-lg font-semibold">{daysWord(t.days)}</span>
                  </p>
                  {t.discount && (
                    <span className="rounded-lg bg-blue px-2 py-1 font-display text-[15px] leading-none text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
                      −{t.discount}%
                    </span>
                  )}
                </div>
                <h3 className="mt-6 text-[21px] font-semibold leading-[1.25]">{t.title}</h3>

                <div className="mt-auto pt-8">
                  <div className="border-t-2 border-dashed border-paper/15 pt-5 transition-colors duration-500 group-hover:border-ink/25">
                    <div className="flex items-end justify-between gap-4">
                      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] opacity-75" aria-label="Маршрут">
                        {t.stops.map((s, j) => (
                          <li key={s} className="flex items-center gap-2">
                            {j > 0 && <span aria-hidden className="size-1 rounded-full bg-current" />}
                            {s}
                          </li>
                        ))}
                      </ol>
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-paper">
                        <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
                <span className="sr-only">. Открыть тур на Горбилете в новой вкладке</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
