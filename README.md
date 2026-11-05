# Новый год в новом городе

GitHub Pages: https://gorbilet-site.github.io/blackfriday-newyear-rass/

Репозиторий: https://github.com/gorbilet-site/blackfriday-newyear-rass

Публикация обновления: `npm run build:pages`, затем коммит и push исходников и папки `docs`.

Для телефонов проверены ширины 320, 360, 390 и 430 px. Мобильные карточки используют одну колонку и не сжимают описания между скидкой и кнопкой. Скрипт `npm run typograph` связывает предлоги и союзы со следующим словом неразрывным пробелом, не затрагивая программный код.

Сайт-сателлит Горбилета для рассылки Туриста к Чёрной пятнице. Пять направлений на январские каникулы: Москва и Петербург ведут на лид-магниты, Калининград, Казань и Нижний Новгород раскрываются списком идей с экскурсиями со скидкой.

Стек Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, Lucide. Палитра как у лендинга «Огни Москвы»: синий #3B8BEB, белый и чёрный, текст чёрный. Шрифты Druk Wide и Inter из брендбука подключены локально, внешних запросов нет.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Если на Windows Turbopack завершается при обработке CSS, используйте `npm run build:webpack`.
Проверка разметки ссылок и наличия фотографий: `npm run check:links`.

Статическая сборка для любого хостинга без Node.js

```bash
STATIC_EXPORT=1 npm run build   # результат в папке out/
```

Один HTML-файл со всеми страницами, шрифтами и скриптами. Открывается двойным кликом, работает без интернета, кроме переходов на Горбилет

```bash
npm run build:single   # результат novyj-god-v-novom-gorode.html
```

В этой версии страницы открываются по хэшу, например `#/goroda/kazan`.

## Что где править

| Что | Файл |
| --- | --- |
| Ссылки на лид-магниты Москвы и Петербурга (`leadUrl`) | `src/data/cities.ts` |
| Идеи, ссылки на экскурсии, тексты городов | `src/data/cities.ts` |
| Готовые туры из Петербурга | `src/data/tours.ts` |
| Скидки и описания экскурсий на плашках (`discount`, `note`) | `src/data/cities.ts` |
| UTM-метки, домен, контакты | `src/lib/site.ts` |
| Цвета и шрифты | `src/app/globals.css` (блок `@theme`) |
| Фотографии предложений и их источники | `src/data/offer-photos.json`, `public/offers/` |

### Лид-магниты

Петербург ведёт на black-friday-gorbilet.ru. Москва ведёт на опубликованный лид-магнит `https://gorbilet-site.github.io/ogni-moskvy/` с метками `utm_source=vk`, `utm_medium=rassilka_tr`, `utm_campaign=moscow_newyear_moscow`, `utm_content=ogni-moskvy`.

### Типографика

После правки текстов запустите `npm run typograph`. Скрипт ставит неразрывные пробелы после коротких предлогов, союзов и чисел.

### UTM

Ссылки на экскурсии, туры и городские подборки собираются функцией `withUtm` из `src/lib/site.ts`.
Три общие кнопки Горбилета в шапке и подвале размечены `utm_source=vk`, `utm_medium=rassilka_tr`, `utm_campaign=other_newyear_tr`, `utm_content=home`.

- `utm_source=vk`
- `utm_medium=rassilka_tr`
- `utm_campaign=moscow_newyear_<город>` (kaliningrad, kazan, nn, moscow, spb)
- `utm_content=<последняя часть ссылки>`, для лид-магнитов `ogni-moskvy` и `black-friday-gorbilet`
- туры из Петербурга размечены как `moscow_newyear_spb`

Для московского лид-магнита используется `utm_content=ogni-moskvy`, совпадающий с последним сегментом его адреса.
Точное значение `rassilka_tr` взято из задания; `rassilka_teatr` в примере относится к другой рассылке.
Полная таблица 20 размеченных ссылок — `link-audit.csv`, замечания — `LINK_AUDIT.md`.

### Фотографии

У всех 18 предложений есть локальные фотографии из первых изображений их галерей на Горбилете.
Они добавлены в карточки экскурсий, списки на страницах городов и карточки туров.
Восемь фотографий Калининграда, Казани и Нижнего Новгорода получили зимнюю обработку через image_gen с сохранением сюжета и ракурса. Исходники сохранены рядом, обработанные версии имеют суффикс `-winter`. Промпты: `project-notes/winter-photo-prompts.json`. Скрипт синхронизации сохраняет эти сезонные версии.
Однофайловая сборка встраивает фотографии в HTML и не требует их загрузки с внешнего сервера.
Скрипт `node scripts/sync-offer-photos.mjs` повторно получает фотографии и сохраняет адреса источников.

## Страницы

- `/` главная: hero с посадочным талоном, табло направлений, готовые туры из Петербурга
- `/goroda/kaliningrad`, `/goroda/kazan`, `/goroda/nizhnij-novgorod` план поездки с чек-листом и экскурсиями
- `/o-proekte`, `/kontakty`, страница 404
- `public/sitemap.xml`, `public/robots.txt` (при смене домена поправьте и их), OG-картинка `public/og.jpg`

Анимации учитывают `prefers-reduced-motion`. Отметки в чек-листе хранятся в localStorage браузера.
