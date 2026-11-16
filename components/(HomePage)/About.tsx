"use client";

/**
 * About section. Self-contained.
 * Needs: next (next/image, next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (borders) | Ice Sheet #DFEAF5 (main text)
 * Tangerine #FF895D (accent) | Glacier #A8C8EB (highlights) | Storm #657E9B (quiet text)
 *
 * Type scale (one font, three weights): 800 titles and numbers, 600 headline, 500 body.
 * Motion: one soft fade-up per block when it enters the screen. Nothing else moves.
 * Layout: portrait on the left, text on the right, on every screen size.
 */

import Image from "next/image";
import { Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-about-display",
});

const DISPLAY = "font-[family-name:var(--font-about-display)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

const DATA = {
  intro: "I build secure, scalable backends and AI powered products.",
  description:
    "I'm Asad Khan, a final year B.Tech IT student focused on backend engineering. I design secure APIs, scalable systems and reliable applications with Java and Spring Boot.",
  buttonLabel: "Know more",
  full: `I'm Asad Khan, a final year B.Tech Information Technology student with a strong interest in backend development and AI.

I enjoy building software that solves real problems. My focus is backend engineering: designing secure APIs, scalable systems, and reliable applications with Java and Spring Boot.

I'm currently building products, sharing my journey publicly, and looking for opportunities to contribute to startups and engineering teams.`,

  stats: [
    { label: "GitHub projects", value: "16", suffix: "+" },
    { label: "LeetCode problems", value: "800", suffix: "+" },
    { label: "Graduating", value: "2027", suffix: "" },
  ],
};

/* Button: compact on phones, larger on desktop. No lift, only a slight brightness change. */

const BTN_SOLID = `group inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#FF895D] px-4 text-[13px] font-semibold leading-none text-[#0B111B] transition-[filter] duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D] md:h-14 md:gap-2 md:px-8 md:text-base`;

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 md:size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Key words get colour, so the eye lands on them first */
function Hi({ text, words, className }: { text: string; words: string[]; className: string }) {
  const re = new RegExp("(" + words.join("|") + ")", "g"); // words are plain text, no special characters
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

/** Stats: small numbers, quiet labels. The plus sign is small and raised, in Glacier. */
function Stats({ className }: { className: string }) {
  return (
    <dl className={className}>
      {DATA.stats.map((s) => (
        <div key={s.label} data-fade className={`flex min-w-0 flex-col items-center gap-1.5 text-center md:items-start md:gap-2 md:text-left ${HIDDEN}`}>
          <dt className="flex min-h-[3em] items-end justify-center text-[11px] font-medium leading-[1.4] text-[#657E9B] md:min-h-0 md:justify-start md:text-sm">
            {s.label}
          </dt>
          <dd className="text-[1.6rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-[#DFEAF5] md:text-[length:min(3.4vw,5.5vh)]">
            {s.value}
            {s.suffix && <span className="ml-0.5 align-top text-[0.55em] font-semibold text-[#A8C8EB]">{s.suffix}</span>}
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

  // Rendered in a portal on document.body, so the blur covers the whole website, not just this section
  return createPortal(
    <div
      className={`${manrope.variable} ${DISPLAY} fixed inset-0 z-[9998] flex items-center justify-center bg-[#0B111B]/70 p-4 backdrop-blur-md`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About me"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-[760px] flex-col rounded-3xl border border-[#253B56] bg-[#0B111B] shadow-2xl"
      >
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-14 md:px-10 md:pb-10 md:pt-16" data-lenis-prevent="true">
          <p className="whitespace-pre-line text-xl font-medium leading-9 text-[#DFEAF5]/90 md:text-2xl md:leading-10">{DATA.full}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 cursor-pointer place-items-center rounded-full text-[#657E9B] transition-colors hover:text-[#DFEAF5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF895D]"
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
      className={`${manrope.variable} ${DISPLAY} relative isolate overflow-clip bg-[#0B111B] text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B]`}
    >
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-5 pb-6 pt-32 md:block md:px-12 md:pb-4 md:pt-36 lg:px-16 lg:pb-[1.5vw]">
        {/* Title: one line */}
        <h2
          data-fade
          className={`select-none whitespace-nowrap text-[11vw] font-extrabold leading-[0.9] tracking-[-0.055em] text-[#DFEAF5] md:text-[length:min(8vw,12vh)] ${HIDDEN}`}
        >
          About me
        </h2>

        {/* Portrait left, text right. On desktop both start at the top, and the portrait is pulled up with md:-mt-[25vh]. */}
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
            <p
              data-fade
              className={`text-[1.4rem] font-semibold leading-[1.12] tracking-[-0.035em] text-[#DFEAF5] sm:text-3xl md:text-4xl xl:text-[length:min(4rem,7.4vh)] ${HIDDEN}`}
            >
              <Hi text={DATA.intro} words={["backends", "AI"]} className="text-[#A8C8EB]" />
            </p>

            <p data-fade className={`max-w-[44ch] text-[14px] font-medium leading-[1.6] text-[#657E9B] sm:text-base md:text-lg ${HIDDEN}`}>
              {DATA.description}
            </p>

            <div data-fade className={HIDDEN}>
              <button onClick={() => setOpen(true)} className={BTN_SOLID}>
                {DATA.buttonLabel}
                <ArrowRight />
              </button>
            </div>

            {/* Desktop only: stats sit right under the button, in the text column */}
            <Stats className="relative z-10 hidden md:mt-4 md:grid md:grid-cols-3 md:gap-8 xl:mt-6 xl:gap-10" />
          </div>
        </div>

        {/* Phone only: stats stay in their original place below the grid */}
        <Stats className="relative z-10 mt-[calc(10vw-2rem)] grid grid-cols-3 gap-4 md:hidden" />
      </div>

      <AboutModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}