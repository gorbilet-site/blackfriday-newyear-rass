export const site = {
  name: "Новый год в новом городе",
  brand: "Горбилет",
  tagline: "Чёрная пятница для ярких январских каникул",
  lead: "Собрали скидки для ваших путешествий",
  description:
    "Куда поехать на январские каникулы. Москва, Петербург, Калининград, Казань и Нижний Новгород с идеями для поездки и экскурсиями со скидками от Горбилета.",
  // Боевой домен сателлита. Можно задать через переменную окружения NEXT_PUBLIC_SITE_URL
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://newyear.gorbilet.ru",
  gorbilet: "https://gorbilet.ru/?utm_source=vk&utm_medium=rassilka_tr&utm_campaign=other_newyear_tr&utm_content=home",
} as const;

/**
 * UTM-разметка рассылки Туриста.
 * source vk, medium rassilka_tr, campaign moscow_newyear_<город>, content <последняя часть ссылки>
 */
export const utm = {
  source: "vk",
  medium: "rassilka_tr",
  campaignPrefix: "moscow_newyear_",
} as const;

/** Последняя часть ссылки без слэшей, например ekskursija-peshkom-po-amalienau */
export function lastSegment(url: string) {
  const path = new URL(url).pathname.split("/").filter(Boolean);
  return path[path.length - 1] ?? "home";
}

/** Добавляет UTM-метки к ссылке. city пишется в конец campaign */
export function withUtm(url: string, city: string, content?: string) {
  const u = new URL(url);
  u.searchParams.set("utm_source", utm.source);
  u.searchParams.set("utm_medium", utm.medium);
  u.searchParams.set("utm_campaign", `${utm.campaignPrefix}${city}`);
  u.searchParams.set("utm_content", content ?? lastSegment(url));
  return u.toString();
}

export const contacts = {
  email: "info@gorbilet.com",
  telegram: "https://t.me/Gorbilet_podderzka_bot",
  vk: "https://vk.ru/gorbilet_travel",
  max: "https://max.ru/id7813296237_bot",
  tickets: "https://tickets.gorbilet.ru",
} as const;

export const nav = [
  { href: "/#kuda", label: "Куда поехать" },
  { href: "/#tury", label: "Туры" },
  { href: "/o-proekte", label: "О проекте" },
  { href: "/kontakty", label: "Контакты" },
] as const;
