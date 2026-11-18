"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Font is loaded once in layout.tsx. */

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

const DATA = {
  intro: "I build secure, scalable backends and AI powered products.",
  description:
    "I'm Asad Khan, a final year B.Tech IT student focused on backend engineering. I design secure APIs, scalable systems and reliable applications with Java and Spring Boot.",
  buttonLabel: "Know more",

  /* Modal: three paragraphs. A blank line between them makes a new paragraph. */
  full: `I'm Asad Khan, a final year B.Tech Information Technology student, graduating in 2027. I learn by building, so most of what I know comes from shipping real projects, solving 800+ problems on LeetCode and sharing my journey publicly.

Day to day I work on backends. I build APIs protected with JWT and role based access, design systems that can grow, and write applications that stay reliable under real use, mostly with Java and Spring Boot. Alongside that, I build AI products, like a health chatbot on Google Gemini and ML models for air quality and exoplanet detection.

I believe the best part of a product is the part nobody notices, because it never breaks. I like keeping systems simple, secure and honest, and I want to work with startups and teams who care about the same things.`,

  stats: [
    { label: "GitHub projects", value: "16", suffix: "+" },
    { label: "LeetCode problems", value: "800", suffix: "+" },
    { label: "Graduating", value: "2027", suffix: "" },
  ],
};

const BTN_SOLID = `group inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-button-bg px-4 py-3 text-[13px] font-semibold leading-none text-on-accent transition-[filter] duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:gap-2 md:px-8 md:py-4 md:text-base`;

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 md:size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Key words get colour, so the eye lands on them first */
function Hi({ text, words, className }: { text: string; words: string[]; className: string }) {
  const re = new RegExp("(" + words.join("|") + ")", "g");
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className={className}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

function Stats({ className }: { className: string }) {
  return (
    <dl className={className}>
      {DATA.stats.map((s) => (
        <div key={s.label} data-fade className={`flex min-w-0 flex-col items-center gap-1.5 text-center md:items-start md:gap-2 md:text-left ${HIDDEN}`}>
          <dt className="flex min-h-[3em] items-end justify-center text-small md:text-small-md md:min-h-0 md:justify-start font-medium leading-[1.4] text-muted">
            {s.label}
          </dt>
          <dd className="text-stat md:text-stat-md tabular-nums text-heading">
            {s.value}
            {s.suffix && <span className="ml-0.5 align-top text-[0.55em] font-semibold text-subheading">{s.suffix}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="font-display fixed inset-0 z-[9998] flex items-center justify-center bg-section-bg/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About me"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-[760px] flex-col rounded-3xl border border-section-border bg-section-bg shadow-2xl"
      >
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-14 md:px-10 md:pb-10 md:pt-16" data-lenis-prevent="true">
          <p className="whitespace-pre-line text-xl font-medium leading-9 text-paragraph-strong md:text-2xl md:leading-10">{DATA.full}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

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
      id="about"
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto flex w-full max-w-page flex-col gap-10 px-gutter pb-section pt-32 md:block md:px-gutter-md md:pb-section-md md:pt-36 lg:px-gutter-lg">
        {/* Title: one line */}
        <h2 data-fade className={`select-none whitespace-nowrap text-h2 md:text-h2-md text-heading ${HIDDEN}`}>
          About me
        </h2>

        {/* Portrait left, text right */}
        <div className="grid grid-cols-[36%_1fr] items-center gap-x-3 md:mt-[3vh] md:grid-cols-2 md:items-start md:gap-x-10 xl:grid-cols-[minmax(0,24rem)_1fr] xl:gap-x-16">
          <div data-fade className={`relative -ml-2 w-[calc(100%+0.5rem)] md:-mt-[25vh] md:ml-0 md:w-full xl:max-w-[24rem] ${HIDDEN}`}>
            <Image
              src="/portfolio.images/portfolioak-removebg-preview.png"
              alt="Silhouette looking up at the sky"
              width={330}
              height={740}
              priority
              className="h-auto w-full select-none object-contain"
              draggable={false}
            />
          </div>

          <div className="flex flex-col justify-center gap-4 md:justify-start md:gap-6 md:pt-[4vh] xl:gap-7">
            <p data-fade className={`text-lead md:text-lead-md text-heading ${HIDDEN}`}>
              <Hi text={DATA.intro} words={["backends", "AI"]} className="text-subheading" />
            </p>

            <p data-fade className={`max-w-[44ch] text-body md:text-body-md text-subheading-soft ${HIDDEN}`}>
              {DATA.description}
            </p>

            <div data-fade className={HIDDEN}>
              <button onClick={() => setOpen(true)} className={BTN_SOLID}>
                {DATA.buttonLabel}
                <ArrowRight />
              </button>
            </div>

            {/* Desktop only: dashed line, then stats */}
            <Stats className="relative z-10 hidden border-t border-dashed border-section-border md:mt-6 md:grid md:grid-cols-3 md:gap-8 md:pt-8 xl:mt-8 xl:gap-10" />
          </div>
        </div>

        {/* Phone only: dashed line, then stats below the grid */}
        <Stats className="relative z-10 grid grid-cols-3 gap-4 border-t border-dashed border-section-border pt-8 md:hidden" />
      </div>

      <AboutModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}