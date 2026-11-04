import photos from "@/data/offer-photos.json";

type Photo = { src: string };

/** Local gallery photo shared by the Next.js and standalone HTML builds. */
export function OfferPhoto({ href, alt, className = "" }: { href?: string; alt: string; className?: string }) {
  const photo = href ? (photos as Record<string, Photo>)[href] : undefined;
  if (!photo) return null;
  return (
    // Native images also work in the offline, single-file version.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${photo.src}` : photo.src}
      alt={alt}
      width={900}
      height={600}
      loading="lazy"
      decoding="async"
      className={`block aspect-[3/2] w-full object-cover ${className}`}
    />
  );
}
