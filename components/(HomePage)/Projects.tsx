"use client";

/**
 * Projects section, dark Skills theme with soft glass cards. No images, no gsap.
 * Needs: next (next/font), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Ice Sheet #DFEAF5 (titles) | Glacier #A8C8EB (numbers, links)
 * Storm #657E9B (labels) | Tangerine #FF895D (selection, link hover)
 *
 * Cards: low opacity white fill (white/6), slightly rounded corners, no shadow.
 * Phone: 1 column. Tablet: 2 columns. Laptop and up: 3 columns.
 * Each card: number and title on the left, live (globe) and code (GitHub) icons on the right,
 * then what it is, the problem it solved, and the stack at the bottom.
 *
 * Motion: one soft fade-up per card when it enters the screen. Nothing else moves.
 */

import { Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-projects-display",
});

const DISPLAY = "font-[family-name:var(--font-projects-display)]";
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

const ICON =
  "grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.07] text-[#A8C8EB] transition-colors duration-300 hover:bg-[#FF895D] hover:text-[#0B111B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF895D]";

/** Globe icon for the live demo */
const LiveIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/** GitHub icon for the code */
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
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

        {/* Cards: 1 column phone, 2 tablet, 3 laptop */}
        <ol className="mt-12 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {DATA.projects.map((p, i) => (
            <li
              key={p.title}
              data-fade
              className={`flex h-full flex-col rounded-xl bg-white/[0.06] p-5 transition-colors duration-300 hover:bg-white/[0.09] md:p-6 ${HIDDEN}`}
            >
              {/* title left, live + code icons right */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-sm font-extrabold tabular-nums tracking-[-0.02em] text-[#A8C8EB]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.5rem] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#DFEAF5] md:text-[1.6rem]">
                    {p.title}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`Open live demo of ${p.title}`} title="Live demo" className={ICON}>
                    <LiveIcon />
                  </a>
                  <a href={p.code} target="_blank" rel="noopener noreferrer" aria-label={`View code of ${p.title}`} title="View code" className={ICON}>
                    <CodeIcon />
                  </a>
                </div>
              </div>

              <p className="mt-1 pl-[2.1rem] text-[13px] font-medium leading-[1.5] text-[#657E9B]">{p.kind}</p>

              <p className="mt-6 text-[15px] font-medium leading-[1.7] tracking-[-0.01em] text-[#DFEAF5]/80">{p.problem}</p>

              <p className="mt-auto pt-6 text-[13px] font-medium leading-[1.6] text-[#A8C8EB]/70">{p.stack.join(", ")}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Projects;