import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export default function NotFound() {
  return (
    <PageHero eyebrow="Ошибка 404" lines={["Рейс", "отменён"]}>
      <p>
        Такой страницы нет.{" "}
        <Link href="/" className="font-semibold underline decoration-2 underline-offset-4">
          Вернуться к направлениям
        </Link>
      </p>
    </PageHero>
  );
}
