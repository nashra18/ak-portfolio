"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-projects-display" });
const body = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-projects-body" });
const DISPLAY = "font-[family-name:var(--font-projects-display)]";

/*
  Projects: same theme as Approach.

  Layout: every project is the same card.
  phone: 1 column. tablet and laptop: 2 columns (6 projects = 3 rows).

  Text motion
  - Heading: letters rise out of a mask, one by one.
  - Intro: scrubbed. Each word lights up as you scroll (reads along with you).
  - Card title: letters rise and un-tilt, then description words follow.

  Palette
  Cream     #F6F7EB  background
  Charcoal  #393E41  text, image frames
  Vermilion #E94F37  hover accent, full stop
  Coral     #FF6B54  window dot
*/

type Project = {
  title: string;
  desc: string;
  tags: string[];
  code: string;
  live: string;
  img?: string; // optional: your own screenshot, e.g. "/projects/finance.png"
};

const PROJECTS: Project[] = [
  {
    title: "Finance Dashboard",
    desc: "Secure finance management platform with JWT authentication, role based access, REST APIs, and MySQL.",
    tags: ["Java", "Spring Boot", "MySQL", "JWT"],
    code: "https://github.com/meranaamkhann/finance_dashboard",
    live: "https://finance-pro-sibbus.vercel.app/",
  },
  {
    title: "Sibbu",
    desc: "AI-powered chatbot for providing healthcare information and support.",
    tags: ["Python", "Flask", "Google Gemini", "SQLite"],
    code: "https://github.com/meranaamkhann/Sibbu",
    live: "https://sibbu.onrender.com/",
  },
  {
    title: "URL Shortener",
    desc: "Generate short, shareable links with custom aliases, authentication, and link analytics.",
    tags: ["React", "Node", "MongoDB", "JWT"],
    code: "https://github.com/meranaamkhann?tab=repositories",
    live: "https://url-shortner-sibbus.vercel.app/",
  },
  {
    title: "AeroSense",
    desc: "Machine learning model for predicting air quality from historical environmental data.",
    tags: ["Python", "Pandas", "Scikit", "ML"],
    code: "https://github.com/meranaamkhann/AeroSense",
    live: "https://air-quality-prediction-sibbus.vercel.app/",
  },
  {
    title: "Expense Tracker",
    desc: "Full stack expense management application built with Java Spring Boot and React for tracking and managing personal finances.",
    tags: ["Java", "Spring Boot", "React", "TypeScript"],
    code: "https://github.com/meranaamkhann/InCampus_MVP",
    live: "https://spendwise-sibbus.vercel.app/",
  },
  {
    title: "ExoNova",
    desc: "AI to detect exoplanets from light curve data using machine learning models.",
    tags: ["Python", "TypeScript", "HTML", "JavaScript"],
    code: "https://github.com/meranaamkhann/ExoNova",
    live: "https://ai-exoplanet-discovery-platform.vercel.app/",
  },
];

const INTRO = "Backends, AI tools and full stack apps. Every one of them is live, so open them and click around.";

/* screenshot of the live site; swap for `img` if you have your own */
const shot = (url: string) => `https://image.thum.io/get/width/1400/crop/900/${url}`;
const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/* ---------- text splitters ---------- */

const MASK = "-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-top";

/* whole words, each inside a mask (descriptions) */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").flatMap((w, i) => {
        const word = (
          <span key={i} aria-hidden className={MASK}>
            <span data-word className="inline-block will-change-transform">
              {w}
            </span>
          </span>
        );
        return i ? [" ", word] : [word];
      })}
    </>
  );
}

/* single letters inside a mask per word (headings). Words never break in the middle. */
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

/* plain words that get lit up by scrolling (intro) */
function ScrubWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden>
          {i ? " " : ""}
          <span data-scrub>{w}</span>
        </span>
      ))}
    </>
  );
}

function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={`${className} transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
    >
      <path d="M4 12L12 4M5.5 4H12V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}

/* ---------- card ---------- */

function Card({ p }: { p: Project }) {
  return (
    <li data-project className="flex flex-col">
      <a
        href={p.live}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open live demo of ${p.title}`}
        className="group relative block rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E94F37]"
      >
        <div
          data-frame
          className="overflow-hidden rounded-[24px] border border-[#393E41]/30 bg-[#393E41] shadow-[0_24px_60px_rgba(57,62,65,0.22)] md:rounded-[28px]"
        >
          <div className="flex h-9 items-center gap-2 border-b border-[#F6F7EB]/25 px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B54]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F6F7EB]/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F6F7EB]/40" />
            <span className="ml-3 truncate text-[11px] font-medium text-[#F6F7EB]/70">{host(p.live)}</span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-[#2E3234] bg-[radial-gradient(rgba(246,247,235,0.22)_1px,transparent_1px)] bg-[length:14px_14px]">
            {/* fallback if the screenshot does not load */}
            <span
              className={`${DISPLAY} absolute inset-0 flex items-center justify-center px-6 text-center text-3xl font-bold tracking-[-0.04em] text-[#FF8A75]/40 md:text-4xl`}
            >
              {p.title}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-pic
              src={p.img ?? shot(p.live)}
              alt={`${p.title} preview`}
              loading="lazy"
              onError={(e) => (e.currentTarget.style.display = "none")}
              className="absolute inset-0 h-full w-full object-cover object-top will-change-transform"
            />
          </div>
        </div>

        {/* appears on hover: tells you the image is a link */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-5 right-5 flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-[#F6F7EB] text-[#393E41] opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
        >
          <Arrow className="h-5 w-5" />
        </span>
      </a>

      <div className="mt-6 flex flex-1 flex-col md:mt-8">
        <h3
          data-title
          aria-label={p.title}
          className={`${DISPLAY} text-[2.25rem] font-bold leading-[0.95] tracking-[-0.045em] md:text-[2.5rem] xl:text-6xl`}
        >
          <Chars text={p.title} />
        </h3>

        <p data-desc aria-label={p.desc} className="mt-4 max-w-[46ch] text-base font-medium leading-[1.65] text-[#393E41]/90 md:text-[17px]">
          <Words text={p.desc} />
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} data-tag className="rounded-full bg-[#393E41]/[0.08] px-3 py-1 text-[13px] font-medium text-[#393E41]">
              {t}
            </li>
          ))}
        </ul>

        <div data-rise className="mt-auto flex flex-wrap gap-3 pt-7">
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-[#393E41] px-5 py-3 text-sm font-semibold text-[#F6F7EB] transition-colors duration-300 hover:bg-[#E94F37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E94F37]"
          >
            Live demo <Arrow />
          </a>
          <a
            href={p.code}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-[#393E41] px-5 py-3 text-sm font-semibold text-[#393E41] transition-colors duration-300 hover:bg-[#393E41] hover:text-[#F6F7EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E94F37]"
          >
            View code <Arrow />
          </a>
        </div>
      </div>
    </li>
  );
}

/* ---------- section ---------- */

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);

    const mm = gsap.matchMedia();
    mm.add(
      {
        full: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (mc) => {
        if (mc.conditions?.reduced) return; // everything is visible by default

        /* heading: letters rise out of their mask, tilted, then settle */
        const headEl = q("[data-head]")[0];
        const paraEl = q("[data-para]")[0];
        const headChars = q("[data-head] [data-char]");
        gsap.fromTo(
          headChars,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.035,
            scrollTrigger: { trigger: headEl, start: "top 95%", once: true },
          }
        );

        /* intro: scrubbed. Each word fades in as you scroll past it */
        const scrub = q("[data-scrub]");
        gsap.fromTo(
          scrub,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            duration: 3,
            stagger: 1,
            scrollTrigger: { trigger: paraEl, start: "top 90%", end: "bottom 55%", scrub: 0.6 },
          }
        );

        /* fonts change the heading size, so measure the triggers again once they are ready */
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        /* every card */
        q("[data-project]").forEach((card) => {
          const r = gsap.utils.selector(card);
          const frame = r("[data-frame]")[0];
          const pic = r("[data-pic]")[0];
          const chars = r("[data-title] [data-char]");
          const words = r("[data-desc] [data-word]");
          const tags = r("[data-tag]");
          const rise = r("[data-rise]");

          gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(chars, { yPercent: 118, rotate: 8, transformOrigin: "0% 100%" });
          gsap.set(words, { yPercent: 115 });
          gsap.set(tags, { opacity: 0, scale: 0.85 });
          gsap.set(rise, { opacity: 0, y: 20 });

          gsap
            .timeline({ scrollTrigger: { trigger: card, start: "top 82%", once: true } })
            .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, 0)
            .to(chars, { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger: 0.03 }, 0.45)
            .to(words, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.012 }, 0.7)
            .to(tags, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.05 }, 1)
            .to(rise, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.1);

          /* the screenshot drifts inside its frame while you scroll */
          gsap.fromTo(
            pic,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.12,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="projects"
      aria-label="Projects"
      className={`${display.variable} ${body.variable} overflow-hidden bg-[#F6F7EB] px-5 py-16 font-[family-name:var(--font-projects-body)] text-[#393E41] antialiased md:px-12 md:py-28 lg:px-16`}
    >
      <div className="mb-12 grid gap-6 md:mb-20 lg:grid-cols-12 lg:items-end lg:gap-x-12">
        <h2
          data-head
          aria-label="Selected projects"
          className={`${DISPLAY} text-[2.75rem] font-bold leading-[0.9] tracking-[-0.055em] md:text-7xl lg:col-span-8 xl:text-[8rem]`}
        >
          <Chars text="Selected projects" />
          <span className="text-[#E94F37]">.</span>
        </h2>
        <p
          data-para
          aria-label={INTRO}
          className="max-w-[40ch] text-lg font-medium leading-[1.6] text-[#393E41] md:text-xl lg:col-span-4 lg:pb-3"
        >
          <ScrubWords text={INTRO} />
        </p>
      </div>

      {/* phone: 1 column. tablet and laptop: 2 columns, 3 rows */}
      <ol className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24 lg:gap-x-12">
        {PROJECTS.map((p) => (
          <Card key={p.title} p={p} />
        ))}
      </ol>
    </section>
  );
}

export default Projects;