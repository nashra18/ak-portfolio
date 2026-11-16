"use client";

/**
 * Skills section. Self-contained.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Ice Sheet #DFEAF5 (titles, skills) | Glacier #A8C8EB (numbers, phone skills)
 * Storm #657E9B (intro) | Tangerine #FF895D (selection)
 *
 * Award style list: no cards, no boxes, no lines, no icons, no slashes.
 * Each row: number, group title on the left, skills on the right.
 * Space and size do the separating.
 *
 * Phone hierarchy: number sits beside the title, title is heavy (800), skills are small, light (500) and softer in colour.
 *
 * Every piece of information appears exactly once.
 * Layout: title and intro on top, then one row per group. Stacked on phones.
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
  variable: "--font-skills-display",
});

const DISPLAY = "font-[family-name:var(--font-skills-display)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

const DATA = {
  title: "What I know",
  intro: "The languages, frameworks and tools I use to build backends and make sense of data.",
  groups: [
    { title: "Languages", items: ["Java", "Python", "C++"] },
    { title: "Backend", items: ["Spring Boot", "Spring Security", "REST APIs", "JWT Auth", "MVC Architecture"] },
    { title: "Database", items: ["MySQL", "JPA", "Hibernate"] },
    { title: "AI / Data", items: ["Scikit-learn", "Pandas", "NumPy", "Feature Engineering"] },
    { title: "Core CS", items: ["DSA", "OOP", "Operating Systems", "DBMS"] },
    { title: "Tools", items: ["Git", "GitHub", "Maven", "Postman"] },
  ],
};

export function Skills() {
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
      id="skills"
      aria-label="Tech stack"
      className={`${manrope.variable} ${DISPLAY} relative isolate overflow-clip bg-[#0B111B] text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B]`}
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-16">
        {/* Heading: title left, intro right on desktop */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-16">
          <h2
            data-fade
            className={`select-none text-[12vw] font-extrabold leading-[0.9] tracking-[-0.055em] text-[#DFEAF5] md:whitespace-nowrap md:text-[length:min(7vw,11vh)] ${HIDDEN}`}
          >
            {DATA.title}
          </h2>
          <p data-fade className={`max-w-[36ch] text-[14px] font-medium leading-[1.65] text-[#657E9B] md:pb-2 md:text-base ${HIDDEN}`}>
            {DATA.intro}
          </p>
        </div>

        {/* Rows */}
{/* Rows: dashed line between groups */}
<ul className="mt-14 flex flex-col divide-y divide-dashed divide-[#253B56] md:mt-24">
  {DATA.groups.map((g, i) => (
    <li
      key={g.title}
      className="grid gap-3 py-8 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-16 md:py-10"
    >
      <div data-fade className={`flex items-baseline gap-3 md:gap-4 ${HIDDEN}`}>
        <span className="text-sm font-extrabold tabular-nums tracking-[-0.02em] text-[#A8C8EB] md:text-sm md:font-semibold md:tracking-normal">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="text-[1.5rem] font-extrabold leading-[1] tracking-[-0.045em] text-[#DFEAF5] md:text-[length:min(2.4vw,4.2vh)]">
          {g.title}
        </h3>
      </div>

      <p
        data-fade
        className={`max-w-[34ch] pl-[2.1rem] text-[15px] font-medium leading-[1.7] tracking-[-0.01em] text-[#A8C8EB]/70 md:max-w-none md:pl-0 md:text-[length:min(1.5vw,2.8vh)] md:leading-[1.6] md:tracking-[-0.02em] md:text-[#DFEAF5]/80 ${HIDDEN}`}
      >
        {g.items.join(", ")}
      </p>
    </li>
  ))}
</ul>
      </div>
    </section>
  );
}

export default Skills;