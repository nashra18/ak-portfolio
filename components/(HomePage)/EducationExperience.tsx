"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Fonts are loaded once in layout.tsx. */

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

const DATA = {
  education: {
    degree: "B.Tech in Information Technology",
    college: "Galgotias College of Engineering & Technology",
    graduating: "2027",
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

const BTN_GHOST =
  "group inline-flex h-12 w-fit cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-button-ghost-border bg-button-ghost-bg px-6 text-sm font-semibold leading-none text-heading transition-[filter,border-color] duration-300 hover:border-button-ghost-border-hover hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:h-14 md:px-8 md:text-base";

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 md:size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

/** Key words get weight and brightness, so the eye lands on them first */
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

/** One block: big title on the left, details on the right, solid line above every block except the first */
function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-8 border-section-border py-16 first:pt-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-16 md:py-24 md:first:pt-0 [&:not(:first-child)]:border-t last:pb-0">
      <h2 data-fade className={`select-none text-h2 md:text-h2-md text-heading ${HIDDEN}`}>
        {title}
      </h2>
      <div className="flex flex-col gap-8 md:gap-10">{children}</div>
    </div>
  );
}

/** Small label above a value: used for the stats */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div data-fade className={`flex flex-col gap-2 ${HIDDEN}`}>
      <span className="text-small md:text-small-md uppercase tracking-eyebrow text-muted">{label}</span>
      <span className="text-stat md:text-stat-md tabular-nums text-heading">{value}</span>
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

  const { education: edu, experience: exp, certificate } = DATA;

  return (
    <section
      ref={root}
      id="experience"
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto w-full max-w-page px-gutter pb-section pt-section md:px-gutter-md md:pb-section-md md:pt-section-md lg:px-gutter-lg">
        <div className="flex flex-col">
          {/* Education */}
          <Block title="Education">
            <div data-fade className={`flex flex-col gap-3 ${HIDDEN}`}>
              <h3 className="text-h3 md:text-h3-md text-heading">{edu.degree}</h3>
              <p className="text-sub md:text-sub-md text-subheading">{edu.college}</p>
            </div>

            <div className="flex gap-12 md:gap-16">
              <Stat label="Graduating" value={edu.graduating} />
              <Stat label="SGPA" value={edu.sgpa} />
            </div>
          </Block>

          {/* Experience */}
          <Block title="Experience">
            <div className="flex flex-col gap-3">
              <span data-fade className={`w-fit text-small md:text-small-md uppercase tracking-eyebrow text-accent ${HIDDEN}`}>
                {exp.period}
              </span>
              <h3 data-fade className={`text-h3 md:text-h3-md text-heading ${HIDDEN}`}>
                {exp.role}
              </h3>
              <p data-fade className={`text-sub md:text-sub-md text-subheading ${HIDDEN}`}>
                {exp.company}
              </p>
            </div>

            <div className="flex max-w-2xl flex-col gap-5 md:gap-6">
              {exp.points.map((p) => (
                <p key={p} data-fade className={`text-body md:text-body-md text-paragraph ${HIDDEN}`}>
                  <Hi text={p} words={["backend development", "RESTful APIs", "Java"]} className="font-semibold text-heading" />
                </p>
              ))}
            </div>

            <div data-fade className={HIDDEN}>
              <a href={certificate.href} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                {certificate.label}
                <ArrowUpRight />
              </a>
            </div>
          </Block>
        </div>
      </div>
    </section>
  );
}