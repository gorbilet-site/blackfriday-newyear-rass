import { withUtm } from "@/lib/site";

export type Tour = {
  title: string;
  /** Город назначения для маршрута «Петербург → …» */
  to: string;
  days: number;
  /** Скидка в процентах. null, если на странице тура она не указана */
  discount: number | null;
  stops: string[];
  href: string;
};

/** Готовые новогодние туры из Петербурга. utm_campaign moscow_newyear_spb, utm_content по адресу тура */
export const tours: Tour[] = [
  {
    title: "Новый год в сказочном Кёнигсберге",
    to: "Калининград",
    days: 4,
    discount: 10,
    stops: ["Калининград", "Светлогорск", "Зеленоградск"],
    href: "https://gorbilet.ru/spb/actions/chetyrehdnevnyj-tur-novyj-god-v-skazochnom-kenigsberge/",
  },
  {
    title: "Белорусский Новый год",
    to: "Витебск",
    days: 3,
    discount: 10,
    stops: ["Витебск", "Полоцк"],
    href: "https://gorbilet.ru/spb/actions/trehdnevnyj-tur-belorusskij-novyj-god/",
  },
  {
    title: "Ярославль и Кострома. В гости к Снегурочке",
    to: "Кострома",
    days: 3,
    discount: 10,
    stops: ["Ярославль", "Кострома", "Лосиная ферма"],
    href: "https://gorbilet.ru/spb/actions/trekhdnevnyi-tur-yaroslavl-kostroma-v-gosti-k-snegurochke-so-skidkoi/",
  },
  {
    title: "Новый год в Москве. В центре событий",
    to: "Москва",
    days: 3,
    discount: null,
    stops: ["Москва"],
    href: "https://gorbilet.ru/spb/actions/trehdnevnyj-tur-novyj-god-v-moskve-v-tsentre-sobytij/",
  },
  {
    title: "Новый год в Тверской губернии",
    to: "Тверь",
    days: 3,
    discount: 10,
    stops: ["Тверь", "Торжок", "Старица"],
    href: "https://gorbilet.ru/spb/actions/trehdnevnyj-tur-novyj-god-v-tverskoj-gubernii/",
  },
  {
    title: "Вологодский Новый год",
    to: "Вологда",
    days: 4,
    discount: null,
    stops: ["Тихвин", "Вологда", "Череповец"],
    href: "https://gorbilet.ru/spb/actions/chetyrehdnevnyj-tur-vologodskij-novyj-god/",
  },
];

export const tourHref = (t: Tour) => withUtm(t.href, "spb");

export function daysWord(n: number) {
  return n === 1 ? "день" : n < 5 ? "дня" : "дней";
}
