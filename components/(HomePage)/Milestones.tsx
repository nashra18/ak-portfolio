"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Hover effects never use transform on the [data-fade] elements, so GSAP's inline transforms never clash. */

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Card: soft gradient built from --color-section-border. Change this one value to adjust it. */
const CARD =
  "border border-section-border bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-section-border)_55%,transparent)_0%,color-mix(in_srgb,var(--color-section-border)_18%,transparent)_60%,color-mix(in_srgb,var(--color-section-border)_12%,transparent)_100%)] transition-colors duration-500 hover:border-button-ghost-border-hover/70";

/* Content: edit here */

type Item = { name: string; meta?: string };

const DATA: { title: string; text: string; items: Item[] }[] = [
  {
    title: "Hackathons",
    text: "Building solutions, collaborating with teams, and solving real world challenges under tight deadlines.",
    items: [
      { name: "Smart India Hackathon", meta: "2025" },
      { name: "Bharatiya Antariksh Hackathon", meta: "ISRO, 2026" },
      { name: "HACKHAZARDS '26", meta: "2026" },
      { name: "GDG HackFest 2.0", meta: "2026" },
    ],
  },
  {
    title: "Certifications",
    text: "Focused on backend development, AI, and software engineering.",
    items: [
      { name: "Oracle AI Foundations Associate" },
      { name: "HackerRank Java (Basic)" },
      { name: "Tata GenAI Data Analytics Simulation" },
    ],
  },
];

export default function Milestones() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.selector(el)("[data-fade]");
      gsap.set(items, { opacity: 0, y: 12 });

      // one soft fade-up per block, once, as it enters the screen
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, overwrite: true }),
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="milestones"
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto w-full max-w-page px-gutter py-section md:px-gutter-md md:py-section-md lg:px-gutter-lg">
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {DATA.map((group) => (
            <div
              key={group.title}
              className={`relative flex flex-col gap-8 overflow-hidden rounded-[2rem] p-7 md:gap-10 md:p-10 ${CARD}`}
            >
              {/* faint light line along the top edge */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-subheading/40 to-transparent"
              />

              <div className="flex flex-col gap-3">
                <h2 data-fade className={`select-none text-title md:text-title-md text-heading ${HIDDEN}`}>
                  {group.title}
                </h2>

                <p data-fade className={`max-w-[40ch] text-[13px] font-medium leading-[1.65] text-subheading-soft md:text-sm ${HIDDEN}`}>
                  {group.text}
                </p>
              </div>

              <ul className="flex flex-col gap-1.5">
                {group.items.map((it, i) => (
                  <li
                    key={it.name}
                    data-fade
                    className={`group/row grid grid-cols-[1.75rem_1fr_auto] items-center gap-x-3 rounded-2xl px-3 py-3.5 transition-colors duration-500 ${SPRING} hover:bg-section-bg/45 md:grid-cols-[2.25rem_1fr_auto] md:px-4 md:py-4 ${HIDDEN}`}
                  >
                    <span className="text-[11px] font-semibold tabular-nums text-subheading transition-colors duration-500 group-hover/row:text-accent md:text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] font-semibold leading-[1.3] tracking-[-0.02em] text-heading md:text-base">
                      {it.name}
                    </span>
                    {it.meta && (
                      <span className="whitespace-nowrap rounded-full border border-section-border bg-section-bg/40 px-2.5 py-1 text-[11px] font-medium leading-none tabular-nums text-subheading transition-colors duration-500 group-hover/row:border-button-ghost-border-hover md:text-xs">
                        {it.meta}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}