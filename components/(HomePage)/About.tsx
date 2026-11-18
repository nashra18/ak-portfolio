
"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIso =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DATA = {
  intro: "I build secure, scalable backends and AI powered products.",

  description:
    "I'm Asad Khan, a final year B.Tech IT student focused on backend engineering. I design secure APIs, scalable systems and reliable applications with Java and Spring Boot.",

  full: `I'm Asad Khan, a final year B.Tech Information Technology student, graduating in 2027. I learn by building, so most of what I know comes from shipping real projects, solving 800+ problems on LeetCode and sharing my journey publicly.

Day to day I work on backends. I build APIs protected with JWT and role based access, design systems that can grow, and write applications that stay reliable under real use, mostly with Java and Spring Boot. Alongside that, I build AI products, like a health chatbot on Google Gemini and ML models for air quality and exoplanet detection.

I believe the best part of a product is the part nobody notices, because it never breaks. I like keeping systems simple, secure and honest, and I want to work with startups and teams who care about the same things.`,

  stats: [
    { label: "GitHub projects", value: "16", suffix: "+" },
    { label: "LeetCode problems", value: "800", suffix: "+" },
    { label: "Graduating", value: "2027", suffix: "" },
  ],
};

function HighlightText({
  text,
  words,
}: {
  text: string;
  words: string[];
}) {
  const parts = text.split(/(backends|AI)/g);

  return (
    <>
      {parts.map((part, index) =>
        words.includes(part) ? (
          <span key={index} className="text-subheading">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function AboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/75 p-4 backdrop-blur-lg"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About me"
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-[700px] flex-col overflow-hidden rounded-2xl border border-section-border bg-section-bg shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-section-border px-6 py-5 md:px-9">
          <h3 className="text-lg font-bold tracking-tight text-heading">
            About me
          </h3>

          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-section-border text-muted transition-colors hover:border-accent hover:text-heading"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div
          className="overflow-y-auto px-6 py-7 md:px-9 md:py-9"
          data-lenis-prevent="true"
        >
          <p className="whitespace-pre-line text-[15px] leading-[1.85] text-paragraph-strong md:text-lg md:leading-[1.9]">
            {DATA.full}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function StatItem({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div data-stat className="min-w-0">
      <p className="text-[10px] font-medium leading-relaxed text-muted sm:text-xs">
        {label}
      </p>

      <p className="mt-2 text-2xl font-extrabold leading-none tracking-[-0.055em] text-heading tabular-nums sm:text-3xl lg:text-[2.6rem]">
        {value}
        {suffix && (
          <span className="ml-0.5 align-top text-[0.5em] font-semibold text-subheading">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const closeModal = useCallback(() => setOpen(false), []);

  useIso(() => {
    const element = root.current;
    if (!element) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const image = element.querySelector<HTMLElement>("[data-portrait]");
      const intro = element.querySelector<HTMLElement>("[data-intro]");
      const description =
        element.querySelector<HTMLElement>("[data-description]");
      const button = element.querySelector<HTMLElement>("[data-button]");
      const stats = gsap.utils.toArray<HTMLElement>(
        "[data-stat]",
        element
      );

      if (!image || !intro || !description || !button) return;

      gsap.set([image, intro, description, button, ...stats], {
        autoAlpha: 0,
        y: 18,
      });

      gsap.set(image, {
        clipPath: "inset(7% 0 0 0)",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 76%",
          once: true,
        },
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(image, {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 1.05,
        })
        .to(
          intro,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
          },
          "-=0.65"
        )
        .to(
          description,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
          },
          "-=0.5"
        )
        .to(
          button,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.4"
        );

      if (stats.length) {
        timeline.to(
          stats,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
          },
          "-=0.3"
        );
      }
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={root}
      id="about"
      aria-label="About me"
      className="relative isolate overflow-hidden bg-section-bg font-display text-heading antialiased"
    >
      <div className="mx-auto w-full max-w-page px-gutter pb-20 pt-28 sm:pb-24 sm:pt-32 md:px-gutter-md md:pb-section-md md:pt-36 lg:px-gutter-lg">
        <h2 className="select-none text-h2 text-heading md:text-h2-md">
          About me
        </h2>

        <div className="mt-10 grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)] items-start gap-x-4 gap-y-8 sm:mt-12 sm:gap-x-6 md:mt-14 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] md:gap-x-14 md:gap-y-0 xl:mt-16 xl:gap-x-20">
          {/* Portrait */}

          <div
            data-portrait
            className="relative mx-auto w-full max-w-[180px] md:col-start-1 md:row-span-2 md:row-start-1 md:max-w-[24rem]"
          >
            <div className="pointer-events-none absolute inset-x-[12%] bottom-[8%] top-[8%] rounded-full border border-section-border/50" />

            <Image
              src="/portfolio.images/portfolioak-removebg-preview.png"
              alt="Asad Khan"
              width={330}
              height={740}
              priority
              draggable={false}
              sizes="(max-width: 640px) 42vw, (max-width: 1024px) 35vw, 380px"
              className="relative z-10 h-auto w-full select-none object-contain"
            />
          </div>

          {/* Introduction and button */}

          <div className="flex min-w-0 flex-col items-start pt-1 md:col-start-2 md:row-start-1 md:pt-5 xl:pt-8">
            <p
              data-intro
              className="max-w-[25ch] text-[clamp(1.05rem,2.5vw,2.25rem)] font-semibold leading-[1.25] tracking-[-0.045em] text-heading"
            >
              <HighlightText
                text={DATA.intro}
                words={["backends", "AI"]}
              />
            </p>

            <p
              data-description
              className="mt-3 max-w-[43ch] text-[10px] leading-[1.7] text-subheading-soft sm:mt-5 sm:text-sm sm:leading-[1.85] md:mt-6 md:text-body-md"
            >
              {DATA.description}
            </p>

            <button
              data-button
              onClick={() => setOpen(true)}
              className="group mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-button-bg px-3 py-2 text-[10px] font-semibold text-on-accent transition-all duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:mt-6 sm:px-5 sm:py-3 sm:text-sm md:mt-7 md:px-7 md:py-3.5"
            >
              Know more
              <ArrowIcon />
            </button>
          </div>

          {/* Stats */}

          <div className="col-span-full mt-2 grid w-full grid-cols-3 gap-x-4 gap-y-5 md:col-span-1 md:col-start-2 md:row-start-2 md:mt-10 md:gap-8 xl:mt-11">
            {DATA.stats.map((stat) => (
              <StatItem
                key={stat.label}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>
      </div>

      <AboutModal open={open} onClose={closeModal} />
    </section>
  );
}
