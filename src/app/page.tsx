import { Hero } from "@/components/hero";
import { Departures } from "@/components/departures";
import { Tours } from "@/components/tours";
import { MaskLines, Reveal } from "@/components/motion";
import { cities } from "@/data/cities";
import { site } from "@/lib/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Куда поехать на январские каникулы",
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: c.kind === "list" ? `${site.url}/goroda/${c.slug}` : `${site.url}/#${c.slug}`,
    })),
  };

  return (
    <>
      <Hero />

      <section id="kuda" className="py-20 sm:py-28" aria-labelledby="kuda-title">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-deep">Табло направлений</p>
              <h2 id="kuda-title" className="display mt-5 text-[clamp(1.8rem,9vw,6rem)] lg:text-[clamp(3.4rem,5.2vw,5.4rem)]">
                <MaskLines lines={["Куда", "поехать?"]} />
              </h2>
            </div>
            <Reveal className="lg:col-span-5 lg:pb-3">
              <p className="max-w-md text-lg leading-[1.5] text-ink/75">
                Выберите город на табло. Для Москвы и Петербурга мы подготовили отдельные гиды, а для остальных городов собрали идеи для поездки и экскурсии со скидкой.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 sm:mt-16">
            <Departures />
          </div>
        </div>
      </section>

      <Tours />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
