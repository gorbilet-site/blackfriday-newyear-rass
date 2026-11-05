// Downloads the first gallery photo of each exact offer, never recommendation images.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const cache = resolve(root, ".audit/pages");
mkdirSync(cache, { recursive: true });
mkdirSync(resolve(root, "public/offers"), { recursive: true });
const urls = [...new Set(["cities", "tours"].flatMap((name) =>
  [...readFileSync(resolve(root, `src/data/${name}.ts`), "utf8")
    .matchAll(/href: "(https:\/\/gorbilet\.ru\/[^"\s]+\/actions\/[^"\s]+)"/g)].map((m) => m[1]),
))];
const manifestPath = resolve(root, "src/data/offer-photos.json");
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const results = [];

async function request(url) {
  let error;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      return response;
    } catch (e) { error = e; }
  }
  throw error;
}

function offerData(html, slug) {
  const objects = [];
  function visit(value) {
    if (!value || typeof value !== "object") return;
    if (value.slug === slug && Array.isArray(value.images) && value.images.length) objects.push(value);
    for (const child of Object.values(value)) visit(child);
  }
  const chunks = [...html.matchAll(/self\.__next_f\.push\((\[.*?\])\)<\/script>/gs)]
    .map((m) => { try { return JSON.parse(m[1])[1] || ""; } catch { return ""; } }).join("");
  // Flight text records can end immediately before the next JSON record.
  for (const match of chunks.matchAll(/(?<![a-f0-9])[a-f0-9]+:(?=[\[{])/g)) {
    const start = match.index + match[0].length;
    let depth = 0, quoted = false, escaped = false;
    for (let i = start; i < chunks.length; i++) {
      const ch = chunks[i];
      if (quoted) {
        if (escaped) escaped = false;
        else if (ch === "\\") escaped = true;
        else if (ch === '"') quoted = false;
      } else if (ch === '"') quoted = true;
      else if (ch === "[" || ch === "{") depth++;
      else if ((ch === "]" || ch === "}") && --depth === 0) {
        try { visit(JSON.parse(chunks.slice(start, i + 1))); } catch { /* not a JSON record */ }
        break;
      }
    }
  }
  return objects.find((o) => o.description) ?? objects[0];
}

async function sync(pageUrl) {
  const slug = new URL(pageUrl).pathname.split("/").filter(Boolean).at(-1);
  if (manifest[pageUrl]?.seasonalEdit && existsSync(resolve(root, `public${manifest[pageUrl].src}`))) {
    results.push({ pageUrl, status: "ok", image: manifest[pageUrl].src, seasonalEditPreserved: true });
    console.log("KEEP WINTER", slug);
    return;
  }
  try {
    const htmlPath = resolve(cache, `${slug}.html`);
    let html;
    let finalUrl = pageUrl;
    if (existsSync(htmlPath)) html = readFileSync(htmlPath, "utf8");
    else {
      const response = await request(pageUrl);
      finalUrl = response.url;
      html = await response.text();
      writeFileSync(htmlPath, html);
    }
    const offer = offerData(html, slug);
    if (!offer) throw new Error("Exact offer gallery not found");
    const photo = [...offer.images].sort((a, b) => a.position - b.position)[0];
    const sourceUrl = photo.webp ?? photo.image;
    if (new URL(sourceUrl).hostname !== "media.gorbilet.ru") throw new Error("Unexpected image host");
    const extension = sourceUrl.includes(".webp") ? "webp" : "jpg";
    const src = `/offers/${slug}.${extension}`;
    const localFile = resolve(root, `public${src}`);
    if (!existsSync(localFile)) {
      const response = await request(sourceUrl);
      const bytes = Buffer.from(await response.arrayBuffer());
      const isWebp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
      const isPng = bytes.toString("hex", 0, 8) === "89504e470d0a1a0a";
      if (!isWebp && !isJpeg && !isPng) throw new Error("Invalid image signature");
      writeFileSync(localFile, bytes);
    }
    manifest[pageUrl] = { src, sourceUrl, pageUrl, title: offer.title, fetchedAt: new Date().toISOString() };
    results.push({ pageUrl, finalUrl, status: "ok", offerStatus: offer.status, hasDates: offer.has_upcoming_open_events, title: offer.title, image: src });
    console.log("OK", slug);
  } catch (error) {
    results.push({ pageUrl, status: "error", error: error.message });
    console.error("FAILED", slug, error.message);
  }
  writeFileSync(manifestPath, JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2) + "\n");
  writeFileSync(resolve(root, ".audit/offer-check.json"), JSON.stringify(results, null, 2) + "\n");
}

let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < urls.length) await sync(urls[cursor++]);
}));
console.log(`${results.filter((r) => r.status === "ok").length}/${urls.length} offers with photos`);
if (results.some((r) => r.status !== "ok")) process.exitCode = 1;
