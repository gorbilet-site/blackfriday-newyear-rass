import type { NextConfig } from "next";

// STATIC_EXPORT=1 npm run build собирает статический сайт в папку out/ для любого хостинга
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  // в статической выгрузке частичный пререндер недоступен, сайт и так полностью статичный
  cacheComponents: !staticExport,
  partialPrefetching: !staticExport,
  ...(staticExport ? { output: "export", trailingSlash: true, images: { unoptimized: true } } : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Fallback for Windows environments where Turbopack's CSS worker exits early.
  webpack(config) {
    config.module.rules.unshift({
      test: /globals\.css$/,
      enforce: "pre",
      use: ["@tailwindcss/turbopack"],
    });
    return config;
  },
};

export default nextConfig;
