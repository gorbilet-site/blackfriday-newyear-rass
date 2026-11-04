import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CityPlan } from "@/components/city-plan";
import { MaskLines, Reveal, SplitFlap } from "@/components/motion";
import { discountLabel, ideaHref, listCities, type ListCity } from "@/data/cities";
import { site } from "@/lib/site";
import { OfferPhoto } from "./offer-photo";

/** Страница города. Используется и в Next.js, и в однофайловой сборке */
export function CityView({ city }: { city: ListCity }) {
  const idx = listCities.findIndex((c) => c.slug === city.slug);
  const next = listCities[(idx + 1) % listCities.length];
  const tickets = city.ideas.filter((i) => i.href);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `Новый год ${city.inName}`,
    description: city.intro,
    url: `${site.url}/goroda/${city.slug}`,
    itinerary: {
      "@type": "ItemList",
      itemListElement: city.ideas.map((idea, i) => ({ "@type": "ListItem", position: i + 1, name: idea.text })),
    },
  };

  return (
    <>
      <section className="grain relative isolate overflow-hidden bg-blue text-ink">
        <div aria-hidden className="pointer-events-none absolute -right-[25%] -top-[40%] -z-10 size-[80vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.28),transparent_60%)]" />
        <div className="shell pb-16 pt-28 sm:pb-24 sm:pt-36">
          <Link href="/#kuda" className="group inline-flex items-center gap-2 text-[15px] font-medium text-ink/75 hover:text-ink">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Все направления
          </Link>
          <div className="mt-10 flex items-center gap-4">
            <SplitFlap
              text={city.code}
              cells
              className="flex gap-1"
              cellClassName="grid h-12 w-10 place-items-center rounded-lg bg-ink font-display text-xl text-paper"
            />
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/70">Рейс на каникулы</span>
          </div>
          <h1 className="display mt-6 text-[clamp(2.3rem,9.6vw,8.4rem)] [overflow-wrap:anywhere]">
            <MaskLines onLoad lines={city.name.split(" ")} />
          </h1>
          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <p className="text-lg leading-[1.5] text-ink/85 sm:text-xl">{city.intro}</p>
            </Reveal>
          </div>
        </div>
        <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-10 w-full text-paper sm:h-16">
          <path d="M0 80V50C320 10 640 0 900 30C1140 58 1300 60 1440 30V80Z" fill="currentColor" />
        </svg>
      </section>

      <section className="py-16 sm:py-24" aria-labelledby="plan-title">
        <div className="shell">
          <h2 id="plan-title" className="display text-[clamp(1.6rem,5vw,4rem)]">
            <MaskLines lines={["Что успеть", city.inName]} />
          </h2>
          <div className="mt-12">
            <CityPlan city={city} />
          </div>
        </div>
      </section>

      <section className="bg-blush py-16 sm:py-24" aria-labelledby="tickets-title">
        <div className="shell">
          <h2 id="tickets-title" className="display text-[clamp(1.8rem,4vw,3rem)]">
            Экскурсии со скидкой
          </h2>
          <ul className="mt-10 border-t-2 border-ink">
            {tickets.map((t) => {
              const d = discountLabel(t);
              return (
                <li key={t.href} className="border-b border-ink/10">
                  <a
                    href={ideaHref(city, t)}
                    target="_blank"
                    rel="noopener"
                    className="group grid grid-cols-1 items-center gap-4 py-5 sm:grid-cols-[1fr_auto_auto] sm:gap-8 sm:py-6"
                  >
                    <span className="flex min-w-0 items-center gap-4 sm:gap-6">
                      <span className="hidden w-32 shrink-0 overflow-hidden rounded-xl sm:block lg:w-44">
                        <OfferPhoto href={t.href} alt={t.ticket ?? t.text} />
                      </span>
                      <span className="min-w-0">
                        <span className="mb-3 block max-w-xs overflow-hidden rounded-xl sm:hidden">
                          <OfferPhoto href={t.href} alt={t.ticket ?? t.text} />
                        </span>
                      <span className="block text-lg font-semibold leading-snug transition-colors group-hover:text-blue-deep sm:text-xl">{t.ticket}</span>
                      {t.note && <span className="mt-1 block text-[15px] leading-snug text-mist">{t.note}</span>}
                      </span>
                    </span>
                    <span className="hidden text-[15px] font-semibold text-blue-deep sm:block">Купить со скидкой</span>
                    <span className="flex items-center justify-end gap-3 sm:justify-start">
                      {d && <span className="rounded-xl bg-blue px-3 py-2 font-display text-[17px] text-ink">{d}</span>}
                      <span className="grid size-10 place-items-center rounded-full bg-ink text-paper transition-colors group-hover:bg-blue">
                        <ArrowRight className="size-4 -rotate-45" />
                      </span>
                    </span>
                    <span className="sr-only">Открыть билет на Горбилете</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="shell">
          <Link
            href={`/goroda/${next.slug}`}
            className="group relative block overflow-hidden rounded-[32px] bg-ink p-8 text-paper transition-colors duration-700 hover:text-ink sm:p-12"
          >
            <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-blue transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
            <span className="relative block text-sm font-semibold uppercase tracking-[0.16em] opacity-70">Следующий рейс</span>
            <span className="relative mt-4 flex items-end justify-between gap-6">
              <span className="display text-[clamp(2rem,6vw,5rem)] [overflow-wrap:anywhere]">{next.name}</span>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 group-hover:translate-x-1">
                <ArrowRight className="size-6" />
              </span>
            </span>
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
