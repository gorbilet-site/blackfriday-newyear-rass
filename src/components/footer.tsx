import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Send } from "lucide-react";
import { Logo } from "./logo";
import { cities, leadHref } from "@/data/cities";
import { contacts, nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="grain relative isolate overflow-hidden bg-ink text-paper">
      <div className="shell relative pb-10 pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display text-[clamp(2rem,8.4vw,3.6rem)] lg:text-[clamp(2rem,3.4vw,3.4rem)]">
              Встретимся
              <br />
              в январе
            </p>
            <a
              href={site.gorbilet}
              target="_blank"
              rel="noopener"
              className="group mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-blue pl-7 pr-2 text-[17px] font-semibold text-ink transition-colors duration-500 hover:bg-paper"
            >
              Все скидки на Горбилете
              <span className="grid size-10 place-items-center rounded-full bg-ink text-paper">
                <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </div>

          <nav aria-label="Разделы сайта" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:pl-10">
            <div>
              <h2 className="text-sm font-semibold text-paper/70">Направления</h2>
              <ul className="mt-4 grid gap-3">
                {cities.map((c) => (
                  <li key={c.slug}>
                    {c.kind === "list" ? (
                      <Link href={`/goroda/${c.slug}`} className="transition-opacity hover:opacity-70">
                        {c.name}
                      </Link>
                    ) : (
                      <a href={leadHref(c)} target="_blank" rel="noopener" className="transition-opacity hover:opacity-70">
                        {c.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-paper/70">Сайт</h2>
              <ul className="mt-4 grid gap-3">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="transition-opacity hover:opacity-70">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="text-sm font-semibold text-paper/70">Поддержка</h2>
              <ul className="mt-4 grid gap-3">
                <li>
                  <a href={`mailto:${contacts.email}`} className="inline-flex items-center gap-2 transition-opacity hover:opacity-70">
                    <Mail className="size-4" />
                    {contacts.email}
                  </a>
                </li>
                <li>
                  <a href={contacts.vk} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition-opacity hover:opacity-70">
                    <MessageCircle className="size-4" />
                    Сообщения ВКонтакте
                  </a>
                </li>
                <li>
                  <a href={contacts.telegram} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition-opacity hover:opacity-70">
                    <Send className="size-4" />
                    Телеграм-бот
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 sm:mt-28">
          <Logo className="h-auto w-full" title="Горбилет" />
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-paper/25 pt-6 text-sm text-paper/75 sm:flex-row sm:justify-between">
          <p>© 2026 Горбилет</p>
          <p>Цены и скидки указаны на страницах событий и могут меняться</p>
        </div>
      </div>
    </footer>
  );
}
