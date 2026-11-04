"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Плавное появление блока при скролле */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </Tag>
  );
}

/** Заголовок, строки которого выезжают из-под маски */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  onLoad = false,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  /** Анимировать сразу при загрузке, а не при попадании в экран */
  onLoad?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = onLoad || inView;
  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="-my-[0.16em] block py-[0.16em] [clip-path:inset(0_-100vw)]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ""}`}
            initial={reduce ? false : { y: "110%", rotate: 2 }}
            animate={show ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const FLAP = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789";

/** Табло с перелистывающимися буквами. Для скринридера текст целиком в aria-label */
export function SplitFlap({
  text,
  className,
  cellClassName,
  delay = 0,
  cells = false,
}: {
  text: string;
  className?: string;
  cellClassName?: string;
  delay?: number;
  /** Каждая буква в отдельной плашке */
  cells?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    const chars = [...text];
    const settleAt = chars.map((_, i) => 6 + i * 2 + Math.floor(Math.random() * 3));
    let frame = 0;
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        frame++;
        const next = chars
          .map((ch, i) =>
            ch === " " || frame >= settleAt[i] ? ch : FLAP[Math.floor(Math.random() * FLAP.length)],
          )
          .join("");
        setShown(next);
        if (frame >= Math.max(...settleAt)) clearInterval(timer);
      }, 42);
    }, delay * 1000);
    return () => {
      clearTimeout(start);
      if (timer) clearInterval(timer);
      setShown(text);
    };
  }, [inView, reduce, text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {[...shown].map((ch, i) =>
        cells ? (
          <span key={i} aria-hidden className={cellClassName}>
            {ch}
          </span>
        ) : (
          <span key={i} aria-hidden>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
