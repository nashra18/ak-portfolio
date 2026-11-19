"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Portrait on the left, words on the right, numbers below.
   Colour is kept calm: white, soft blue and grey. Orange only on the button. */

/* Content: edit here */

const DATA = {
  title: "About me",
  intro: "I learn by shipping real things, and I show the work in public.",
  introHighlight: ["shipping"],
  description:
    "Most of what I know came from building, breaking and fixing real projects, from backends to AI products. I want to join startups and teams who care about the same things.",
  descriptionHighlight: ["building, breaking and fixing", "startups and teams"],
  buttonLabel: "Know more",

  full: `I learn by building. Most of what I know comes from shipping real projects, solving 800+ problems on LeetCode and sharing my journey in public.

Alongside backends, I build AI products. A health chatbot on Google Gemini, and machine learning models for air quality prediction and exoplanet detection. Each one taught me more than any course did, because each one had to actually work.

I like keeping things simple and honest, and I want to work with startups and teams who care about the same things.`,

  stats: [
    { label: "GitHub projects", value: "16", suffix: "+" },
    { label: "LeetCode problems", value: "800", suffix: "+" },
    { label: "Graduating", value: "2027", suffix: "" },
  ],
};

const BTN_SOLID =
  "group inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-button-bg px-3.5 py-2.5 text-[11px] font-semibold leading-none text-on-accent transition-[filter] duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-4 sm:text-xs md:gap-2 md:px-6 md:py-3 md:text-sm";

const ArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-3 shrink-0 md:size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Hi({ text, words, className }: { text: string; words: string[]; className: string }) {
  const re = new RegExp(
    "(" + words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")",
    "g"
  );

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
        <div
          key={s.label}
          data-fade
          className={`flex min-w-0 flex-col items-center gap-1 text-center md:items-start md:text-left ${HIDDEN}`}
        >
          <dt className="flex min-h-[2.8em] items-end justify-center text-small md:min-h-0 md:justify-start md:text-small-md leading-[1.35] text-muted">
            {s.label}
          </dt>

          <dd className="text-stat md:text-stat-md tabular-nums text-heading">
            {s.value}
            {s.suffix && <span className="ml-0.5 align-top text-[0.55em] text-muted">{s.suffix}</span>}
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

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

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
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-section-bg/70 p-4 font-display backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About me"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-[680px] flex-col rounded-2xl border border-section-border bg-section-bg shadow-2xl"
      >
        <div
          className="flex-1 overflow-y-auto px-5 pb-7 pt-12 sm:px-7 md:px-9 md:pb-8 md:pt-14"
          data-lenis-prevent="true"
        >
          <p className="whitespace-pre-line text-[14px] font-medium leading-[1.8] text-paragraph-strong sm:text-base md:text-lg md:leading-[1.9]">
            {DATA.full}
          </p>
        </div>

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden
          >
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

      gsap.set(items, { opacity: 0, y: 10 });

      ScrollTrigger.batch(items, {
        start: "top 96%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            overwrite: true,
          }),
      });
    });

    // image and font loading shifts the layout, so re-measure every trigger position
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="about"
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto flex w-full max-w-page flex-col gap-8 px-gutter pb-section pt-28 md:block md:px-gutter-md md:pb-section-md md:pt-32 lg:px-gutter-lg">
        <h2
          data-fade
          className={`select-none whitespace-nowrap text-h2 md:text-h2-md text-heading ${HIDDEN}`}
        >
          {DATA.title}
        </h2>

        <div className="grid grid-cols-[36%_1fr] items-center gap-x-3 md:mt-[3vh] md:grid-cols-2 md:items-start md:gap-x-8 xl:grid-cols-[minmax(0,22rem)_1fr] xl:gap-x-14">
          <div
            data-fade
            className={`relative -ml-2 w-[calc(100%+0.5rem)] md:-mt-[25vh] md:ml-0 md:w-full xl:max-w-[22rem] ${HIDDEN}`}
          >
            <Image
              src="/portfolio.images/portfolioak-removebg-preview.png"
              alt="Silhouette looking up at the sky"
              width={330}
              height={740}
              priority
              onLoad={() => ScrollTrigger.refresh()}
              className="h-auto w-full select-none object-contain"
              draggable={false}
            />
          </div>

          <div className="flex flex-col justify-center gap-3 md:justify-start md:gap-6 md:pt-[4vh] xl:gap-7">
          <p
  data-fade
  className={`max-w-[22ch] text-[1.45rem] font-semibold leading-[1.2] tracking-[-0.04em] text-muted sm:text-[2rem] md:text-statement ${HIDDEN}`}
>
  <Hi text={DATA.intro} words={DATA.introHighlight} className="text-heading" />
</p>

            <p
              data-fade
              className={`max-w-[34ch] text-sub md:text-sub-md text-subheading-soft ${HIDDEN}`}
            >
              <Hi text={DATA.description} words={DATA.descriptionHighlight} className="text-heading" />
            </p>

            <div data-fade className={HIDDEN}>
              <button onClick={() => setOpen(true)} className={BTN_SOLID}>
                {DATA.buttonLabel}
                <ArrowRight />
              </button>
            </div>

            <Stats className="relative z-10 hidden md:mt-6 md:grid md:grid-cols-3 md:gap-6 xl:mt-8 xl:gap-8" />
          </div>
        </div>

        <Stats className="relative z-10 grid grid-cols-3 gap-3 pt-2 md:hidden" />
      </div>

      <AboutModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}