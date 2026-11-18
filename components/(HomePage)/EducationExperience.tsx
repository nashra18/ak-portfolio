
"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const DATA = {
  education: {
    degree: "B.Tech in Information Technology",
    college: "Galgotias College of Engineering & Technology",
    sgpa: "7.52",
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

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function Hi({
  text,
  words,
}: {
  text: string;
  words: string[];
}) {
  const escaped = words.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");

  return (
    <>
      {text.split(regex).map((part, index) =>
        words.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
          <span key={index} className="font-semibold text-heading">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-9 border-section-border py-16 first:border-t-0 first:pt-0 last:pb-0 [&:not(:first-child)]:border-t md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] md:gap-16 md:py-24">
      <div data-fade className={HIDDEN}>
        <h2 className="text-h2 text-heading md:text-h2-md">
          {title}
        </h2>
      </div>

      <div className="flex min-w-0 flex-col gap-9 md:gap-11">
        {children}
      </div>
    </div>
  );
}

/* Education: only SGPA */

function EducationStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div data-fade className={`flex flex-col gap-2 ${HIDDEN}`}>
      <span className="text-small uppercase tracking-eyebrow text-muted md:text-small-md">
        {label}
      </span>

      <span className="text-stat tabular-nums text-heading md:text-stat-md">
        {value}
      </span>
    </div>
  );
}

function EducationContent({
  degree,
  college,
  sgpa,
}: {
  degree: string;
  college: string;
  sgpa: string;
}) {
  return (
    <div className="flex flex-col gap-7 md:gap-8">
      <div data-fade className={HIDDEN}>
        <h3 className="max-w-xl text-h3 leading-snug text-heading md:text-h3-md">
          {degree}
        </h3>

        <p className="mt-3 max-w-lg text-sub leading-relaxed text-subheading md:text-sub-md">
          {college}
        </p>
      </div>

      <EducationStat label="SGPA" value={sgpa} />
    </div>
  );
}

/* Experience timeline: unchanged */

function ExperiencePoint({
  text,
  index,
}: {
  text: string;
  index: string;
}) {
  return (
    <div
      data-fade
      className={`group relative grid grid-cols-[22px_minmax(0,1fr)] gap-4 ${HIDDEN}`}
    >
      <div className="relative flex justify-center">
        <span className="relative z-10 mt-[7px] size-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(255,137,93,0.10),0_0_14px_rgba(255,137,93,0.35)] transition-transform duration-300 group-hover:scale-125" />

        <span className="absolute bottom-[-24px] top-5 w-px bg-section-border last:hidden" />
      </div>

      <div className="flex items-start gap-4 pb-2">
        <span className="mt-0.5 hidden font-mono text-[10px] tracking-widest text-muted sm:block">
          {index}
        </span>

        <p className="max-w-2xl text-body leading-[1.9] text-paragraph md:text-body-md">
          <Hi
            text={text}
            words={["backend development", "RESTful APIs", "Java"]}
          />
        </p>
      </div>
    </div>
  );
}

export default function EducationExperience() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const element = root.current;
    if (!element) return;

    const mm = gsap.matchMedia();

    const context = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-fade]", element);

        gsap.set(items, {
          autoAlpha: 0,
          y: 20,
        });

        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.09,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });
      });
    }, element);

    return () => {
      mm.revert();
      context.revert();
    };
  }, []);

  const { education: edu, experience: exp, certificate } = DATA;

  return (
    <section
      ref={root}
      id="experience"
      className="relative isolate overflow-hidden bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="pointer-events-none absolute -right-40 top-24 size-[420px] rounded-full border border-section-border opacity-40" />
      <div className="pointer-events-none absolute -right-24 top-40 size-[260px] rounded-full border border-section-border opacity-40" />

      <div className="relative mx-auto w-full max-w-page px-gutter pb-section pt-section md:px-gutter-md md:pb-section-md md:pt-section-md lg:px-gutter-lg">
        <div className="flex flex-col">

          {/* Education */}

          <Block title="Education">
            <EducationContent
              degree={edu.degree}
              college={edu.college}
              sgpa={edu.sgpa}
            />
          </Block>

          {/* Experience */}

          <Block title="Experience">
            <div className="relative" data-fade>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-section-border bg-button-ghost-bg px-3 py-2">
                <span className="size-1.5 rounded-full bg-accent shadow-[0_0_9px_rgba(255,137,93,0.55)]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-subheading sm:text-xs">
                  {exp.period}
                </span>
              </div>

              <h3 className="max-w-xl text-h3 leading-snug text-heading md:text-h3-md">
                {exp.role}
              </h3>

              <p className="mt-3 text-sub text-subheading md:text-sub-md">
                {exp.company}
              </p>
            </div>

            <div className="flex max-w-2xl flex-col gap-6">
              {exp.points.map((point, index) => (
                <ExperiencePoint
                  key={point}
                  text={point}
                  index={`0${index + 1}`}
                />
              ))}
            </div>

            <div data-fade className={HIDDEN}>
              <a
                href={certificate.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center gap-4 rounded-full border border-button-ghost-border bg-button-ghost-bg px-5 text-sm font-semibold text-heading transition-all duration-300 hover:border-button-ghost-border-hover hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:px-6"
              >
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
