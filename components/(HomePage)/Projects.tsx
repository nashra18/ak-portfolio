
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as RPointerEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Fonts: font-display (Manrope) and font-mono (JetBrains Mono), both loaded in layout.tsx.

   Content: edit here
   shot = your own 16:9 screenshot in /public/project-images/ (png or webp).
   If the file is missing, a clean placeholder shows. */

type Project = {
  title: string;
  kind: string;
  desc: string;
  problem: string;
  solution: string;
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
      desc: "Finance platform where every request needs a JWT login and each role sees only what it should. Permission checks run on the server.",
      problem:
        "Financial data is some of the most private data a person or a team owns. In most small tools everyone who logs in can see every record, and anyone can edit or delete things they should never touch. One wrong click or one curious user is enough to break trust, and there is no clear trail of who did what.",
      solution:
        "I built the backend in Spring Boot and put every single endpoint behind JWT authentication, so nothing works without a valid login. On top of that, each user gets a role, and each role is allowed only a fixed set of actions, for example viewing, adding or managing records. The data lives in MySQL, and the permission checks run on the server, so hiding a button on the screen is never the only protection.",
      stack: ["Java", "Spring Boot", "MySQL", "JWT"],
      live: "https://finance-pro-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/finance_dashboard",
      shot: "/project-images/finance-pro.png",
    },
    {
      title: "Sibbu",
      kind: "AI healthcare chatbot",
      desc: "Healthcare chatbot that answers health questions in plain language using Google Gemini, and saves every chat to read later.",
      problem:
        "When someone feels unwell, they search the web and land on long articles, ads and conflicting advice. It takes time to find one clear answer, and in a worried moment that confusion makes things worse. People also lose the earlier answers once they close the tab, so they have to ask the same thing again.",
      solution:
        "Sibbu is a chatbot that takes a health question and answers it in simple, plain language using Google Gemini. The Flask backend handles the conversation and keeps the replies short and easy to follow. Every chat is saved in SQLite, so a user can come back later and read what was said before instead of starting from zero.",
      stack: ["Python", "Flask", "Google Gemini", "SQLite"],
      live: "https://sibbu.onrender.com/",
      code: "https://github.com/meranaamkhann/Sibbu",
      shot: "/project-images/sibbu.png",
    },
    {
      title: "URL Shortener",
      kind: "Short links with analytics",
      desc: "Turns long links into short ones with custom aliases. Each user logs in and sees a click count for every link they create.",
      problem:
        "Long links are ugly, easy to break in a message and hard to remember. Even after you share one, you have no idea whether anybody actually opened it, so you cannot tell which link or which channel is working. Most free tools also give you random codes with no say in how the link looks.",
      solution:
        "I built a full stack app with React on the front and Node with MongoDB behind it. A user logs in with JWT, creates a short link and can choose a custom alias, so the link reads the way they want. Every visit is counted against that link, and the dashboard shows the click totals, so each person sees the results of their own links only.",
      stack: ["React", "Node", "MongoDB", "JWT"],
      live: "https://url-shortner-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann?tab=repositories",
      shot: "/project-images/url-shortner.png",
    },
    {
      title: "AeroSense",
      kind: "Air quality prediction model",
      desc: "Learns from past air quality readings and predicts what the air will be like ahead of time, so you can plan your day around it.",
      problem:
        "Air quality is normally reported after the air has already turned bad. By the time the number is high, people have already been outside, children have already gone to school and the plan for the day is already made. Knowing it a little earlier would let people change their routine instead of just reacting.",
      solution:
        "AeroSense learns from past air quality readings using Python, Pandas and Scikit-learn. I cleaned the data, trained a model on the patterns in it and used it to predict what the air quality will look like ahead of time. The result is shown in a simple web page, so a person can check the forecast quickly and decide when it is safe to go out.",
      stack: ["Python", "Pandas", "Scikit-learn", "ML"],
      live: "https://air-quality-prediction-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/AeroSense",
      shot: "/project-images/aero-sense.png",
    },
    {
      title: "Expense Tracker",
      kind: "Personal expense manager",
      desc: "One simple full stack app to add, edit and review every personal expense, so it is clear where the money is really going.",
      problem:
        "Daily spending is spread across UPI apps, cash, cards and plain memory. At the end of the month the money is gone, but it is hard to say where it went. Notes apps and spreadsheets work for a few days, then get skipped because adding an entry takes too many steps.",
      solution:
        "I built one full stack app where every expense is added in a few taps, and can be edited or removed later if it was wrong. The backend is Java with Spring Boot, and the front end is React with TypeScript, so the data stays consistent and the screens stay fast. Reviewing past expenses in one place makes it clear where the money is really going.",
      stack: ["Java", "Spring Boot", "React", "TypeScript"],
      live: "https://spendwise-sibbus.vercel.app/",
      code: "https://github.com/meranaamkhann/InCampus_MVP",
      shot: "/project-images/spendwise.png",
    },
    {
      title: "ExoNova",
      kind: "Exoplanet detection with ML",
      desc: "A trained ML model that scans star light curves and flags the tiny dips that point to a planet, so nobody checks them by hand.",
      problem:
        "Space telescopes record the brightness of millions of stars over time, and a planet passing in front of a star causes a tiny, regular dip in that light. Checking these light curves by hand to find the dips is slow, tiring and easy to get wrong, and most stars turn out to have nothing in them.",
      solution:
        "I trained a machine learning model on star light curve data so it learns what the dip of a real planet looks like. The model scans new data and flags the stars that show those signs, so a person only needs to look at the likely candidates instead of everything. The results are shown on a web interface built with TypeScript, HTML and JavaScript.",
      stack: ["Python", "TypeScript", "HTML", "JavaScript"],
      live: "https://ai-exoplanet-discovery-platform.vercel.app/",
      code: "https://github.com/meranaamkhann/ExoNova",
      shot: "/project-images/exo-nova.png",
    },
  ],
};

const N = DATA.projects.length;
const pad = (n: number) => String(n).padStart(2, "0");

/* ---------- Icons ---------- */
const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ArrowRight = ({ className = "size-5" }: { className?: string }) => (
  <svg {...svgProps} strokeWidth={2.2} className={`${className} shrink-0`}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CloseIcon = () => (
  <svg {...svgProps} strokeWidth={2.2} className="size-[18px] shrink-0">
    <path d="M6 6l12 12M18 6L6 18" />
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

/* ---------- Shared styles ---------- */

const ICON_BTN =
  "grid size-10 shrink-0 place-items-center rounded-full border border-section-border text-subheading-soft transition-[color,background-color,border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-button-ghost-border-hover hover:text-heading active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const RISE =
  "translate-y-7 scale-[0.98] opacity-0 transition-[opacity,translate,scale] duration-[1000ms] ease-[cubic-bezier(.32,.72,0,1)] data-[in=true]:translate-y-0 data-[in=true]:scale-100 data-[in=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none";

const EYEBROW = "font-mono text-small md:text-small-md uppercase tracking-eyebrow";

/* Card look, used only on the main page grid */
const CARD =
  "border border-section-border bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-section-border)_55%,transparent)_0%,color-mix(in_srgb,var(--color-section-border)_18%,transparent)_60%,color-mix(in_srgb,var(--color-section-border)_12%,transparent)_100%)] transition-colors duration-500 hover:border-button-ghost-border-hover/70";

const SPOTLIGHT = {
  background:
    "radial-gradient(70% 55% at var(--mx) 100%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)",
} as const;

const BORDER_GLOW = {
  padding: 1,
  background: "radial-gradient(60% 45% at var(--mx) 100%, var(--color-accent), transparent 70%)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const;

function GlowCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rx: ((v: number) => void) | null = null;
    let ry: ((v: number) => void) | null = null;

    if (!reduce) {
      gsap.set(card, { transformPerspective: 900 });
      rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
      ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
    }

    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      rx?.((0.5 - py) * 8);
      ry?.((px - 0.5) * 10);
      card.style.setProperty("--mx", `${px * 100}%`);
    };

    const leave = () => {
      rx?.(0);
      ry?.(0);
    };

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);

    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="h-full" style={{ perspective: "900px" }}>
      <div
        ref={ref}
        className={`group/card relative h-full rounded-2xl [transform-style:preserve-3d] ${CARD} ${className}`}
        style={{ ["--mx" as string]: "50%" }}
      >
        {/* Bottom glow: hover on desktop, faint static glow on phones */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 [@media(hover:none)]:opacity-40"
          style={SPOTLIGHT}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 [@media(hover:none)]:opacity-40"
          style={BORDER_GLOW}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}

function InView({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-in={on} style={{ transitionDelay: `${delay}ms` }} className={`group/iv ${className}`}>
      {children}
    </div>
  );
}

function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <InView delay={delay} className={`${RISE} ${className}`}>
      {children}
    </InView>
  );
}

/* ---------- 16:9 image with placeholder ---------- */

function Shot({
  src,
  title,
  index,
  eager = false,
  zoom = true,
}: {
  src: string;
  title: string;
  index: number;
  eager?: boolean;
  zoom?: boolean;
}) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const im = img.current;
    if (im?.complete) setState(im.naturalWidth > 0 ? "ok" : "error");
  }, [src]);

  return (
    <div className="group/shot relative aspect-video overflow-hidden rounded-xl bg-chip-bg">
      <div
        aria-hidden
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-white/[0.07] to-transparent ${
          state === "loading" ? "animate-pulse" : ""
        }`}
      >
        <span className="select-none text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-none tracking-[-0.05em] text-white/[0.07]">
          {pad(index + 1)}
        </span>
        <span className={`select-none text-muted/60 ${EYEBROW}`}>{title}</span>
      </div>

      {state !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={img}
          src={src}
          alt={`Screenshot of ${title}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          onLoad={() => setState("ok")}
          onError={() => setState("error")}
          className={`absolute inset-0 size-full select-none object-cover object-top transition-[opacity,scale] duration-[900ms] ease-out motion-reduce:transition-none ${
            zoom ? "group-hover/shot:scale-[1.04]" : ""
          } ${state === "ok" ? "opacity-100" : "opacity-0"}`}
        />
      )}

      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
  );
}

/* ---------- Card (main page) ---------- */

function Card({ p, i, onOpen }: { p: Project; i: number; onOpen: (i: number) => void }) {
  return (
    <Rise delay={(i % 3) * 110} className="h-full">
      <GlowCard className="p-3 md:p-3.5">
        <div className="flex h-full flex-col">
          <button
            type="button"
            onClick={() => onOpen(i)}
            aria-label={`View details of ${p.title}`}
            className="block w-full cursor-pointer rounded-xl text-left transition-[scale] duration-500 ease-[cubic-bezier(.32,.72,0,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            <Shot src={p.shot} title={p.title} index={i} />
          </button>

          <div className="flex flex-1 flex-col px-2 pb-1 pt-5 md:px-2.5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-baseline gap-3">
                <span className="font-mono text-[12px] font-semibold tabular-nums text-subheading">{pad(i + 1)}</span>
                <h3 className="min-w-0 text-[1.45rem] font-bold leading-tight tracking-[-0.04em] text-heading md:text-[1.6rem]">
                  {p.title}
                </h3>
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

            <p className="mt-3 max-w-[48ch] text-body md:text-body-md text-paragraph">{p.desc}</p>

            <div className="mt-auto flex justify-end pt-6">
              <button
                type="button"
                onClick={() => onOpen(i)}
                className="group/btn inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-section-border px-4 font-mono text-[12.5px] font-semibold text-heading transition-[border-color,background-color,scale] duration-300 hover:border-button-ghost-border-hover hover:bg-white/[0.04] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                View in detail
                <ArrowRight className="size-3.5 transition-[translate] duration-300 group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </GlowCard>
    </Rise>
  );
}

/* ---------- Detail sheet (no cards, no glow) ---------- */

function Section({
  label,
  tone,
  children,
}: {
  label: string;
  tone: string;
  children: ReactNode;
}) {
  return (
    <Rise className="border-t border-section-border pt-7 md:pt-9">
      <span className={`text-muted ${EYEBROW}`}>{label}</span>
      <p className={`mt-5 max-w-[62ch] text-[1.05rem] font-medium leading-[1.85] tracking-[-0.01em] md:text-[1.12rem] ${tone}`}>
        {children}
      </p>
    </Rise>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <Rise>
      <span className={`text-muted ${EYEBROW}`}>Built with</span>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((s) => (
          <li
            key={s}
            className="rounded-chip border border-chip-border bg-chip-bg px-3 py-2 font-mono text-xs font-medium leading-none text-chip-text"
          >
            {s}
          </li>
        ))}
      </ul>
    </Rise>
  );
}

function Sheet({
  i,
  shown,
  leaving,
  onClose,
  onNext,
}: {
  i: number;
  shown: boolean;
  leaving: boolean;
  onClose: () => void;
  onNext: () => void;
}) {
  const p = DATA.projects[i];
  const next = DATA.projects[(i + 1) % N];
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [i]);

  useEffect(() => {
    if (shown) closeBtn.current?.focus({ preventScroll: true });
  }, [shown]);

  // page-level smooth scroll (Lenis etc.) must not swallow wheel/touch inside the sheet
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;

    const stop = (e: Event) => e.stopPropagation();
    el.addEventListener("wheel", stop, { passive: true });
    el.addEventListener("touchmove", stop, { passive: true });

    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, []);

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startY.current = e.clientY;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setDrag(Math.max(0, e.clientY - startY.current));
  };

  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    const far = drag > 120;
    setDrag(0);
    if (far) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      data-lenis-prevent
      className="fixed inset-0 z-[100] font-display text-heading antialiased"
    >
      <div
        onClick={onClose}
        aria-hidden
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-700 ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        style={{ transform: `translateY(${drag}px)`, transitionDuration: dragging ? "0ms" : undefined }}
        className={`absolute inset-x-0 bottom-0 top-3 flex flex-col overflow-hidden rounded-t-[1.75rem] border border-b-0 border-section-border bg-section-bg shadow-[0_-30px_80px_rgba(0,0,0,0.6)] transition-[translate,transform,opacity] duration-[750ms] ease-[cubic-bezier(.32,.72,0,1)] motion-reduce:transition-none md:top-6 ${
          shown ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div
          ref={scroller}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain"
        >
          {/* Top bar */}
          <div
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            className="sticky top-0 z-30 cursor-grab select-none bg-black/70 px-gutter pb-3 pt-6 backdrop-blur-xl active:cursor-grabbing md:px-gutter-md md:pt-7 lg:px-gutter-lg"
          >
            <span aria-hidden className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20" />
            <div className="mx-auto flex w-full max-w-page items-center justify-end">
              <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className={ICON_BTN}>
                <CloseIcon />
              </button>
            </div>
          </div>

          <div
            className={`transition-[opacity,translate] duration-300 ease-out ${
              leaving ? "-translate-y-3 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            <div
              key={i}
              className="mx-auto w-full max-w-page px-gutter pb-24 pt-8 md:px-gutter-md md:pb-32 md:pt-10 lg:px-gutter-lg"
            >
              {/* Desktop: left = sticky info, right = image and story. Phone: one column. */}
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                {/* LEFT */}
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-28">
                    <Rise delay={150}>
                      <p className={`text-subheading ${EYEBROW}`}>{p.kind}</p>
                    </Rise>

                    <InView className="mt-5">
                      <h2 className="text-[clamp(2.75rem,12vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-heading lg:text-[clamp(2.75rem,4.4vw,4.5rem)]">
                        {p.title.split(" ").map((w, k) => (
                          <span
                            key={k}
                            className="mr-[0.22em] inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom last:mr-0"
                          >
                            <span
                              style={{ transitionDelay: `${250 + k * 90}ms` }}
                              className="inline-block translate-y-[115%] transition-[translate] duration-[1100ms] ease-[cubic-bezier(.32,.72,0,1)] group-data-[in=true]/iv:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none"
                            >
                              {w}
                            </span>
                          </span>
                        ))}
                      </h2>
                    </InView>

                    <Rise delay={350}>
                      <p className="mt-6 max-w-[44ch] text-body md:text-body-md text-paragraph">{p.desc}</p>
                    </Rise>

                    <Rise delay={450} className="mt-8 flex flex-wrap items-center gap-3">
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center gap-2.5 rounded-full bg-heading px-5 font-mono text-[13px] font-semibold text-on-accent transition-[opacity,scale] duration-300 hover:opacity-90 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        <LiveIcon />
                        Live demo
                      </a>
                      <a
                        href={p.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-11 items-center gap-2.5 rounded-full border border-section-border px-5 font-mono text-[13px] font-semibold text-heading transition-[border-color,scale] duration-300 hover:border-button-ghost-border-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                      >
                        <CodeIcon />
                        Source code
                      </a>
                    </Rise>

                    <div className="mt-12 hidden lg:block">
                      <Stack items={p.stack} />
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-10 md:gap-12 lg:col-span-7">
                  <Rise delay={300}>
                    <Shot src={p.shot} title={p.title} index={i} eager zoom={false} />
                  </Rise>

                  <Section label="Problem I solved" tone="text-paragraph-strong">
                    {p.problem}
                  </Section>

                  <Section label="How I solved it" tone="text-subheading-soft">
                    {p.solution}
                  </Section>

                  <div className="lg:hidden">
                    <Stack items={p.stack} />
                  </div>

                  {/* Next project */}
                  <Rise className="border-t border-section-border pt-7 md:pt-9">
                    <button
                      type="button"
                      onClick={onNext}
                      className="group/next ml-auto flex w-full cursor-pointer flex-col items-end gap-3 text-right focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent"
                    >
                      <span className={`text-muted ${EYEBROW}`}>Next project</span>
                      <span className="flex items-center gap-4">
                        <span className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-[0.98] tracking-[-0.05em] text-heading">
                          {next.title}
                        </span>
                        <ArrowRight className="size-7 text-subheading transition-[translate,color] duration-500 ease-[cubic-bezier(.32,.72,0,1)] group-hover/next:translate-x-1.5 group-hover/next:text-heading" />
                      </span>
                    </button>
                  </Rise>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */

export function Projects() {
  const [active, setActive] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const open = (i: number) => {
    window.clearTimeout(timer.current);
    lastFocus.current = document.activeElement as HTMLElement | null;
    setLeaving(false);
    setActive(i);
    requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
  };

  const close = useCallback(() => {
    setShown(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setActive(null);
      setLeaving(false);
      lastFocus.current?.focus?.({ preventScroll: true });
    }, 650);
  }, []);

  const goNext = () => {
    if (leaving) return;
    setLeaving(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setActive((a) => (a === null ? a : (a + 1) % N));
      setLeaving(false);
    }, 320);
  };

  const isOpen = active !== null;

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [isOpen, close]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <section
      id="projects"
      aria-label="Projects"
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto w-full max-w-page px-gutter pb-section pt-section md:px-gutter-md md:pb-section-md md:pt-section-md lg:px-gutter-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-16">
          <Rise>
            <h2 className="select-none text-h2 md:text-h2-md text-heading md:whitespace-nowrap">{DATA.title}</h2>
          </Rise>
          <Rise delay={100}>
            <p className="max-w-[36ch] text-sub md:text-sub-md text-muted md:pb-2">{DATA.intro}</p>
          </Rise>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {DATA.projects.map((p, i) => (
            <li key={p.title} className="h-full">
              <Card p={p} i={i} onOpen={open} />
            </li>
          ))}
        </ol>
      </div>

      {active !== null &&
        createPortal(
          <Sheet i={active} shown={shown} leaving={leaving} onClose={close} onNext={goNext} />,
          document.body
        )}
    </section>
  );
}

export default Projects;
