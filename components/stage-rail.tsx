"use client";

import { useEffect, useRef } from "react";
import { STAGE_LABEL, type Stage } from "@/lib/labels";

type Item = { stage: Stage; title: string; text: string };

/**
 * The before / during / after rail. The orange rule draws itself once when the
 * rail enters the viewport, with readable content before hydration.
 */
export function StageRail({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let animation: Animation | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animation = el
            .querySelector(".rail-line")
            ?.animate(
              [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
              { duration: 900, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
            );
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      animation?.cancel();
    };
  }, []);

  return (
    <div ref={ref}>
      <div className="h-[3px] w-full bg-warm-2">
        <div className="rail-line h-full w-full bg-orange" />
      </div>
      <ol className="rail-dots grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-8">
        {items.map((item) => (
          <li key={item.stage} className="rail-dot relative pt-6">
            <span
              aria-hidden
              className="absolute -top-[9px] left-0 h-[15px] w-[15px] rounded-full border-[3px] border-paper bg-orange"
            />
            <p className="display text-[clamp(2.4rem,2rem+2vw,4rem)] leading-none text-ink">
              {STAGE_LABEL[item.stage]}
            </p>
            <h3 className="title mt-4 text-[1.35rem]">{item.title}</h3>
            <p className="mt-2 max-w-[38ch] text-ink-2">{item.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Compact variant for program pages: which stages a program covers. */
export function StageChips({ stages }: { stages: Stage[] }) {
  const all: Stage[] = ["before", "during", "after"];
  return (
    <ol className="flex items-center gap-0" aria-label="Stages covered">
      {all.map((s, i) => {
        const on = stages.includes(s);
        return (
          <li key={s} className="flex items-center">
            <span
              className={`strip rounded-[3px] px-2.5 py-1 ${on ? "bg-orange text-ink" : "bg-warm text-ink-3"}`}
              aria-current={on ? "true" : undefined}
            >
              {STAGE_LABEL[s]}
            </span>
            {i < all.length - 1 && (
              <span
                aria-hidden
                className={`h-[2px] w-4 ${on && stages.includes(all[i + 1]) ? "bg-orange" : "bg-warm-2"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
