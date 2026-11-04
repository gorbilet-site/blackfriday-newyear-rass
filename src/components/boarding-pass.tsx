import { Plane } from "lucide-react";
import { LogoMark } from "./logo";

/** Декоративный посадочный талон. Читается скринридером как одна подпись */
export function BoardingPass({ className }: { className?: string }) {
  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1];
  return (
    <figure
      className={`ticket relative rounded-[28px] bg-paper text-ink shadow-[0_40px_80px_-30px_rgba(10,40,100,0.5)] [--notch-y:62%] ${className ?? ""}`}
      aria-label="Посадочный талон. Откуда будни, куда каникулы. Пассажир вы, январь 2027"
    >
      <div className="p-6 pb-5 sm:p-7" aria-hidden>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[13px] font-semibold text-blue-deep">
            <LogoMark className="h-5 w-auto" />
            Посадочный талон
          </span>
          <span className="rounded-full bg-blush px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-deep">
            −%
          </span>
        </div>

        <div className="mt-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-mist">Откуда</p>
            <p className="display mt-1 text-[clamp(1.05rem,1.45vw,1.35rem)]">Будни</p>
          </div>
          <div className="mb-2 flex flex-1 items-center gap-1 text-blue">
            <span className="perforation flex-1 text-blue/40" />
            <Plane className="size-5 shrink-0" />
            <span className="perforation flex-1 text-blue/40" />
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-mist">Куда</p>
            <p className="display mt-1 text-[clamp(1.05rem,1.45vw,1.35rem)] text-blue">Каникулы</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-[13px]">
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-mist">Пассажир</dt>
            <dd className="mt-0.5 font-semibold">Вы</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-mist">Дата</dt>
            <dd className="mt-0.5 font-semibold">Январь 2027</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-wider text-mist">Места</dt>
            <dd className="mt-0.5 font-semibold">Со скидкой</dd>
          </div>
        </dl>
      </div>
      <div className="mx-6 border-t-2 border-dashed border-line sm:mx-7" aria-hidden />
      <div className="flex items-center justify-between gap-4 p-6 pt-5 sm:px-7" aria-hidden>
        <div className="flex h-10 items-stretch gap-[3px]">
          {bars.map((w, i) => (
            <span key={i} className="bg-ink" style={{ width: w }} />
          ))}
        </div>
        <span className="display text-xl text-blue">НГ-27</span>
      </div>
    </figure>
  );
}
