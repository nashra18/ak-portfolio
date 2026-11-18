"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Fonts: font-display (Manrope) and font-mono (JetBrains Mono), both loaded in layout.tsx. */

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here
   shot = your own screenshot in /public/projects/ (1440x900, png or webp).
   If the file is missing, a live screenshot is fetched. If that fails too, a blank placeholder shows. */

type Project = {
  title: string;
  kind: string;
  problem: string; // the problem it solved
  solution: string; // what was built to fix it
  stack: string[];
  live: string;
  code: string;
  shot: string;
};

const DATA: { title: string; intro: string; projects: Project[] } = {
  title: "What I built",
  intro: "Each project starts with a real problem. Here is what was broken, and what I built to fix it.",
  projects: [
    {
      title: "Finance Dashboard",
      kind: "Secure finance management platform",
      problem: "Financial records are private, and not every user should see or change everything.",
      solution: "Every endpoint sits behind JWT login, and each role gets only the actions it is allowed.",
      stack: ["Java", "Spring Boot", "MySQL", "JWT"],
      live: "https://finance-pro-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/finance_dashboard",
      shot: "/projects/finance-dashboard.png",
    },
    {
      title: "Sibbu",
      kind: "AI healthcare chatbot",
      problem: "Finding clear health information fast is hard, and search results are full of noise.",
      solution: "Answers health questions in plain language with Google Gemini and saves every chat in SQLite.",
      stack: ["Python", "Flask", "Google Gemini", "SQLite"],
      live: "https://sibbu.onrender.com/",
      code: "https://github.com/meranaamkhann/Sibbu",
      shot: "/projects/sibbu.png",
    },
    {
      title: "URL Shortener",
      kind: "Short links with analytics",
      problem: "Long links are messy to share, and you never know if anyone opened them.",
      solution: "Short links with custom aliases, a login per user, and a click count for every link.",
      stack: ["React", "Node", "MongoDB", "JWT"],
      live: "https://url-shortner-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann?tab=repositories",
      shot: "/projects/url-shortener.png",
    },
    {
      title: "AeroSense",
      kind: "Air quality prediction model",
      problem: "Air quality is usually known only after it has already turned bad.",
      solution: "Learns from past readings and predicts air quality ahead of time, so people can plan around it.",
      stack: ["Python", "Pandas", "Scikit-learn", "ML"],
      live: "https://air-quality-prediction-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/AeroSense",
      shot: "/projects/aerosense.png",
    },
    {
      title: "Expense Tracker",
      kind: "Personal expense manager",
      problem: "Daily spending is scattered across payments and memory, so it is hard to see where money goes.",
      solution: "One full stack app to record, edit and review every personal expense.",
      stack: ["Java", "Spring Boot", "React", "TypeScript"],
      live: "https://spendwise-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/InCampus_MVP",
      shot: "/projects/expense-tracker.png",
    },
    {
      title: "ExoNova",
      kind: "Exoplanet detection with ML",
      problem: "Checking huge star light curve data by hand to find exoplanets is slow.",
      solution: "A trained ML model that spots the signs of a planet automatically.",
      stack: ["Python", "TypeScript", "HTML", "JavaScript"],
      live: "https://ai-exoplanet-discovery-platform.vercel.app/",
      code: "https://github.com/meranaamkhann/ExoNova",
      shot: "/projects/exonova.png",
    },
  ],
};

/* Icons */
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ArrowUpRight = ({ className = "size-4" }: { className?: string }) => (
  <svg {...svgProps} strokeWidth={2.4} className={`${className} shrink-0`}>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

const LiveIcon = () => (
  <svg {...svgProps} className="size-[18px] shrink-0">
    <path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

const CodeIcon = () => (
  <svg {...svgProps} className="size-[18px] shrink-0">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

/** Round icon button, sits next to the title. Small lift on hover. */
const ICON_BTN =
  "grid size-10 shrink-0 place-items-center rounded-full border border-card-border text-subheading-soft transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:text-accent active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

/** Reveal inside a card: starts lower and hidden, rises in when the card gets data-in="true".
    Pass the delay in ms through style. */
const REVEAL =
  "translate-y-3 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-data-[in=true]/card:translate-y-0 group-data-[in=true]/card:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none";

const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

/** Screenshot only, no text on it. The whole image opens the live site.
    On enter the image is uncovered from top to bottom. */
function Shot({ title, live, shot }: { title: string; live: string; shot: string }) {
  const sources = [shot, `https://image.thum.io/get/width/1400/crop/875/noanimate/${live}`];
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth > 0) setLoaded(true);
  }, [stage]);

  return (
    <a
      href={live}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open live demo of ${title}`}
      style={delay(120)}
      className="group/shot relative block aspect-[16/10] cursor-pointer overflow-hidden rounded-[0.9rem] bg-chip-bg ring-1 ring-inset ring-white/10 transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(.22,1,.36,1)] [clip-path:inset(0_0_100%_0_round_0.9rem)] group-data-[in=true]/card:[clip-path:inset(0_0_0%_0_round_0.9rem)] motion-reduce:transition-none motion-reduce:[clip-path:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {stage < sources.length ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={stage}
          ref={img}
          src={sources[stage]}
          alt={`Screenshot of ${title}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setStage((s) => s + 1);
          }}
          className={`size-full select-none object-cover object-top transition-[transform,opacity] duration-700 ease-out group-hover/shot:scale-[1.05] motion-reduce:transition-none ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent" aria-hidden />
      )}

      {!loaded && stage < sources.length && <div className="absolute inset-0 animate-pulse bg-white/[0.04]" aria-hidden />}

      {/* hover: image dims slightly, arrow circle slides in from the corner */}
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/shot:bg-black/25" aria-hidden />
      <span className="pointer-events-none absolute right-3 top-3 grid size-10 -translate-x-1 translate-y-1 scale-90 place-items-center rounded-full bg-accent text-on-accent opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover/shot:translate-x-0 group-hover/shot:translate-y-0 group-hover/shot:scale-100 group-hover/shot:opacity-100 motion-reduce:transition-none">
        <ArrowUpRight />
      </span>
    </a>
  );
}

export function Projects() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const el = root.current;
    if (!el) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach((c) => c.setAttribute("data-in", "true"));
      return;
    }

    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-fade]"));
    items.forEach((i) => {
      i.style.opacity = "0";
      i.style.transform = "translateY(16px)";
      i.style.transition = "opacity 800ms cubic-bezier(.22,1,.36,1), transform 800ms cubic-bezier(.22,1,.36,1)";
    });

    // one soft fade-up per block, once, as it enters the screen.
    // cards also get data-in, which starts the animation of everything inside them.
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const t = e.target as HTMLElement;
          t.style.transitionDelay = `${n++ * 90}ms`;
          t.style.opacity = "1";
          t.style.transform = "none";
          if (t.hasAttribute("data-card")) t.setAttribute("data-in", "true");
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

        {/* Cards: 1 column phone, 2 tablet, 3 laptop */}
        <ol className="mt-14 grid grid-cols-1 gap-6 md:mt-24 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
          {DATA.projects.map((p, i) => (
            <li key={p.title} data-fade data-card className={`group/card h-full ${HIDDEN}`}>
              <article className="group flex h-full flex-col rounded-card border border-card-border bg-card-bg p-3 transition-colors duration-300 hover:border-card-border-hover hover:bg-card-bg-hover md:p-3.5">
                <Shot title={p.title} live={p.live} shot={p.shot} />

                <div className="flex flex-1 flex-col px-3 pb-3 pt-6 md:px-4 md:pb-4 md:pt-7">
                  {/* Title row: number + title on the left, live and code icons on the right */}
                  <div className={`flex items-start justify-between gap-4 ${REVEAL}`} style={delay(350)}>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-sm font-semibold tabular-nums text-muted transition-colors duration-300 group-hover:text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-card md:text-card-md text-heading">{p.title}</h3>
                      </div>
                      <p className="mt-2 font-mono text-[12.5px] font-medium leading-[1.5] text-subheading-soft">{p.kind}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open live demo of ${p.title}`}
                        title="Live demo"
                        className={ICON_BTN}
                      >
                        <LiveIcon />
                      </a>
                      <a
                        href={p.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View code of ${p.title}`}
                        title="View code"
                        className={ICON_BTN}
                      >
                        <CodeIcon />
                      </a>
                    </div>
                  </div>

                  {/* Problem and solution */}
                  <div className="mt-7 flex flex-col gap-5">
                    <div className={`flex flex-col gap-1.5 ${REVEAL}`} style={delay(480)}>
                      <span className="font-mono text-small md:text-small-md text-muted">Problem I solved</span>
                      <p className="max-w-[48ch] text-body md:text-body-md text-paragraph-strong">{p.problem}</p>
                    </div>
                    <div className={`flex flex-col gap-1.5 ${REVEAL}`} style={delay(600)}>
                      <span className="font-mono text-small md:text-small-md text-muted">How</span>
                      <p className="max-w-[48ch] text-body md:text-body-md text-subheading-soft">{p.solution}</p>
                    </div>
                  </div>

                  {/* Stack: chips pop in one by one */}
                  <ul className="mt-auto flex flex-wrap gap-2 pt-8">
                    {p.stack.map((s, k) => (
                      <li
                        key={s}
                        style={delay(720 + k * 70)}
                        className={`rounded-chip border border-chip-border bg-chip-bg px-2.5 py-1.5 font-mono text-xs font-medium leading-none text-chip-text ${REVEAL}`}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
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