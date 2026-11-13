"use client";

/**
 * Projects section, built on the About theme.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Frost #F1F6FA | Deep Fjord #18364B | Iced Denim #4F91C9 | Pistachio #A8B85A
 *
 * Layout
 * Phone: one column. Tablet: two columns. Laptop and up: three columns.
 * Each card reads top to bottom: number and title, description, stack, image.
 * Globe (live) and code icons sit on top of the image, both in grey.
 *
 * Images (all local, put these files in public/projects/)
 * finance.png, sibbu.png, url-shortener.png,
 * aerosense.png, expense-tracker.png, exonova.png
 *
 * Motion (kept small)
 * 1. The heading rises out of a mask, letter by letter
 * 2. Each card fades up once when it arrives
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-projects-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-projects-mono" });

const DISPLAY = "font-[family-name:var(--font-projects-display)]";
const MONO = "font-[family-name:var(--font-projects-mono)]";
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";

/* Content: edit here */

type Project = {
  title: string;
  desc: string;
  tags: string[];
  code: string;
  live: string;
  img: string; // file inside public/projects/ (name must match exactly, including case)
};

const PROJECTS: Project[] = [
  {
    title: "Finance Dashboard",
    desc: "Secure finance management platform with JWT auth, role based access, and REST APIs.",
    tags: ["Java", "Spring Boot", "MySQL", "JWT"],
    code: "https://github.com/meranaamkhann/finance_dashboard",
    live: "https://finance-pro-sibbus.vercel.app/",
    img: "/projects/finance.png",
  },
  {
    title: "Sibbu",
    desc: "AI powered chatbot that gives healthcare information and support.",
    tags: ["Python", "Flask", "Google Gemini", "SQLite"],
    code: "https://github.com/meranaamkhann/Sibbu",
    live: "https://sibbu.onrender.com/",
    img: "/projects/sibbu.png",
  },
  {
    title: "URL Shortener",
    desc: "Short, shareable links with custom aliases, authentication, and link analytics.",
    tags: ["React", "Node", "MongoDB", "JWT"],
    code: "https://github.com/meranaamkhann?tab=repositories",
    live: "https://url-shortner-sibbus.vercel.app/",
    img: "/projects/url-shortener.png",
  },
  {
    title: "AeroSense",
    desc: "Machine learning model that predicts air quality from historical data.",
    tags: ["Python", "Pandas", "Scikit", "ML"],
    code: "https://github.com/meranaamkhann/AeroSense",
    live: "https://air-quality-prediction-sibbus.vercel.app/",
    img: "/projects/aerosense.png",
  },
  {
    title: "Expense Tracker",
    desc: "Full stack app to track and manage personal expenses, built with Spring Boot and React.",
    tags: ["Java", "Spring Boot", "React", "TypeScript"],
    code: "https://github.com/meranaamkhann/InCampus_MVP",
    live: "https://spendwise-sibbus.vercel.app/",
    img: "/projects/expense-tracker.png",
  },
  {
    title: "ExoNova",
    desc: "AI that detects exoplanets from light curve data using machine learning.",
    tags: ["Python", "TypeScript", "HTML", "JavaScript"],
    code: "https://github.com/meranaamkhann/ExoNova",
    live: "https://ai-exoplanet-discovery-platform.vercel.app/",
    img: "/projects/exonova.png",
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

/* Small pieces */

const MASK = "-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-top";

/** Letters inside a mask so they can rise into view. Words never break mid word. */
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

/* Both icons are grey */
const ICON_BASE = `grid size-9 place-items-center rounded-full bg-[#E5E7EB] text-[#4B5563] transition-colors duration-300 hover:bg-[#D1D5DB] hover:text-[#111827] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F91C9]`;

/** Earth / globe icon for the live demo */
const LiveIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

/**
 * Local screenshot from public/projects/.
 * If the file is missing, the title placeholder behind it stays visible.
 * The ref check covers images that failed before React attached onError.
 */
function Shot({ p }: { p: Project }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={p.img}
      alt={`${p.title} preview`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`absolute inset-0 size-full object-cover object-top transition-transform duration-700 ${SPRING} group-hover/shot:scale-[1.03]`}
    />
  );
}

/* Card */

function Card({ p, idx }: { p: Project; idx: number }) {
  return (
    <li data-card className="flex h-full flex-col rounded-3xl bg-[#E6EEF5] p-4 md:p-5">
      {/* number and title */}
      <div className="flex items-baseline gap-2.5">
        <span className={`${MONO} text-xs text-[#4F91C9]`}>{pad(idx + 1)}</span>
        <h3 className="line-clamp-1 text-xl font-extrabold leading-[1.15] tracking-[-0.03em] md:text-[1.35rem]">{p.title}</h3>
      </div>

      {/* description: fixed 3 line space so every card lines up */}
      <p className="mt-2.5 line-clamp-3 min-h-[4.65em] text-sm leading-[1.55] text-[#18364B]/75">{p.desc}</p>

      {/* stack: fixed 2 row space */}
      <ul className="mt-3 flex min-h-[3.5rem] flex-wrap content-start gap-1.5">
        {p.tags.map((t) => (
          <li key={t} className={`${MONO} h-6 rounded-full bg-[#4F91C9]/15 px-2.5 text-[11px] leading-6 text-[#18364B]`}>
            {t}
          </li>
        ))}
      </ul>

      {/* image pinned to the bottom, with live (globe) and code icons on top */}
      <div className="group/shot relative mt-auto pt-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#18364B]">
          <span
            className={`${DISPLAY} absolute inset-0 flex items-center justify-center px-4 text-center text-xl font-bold tracking-[-0.04em] text-[#F1F6FA]/20`}
          >
            {p.title}
          </span>
          <Shot p={p} />
        </div>

        <div className="absolute right-2 top-6 flex gap-1.5 rounded-full bg-[#F1F6FA]/90 p-1 backdrop-blur-sm">
          <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`Open live demo of ${p.title}`} title="Live demo" className={ICON_BASE}>
            <LiveIcon />
          </a>
          <a href={p.code} target="_blank" rel="noopener noreferrer" aria-label={`View code of ${p.title}`} title="View code" className={ICON_BASE}>
            <GithubIcon />
          </a>
        </div>
      </div>
    </li>
  );
}

/* Section */

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* 1. Heading rises out of a mask */
      const head = el.querySelector<HTMLElement>("[data-head]");
      const chars = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-head] [data-char]"));
      if (head && chars.length) {
        gsap.fromTo(
          chars,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.035,
            scrollTrigger: { trigger: head, start: "top 92%", once: true },
          }
        );
      }

      /* 2. Cards fade up once */
      gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-card]")).forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: card, start: "top 90%", once: true },
          }
        );
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="projects"
      aria-label="Projects"
      className={`${display.variable} ${mono.variable} ${DISPLAY} overflow-clip bg-[#F1F6FA] px-5 pb-20 pt-20 text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B] md:px-12 md:pb-24 md:pt-28 lg:px-16 lg:pt-28`}
    >
      <div className="mx-auto w-full max-w-[80rem]">
        {/* heading */}
        <div className="mb-12 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2
            data-head
            aria-label="Selected projects"
            className="text-[3rem] font-extrabold leading-[0.9] tracking-[-0.055em] md:text-[4.25rem] xl:text-[5.5rem]"
          >
            <Chars text="Selected projects" />
            <span className="ml-[0.04em] inline-block size-[0.12em] rounded-full bg-[#A8B85A]" />
          </h2>
          <p className="max-w-[48ch] text-base leading-[1.6] text-[#18364B]/75 md:pb-2 md:text-lg">
            A few things I have built, from secure full stack apps to machine learning models that learn from real data.
            Each one is deployed, so you can try the live demo or read the code on GitHub.
          </p>
        </div>

        {/* phone: 1 column, tablet: 2 columns, laptop: 3 columns */}
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PROJECTS.map((p, i) => (
            <Card key={p.title} p={p} idx={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Projects;