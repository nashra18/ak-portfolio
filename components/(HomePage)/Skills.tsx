"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Font is loaded once in layout.tsx. */

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
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto w-full max-w-page px-gutter pb-section pt-section md:px-gutter-md md:pb-section-md md:pt-section-md lg:px-gutter-lg">
        {/* Heading: title left, intro right on desktop */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-16">
          <h2 data-fade className={`select-none text-h2 md:text-h2-md text-heading md:whitespace-nowrap ${HIDDEN}`}>
            {DATA.title}
          </h2>
          <p data-fade className={`max-w-[36ch] text-sub md:text-sub-md text-muted md:pb-2 ${HIDDEN}`}>
            {DATA.intro}
          </p>
        </div>

        {/* Rows: one by one. Phone: stacked card. Desktop: wide horizontal row, title left, chips right */}
        <ul className="mt-12 flex flex-col gap-3 md:mt-16 md:gap-4">
          {DATA.groups.map((g) => (
            <li
              key={g.title}
              data-fade
              className={`flex flex-col gap-5 rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.09] md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] md:items-center md:gap-12 md:px-9 md:py-7 ${HIDDEN}`}
            >
              <h3 className="text-card md:text-card-md text-heading">{g.title}</h3>

              <ul className="flex flex-wrap gap-2 md:gap-2.5">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-xs font-medium leading-none text-subheading-soft md:px-3.5 md:py-2.5 md:text-sm"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Skills;