"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Concept
   Education  : a credential card that tilts in 3D toward your cursor, with a
                spotlight and glowing border that follow the pointer. The SGPA
                number counts up once.
   Experience : each sentence is written in light once when it enters the view.
                Words go dim -> orange -> white in a wave.

   Typography comes from the theme tokens (globals.css), same as About and Approach. */

const ACCENT = "#FF895D";
const TEXT = "#F5F7FA";
const DIM = "#2B323C";
const GLOW = "rgba(255,137,93,0.55)";

const education = {
  degree: "B.Tech in Information Technology",
  college: "Galgotias College of Engineering & Technology",
  sgpa: 7.52,
  scale: 10,
};

const experience = {
  role: "Java Full Stack Development Intern",
  company: "Kinetrexa Software Private Limited",
  points: [
    "Worked on full stack application development using Java and modern web technologies.",
    "Built and integrated backend functionality, REST APIs and database operations.",
    "Collaborated on application features while improving understanding of real world development workflows.",
  ],
  certificate: "https://meranaamkhann.netlify.app/assets/Kinetrexa_Internship_Certificate.pdf",
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}

function Words({ text, attr }: { text: string; attr: "data-word" | "data-scrub-word" }) {
  const p = { [attr]: "" } as Record<string, string>;
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          className={attr === "data-word" ? "mr-[0.28em] inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-bottom last:mr-0" : "mr-[0.26em] inline-block last:mr-0"}
        >
          <span {...p} className="inline-block will-change-transform">
            {w}
          </span>
        </span>
      ))}
    </>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <h2 data-heading className="text-title md:text-title-md text-heading">
      <Words text={children} attr="data-word" />
    </h2>
  );
}

export default function EducationExperience() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  /* Tilt + spotlight */
  useEffect(() => {
    const el = card.current;
    if (!el || reduce || !window.matchMedia("(hover: hover)").matches) return;

    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx((0.5 - py) * 12);
      ry((px - 0.5) * 14);
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  /* Entrances (all play once) */
  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set("[data-scrub-word]", { color: TEXT });
        gsap.set("[data-dot]", { backgroundColor: ACCENT, borderColor: ACCENT });
        return;
      }

      gsap.set("[data-word]", { yPercent: 115 });
      gsap.set("[data-fade]", { opacity: 0, y: 18 });
      gsap.set("[data-scrub-word]", { color: DIM });
      if (num.current) num.current.textContent = "0.00";

      ScrollTrigger.batch("[data-heading]", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          els.forEach((el) =>
            gsap.to(el.querySelectorAll("[data-word]"), { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "expo.out" })
          ),
      });

      ScrollTrigger.batch("[data-fade]", {
        start: "top 90%",
        once: true,
        onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.85, stagger: 0.1, ease: "power3.out", overwrite: true }),
      });

      /* SGPA number counts up once */
      ScrollTrigger.create({
        trigger: card.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const c = { v: 0 };
          gsap.to(c, {
            v: education.sgpa,
            duration: 2,
            ease: "power3.out",
            delay: 0.25,
            onUpdate: () => {
              if (num.current) num.current.textContent = c.v.toFixed(2);
            },
          });
        },
      });

      /* Experience: words are written in light, once */
      gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((p) => {
        gsap.to(p.querySelectorAll("[data-scrub-word]"), {
          keyframes: [
            { color: ACCENT, duration: 0.35 },
            { color: TEXT, duration: 0.35 },
          ],
          stagger: 0.09,
          ease: "none",
          scrollTrigger: { trigger: p, start: "top 78%", once: true },
        });
      });

      /* Each dot lights once */
      gsap.utils.toArray<HTMLElement>("[data-dot]").forEach((dot) => {
        gsap.to(dot, {
          backgroundColor: ACCENT,
          borderColor: ACCENT,
          scale: 1.5,
          boxShadow: `0 0 12px 2px ${GLOW}`,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: { trigger: dot, start: "top 70%", once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={root}
      id="experience"
      className="relative overflow-hidden bg-section-bg px-gutter py-section font-display text-heading antialiased selection:bg-accent selection:text-on-accent md:px-gutter-md md:py-section-md lg:px-gutter-lg"
    >
      <div className="mx-auto max-w-page">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:gap-24">
          {/* Education */}
          <div>
            <Heading>Education</Heading>

            <div data-fade className="mt-8 max-w-[26rem]" style={{ perspective: "900px" }}>
              <div
                ref={card}
                className="group relative rounded-3xl border border-[#1B2128] bg-[#080A0D] p-6 [transform-style:preserve-3d] sm:p-7"
                style={{ ["--mx" as string]: "50%", ["--my" as string]: "30%" }}
              >
                {/* Spotlight following the cursor */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(260px circle at var(--mx) var(--my), rgba(255,137,93,0.14), transparent 70%)` }}
                />
                {/* Glowing border following the cursor */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    padding: 1,
                    background: `radial-gradient(200px circle at var(--mx) var(--my), ${ACCENT}, transparent 70%)`,
                    WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />

                <div className="relative flex items-center gap-8 sm:gap-10">
                  {/* SGPA, lifted off the card */}
                  <div className="flex shrink-0 flex-col items-center gap-1 [transform:translateZ(36px)]">
                    <span
                      ref={num}
                      aria-label={`SGPA ${education.sgpa}`}
                      className="text-stat md:text-stat-md tabular-nums text-subheading"
                    >
                      {education.sgpa.toFixed(2)}
                    </span>
                    <span className="text-small md:text-small-md text-muted">SGPA</span>
                  </div>

                  <div className="min-w-0 [transform:translateZ(18px)]">
                    <h3 className="text-body md:text-sub-md font-semibold leading-snug tracking-[-0.02em] text-heading">
                      {education.degree}
                    </h3>
                    <p className="mt-2 text-body text-paragraph">{education.college}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <Heading>Experience</Heading>

            <div className="mt-8">
              <h3
                data-fade
                className="text-body md:text-sub-md font-semibold leading-snug tracking-[-0.02em] text-heading"
              >
                {experience.role}
              </h3>
              <p data-fade className="mt-2 text-body md:text-body-md text-subheading">
                {experience.company}
              </p>

              <div data-rail className="relative mt-10 flex flex-col gap-10 pl-9 md:gap-14">
                {experience.points.map((point, i) => (
                  <div key={i} className="relative">
                    <span
                      data-dot
                      aria-hidden
                      className="absolute left-[-36px] top-[0.7em] size-[7px] rounded-full border border-[#3A424D] bg-section-bg"
                    />
                    <p data-scrub className="max-w-[40ch] text-sub md:text-sub-md font-semibold tracking-[-0.02em]">
                      <Words text={point} attr="data-scrub-word" />
                    </p>
                  </div>
                ))}
              </div>

              <a
                data-fade
                href={experience.certificate}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-12 inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border border-section-border px-4 text-small md:text-small-md text-heading transition-colors duration-300 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-11 sm:px-5"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0 motion-reduce:transition-none"
                />
                <span className="relative transition-colors duration-300 group-hover:text-on-accent">View certificate</span>
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  fill="none"
                  className="relative h-3.5 w-3.5 transition-[transform,color] duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-on-accent motion-reduce:transition-none"
                >
                  <path d="M4 12L12 4M5 4H12V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}