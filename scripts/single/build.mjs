// Однофайловая сборка: node scripts/single/build.mjs → novyj-god-v-novom-gorode.html
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const tmp = resolve(root, ".single");
mkdirSync(tmp, { recursive: true });

execFileSync(process.execPath, [resolve(root, "node_modules/@tailwindcss/cli/dist/index.mjs"), "-i", "src/app/globals.css", "-o", ".single/app.css", "--minify"], { cwd: root, stdio: "inherit" });

const js = await build({
  entryPoints: [resolve(import.meta.dirname, "entry.tsx")],
  bundle: true,
  write: false,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  logLevel: "error",
  plugins: [{
    name: "inline-offer-photos",
    setup(builder) {
      builder.onLoad({ filter: /offer-photos\.json$/ }, () => {
        const photos = JSON.parse(readFileSync(resolve(root, "src/data/offer-photos.json"), "utf8"));
        for (const photo of Object.values(photos)) {
          const file = resolve(root, `public${photo.src}`);
          const mime = photo.src.endsWith(".webp") ? "image/webp" : "image/jpeg";
          photo.src = `data:${mime};base64,${readFileSync(file).toString("base64")}`;
        }
        return { contents: JSON.stringify(photos), loader: "json" };
      });
    },
  }],
  alias: {
    "next/link": resolve(import.meta.dirname, "link.tsx"),
    "next/navigation": resolve(import.meta.dirname, "navigation.ts"),
    "@": resolve(root, "src"),
  },
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env.NEXT_PUBLIC_SITE_URL": "undefined",
  },
});

const b64 = (p) => readFileSync(resolve(root, p)).toString("base64");
const css = readFileSync(resolve(tmp, "app.css"), "utf8");
const icon = readFileSync(resolve(root, "src/app/icon.svg"), "utf8");
const script = js.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const html = `<!doctype html>
<html lang="ru" style="--font-inter:'Inter GB';--font-druk:'Druk Wide GB'">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#3b8beb">
<title>Новый год в новом городе. Чёрная пятница для ярких январских каникул | Горбилет</title>
<meta name="description" content="Куда поехать на январские каникулы. Москва, Петербург, Калининград, Казань и Нижний Новгород с идеями для поездки, экскурсиями и готовыми турами со скидками от Горбилета.">
<link rel="icon" href="data:image/svg+xml;base64,${Buffer.from(icon).toString("base64")}">
<style>
@font-face{font-family:'Inter GB';src:url(data:font/woff2;base64,${b64("src/fonts/inter-var.woff2")}) format('woff2');font-weight:100 900;font-display:swap}
@font-face{font-family:'Druk Wide GB';src:url(data:font/woff2;base64,${b64("src/fonts/druk-wide-medium.woff2")}) format('woff2');font-weight:500;font-display:swap}
${css}
</style>
</head>
<body class="flex min-h-svh flex-col">
<div id="root" class="contents"></div>
<noscript>Для работы сайта включите JavaScript.</noscript>
<script>${script}</script>
</body>
</html>`;

const out = resolve(root, "novyj-god-v-novom-gorode.html");
writeFileSync(out, html);
console.log("ok", out, (html.length / 1024).toFixed(0) + " KB");
