"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Same card surface as Milestones */
const CARD =
  "border border-section-border bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-section-border)_55%,transparent)_0%,color-mix(in_srgb,var(--color-section-border)_18%,transparent)_60%,color-mix(in_srgb,var(--color-section-border)_12%,transparent)_100%)] transition-colors duration-500 [@media(hover:hover)]:hover:border-button-ghost-border-hover/70";

/* Same glow as Milestones: a natural spotlight and a glowing border that
   follow the cursor. Mouse only, phones stay plain. */
const SPOTLIGHT = {
  background:
    "radial-gradient(260px circle at var(--mx) var(--my), color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)",
} as const;

const BORDER_GLOW = {
  padding: 1,
  background:
    "radial-gradient(200px circle at var(--mx) var(--my), var(--color-accent), transparent 70%)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const;

const DATA = {
  title: "What I know",
  intro:
    "The languages, frameworks and tools I use to build backends and make sense of data.",
  groups: [
    { title: "Languages", items: ["Java", "Python", "C++"] },
    {
      title: "Backend",
      items: [
        "Spring Boot",
        "Spring Security",
        "REST APIs",
        "JWT Auth",
        "MVC Architecture",
      ],
    },
    { title: "Database", items: ["MySQL", "JPA", "Hibernate"] },
    {
      title: "AI / Data",
      items: ["Scikit-learn", "Pandas", "NumPy", "Feature Engineering"],
    },
    {
      title: "Core CS",
      items: ["DSA", "OOP", "Operating Systems", "DBMS"],
    },
    {
      title: "Tools",
      items: ["Git", "GitHub", "Maven", "Postman"],
    },
  ],
};

export function Skills() {
  const root = useRef<HTMLElement>(null);

  /* Scroll entrance (unchanged) */
  useIso(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.selector(el)("[data-fade]");

      gsap.set(items, {
        opacity: 0,
        y: 10,
      });

      ScrollTrigger.batch(items, {
        start: "top 94%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.07,
            overwrite: true,
          }),
      });
    });

    return () => mm.revert();
  }, []);

  /* Cursor glow (mouse only) */
  useEffect(() => {
    const el = root.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;

    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-glow]"));
    const cleanups = rows.map((row) => {
      const move = (e: PointerEvent) => {
        const r = row.getBoundingClientRect();
        row.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        row.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      };
      row.addEventListener("pointermove", move);
      return () => row.removeEventListener("pointermove", move);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={root}
      id="skills"
      aria-label="Tech stack"
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto w-full max-w-page px-gutter pb-section pt-section md:px-gutter-md md:pb-section-md md:pt-section-md lg:px-gutter-lg">

        {/* Heading */}

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-12">
          <h2
            data-fade
            className={`select-none text-h2 text-heading md:whitespace-nowrap md:text-h2-md ${HIDDEN}`}
          >
            {DATA.title}
          </h2>

          <p
            data-fade
            className={`max-w-[32ch] text-[13px] leading-[1.65] text-muted sm:text-sm md:pb-1 md:text-base ${HIDDEN}`}
          >
            {DATA.intro}
          </p>
        </div>

        {/* Skill groups */}

        <ul className="mt-9 flex flex-col gap-2.5 sm:mt-11 md:mt-14 md:gap-3">
          {DATA.groups.map((g) => (
            <li
              key={g.title}
              data-fade
              data-glow
              className={`group/row relative grid grid-cols-1 gap-3 overflow-hidden rounded-xl px-4 py-4 sm:px-5 md:grid-cols-[minmax(0,0.7fr)_minmax(0,2fr)] md:items-center md:gap-8 md:px-7 md:py-5 ${CARD} ${HIDDEN}`}
              style={{ ["--mx" as string]: "50%", ["--my" as string]: "20%" }}
            >
              {/* Glow layers (fade in on hover, follow the cursor) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover/row:opacity-100"
                style={SPOTLIGHT}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 [@media(hover:hover)]:group-hover/row:opacity-100"
                style={BORDER_GLOW}
              />

              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-subheading/40 to-transparent"
              />

              <h3 className="relative text-[14px] font-semibold tracking-[-0.025em] text-heading sm:text-[15px] md:text-base">
                {g.title}
              </h3>

              <ul className="relative flex flex-wrap gap-1.5 sm:gap-2">
                {g.items.map((s) => (
                  <li
                    key={s}
                    className="rounded-md border border-chip-border bg-chip-bg px-2.5 py-1.5 text-[10px] font-medium leading-tight text-chip-text transition-colors duration-200 hover:border-card-border-hover sm:px-3 sm:py-2 sm:text-[11px] md:text-xs"
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