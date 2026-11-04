import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityView } from "@/components/city-view";
import { getCity, listCities, type ListCity } from "@/data/cities";

export function generateStaticParams() {
  return listCities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/goroda/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city || city.kind !== "list") return {};
  const title = `Новый год ${city.inName}. Что успеть на январских каникулах`;
  const description = `${city.intro} Экскурсии со скидкой на Горбилете.`;
  return {
    title,
    description,
    alternates: { canonical: `/goroda/${city.slug}` },
    openGraph: { title, description, url: `/goroda/${city.slug}` },
  };
}

export default async function CityPage({ params }: PageProps<"/goroda/[slug]">) {
  const { slug } = await params;
  const found = getCity(slug);
  if (!found || found.kind !== "list") notFound();
  return <CityView city={found as ListCity} />;
}
