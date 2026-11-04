import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
mkdirSync(resolve(root, ".audit"), { recursive: true });
const bundle = resolve(root, ".audit/link-data.cjs");
await build({
  stdin: {
    contents: 'export * from "./src/data/cities"; export * from "./src/data/tours"; export * from "./src/lib/site";',
    resolveDir: root,
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: bundle,
  alias: { "@": resolve(root, "src") },
});
const data = (await import(pathToFileURL(bundle).href)).default;
const photos = JSON.parse(readFileSync(resolve(root, "src/data/offer-photos.json"), "utf8"));
const checks = [];
function check(title, url, city, content = data.lastSegment(url)) {
  const link = new URL(url);
  const expected = { utm_source: "vk", utm_medium: "rassilka_tr", utm_campaign: `moscow_newyear_${city}`, utm_content: content };
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(link.searchParams.get(key), value, `${title}: ${key}`);
    assert.equal(link.searchParams.getAll(key).length, 1, `${title}: duplicate ${key}`);
  }
  checks.push({ title, url, ...expected });
}
for (const city of data.cities) {
  if (city.kind === "lead") check(city.name, data.leadHref(city), city.utmCity, city.leadUrl ? city.leadContent : data.lastSegment(city.fallbackUrl));
  else for (const idea of city.ideas.filter((i) => i.href)) {
    check(idea.ticket, data.ideaHref(city, idea), city.utmCity);
    assert.ok(photos[idea.href], `Missing photo: ${idea.href}`);
  }
}
const expectedTours = [
  "trehdnevnyj-tur-belorusskij-novyj-god",
  "chetyrehdnevnyj-tur-novyj-god-v-skazochnom-kenigsberge",
  "trekhdnevnyi-tur-yaroslavl-kostroma-v-gosti-k-snegurochke-so-skidkoi",
  "trehdnevnyj-tur-novyj-god-v-moskve-v-tsentre-sobytij",
  "trehdnevnyj-tur-novyj-god-v-tverskoj-gubernii",
  "chetyrehdnevnyj-tur-vologodskij-novyj-god",
];
assert.deepEqual(data.tours.map((t) => data.lastSegment(t.href)).sort(), expectedTours.sort());
for (const tour of data.tours) {
  check(tour.title, data.tourHref(tour), "spb");
  assert.ok(photos[tour.href], `Missing tour photo: ${tour.href}`);
}
for (const photo of Object.values(photos)) {
  assert.ok(existsSync(resolve(root, `public${photo.src}`)), photo.src);
  assert.equal(new URL(photo.sourceUrl).hostname, "media.gorbilet.ru");
}
const spb = data.cities.find((c) => c.slug === "peterburg");
assert.equal(spb.leadUrl, "https://www.black-friday-gorbilet.ru/");
const moscow = data.cities.find((c) => c.slug === "moskva");
assert.equal(moscow.leadUrl, "https://gorbilet-site.github.io/ogni-moskvy/");
assert.equal(data.leadHref(moscow), "https://gorbilet-site.github.io/ogni-moskvy/?utm_source=vk&utm_medium=rassilka_tr&utm_campaign=moscow_newyear_moscow&utm_content=ogni-moskvy");
assert.equal(data.contacts.vk, "https://vk.me/gorbilet");
const preserved = new URL(data.withUtm("https://gorbilet.ru/spb/actions/example/?date=2027-01-01&utm_source=old#tickets", "spb"));
assert.equal(preserved.searchParams.get("date"), "2027-01-01");
assert.equal(preserved.hash, "#tickets");
assert.equal(preserved.searchParams.getAll("utm_source").length, 1);
const general = new URL(data.site.gorbilet);
const generalExpected = { utm_source: "vk", utm_medium: "rassilka_tr", utm_campaign: "other_newyear_tr", utm_content: "home" };
for (const [key, value] of Object.entries(generalExpected)) {
  assert.equal(general.searchParams.get(key), value, `General Gorbilet CTA: ${key}`);
  assert.equal(general.searchParams.getAll(key).length, 1, `General Gorbilet CTA: duplicate ${key}`);
}
checks.push({ title: "Общие переходы на Горбилет", url: data.site.gorbilet, ...generalExpected });
const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
const fields = ["title", "url", "utm_source", "utm_medium", "utm_campaign", "utm_content"];
writeFileSync(resolve(root, "link-audit.csv"), "\uFEFF" + [fields, ...checks.map((c) => fields.map((f) => c[f]))].map((row) => row.map(quote).join(";")).join("\r\n"));
console.log(`PASS: ${checks.length} marked links, all 6 requested tours, 18 local offer photos, VK and SPb links.`);
console.log("PASS: Moscow points to published Ogni Moskvy with travel landing UTM.");
console.log("PASS: three general Gorbilet CTAs use other_newyear_tr.");
