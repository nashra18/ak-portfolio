"use client";

/**
 * Education and Experience section. Self-contained.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (borders) | Ice Sheet #DFEAF5 (main text)
 * Tangerine #FF895D (accent) | Glacier #A8C8EB (highlights) | Storm #657E9B (quiet text)
 *
 * Hierarchy (one font, three weights):
 * L1  Page title        800, huge          (matches "About me")
 * L2  Role / degree     800, large         (the strongest thing in each block)
 * L3  Place             600, Glacier       (supporting)
 * L4  Period, labels    600, small caps    (metadata)
 * L5  Body              500, Storm         (quiet)
 *
 * Layout: label column on the left, content on the right (desktop). Stacked on phones.
 * No divider lines. Space and size do the separating.
 * Motion: one soft fade-up per block when it enters the screen. Nothing else moves.
 */

import { Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-exp-display",
});

const DISPLAY = "font-[family-name:var(--font-exp-display)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

const DATA = {
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

/* Button: compact on phones, larger on desktop. No lift, only a slight brightness change. */

const BTN_GHOST = `group inline-flex h-10 w-fit cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#253B56] px-4 text-[13px] font-semibold leading-none text-[#DFEAF5] transition-[filter,border-color] duration-300 hover:border-[#657E9B] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D] md:h-14 md:gap-2 md:px-8 md:text-base`;

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 md:size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

/** Key words get weight and brightness, so the eye lands on them first */
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

/** Period shown as small spaced capitals in Glacier. No box, no lines. */
function Period({ children }: { children: string }) {
  return (
    <span
      data-fade
      className={`w-fit text-[11px] font-semibold uppercase leading-none tracking-[0.18em] text-[#FF895D] md:text-xs ${HIDDEN}`}
    >
      {children}
    </span>
  );
}

/** One block: label column on the left, content on the right */
function Block({ index, label, children }: { index: string; label: string; children: ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-16">
      <div data-fade className={`flex items-baseline gap-3 md:flex-col md:gap-3 ${HIDDEN}`}>
        <span className="text-sm font-extrabold tabular-nums tracking-[-0.02em] text-[#FF895D] md:text-base">{index}</span>
        <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#657E9B] md:text-sm">{label}</h3>
      </div>
      <div className="flex flex-col gap-5 md:gap-6">{children}</div>
    </div>
  );
}

/** Role or degree (strongest), then place (supporting) */
function Heading({ title, place }: { title: string; place: string }) {
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      <h4
        data-fade
        className={`text-[length:clamp(1.6rem,7vw,2.25rem)] font-extrabold leading-[1.05] tracking-[-0.045em] text-[#DFEAF5] md:text-[length:min(3.6vw,6vh)] ${HIDDEN}`}
      >
        {title}
      </h4>
      <p data-fade className={`text-base font-semibold leading-[1.3] tracking-[-0.01em] text-[#A8C8EB] md:text-xl ${HIDDEN}`}>
        {place}
      </p>
    </div>
  );
}

export default function EducationExperience() {
  const root = useRef<HTMLElement>(null);

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
      id="experience"
      className={`${manrope.variable} ${DISPLAY} relative isolate overflow-clip bg-[#0B111B] text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B]`}
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 pb-20 pt-20 md:px-12 md:pb-28 md:pt-28 lg:px-16">
        {/* L1: page title */}
        <h2
          data-fade
          className={`select-none text-[11vw] font-extrabold leading-[0.9] tracking-[-0.055em] text-[#DFEAF5] md:text-[length:min(8vw,12vh)] ${HIDDEN}`}
        >
          Education <span className="text-[#657E9B]">and</span> Experience
        </h2>

        <div className="mt-12 flex flex-col gap-16 md:mt-20 md:gap-28">
          {/* Education */}
          <Block index="01" label="Education">
            <Period>{DATA.education.period}</Period>
            <Heading title={DATA.education.degree} place={DATA.education.college} />

            <dl data-fade className={`mt-2 flex w-fit flex-col gap-2 ${HIDDEN}`}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#657E9B] md:text-xs">SGPA</dt>
              <dd className="text-5xl font-extrabold leading-none tracking-[-0.05em] tabular-nums text-[#DFEAF5] md:text-7xl">
                {DATA.education.sgpa}
              </dd>
            </dl>
          </Block>

          {/* Experience */}
          <Block index="02" label="Experience">
            <Period>{DATA.experience.period}</Period>
            <Heading title={DATA.experience.role} place={DATA.experience.company} />

            <ul className="mt-2 flex max-w-3xl flex-col gap-6 md:gap-8">
              {DATA.experience.points.map((p, i) => (
                <li key={p} data-fade className={`grid grid-cols-[2.25rem_1fr] gap-x-2 md:grid-cols-[3rem_1fr] ${HIDDEN}`}>
                  <span className="pt-[0.3em] text-xs font-extrabold tabular-nums text-[#FF895D] md:text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] font-medium leading-[1.65] text-[#657E9B] md:text-lg">
                    <Hi text={p} words={["backend development", "RESTful APIs", "Java"]} className="font-semibold text-[#DFEAF5]" />
                  </span>
                </li>
              ))}
            </ul>

            <div data-fade className={`mt-2 ${HIDDEN}`}>
              <a href={DATA.certificate.href} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                {DATA.certificate.label}
                <ArrowUpRight />
              </a>
            </div>
          </Block>
        </div>
      </div>
    </section>
  );
}