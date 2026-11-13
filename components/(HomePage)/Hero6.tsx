"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", variable: "--font-hero-display" });
// Geist Mono is not in next/font/google on older Next versions. On Next 15+ you can swap back:
//   import { Geist_Mono } from "next/font/google";
//   const mono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-hero-mono" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-hero-mono" });
const VARS = `${display.variable} ${mono.variable}`;
const DISPLAY = "font-[family-name:var(--font-hero-display)]";
const MONO = "font-[family-name:var(--font-hero-mono)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";

/*
  Palette
  White #FFFFFF | Deep Fjord #18364B | Iced Denim #4F91C9 | Pistachio #A8B85A | Frost #F1F6FA

  Minimal hero. White page, one hairline, one oversized name.
  The only motion is a single load sequence: the rule draws across, then each
  letter of the name rises out of a mask. Nothing moves after that.
*/

const NAME = ["Asad", "Khan"];

/* ---------- Links ---------- */

function Primary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`${DISPLAY} group inline-flex items-center gap-3 rounded-full bg-[#18364B] py-1.5 pl-5 pr-1.5 text-base font-medium text-white outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#4F91C9]`}
    >
      {children}
      <span className="grid size-9 place-items-center rounded-full bg-[#A8B85A] text-[#18364B] transition-transform duration-500 ease-out group-hover:rotate-[-45deg]">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

function TextLink({ href, children, download }: { href: string; children: React.ReactNode; download?: boolean }) {
  return (
    <a
      href={href}
      download={download}
      className={`${DISPLAY} group relative inline-block py-2 text-base font-medium text-[#18364B] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#4F91C9]`}
    >
      {children}
      <span className="absolute inset-x-0 bottom-1 h-px origin-left bg-[#18364B]/30" />
      <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-[#18364B] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
    </a>
  );
}

/* ---------- Hero ---------- */

export default function Hero6() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rule = q("[data-rule]");
      const chars = q("[data-char]");
      const fade = q("[data-fade]");

      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(chars, { yPercent: 115, opacity: 1 });
      gsap.set(fade, { opacity: 0, y: 10 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(rule, { scaleX: 1, duration: 1.6 }, 0)
        .to(chars, { yPercent: 0, duration: 1.4, stagger: 0.05 }, 0.2)
        .to(fade, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, 0.9);
      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      id="top"
      className={`${VARS} ${DISPLAY} relative isolate flex h-[100svh] min-h-[620px] flex-col overflow-clip bg-white px-5 pb-6 pt-5 text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B] md:px-12 md:pb-8 lg:px-16`}
    >
      {/* top bar */}
      <div data-fade className={`relative z-10 flex items-center justify-between text-sm font-medium ${HIDDEN}`}>
        <span>Asad Khan</span>
        <span className="flex items-center gap-2 text-[#18364B]/70">
          <span aria-hidden className="size-1.5 rounded-full bg-[#A8B85A]" />
          Open to internships, 2027
        </span>
      </div>

      {/* statement + details */}
      <div className="relative z-10 mt-auto grid gap-10 md:grid-cols-12 md:gap-6">
        <p data-fade className={`max-w-[26ch] text-xl font-medium leading-[1.25] tracking-[-0.015em] md:col-span-6 md:text-3xl ${HIDDEN}`}>
          I build the part of the internet you never see, so the part you do see never breaks.
        </p>

        <dl data-fade className={`grid grid-cols-2 gap-x-6 gap-y-5 text-sm md:col-span-6 md:col-start-8 md:grid-cols-3 ${HIDDEN}`}>
          <div>
            <dt className="text-[#18364B]/55">Role</dt>
            <dd className="mt-1 font-medium">Backend developer</dd>
          </div>
          <div>
            <dt className="text-[#18364B]/55">Stack</dt>
            <dd className="mt-1 font-medium">Java, Spring Boot, PostgreSQL</dd>
          </div>
          <div>
            <dt className="text-[#18364B]/55">Graduating</dt>
            <dd className="mt-1 font-medium">2027</dd>
          </div>
        </dl>
      </div>

      {/* hairline */}
      <div data-rule aria-hidden className="relative z-10 mt-8 h-px w-full bg-[#18364B]/25 md:mt-10" />

      {/* name */}
      <h1
        aria-label="Asad Khan"
        className="relative z-10 mt-5 flex select-none flex-col text-[27vw] font-medium leading-[0.88] tracking-[-0.05em] md:mt-6 md:flex-row md:gap-[0.22em] md:text-[16.5vw]"
      >
        {NAME.map((word) => (
          <span key={word} aria-hidden className="inline-block overflow-hidden py-[0.06em] -my-[0.06em]">
            {word.split("").map((c, i) => (
              <span key={i} data-char className={`inline-block ${HIDDEN}`}>
                {c}
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* actions */}
      <div data-fade className={`relative z-10 mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 md:mt-8 ${HIDDEN}`}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Primary href="#projects">View projects</Primary>
          <TextLink href="/resume.pdf" download>
            Resume
          </TextLink>
        </div>
        <span className="hidden text-sm text-[#18364B]/55 md:block">Scroll</span>
      </div>
    </header>
  );
}

/* ---------- Stats ---------- */

const STATS = [
  { to: 700, suffix: "+", label: "LeetCode problems solved" },
  { to: 6, suffix: "+", label: "GitHub projects" },
  { to: 4, suffix: "+", label: "Certifications" },
  { to: 2027, suffix: "", label: "Graduating" },
];

export function Stats() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
      counters.forEach((el) => {
        const to = Number(el.dataset.to);
        const o = { v: to > 1000 ? to - 25 : 0 };
        el.textContent = String(o.v);
        gsap.to(o, {
          v: to,
          duration: 2.2,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
      });
      return () => counters.forEach((el) => (el.textContent = el.dataset.to ?? ""));
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={`${VARS} ${DISPLAY} bg-[#18364B] px-5 py-20 text-[#F1F6FA] antialiased md:px-12 md:py-32 lg:px-16`}>
      <p className="max-w-[22ch] text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-5xl">The work adds up.</p>
      <dl className="mt-12 grid grid-cols-2 gap-y-10 md:mt-20 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex min-w-0 flex-col gap-3 border-[#4F91C9]/40 pl-4 md:pl-8 ${i % 2 === 1 ? "border-l" : ""} ${i > 0 ? "md:border-l" : "md:border-l-0 md:pl-0"} ${i === 2 ? "max-md:border-l-0 max-md:pl-0" : ""}`}
          >
            <dd className="flex items-start text-[clamp(3rem,15vw,4.5rem)] font-medium leading-[0.85] tracking-[-0.04em] tabular-nums md:text-[8vw]">
              <span data-count data-to={s.to}>
                {s.to}
              </span>
              {s.suffix && <span className="text-[#A8B85A]">{s.suffix}</span>}
            </dd>
            <dt className={`${MONO} text-xs text-[#F1F6FA]/70 md:text-sm`}>{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Testimonials (placeholders: replace before publishing) ---------- */

const TESTIMONIALS = [
  { quote: "Replace this with a real quote from a client or teammate.", name: "Name", role: "Role, Company" },
  { quote: "Keep it to one or two sentences about the work you delivered.", name: "Name", role: "Role, Company" },
  { quote: "Short, specific and honest reads best.", name: "Name", role: "Role, Company" },
];

const CARDS = ["bg-[#18364B] text-[#F1F6FA]", "bg-[#4F91C9] text-white", "bg-[#A8B85A] text-[#18364B]"];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-card]", el),
        { opacity: 0, y: 70, rotate: (i: number) => (i % 2 ? 2 : -2) },
        { opacity: 1, y: 0, rotate: 0, duration: 1, ease: "power3.out", stagger: 0.15, scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
      gsap.fromTo(
        "[data-title]",
        { xPercent: 6 },
        { xPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className={`${VARS} ${DISPLAY} overflow-hidden bg-[#F1F6FA] px-5 py-16 text-[#18364B] antialiased md:px-12 md:py-24 lg:px-16`}
    >
      <h2 id="testimonials-title" data-title className="whitespace-nowrap text-[clamp(4rem,17vw,14rem)] font-medium leading-[0.85] tracking-[-0.05em]">
        Kind words<span className="text-[#A8B85A]">.</span>
      </h2>
      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} data-card className={`flex flex-col justify-between rounded-3xl p-6 md:min-h-[320px] md:p-8 ${CARDS[i % 3]}`}>
            <span aria-hidden className="text-8xl font-medium leading-[0.7] md:text-9xl">
              “
            </span>
            <blockquote className="mt-3 text-lg leading-[1.45] md:mt-4 md:text-xl">{t.quote}</blockquote>
            <figcaption className={`${MONO} mt-6 text-xs opacity-80 md:mt-8`}>
              {t.name}, {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}