"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-skills-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-skills-mono" });

const DISPLAY = "font-[family-name:var(--font-skills-display)]";
const MONO = "font-[family-name:var(--font-skills-mono)]";

/*
  Skills: same theme as the Hero. Compact and easy to scan.
  Layout: heading row on top, then one clean row per skill group (title on the left, skills on the right).
  Skills in a row are separated by a "/" in Iced Denim.
  Spacing: bigger gap at the top, tight rows, 20vw of space at the bottom.
  Background is Frost (same as the Hero). No line above the first row or below the last.

  Palette
  Frost #F1F6FA | Deep Fjord #18364B | Iced Denim #4F91C9 | Pistachio #A8B85A (accent) | White #FFFFFF
*/

const GROUPS: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["Java", "Python", "C++"] },
  { title: "Backend", items: ["Spring Boot","Spring Security", "REST APIs", "JWT Auth", "MVC Architecture"] },
  { title: "Database", items: ["MySQL", "JPA", "Hibernate"] },
  { title: "AI / Data", items: ["Scikit-learn", "Pandas", "NumPy", "Feature Engineering"] },
  { title: "Core CS", items: ["DSA", "OOP", "Operating Systems", "DBMS"] },
  { title: "Tools", items: ["Git", "GitHub", "Maven", "Postman"] },
];

const pad = (n: number) => String(n).padStart(2, "0");

/* ---------- text splitter ---------- */

const MASK = "-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-top";

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").flatMap((w, i) => {
        const word = (
          <span key={i} aria-hidden className={`${MASK} whitespace-nowrap`}>
            {Array.from(w).map((c, k) => (
              <span key={k} data-char className="inline-block will-change-transform">
                {c}
              </span>
            ))}
          </span>
        );
        return i ? [" ", word] : [word];
      })}
    </>
  );
}

/* ---------- section ---------- */

export function Skills() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const head = q("[data-head]")[0];

      gsap.fromTo(
        q("[data-head] [data-char]"),
        { yPercent: 118 },
        { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.035, scrollTrigger: { trigger: head, start: "top 92%", once: true } }
      );
      gsap.fromTo(
        q("[data-intro]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3, scrollTrigger: { trigger: head, start: "top 92%", once: true } }
      );

      q("[data-row]").forEach((row) => {
        const r = gsap.utils.selector(row);
        const items = r("[data-item]");
        const line = r("[data-line]");
        const meta = r("[data-meta]");

        gsap.set(line, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(meta, { opacity: 0, y: 10 });
        gsap.set(items, { yPercent: 110 });

        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } })
          .to(line, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0)
          .to(meta, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.2)
          .to(items, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.05 }, 0.3);
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="skills"
      aria-label="Tech stack"
      className={`${display.variable} ${mono.variable} ${DISPLAY} overflow-clip bg-[#F1F6FA] px-5 pb-[20vw] pt-24 text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B] md:px-12 md:pt-32 lg:px-16 lg:pt-36`}
    >
      {/* heading row */}
      <div className="mb-8 grid gap-4 md:mb-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
        <div className="lg:col-span-8">
          <span className={`${MONO} mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-[#4F91C9]`}>
            <span aria-hidden className="size-2 rounded-full bg-[#A8B85A]" />
            Tech stack
          </span>
          <h2
            data-head
            aria-label="What I know"
            className="text-[3rem] font-extrabold leading-[0.9] tracking-[-0.055em] md:text-7xl xl:text-[6.5rem]"
          >
            <Chars text="What I know" />
            <span className="text-[#A8B85A]">.</span>
          </h2>
        </div>
        <p data-intro className="max-w-[36ch] text-base font-medium leading-[1.5] text-[#18364B]/75 md:text-lg lg:col-span-4 lg:pb-2">
          The languages, frameworks and tools I use to build backends and make sense of data.
        </p>
      </div>

      {/* list: lines only between rows */}
      <ul>
        {GROUPS.map((g, idx) => (
          <li
            key={g.title}
            data-row
            className="relative grid gap-3 py-5 md:py-6 lg:grid-cols-12 lg:items-baseline lg:gap-x-12"
          >
            {idx > 0 && <span data-line aria-hidden className="absolute left-0 top-0 h-px w-full bg-[#18364B]/20" />}

            <div data-meta className="flex items-baseline gap-3 lg:col-span-4">
              <span className={`${MONO} text-xs font-medium text-[#4F91C9]`}>{pad(idx + 1)}</span>
              <h3 className="text-2xl font-bold leading-none tracking-[-0.04em] md:text-[2rem]">{g.title}</h3>
            </div>

            <ul className="group/list flex flex-wrap items-baseline gap-y-1 lg:col-span-8">
              {g.items.map((t, i) => (
                <li key={t} className="overflow-hidden pb-[0.1em]">
                  <span data-item className="flex items-baseline">
                    <span className="cursor-default text-lg font-medium leading-[1.3] tracking-[-0.02em] transition-[opacity,color] duration-300 group-hover/list:opacity-40 hover:!text-[#4F91C9] hover:!opacity-100 md:text-2xl">
                      {t}
                    </span>
                    {i < g.items.length - 1 && (
                      <span aria-hidden className="mx-3 text-lg font-light text-[#4F91C9] md:mx-4 md:text-2xl">
                        /
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;