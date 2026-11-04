"use client";

import { RotateCcw, Share2 } from "lucide-react";
import { useState } from "react";
import type { ListCity } from "@/data/cities";
import { IdeasList, Progress, useChecklist } from "./checklist";

export function CityPlan({ city }: { city: ListCity }) {
  const { done, toggle, reset, count } = useChecklist(city.slug, city.ideas.length);
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = location.href.split("#")[0];
    const title = `Новый год ${city.inName}. Восемь идей для поездки`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* пользователь закрыл окно */
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <aside className="min-w-0 lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <div className="ticket rounded-[28px] bg-ink p-7 text-paper [--notch-y:72%]">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-paper/60">Ваш план</p>
            <p className="display mt-4 text-[clamp(2.4rem,4vw,3.4rem)]">
              {count}
              <span className="text-paper/40">/{city.ideas.length}</span>
            </p>
            <div className="mt-6">
              <Progress done={done} tone="dark" />
            </div>
            <div className="mt-8 border-t-2 border-dashed border-paper/20 pt-6">
              <p className="text-[15px] leading-[1.5] text-paper/75">Отметки хранятся только в этом браузере. Ссылкой можно поделиться с теми, с кем едете.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-blue"
                >
                  <Share2 className="size-4" />
                  <span aria-live="polite">{copied ? "Ссылка скопирована" : "Поделиться"}</span>
                </button>
                {count > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full border border-paper/30 px-5 py-2.5 text-[15px] font-semibold transition-colors hover:border-paper"
                  >
                    <RotateCcw className="size-4" />
                    Сбросить
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0 lg:col-span-8">
        <IdeasList city={city} done={done} toggle={toggle} />
      </div>
    </div>
  );
}
