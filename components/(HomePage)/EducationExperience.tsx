"use client";

/**
 * Education and Experience section. Self-contained.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (borders) | Ice Sheet #DFEAF5 (main text)
 * Glacier #A8C8EB (place, numbers) | Tangerine #FF895D (period, selection) | Storm #657E9B (quiet labels)
 *
 * Weight hierarchy (one font, three weights):
 * L1  Block title (Education, Experience)  800, huge, Ice Sheet
 * L2  Degree / role                        600, medium, Ice Sheet
 * L3  College / company                    500, small, Glacier
 * L4  Period, stat labels                  600/500, tiny caps, Tangerine / Storm
 * L5  Body                                 500, Ice Sheet at 65%, key words 600 in Ice Sheet
 *
 * Education: degree and college on top, then two stats (Graduating, SGPA), like the About section.
 * Experience: period, role, company, three points, certificate button.
 *
 * Every piece of information appears exactly once.
 * Layout: title on the left, details on the right (desktop). Stacked on phones.
 * A thin dashed line separates the two blocks, same as the Skills section.
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

/** One block: big title on the left, details on the right */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-8 py-16 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-16 md:py-24">
      <h2
        data-fade
        className={`select-none text-[length:clamp(2.5rem,12vw,3.5rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#DFEAF5] md:text-[length:min(6vw,10vh)] ${HIDDEN}`}
      >
        {title}
      </h2>
      <div className="flex flex-col gap-6 md:gap-7">{children}</div>
    </div>
  );
}

/** Role or degree (main), place (supporting). Period is optional. */
function Heading({ period, title, place }: { period?: string; title: string; place: string }) {
  return (
    <div className="flex flex-col gap-3">
      {period && (
        <span
          data-fade
          className={`w-fit text-[11px] font-semibold uppercase leading-none tracking-[0.18em] text-[#FF895D] md:text-xs ${HIDDEN}`}
        >
          {period}
        </span>
      )}
      <h3
        data-fade
        className={`text-[length:clamp(1.4rem,6vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-[#DFEAF5] md:text-[length:min(2.4vw,4vh)] ${HIDDEN}`}
      >
        {title}
      </h3>
      <p data-fade className={`text-sm font-medium leading-[1.3] text-[#A8C8EB] md:text-base ${HIDDEN}`}>
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
        <div className="flex flex-col divide-y divide-dashed divide-[#253B56]">
          {/* Education */}
       {/* Education */}
<Block title="Education">
  <Heading title={DATA.education.degree} place={DATA.education.college} />

  <p data-fade className={`mt-2 flex items-baseline gap-3 ${HIDDEN}`}>
    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#657E9B] md:text-xs">SGPA</span>
    <span className="text-[1.75rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-[#DFEAF5] md:text-4xl">
      {DATA.education.sgpa}
    </span>
  </p>
</Block>

          {/* Experience */}
          <Block title="Experience">
            <Heading period={DATA.experience.period} title={DATA.experience.role} place={DATA.experience.company} />

            <div className="flex max-w-2xl flex-col gap-4 md:gap-5">
              {DATA.experience.points.map((p) => (
                <p key={p} data-fade className={`text-[15px] font-medium leading-[1.7] text-[#DFEAF5]/65 md:text-base ${HIDDEN}`}>
                  <Hi text={p} words={["backend development", "RESTful APIs", "Java"]} className="font-semibold text-[#DFEAF5]" />
                </p>
              ))}
            </div>

            <div data-fade className={HIDDEN}>
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