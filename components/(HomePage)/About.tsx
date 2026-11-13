"use client";

/**
 * About section, built on the hero theme.
 * Needs: next (next/image, next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Frost #F1F6FA | Deep Fjord #18364B | Iced Denim #4F91C9 | Pistachio #A8B85A
 *
 * Scroll moments
 * 1. "About" and "me" slide in from opposite sides and meet
 * 2. The portrait is revealed upwards like a curtain, then drifts slowly
 * 3. The intro line lights up word by word as you read down
 * 4. Stats count up
 * 5. Section titles rise out of a mask, letter by letter
 * 6. Education and experience use one timeline style: the line draws itself,
 *    a pistachio dot leads it, and each point wakes up as it arrives
 */

import Image from "next/image";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-about-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--font-about-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-about-mono" });

const DISPLAY = "font-[family-name:var(--font-about-display)]";
const SERIF = "font-[family-name:var(--font-about-serif)]";
const MONO = "font-[family-name:var(--font-about-mono)]";
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";
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
    { label: "GitHub projects", to: 16, dec: 0, suffix: "+" },
    { label: "LeetCode Problems", to: 800, dec: 0, suffix: "+" },
    { label: "Graduating", to: 2027, dec: 0, suffix: "" },
  ],

  education: {
    degree: "B.Tech in Information Technology",
    college: "Galgotias College of Engineering & Technology",
    period: "Graduating 2027",
    sgpa: "7.52", // put your real SGPA here
  },

  experience: {
    role: "Java Full Stack Development Intern",
    company: "Kinetrexa Software Private Limited",
    period: "Jul 2026 to Aug 2026",
    points: [
      "Developed and contributed to real world software projects, applying backend development and software engineering practices.",
      "Worked with Java application development, RESTful APIs, databases and full stack integration to build and improve application functionality.",
      "Collaborated on project development while following structured coding practices, debugging workflows and professional development processes.",
    ],
  },

  certificate: {
    label: "View certificate",
    href: "https://meranaamkhann.netlify.app/assets/Kinetrexa_Internship_Certificate.pdf",
  },
};

/* Small pieces */

const PILL = `${DISPLAY} group inline-flex w-fit items-center gap-3 whitespace-nowrap rounded-full text-sm font-semibold transition-transform duration-500 ${SPRING} hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F91C9] md:text-base`;
const PILL_SOLID = `${PILL} bg-[#A8B85A] py-1 pl-5 pr-1 text-[#18364B]`;
const PILL_GHOST = `${PILL} border border-[#18364B]/50 bg-[#F1F6FA]/60 py-[3px] pl-5 pr-[3px] text-[#18364B] hover:border-[#18364B]`;

function Circle({ children }: { children: ReactNode }) {
  return <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#18364B]/10 md:size-9">{children}</span>;
}

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" className={`size-3.5 transition-transform duration-500 ${SPRING} group-hover:translate-x-0.5`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" className={`size-3.5 transition-transform duration-500 ${SPRING} group-hover:-translate-y-0.5 group-hover:translate-x-0.5`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

/** Important words in Iced Denim */
const HI_WORDS = ["backends", "AI"];

function Hi({ text, words }: { text: string; words: string[] }) {
  const re = new RegExp("(" + words.join("|") + ")", "g"); // words are plain text, no special characters
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-semibold text-[#4F91C9]">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

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

function SectionTitle({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className={`${MONO} text-sm text-[#4F91C9]`}>{index}</span>
      <h3 data-chars className="text-[2.75rem] font-extrabold leading-[1.05] tracking-[-0.04em] md:text-[length:min(7vw,10vh)]">
        <Chars text={children} />
      </h3>
    </div>
  );
}

/** One timeline entry, used by both Education and Experience */
function Entry({
  title,
  place,
  period,
  points,
  action,
}: {
  title: string;
  place: string;
  period: string;
  points?: string[];
  action?: ReactNode;
}) {
  return (
    <div data-tl className="relative mt-8 pl-7 md:mt-10 md:pl-14">
      <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-[#18364B]/15" />
      <span aria-hidden data-tl-line className="absolute left-0 top-0 h-full w-px bg-[#4F91C9]" />
      <span aria-hidden data-tl-dot className="absolute -left-[6px] top-0 size-3.5 rounded-full bg-[#A8B85A] ring-4 ring-[#F1F6FA]" />

      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <h4 data-head className="max-w-[22ch] text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-[#4F91C9] md:text-5xl">
          {title}
        </h4>
        <span data-head className={`${MONO} text-xs text-[#18364B]/65 md:text-sm`}>
          {period}
        </span>
      </div>
      <p data-head className="mt-3 text-base text-[#18364B]/80 md:text-xl">
        {place}
      </p>

      {points && points.length > 0 && (
        <ul className="mt-7 flex max-w-3xl flex-col gap-5 md:mt-8 md:gap-5">
          {points.map((p) => (
            <li key={p} data-bullet className="flex gap-4 text-base leading-[1.65] text-[#18364B]/85 md:text-lg">
              <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 bg-[#A8B85A]" />
              <span>
                <Hi text={p} words={["backend development", "RESTful APIs", "Java"]} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {action}
    </div>
  );
}

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#18364B]/45 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="About me"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[85vh] w-full max-w-[640px] flex-col rounded-3xl bg-[#F1F6FA] shadow-2xl"
      >
        <div className="flex-1 overflow-y-auto px-8 pb-8 pt-14" data-lenis-prevent="true">
          <p className="whitespace-pre-line text-lg leading-8 text-[#18364B]/85">{DATA.full}</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 cursor-pointer place-items-center rounded-full text-[#18364B]/70 transition-colors hover:bg-[#18364B]/10 hover:text-[#18364B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F91C9]"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* About */

export default function About() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const words = DATA.intro.split(" ");

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const one = (s: string) => q(s)[0] as HTMLElement;

      /* 1. Title: the two words slide in from opposite sides and meet (once) */
      const title = { trigger: one("[data-title]"), start: "top 92%", once: true };
      gsap.fromTo(q("[data-t-l]"), { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", scrollTrigger: title });
      gsap.fromTo(q("[data-t-r]"), { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.2, ease: "expo.out", scrollTrigger: title });

      /* 2. Portrait: curtain reveal and a small settle (once) */
      const img = { trigger: one("[data-img]"), start: "top 92%", once: true };
      gsap.fromTo(q("[data-img]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: img });
      gsap.fromTo(q("[data-img-in]"), { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: img });

      /* 3. Intro: words light up one after another (once) */
      gsap.fromTo(
        q("[data-word]"),
        { opacity: 0.14 },
        { opacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.12, scrollTrigger: { trigger: one("[data-intro]"), start: "top 85%", once: true } }
      );
      gsap.fromTo(
        q("[data-desc]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: one("[data-desc]"), start: "top 90%", once: true } }
      );

      /* 4. Stats count up */
      q("[data-count]").forEach((node) => {
        const n = node as HTMLElement;
        const to = parseFloat(n.dataset.to || "0");
        const dec = parseInt(n.dataset.dec || "0", 10);
        const suf = n.dataset.suffix || "";
        const o = { v: 0 };
        n.textContent = (0).toFixed(dec) + suf;
        gsap.to(o, {
          v: to,
          duration: 1.8,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top 92%", once: true },
          onUpdate: () => {
            n.textContent = o.v.toFixed(dec) + suf;
          },
        });
      });

      /* 5. Section titles rise out of a mask */
      q("[data-chars]").forEach((h) => {
        gsap.fromTo(
          gsap.utils.selector(h)("[data-char]"),
          { yPercent: 115 },
          { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.045, scrollTrigger: { trigger: h, start: "top 88%", once: true } }
        );
      });

      /* 6. Timelines (education and experience): the line draws, the dot leads, points wake up */
      q("[data-tl]").forEach((tl) => {
        const s = gsap.utils.selector(tl);
        const tlTrigger = { trigger: tl, start: "top 65%", end: "bottom 70%", scrub: 0.6 };
        gsap.set(s("[data-tl-line]"), { transformOrigin: "top center" });
        gsap.fromTo(s("[data-tl-line]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: tlTrigger });
        gsap.fromTo(s("[data-tl-dot]"), { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: tlTrigger });
        s("[data-bullet]").forEach((b) => {
          gsap.fromTo(b, { opacity: 0.16, x: -16 }, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 90%", once: true } });
        });
        gsap.fromTo(
          s("[data-head]"),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: s("[data-head]")[0], start: "top 88%", once: true } }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="about"
      className={`${display.variable} ${serif.variable} ${mono.variable} ${DISPLAY} relative isolate overflow-clip bg-[#F1F6FA] text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B]`}
    >
      {/* First screen: on phones it fills one screen, with the title pushed lower */}
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[90rem] flex-col gap-8 px-5 pb-10 pt-24 md:block md:min-h-0 md:px-12 md:pb-0 md:pt-28 lg:px-16 lg:pb-[6vw]">
        {/* Title */}
        <h2
          data-title
          aria-label="About me"
          className="flex select-none items-end gap-[0.18em] text-[17vw] font-extrabold leading-[0.85] tracking-[-0.05em] md:text-[length:min(14vw,20vh)]"
        >
          <span aria-hidden data-t-l className="block">About</span>
          <span aria-hidden data-t-r className="block">
            me<span className="ml-[0.04em] inline-block size-[0.12em] rounded-full bg-[#A8B85A]" />
          </span>
        </h2>

        {/* Portrait + text: a bigger portrait on the left, intro, paragraph and button stacked tight on the right */}
        <div className="grid grid-cols-2 items-center gap-x-4 md:mt-6 md:gap-x-10 xl:grid-cols-[minmax(0,24rem)_1fr] xl:gap-x-16">
          <div data-img className="relative -ml-2 w-[calc(100%+0.5rem)] md:ml-0 md:w-full xl:max-w-[24rem]">
            <div data-img-in className="will-change-transform">
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
          </div>

          <div className="flex flex-col justify-center gap-4 md:gap-6 xl:gap-7">
            <p
              data-intro
              className={`${SERIF} text-[1.6rem] leading-[1.1] tracking-[-0.01em] sm:text-4xl md:text-5xl xl:text-[length:min(5rem,9vh)]`}
            >
              {words.map((w, i) => (
                <span key={i} data-word className={`mr-[0.24em] inline-block${HI_WORDS.includes(w) ? " text-[#4F91C9]" : ""}`}>
                  {w}
                </span>
              ))}
            </p>

            <p data-desc className="max-w-[44ch] text-[14px] leading-[1.6] text-[#18364B]/80 sm:text-base md:text-lg">
              {DATA.description}
            </p>

            <div data-desc>
              <button onClick={() => setOpen(true)} className={`${PILL_SOLID} cursor-pointer`}>
                {DATA.buttonLabel}
                <Circle>
                  <ArrowRight />
                </Circle>
              </button>
            </div>
          </div>
        </div>

        {/* Stats: closer to the button block on big screens */}
        <dl className="relative z-10 mt-[calc(10vw-2rem)] grid grid-cols-3 gap-4 md:mt-[2.5vw] md:gap-10 lg:-mt-[7.5vw]">
          {DATA.stats.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col items-center gap-2 text-center md:items-start md:gap-3 md:text-left">
              <dt className={`${MONO} flex min-h-[3em] items-end justify-center text-[11px] leading-[1.5] text-[#18364B]/65 md:min-h-0 md:justify-start md:text-sm`}>{s.label}</dt>
              <dd
                data-count
                data-to={s.to}
                data-dec={s.dec}
                data-suffix={s.suffix}
                className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-[#4F91C9] md:text-[length:min(8vw,11vh)]"
              >
                {s.to.toFixed(s.dec)}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Education and experience */}
      <div className="mx-auto w-full max-w-[90rem] px-5 pb-20 pt-20 md:px-12 md:pb-24 md:pt-28 lg:px-16">
        {/* 01 Education: kept short */}
        <div>
          <SectionTitle index="01">Education</SectionTitle>
          <Entry
            title={DATA.education.degree}
            place={DATA.education.college}
            period={DATA.education.period}
            points={[`SGPA ${DATA.education.sgpa}`]}
          />
        </div>

        {/* 02 Experience */}
        <div className="mt-20 md:mt-28">
          <SectionTitle index="02">Experience</SectionTitle>
          <Entry
            title={DATA.experience.role}
            place={DATA.experience.company}
            period={DATA.experience.period}
            points={DATA.experience.points}
            action={
              <a href={DATA.certificate.href} target="_blank" rel="noopener noreferrer" className={`${PILL_GHOST} mt-8`}>
                {DATA.certificate.label}
                <Circle>
                  <ArrowUpRight />
                </Circle>
              </a>
            }
          />
        </div>
      </div>

      <AboutModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}