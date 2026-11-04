import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";

const inter = localFont({
  src: "../fonts/inter-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const druk = localFont({
  src: "../fonts/druk-wide-medium.woff2",
  variable: "--font-druk",
  weight: "500",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}. ${site.tagline} | Горбилет`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "январские каникулы",
    "куда поехать на новый год",
    "чёрная пятница",
    "экскурсии со скидкой",
    "Калининград",
    "Казань",
    "Нижний Новгород",
    "Москва",
    "Петербург",
    "Горбилет",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: `${site.name} от Горбилета`,
    title: site.name,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Новый год в новом городе. Горбилет" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#3b8beb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${druk.variable}`}>
      <body className="flex min-h-svh flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
