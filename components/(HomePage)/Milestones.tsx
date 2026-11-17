"use client";

/**
 * Milestones section. Self-contained.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind (v3.2+ for named groups).
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (card, border) | Ice Sheet #DFEAF5 (titles, names)
 * Glacier #A8C8EB (numbers, description, years) | Storm #657E9B (hover border) | Tangerine #FF895D (accent)
 *
 * Award style list inside one calm dark blue card per group.
 * Card has a soft top-down gradient and a faint glow line on top. Rows get a quiet hover state.
 * Years sit in small outlined chips.
 *
 * Type scale (one font, three weights): 800 titles, 600 item names, 500 body.
 *
 * Layout: two cards side by side on desktop, stacked on phones.
 * Motion: unchanged. One soft fade-up per block when it enters the screen.
 * Hover effects never use transform on the [data-fade] elements, so GSAP's inline transforms never clash with them.
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
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Card: soft dark blue gradient, thin edge that brightens on hover. Change this one value to adjust it. */
const CARD =
  "border border-[#253B56] bg-[linear-gradient(165deg,rgba(37,59,86,0.55)_0%,rgba(37,59,86,0.18)_60%,rgba(37,59,86,0.12)_100%)] transition-colors duration-500 hover:border-[#657E9B]/70";

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
      <div className="mx-auto w-full max-w-[90rem] px-5 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {DATA.map((group) => (
            <div
              key={group.title}
              className={`relative flex flex-col gap-8 overflow-hidden rounded-[2rem] p-7 md:gap-10 md:p-10 ${CARD}`}
            >
              {/* faint light line along the top edge */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#A8C8EB]/40 to-transparent"
              />

              <div className="flex flex-col gap-3">
                <h2
                  data-fade
                  className={`select-none text-[length:clamp(2.25rem,10vw,3rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#DFEAF5] md:text-[length:min(3.8vw,7vh)] ${HIDDEN}`}
                >
                  {group.title}
                </h2>

                <p data-fade className={`max-w-[40ch] text-[13px] font-medium leading-[1.65] text-[#A8C8EB]/70 md:text-sm ${HIDDEN}`}>
                  {group.text}
                </p>
              </div>

              <ul className="flex flex-col gap-1.5">
                {group.items.map((it, i) => (
                  <li
                    key={it.name}
                    data-fade
                    className={`group/row grid grid-cols-[1.75rem_1fr_auto] items-center gap-x-3 rounded-2xl px-3 py-3.5 transition-colors duration-500 ${SPRING} hover:bg-[#0B111B]/45 md:grid-cols-[2.25rem_1fr_auto] md:px-4 md:py-4 ${HIDDEN}`}
                  >
                    <span className={`text-[11px] font-semibold tabular-nums text-[#A8C8EB]/80 transition-colors duration-500 group-hover/row:text-[#FF895D] md:text-xs`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] font-semibold leading-[1.3] tracking-[-0.02em] text-[#DFEAF5] md:text-base">
                      {it.name}
                    </span>
                    {it.meta && (
                      <span className="whitespace-nowrap rounded-full border border-[#253B56] bg-[#0B111B]/40 px-2.5 py-1 text-[11px] font-medium leading-none tabular-nums text-[#A8C8EB]/85 transition-colors duration-500 group-hover/row:border-[#657E9B] md:text-xs">
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