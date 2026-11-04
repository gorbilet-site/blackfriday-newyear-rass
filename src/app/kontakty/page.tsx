import type { Metadata } from "next";
import { ArrowUpRight, Bot, Mail, MessageCircle, Send, Ticket } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion";
import { contacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Как связаться с поддержкой Горбилета по вопросам билетов, экскурсий и возвратов.",
  alternates: { canonical: "/kontakty" },
};

const channels = [
  { icon: MessageCircle, label: "Сообщения ВКонтакте", value: "Напишите сообществу Горбилета", href: contacts.vk },
  { icon: Send, label: "Телеграм-бот поддержки", value: "Ответит в Телеграме", href: contacts.telegram },
  { icon: Bot, label: "Бот в MAX", value: "Ответит в мессенджере MAX", href: contacts.max },
  { icon: Mail, label: "Почта", value: contacts.email, href: `mailto:${contacts.email}` },
  { icon: Ticket, label: "Мои билеты", value: "Найти купленный билет", href: contacts.tickets },
];

export default function Contacts() {
  return (
    <>
      <PageHero eyebrow="Контакты" lines={["На связи", "до самого", "отправления"]}>
        <p>Вопросы о билетах, датах и возвратах решает поддержка Горбилета. Выберите удобный канал.</p>
      </PageHero>

      <section className="py-20 sm:py-28">
        <ul className="shell grid gap-4 sm:grid-cols-2">
          {channels.map((c, i) => {
            const external = !c.href.startsWith("mailto:");
            return (
              <Reveal as="li" key={c.label} delay={i * 0.06}>
                <a
                  href={c.href}
                  {...(external ? { target: "_blank", rel: "noopener" } : {})}
                  className="group relative isolate flex items-center gap-5 overflow-hidden rounded-[28px] border border-line p-6 transition-colors duration-500 hover:border-blue sm:p-8"
                >
                  <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-blue transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-blush text-blue transition-colors duration-500 group-hover:bg-paper">
                    <c.icon className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xl font-semibold">{c.label}</span>
                    <span className="mt-1 block break-words text-[15px] text-mist transition-colors duration-500 group-hover:text-ink/75">{c.value}</span>
                  </span>
                  <ArrowUpRight className="size-6 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              </Reveal>
            );
          })}
        </ul>
      </section>
    </>
  );
}
