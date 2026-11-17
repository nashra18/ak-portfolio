"use client";

/**
 * Projects section. Dark, flat, editorial. No images, no gsap.
 * Needs: next (next/font), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Card #101A28 (card) | Edge #1C2B40 (card border) | Atlantic #253B56 (stack block)
 * Ice Sheet #DFEAF5 (titles, live link) | Glacier #A8C8EB (stack text) | Storm #657E9B (numbers, labels)
 * Tangerine #FF895D (selection, link hover)
 *
 * Typography carries the message. Two voices: heavy Manrope for names, JetBrains Mono for the technical layer
 * (number, one-line description, labels, stack). Contrast comes from size, weight and tone, not decoration.
 *
 * Design rules, kept deliberately plain:
 *   - soft whitish flat cards, one thin border, no gradients, no glow, no ghost numbers, no lift on hover
 *   - on hover the card gets a slightly lighter fill, a brighter border, and its number turns tangerine. The number sits right next to the title.
 *   - sentence case labels, no uppercase tracking tags
 *   - tangerine appears only on the card number (hover), link hover and text selection
 *   - links are text links with an arrow, not filled buttons
 *   - the stack sits in small solid blocks
 *
 * Phone: 1 column. Tablet: 2 columns. Laptop and up: 3 columns.
 *
 * Motion: one soft fade-up per card when it enters the screen. Nothing else moves.
 */

import { JetBrains_Mono, Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-projects-display",
});

/* Technical layer: numbers, labels, one-line descriptions and the stack use a mono face.
   Big heavy Manrope titles against small mono details is the contrast that says "backend". */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-projects-mono",
});

const DISPLAY = "font-[family-name:var(--font-projects-display)]";
const MONO = "font-[family-name:var(--font-projects-mono)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

type Project = {
  title: string;
  kind: string; // one short line: what it is
  problem: string; // the problem it solved
  stack: string[];
  live: string;
  code: string;
};

const DATA: { title: string; intro: string; projects: Project[] } = {
  title: "What I built",
  intro: "Each project starts with a real problem. Here is what was broken, and what I built to fix it.",
  projects: [
    {
      title: "Finance Dashboard",
      kind: "Secure finance management platform",
      problem:
        "Financial records are private, and not every user should see or change everything. This backend puts every endpoint behind JWT login and gives each role only the actions it is allowed, so data stays protected and access stays under control.",
      stack: ["Java", "Spring Boot", "MySQL", "JWT"],
      live: "https://finance-pro-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/finance_dashboard",
    },
    {
      title: "Sibbu",
      kind: "AI healthcare chatbot",
      problem:
        "Finding clear health information fast is hard, and search results are full of noise. Sibbu answers health questions in plain language using Google Gemini, and keeps conversations in SQLite so people can come back to them.",
      stack: ["Python", "Flask", "Google Gemini", "SQLite"],
      live: "https://sibbu.onrender.com/",
      code: "https://github.com/meranaamkhann/Sibbu",
    },
    {
      title: "URL Shortener",
      kind: "Short links with analytics",
      problem:
        "Long links are messy to share and you never know if anyone opened them. This app creates short links with custom aliases, ties them to a login so each person manages only their own, and shows how many times each link was used.",
      stack: ["React", "Node", "MongoDB", "JWT"],
      live: "https://url-shortner-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann?tab=repositories",
    },
    {
      title: "AeroSense",
      kind: "Air quality prediction model",
      problem:
        "Air quality is usually known only after it has already turned bad. AeroSense learns from historical readings and predicts air quality ahead of time, so people can plan around it instead of reacting to it.",
      stack: ["Python", "Pandas", "Scikit-learn", "ML"],
      live: "https://air-quality-prediction-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/AeroSense",
    },
    {
      title: "Expense Tracker",
      kind: "Personal expense manager",
      problem:
        "Daily spending is scattered across payments and memory, so it is hard to see where money actually goes. This full stack app gives one place to record, edit and review personal expenses.",
      stack: ["Java", "Spring Boot", "React", "TypeScript"],
      live: "https://spendwise-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/InCampus_MVP",
    },
    {
      title: "ExoNova",
      kind: "Exoplanet detection with ML",
      problem:
        "Finding exoplanets means studying huge amounts of star light curve data, which is slow to check by hand. ExoNova trains a machine learning model on that data to spot the signs of a planet automatically.",
      stack: ["Python", "TypeScript", "HTML", "JavaScript"],
      live: "https://ai-exoplanet-discovery-platform.vercel.app/",
      code: "https://github.com/meranaamkhann/ExoNova",
    },
  ],
};

const LINK =
  "inline-flex items-center gap-1.5 text-sm font-semibold leading-none underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors duration-300 hover:text-[#FF895D] hover:decoration-[#FF895D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D]";

/** Small arrow for external links */
const Arrow = () => (
  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-fade]"));
    items.forEach((i) => {
      i.style.opacity = "0";
      i.style.transform = "translateY(12px)";
      i.style.transition = "opacity 700ms cubic-bezier(.22,1,.36,1), transform 700ms cubic-bezier(.22,1,.36,1)";
    });

    // one soft fade-up per block, once, as it enters the screen
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const t = e.target as HTMLElement;
          t.style.transitionDelay = `${n++ * 80}ms`;
          t.style.opacity = "1";
          t.style.transform = "none";
          io.unobserve(t);
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((i) => io.observe(i));

    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={root}
      id="projects"
      aria-label="Projects"
      className={`${manrope.variable} ${mono.variable} ${DISPLAY} relative isolate overflow-clip bg-[#0B111B] text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B]`}
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

        {/* Cards: 1 column phone, 2 tablet, 3 laptop */}
        <ol className="mt-12 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {DATA.projects.map((p, i) => (
            <li key={p.title} data-fade className={`h-full ${HIDDEN}`}>
              <article className="group flex h-full flex-col rounded-[1.25rem] border border-white/10 bg-white/[0.06] p-6 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.09] md:p-8">
                <div className="flex items-baseline gap-3">
                  <span className={`${MONO} text-sm font-semibold tabular-nums text-[#A8C8EB] transition-colors duration-300 group-hover:text-[#FF895D]`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.9rem] font-extrabold leading-[1] tracking-[-0.055em] text-[#DFEAF5] md:text-[2.4rem]">
                    {p.title}
                  </h3>
                </div>
                <p className={`${MONO} mt-3 pl-[1.8rem] text-[12.5px] font-medium leading-[1.5] text-[#A8C8EB]/70`}>{p.kind}</p>

                <div className="mt-7 flex flex-col gap-2">
                  <span className={`${MONO} text-[11px] font-semibold text-[#657E9B]`}>Problem</span>
                  <p className="max-w-[48ch] text-[15px] font-medium leading-[1.7] text-[#DFEAF5]/80">{p.problem}</p>
                </div>

                <div className="mt-auto flex flex-col gap-6 pt-8">
                  <div className="flex flex-col gap-2.5">
                    <span className={`${MONO} text-[11px] font-semibold text-[#657E9B]`}>Stack</span>
                    <ul className="flex flex-wrap gap-2">
                      {p.stack.map((s) => (
                        <li
                          key={s}
                          className={`${MONO} rounded-md border border-white/10 bg-white/[0.07] px-2.5 py-1.5 text-xs font-medium leading-none text-[#A8C8EB]`}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-6 border-t border-white/10 pt-5">
                    <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`Open live demo of ${p.title}`} className={`${LINK} text-[#DFEAF5]`}>
                      Live demo
                      <Arrow />
                    </a>
                    <a href={p.code} target="_blank" rel="noopener noreferrer" aria-label={`View code of ${p.title}`} className={`${LINK} text-[#A8C8EB]/80`}>
                      Code
                      <Arrow />
                    </a>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Projects;