import { withUtm } from "@/lib/site";

export type Idea = {
  text: string;
  /** Страница экскурсии на Горбилете, без UTM */
  href?: string;
  /** Название экскурсии для плашки */
  ticket?: string;
  /** Что ждёт на экскурсии, одной строкой */
  note?: string;
  /** Скидка в процентах, как на странице события */
  discount?: number;
};

type Base = {
  slug: string;
  /** Город в utm_campaign: moscow_newyear_<utmCity> */
  utmCity: string;
  name: string;
  /** Предложный падеж для заголовков */
  inName: string;
  code: string;
  tagline: string;
  /** Координаты для карты маршрута */
  lon: number;
  lat: number;
};

export type LeadCity = Base & {
  kind: "lead";
  /** Ссылка на лид-магнит. Пока null, ведём на раздел города на Горбилете */
  leadUrl: string | null;
  fallbackUrl: string;
  leadName: string;
  /** utm_content для лид-магнита */
  leadContent: string;
};

export type ListCity = Base & {
  kind: "list";
  intro: string;
  ideas: Idea[];
};

export type City = LeadCity | ListCity;

export const cities: City[] = [
  {
    kind: "lead",
    slug: "moskva",
    utmCity: "moscow",
    name: "Москва",
    inName: "в Москве",
    code: "МСК",
    tagline: "Огни Москвы. Гид с маршрутом на три дня и билетами со скидками",
    leadName: "Огни Москвы",
    leadContent: "ogni-moskvy",
    leadUrl: "https://gorbilet-site.github.io/ogni-moskvy/",
    fallbackUrl: "https://gorbilet.ru/msk/",
    lon: 37.62,
    lat: 55.75,
  },
  {
    kind: "lead",
    slug: "peterburg",
    utmCity: "spb",
    name: "Петербург",
    inName: "в Петербурге",
    code: "СПБ",
    tagline: "Новогодний Петербург. Подборка от команды Горбилета",
    leadName: "Новогодний Петербург",
    leadContent: "black-friday-gorbilet",
    leadUrl: "https://www.black-friday-gorbilet.ru/",
    fallbackUrl: "https://gorbilet.ru/",
    lon: 30.31,
    lat: 59.94,
  },
  {
    kind: "list",
    slug: "kaliningrad",
    utmCity: "kaliningrad",
    name: "Калининград",
    inName: "в Калининграде",
    code: "КЛД",
    tagline: "Готика, марципан и балтийский янтарь",
    intro:
      "Самый западный город России встречает Новый год ярмаркой на острове Канта и органом в Кафедральном соборе. Собрали восемь идей, чтобы за каникулы увидеть и старый Кёнигсберг, и балтийское побережье.",
    lon: 20.51,
    lat: 54.71,
    ideas: [
      { text: "Побывать на новогодней ярмарке на острове Канта" },
      {
        text: "Купить настоящий кёнигсбергский марципан после обзорной экскурсии",
        href: "https://gorbilet.ru/kaliningrad/actions/ekskursija-po-kaliningradu-na-dvuhetazhnom-avtobuse-so-skidkoj-20/",
        ticket: "Обзорная экскурсия на двухэтажном автобусе",
        note: "Главные места города и дегустация марципана",
        discount: 20,
      },
      { text: "Попробовать строганину из пеламиды" },
      {
        text: "Прогуляться по Амалиенау",
        href: "https://gorbilet.ru/kaliningrad/actions/ekskursija-peshkom-po-amalienau/",
        ticket: "Пешеходная экскурсия по Амалиенау",
        note: "Немецкие виллы, тихие улицы и поиск хомлина Антошки",
        discount: 20,
      },
      { text: "Увидеть Кафедральный собор и послушать орган" },
      {
        text: "Продегустировать пенное в пивоварне",
        href: "https://gorbilet.ru/kaliningrad/actions/avtobusnaja-ekskursija-vechernij-kaliningrad-s-degustatsiej/",
        ticket: "Вечерний Калининград с дегустацией",
        note: "Огни города, марципан и пенное на заводе «Понарт»",
        discount: 20,
      },
      { text: "Оставить время для Куршской косы" },
      {
        text: "Увидеть, как из самородка янтаря получается украшение",
        href: "https://gorbilet.ru/kaliningrad/actions/avtobusnaja-ekskursija-v-jantarnyj-i-svetlogorsk-s-posescheniem-proizvodstva-jantarja/",
        ticket: "Поездка в Янтарный и Светлогорск",
        note: "Производство янтаря, Приморский карьер и парк Беккера",
        discount: 20,
      },
    ],
  },
  {
    kind: "list",
    slug: "kazan",
    utmCity: "kazan",
    name: "Казань",
    inName: "в Казани",
    code: "КЗН",
    tagline: "Кремль, чак-чак и вечерняя панорама",
    intro:
      "Город, где мечеть Кул-Шариф и православные соборы стоят рядом, а к чаю подают чак-чак. Восемь идей для зимней Казани, от катка на Чёрном озере до эчпочмака, приготовленного своими руками.",
    lon: 49.11,
    lat: 55.79,
    ideas: [
      { text: "Сделать фото на фоне мечети Кул-Шариф" },
      {
        text: "Попасть в «Дворец впечатлений»",
        href: "https://gorbilet.ru/kazan/actions/art-muzej-dvorets-vpechatlenij-so-skidkoj-30/",
        ticket: "Арт-музей «Дворец впечатлений»",
        note: "Три этажа иллюзий от зеркальных миров до волшебного леса",
        discount: 30,
      },
      { text: "Прокатиться на коньках на Чёрном озере" },
      {
        text: "Попробовать настоящий баурсак",
        href: "https://gorbilet.ru/kazan/actions/avtobusno-peshehodnaja-ekskursija-den-kazani-so-skidkoj-do-37/",
        ticket: "Экскурсия «День Казани»",
        note: "Главные маршруты города и дегустация татарской кухни",
        discount: 20,
      },
      { text: "Сходить в Музей чак-чака" },
      {
        text: "Увидеть вечернюю панораму с колеса обозрения",
        href: "https://gorbilet.ru/kazan/actions/avtobusno-peshehodnaja-ekskursija-nochnaja-kazan-s-kataniem-na-kolese-obozrenija/",
        ticket: "«Ночная Казань» с колесом обозрения",
        note: "Город в огнях с высоты и старинные татарские легенды",
        discount: 17,
      },
      { text: "Увидеть Храм всех религий" },
      {
        text: "Приготовить эчпочмак",
        href: "https://gorbilet.ru/kazan/actions/gastronomicheskaja-ekskursija-po-kazani-so-vkusom-so-skidkoj-20/",
        ticket: "Гастрономическая экскурсия «Казань со вкусом»",
        note: "Музей чая, Старо-Татарская слобода и мастер-класс по эчпочмакам",
        discount: 20,
      },
    ],
  },
  {
    kind: "list",
    slug: "nizhnij-novgorod",
    utmCity: "nn",
    name: "Нижний Новгород",
    inName: "в Нижнем Новгороде",
    code: "НН",
    tagline: "Кремль в огнях, ёлочные игрушки и Волга",
    intro:
      "Город на слиянии Оки и Волги. Зимой кремль сияет праздничной иллюминацией, по Большой Покровской гуляют до позднего вечера, а за городом ждут сказочные олени. Восемь идей для январской поездки.",
    lon: 44.0,
    lat: 56.33,
    ideas: [
      {
        text: "Увидеть Нижегородский кремль в праздничной иллюминации",
        href: "https://gorbilet.ru/nn/actions/peshehodnaja-ekskursija-legendy-i-predanija-nizhegorodskogo-kremlja/",
        ticket: "Экскурсия «Легенды и предания Нижегородского кремля»",
        note: "Прогулка по крепости с историями, которые знают только местные",
        discount: 78,
      },
      { text: "Погулять по Большой Покровской" },
      { text: "Прокатиться на коньках в парке «Швейцария»" },
      {
        text: "Съездить в гости к сказочным оленям",
        href: "https://gorbilet.ru/nn/actions/ekskursija-v-kopore-i-nikola-kljuch-v-gosti-k-skazochnym-olenjam/",
        ticket: "Поездка в Копорье и Никола Ключ",
        note: "Олени, избушка Бабы Яги и родник святого Николая",
        discount: 15,
      },
      { text: "Попробовать настоящую волжскую уху" },
      {
        text: "Заглянуть на фабрику ёлочных игрушек «Ариель»",
        href: "https://gorbilet.ru/nn/actions/ekskursija-na-fabriku-elochnyh-igrushek-ariel-s-master-klassom/",
        ticket: "Фабрика ёлочных игрушек «Ариель»",
        note: "Стеклодувный цех, музей игрушки и мастер-класс по росписи",
        discount: 15,
      },
      { text: "Прогуляться по Рождественской улице" },
      {
        text: "Посетить усадьбу Рукавишниковых",
        href: "https://gorbilet.ru/nn/actions/ekskursija-po-nizhnemu-novgorodu-s-posescheniem-usadby-rukavishnikovyh-i-obedom/",
        ticket: "Обзорная экскурсия с усадьбой Рукавишниковых",
        note: "Главные места города, усадьба и обед",
        discount: 15,
      },
    ],
  },
];

export const listCities = cities.filter((c): c is ListCity => c.kind === "list");

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

/** Куда ведёт клик по городу с лид-магнитом */
export function leadHref(c: LeadCity) {
  return withUtm(c.leadUrl ?? c.fallbackUrl, c.utmCity, c.leadUrl ? c.leadContent : undefined);
}

export function ideaHref(c: ListCity, idea: Idea) {
  return idea.href ? withUtm(idea.href, c.utmCity) : undefined;
}

/** «−20%» */
export function discountLabel(idea: Idea) {
  return idea.discount ? `−${idea.discount}%` : null;
}
