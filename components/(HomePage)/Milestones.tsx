"use client";

/**
 * Milestones section. Self-contained.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (card, border) | Ice Sheet #DFEAF5 (names, titles)
 * Glacier #A8C8EB (numbers) | Storm #657E9B (description, years) | Tangerine #FF895D (selection)
 *
 * Award style list inside one calm dark blue card per group.
 * No inner boxes, no divider lines, no icons. Space and size do the separating.
 *
 * Every piece of information appears exactly once.
 * Layout: two cards side by side on desktop, stacked on phones.
 * Motion: one soft fade-up per block when it enters the screen. Nothing else moves.
 */

import { Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-ms-display",
});

const DISPLAY = "font-[family-name:var(--font-ms-display)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Card: a soft dark blue with a thin matching edge. Change this one value to adjust it. */
const CARD = "bg-[#253B56]/35 border border-[#253B56]";

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
      className={`${manrope.variable} ${DISPLAY} relative isolate overflow-clip bg-[#0B111B] text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B]`}
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 py-16 md:px-12 md:py-24 lg:px-16">
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {DATA.map((group) => (
            <div key={group.title} className={`flex flex-col gap-10 rounded-[2rem] p-7 md:gap-14 md:p-12 ${CARD}`}>
              <div className="flex flex-col gap-4">
                <h2
                  data-fade
                  className={`select-none text-[length:clamp(2.25rem,10vw,3rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#DFEAF5] md:text-[length:min(3.8vw,7vh)] ${HIDDEN}`}
                >
                  {group.title}
                </h2>
                <p data-fade className={`max-w-[40ch] text-[15px] font-medium leading-[1.7] text-[#657E9B] md:text-base ${HIDDEN}`}>
                  {group.text}
                </p>
              </div>

              <ul className="flex flex-col gap-7 md:gap-9">
                {group.items.map((it, i) => (
                  <li
                    key={it.name}
                    data-fade
                    className={`grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-3 md:grid-cols-[2.75rem_1fr_auto] ${HIDDEN}`}
                  >
                    <span className="text-xs font-semibold tabular-nums text-[#A8C8EB] md:text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[length:clamp(1.1rem,4.8vw,1.3rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-[#DFEAF5] md:text-[length:min(1.5vw,2.8vh)]">
                      {it.name}
                    </span>
                    {it.meta && (
                      <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-[#657E9B] md:text-sm">{it.meta}</span>
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