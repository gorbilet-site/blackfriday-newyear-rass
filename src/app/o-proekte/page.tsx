import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgePercent, ListChecks, MapPinned } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion";
import { cities } from "@/data/cities";

export const metadata: Metadata = {
  title: "О проекте",
  description:
    "«Новый год в новом городе» от Горбилета. Пять направлений для январских каникул, идеи для поездки и экскурсии со скидками Чёрной пятницы.",
  alternates: { canonical: "/o-proekte" },
};

const points = [
  {
    icon: MapPinned,
    title: "Пять направлений",
    text: `${cities.map((c) => c.name).join(", ")}. Города, куда удобно поехать на январские каникулы на несколько дней.`,
  },
  {
    icon: ListChecks,
    title: "Идеи, а не просто афиша",
    text: "В каждом списке есть и то, что можно сделать самостоятельно, и экскурсии, на которые нужен билет.",
  },
  {
    icon: BadgePercent,
    title: "Скидки Чёрной пятницы",
    text: "Кнопки с билетами ведут на страницы событий на Горбилете. Там актуальные цены, даты и условия.",
  },
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="О проекте" lines={["Новый год", "в новом", "городе"]}>
        <p>
          Спецпроект Горбилета к Чёрной пятнице. Мы собрали направления для январских каникул и экскурсии со скидками, чтобы поездку было проще спланировать заранее.
        </p>
      </PageHero>

      <section className="py-20 sm:py-28">
        <div className="shell grid gap-5 md:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-[28px] border border-line p-7 transition-colors duration-500 hover:border-blue/40 sm:p-8">
                <span className="grid size-12 place-items-center rounded-full bg-blush text-blue">
                  <p.icon className="size-5" />
                </span>
                <h2 className="mt-8 text-2xl font-semibold leading-tight">{p.title}</h2>
                <p className="mt-3 text-[16px] leading-[1.55] text-ink/70">{p.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-blush py-20 sm:py-28">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <h2 className="display text-[clamp(2rem,5vw,4rem)] lg:col-span-5">Кто делает</h2>
          <Reveal className="space-y-5 text-lg leading-[1.55] text-ink/80 lg:col-span-7">
            <p>
              Горбилет продаёт билеты на экскурсии, спектакли и развлечения со скидками. Сервис начинался в Петербурге, а сейчас работает и в других городах, включая Москву, Калининград, Казань и Нижний Новгород.
            </p>
            <p>
              Все кнопки с билетами ведут на gorbilet.ru, где можно выбрать дату и оплатить заказ. Отметки в списках идей хранятся только в вашем браузере.
            </p>
            <Link href="/#kuda" className="group inline-flex items-center gap-2 border-b-2 border-blue pb-1 font-semibold text-blue-deep">
              Выбрать направление
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
