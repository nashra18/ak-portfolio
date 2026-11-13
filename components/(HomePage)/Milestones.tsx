"use client";

/**
 * Milestones section, built on the About theme. Soft, light and minimal.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Frost #F1F6FA | Deep Fjord #18364B (text only) | Iced Denim #4F91C9 | Pistachio #A8B85A
 *
 * Scroll moments (all play once)
 * 1. Eyebrow line draws, "Milestones" rises out of a mask letter by letter
 * 2. Two soft panels rise in, their icons pop, counters count up
 * 3. Items float in one by one
 * 4. Two blurred colour glows drift slowly in the background
 *
 * Hover: an item lifts, turns white, and its icon fills with the panel colour.
 */

import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-ms-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--font-ms-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-ms-mono" });

const DISPLAY = "font-[family-name:var(--font-ms-display)]";
const SERIF = "font-[family-name:var(--font-ms-serif)]";
const MONO = "font-[family-name:var(--font-ms-mono)]";
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

type IconName = "trophy" | "award" | "flag" | "rocket" | "zap" | "code" | "cpu" | "terminal" | "chart" | "plus";
type Tone = "pistachio" | "denim";

const DATA = {
  eyebrow: "Achievements",
  title: "Milestones",
  line: "Small steps, built in public.",
  groups: [
    {
      tone: "pistachio" as Tone,
      icon: "trophy" as IconName,
      title: "Hackathons",
      text: "Building solutions, collaborating with teams, and solving real-world challenges under tight deadlines.",
      count: 4,
      suffix: "",
      items: [
        { name: "Smart India Hackathon", sub: "SIH", year: "2025", icon: "flag" as IconName },
        { name: "Bharatiya Antariksh Hackathon", sub: "ISRO", year: "2026", icon: "rocket" as IconName },
        { name: "HACKHAZARDS '26", sub: "Hackathon", year: "2026", icon: "zap" as IconName },
        { name: "GDG HackFest 2.0", sub: "GDG", year: "2026", icon: "code" as IconName },
      ],
    },
    {
      tone: "denim" as Tone,
      icon: "award" as IconName,
      title: "Certifications",
      text: "Focused on backend development, AI, and software engineering.",
      count: 3,
      suffix: "+",
      items: [
        { name: "Oracle AI Foundations Associate", sub: "Oracle", year: "", icon: "cpu" as IconName },
        { name: "HackerRank Java (Basic)", sub: "HackerRank", year: "", icon: "terminal" as IconName },
        { name: "Tata GenAI Data Analytics Simulation", sub: "Tata", year: "", icon: "chart" as IconName },
        { name: "And other certifications", sub: "More", year: "", icon: "plus" as IconName },
      ],
    },
  ],
};

/* Tone styles */

const TONE = {
  pistachio: {
    panel: "bg-[#A8B85A]/[0.14] border-[#A8B85A]/35",
    badge: "bg-[#A8B85A] text-[#18364B]",
    num: "text-[#A8B85A]",
    chip: "bg-[#A8B85A]/25 text-[#18364B] group-hover/item:bg-[#A8B85A] group-hover/item:text-[#18364B]",
    dot: "bg-[#A8B85A]",
  },
  denim: {
    panel: "bg-[#4F91C9]/[0.10] border-[#4F91C9]/30",
    badge: "bg-[#4F91C9] text-[#F1F6FA]",
    num: "text-[#4F91C9]",
    chip: "bg-[#4F91C9]/15 text-[#4F91C9] group-hover/item:bg-[#4F91C9] group-hover/item:text-[#F1F6FA]",
    dot: "bg-[#4F91C9]",
  },
} as const;

/* Icons */

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className,
  };
  switch (name) {
    case "trophy":
      return (
        <svg {...common}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case "award":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <path d="M4 22v-7" />
        </svg>
      );
    case "rocket":
      return (
        <svg {...common}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "zap":
      return (
        <svg {...common}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "code":
      return (
        <svg {...common}>
          <path d="m16 18 6-6-6-6" />
          <path d="m8 6-6 6 6 6" />
        </svg>
      );
    case "cpu":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <path d="m4 17 6-6-6-6" />
          <path d="M12 19h8" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
  }
}

/* Small pieces */

/** Letters inside a mask so they can rise into view */
function Chars({ text }: { text: string }) {
  return (
    <span aria-label={text} className="inline-flex overflow-hidden pb-[0.16em] -mb-[0.16em]">
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden data-char className="inline-block will-change-transform">
          {c}
        </span>
      ))}
    </span>
  );
}

/* Milestones */

export default function Milestones() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const one = (s: string) => q(s)[0] as HTMLElement;

      /* 1. Eyebrow, title, line */
      const eyebrow = { trigger: one("[data-eyebrow]"), start: "top 92%", once: true };
      gsap.fromTo(q("[data-eyebrow-item]"), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: eyebrow });
      gsap.fromTo(q("[data-eyebrow-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: "expo.out", transformOrigin: "left center", scrollTrigger: eyebrow });

      const head = { trigger: one("[data-title]"), start: "top 90%", once: true };
      gsap.fromTo(q("[data-char]"), { yPercent: 115 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.045, scrollTrigger: head });
      gsap.fromTo(q("[data-line]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3, scrollTrigger: head });

      /* 2 and 3. Panels: rise, icon pop, counter, items */
      q("[data-panel]").forEach((panel, i) => {
        const s = gsap.utils.selector(panel);
        const tl = gsap.timeline({ scrollTrigger: { trigger: panel, start: "top 85%", once: true }, delay: i * 0.12 });

        tl.fromTo(panel, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out" })
          .fromTo(s("[data-badge]"), { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2)" }, 0.2)
          .fromTo(s("[data-head]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.3)
          .fromTo(s("[data-item]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.5);

        const n = s("[data-count]")[0] as HTMLElement | undefined;
        if (n) {
          const to = parseFloat(n.dataset.to || "0");
          const suf = n.dataset.suffix || "";
          const o = { v: 0 };
          n.textContent = "0" + suf;
          tl.to(
            o,
            {
              v: to,
              duration: 1.4,
              ease: "power3.out",
              onUpdate: () => {
                n.textContent = Math.round(o.v) + suf;
              },
            },
            0.4
          );
        }
      });

      /* 4. Background glows drift slowly */
      q("[data-glow]").forEach((g, i) => {
        gsap.to(g, {
          x: i % 2 ? -50 : 50,
          y: i % 2 ? 40 : -40,
          duration: 7 + i * 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="milestones"
      className={`${display.variable} ${serif.variable} ${mono.variable} ${DISPLAY} relative isolate overflow-clip bg-[#F1F6FA] text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B]`}
    >
      {/* Soft glows */}
      <span aria-hidden data-glow className="pointer-events-none absolute -left-24 top-1/4 -z-10 size-[26rem] rounded-full bg-[#A8B85A]/25 blur-[110px] md:size-[34rem]" />
      <span aria-hidden data-glow className="pointer-events-none absolute -right-24 bottom-10 -z-10 size-[26rem] rounded-full bg-[#4F91C9]/25 blur-[110px] md:size-[34rem]" />

      <div className="mx-auto w-full max-w-[90rem] px-5 py-24 md:px-12 md:py-32 lg:px-16">
        {/* Eyebrow */}
        <div data-eyebrow className="mb-8 flex items-center gap-4 md:mb-12">
          <span data-eyebrow-item className="size-2 rounded-full bg-[#A8B85A]" />
          <p data-eyebrow-item className={`${MONO} text-[10px] uppercase tracking-[0.24em] text-[#18364B]/65 md:text-xs`}>
            {DATA.eyebrow}
          </p>
          <span data-eyebrow-line className="h-px flex-1 bg-[#18364B]/15" />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 data-title className="text-[clamp(2rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
            <Chars text={DATA.title} />
            <span className="ml-[0.05em] inline-block size-[0.12em] rounded-full bg-[#A8B85A]" />
          </h2>
          <p data-line className={`${SERIF} text-2xl italic text-[#18364B]/55 md:pb-4 md:text-4xl`}>
            {DATA.line}
          </p>
        </div>

        {/* Panels */}
        <div className="mt-14 grid gap-5 md:mt-20 md:gap-6 lg:grid-cols-2">
          {DATA.groups.map((g) => {
            const t = TONE[g.tone];
            return (
              <article key={g.title} data-panel className={`rounded-[2rem] border p-6 backdrop-blur-sm md:p-10 ${t.panel}`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-6">
                  <span data-badge className={`grid size-14 place-items-center rounded-full md:size-16 ${t.badge}`}>
                    <Icon name={g.icon} className="size-6 md:size-7" />
                  </span>
                  <span
                    data-head
                    data-count
                    data-to={g.count}
                    data-suffix={g.suffix}
                    className={`${SERIF} text-7xl leading-[0.8] md:text-8xl ${t.num}`}
                  >
                    {g.count}
                    {g.suffix}
                  </span>
                </div>

                <h3 data-head className="mt-8 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] md:text-5xl">
                  {g.title}
                </h3>
                <p data-head className="mt-3 max-w-[44ch] text-[14px] leading-[1.7] text-[#18364B]/70 sm:text-base">
                  {g.text}
                </p>

                {/* Items */}
                <ul className="mt-8 flex flex-col gap-3 md:mt-10">
                  {g.items.map((it) => (
                    <li
                      key={it.name}
                      data-item
                      className={`group/item flex items-center gap-4 rounded-2xl bg-white/65 px-4 py-3.5 transition-[transform,background-color,box-shadow] duration-500 ${SPRING} hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_34px_-18px_rgba(24,54,75,0.35)] md:gap-5 md:px-5 md:py-4`}
                    >
                      <span className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-500 ${SPRING} md:size-11 ${t.chip}`}>
                        <Icon name={it.icon} className="size-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-bold leading-snug tracking-[-0.01em] md:text-lg">{it.name}</p>
                        <p className={`${MONO} mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[#18364B]/50 md:text-[11px]`}>{it.sub}</p>
                      </div>
                      {it.year && <span className={`${SERIF} text-xl text-[#18364B]/55 md:text-2xl`}>{it.year}</span>}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}