"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Space_Grotesk, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", variable: "--font-hero-display" });
// Geist Mono is not in next/font/google on older Next versions. On Next 15+ you can swap back:
//   import { Geist_Mono } from "next/font/google";
//   const mono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-hero-mono" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--font-hero-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--font-hero-serif" });
const VARS = `${display.variable} ${mono.variable} ${serif.variable}`;
const DISPLAY = "font-[family-name:var(--font-hero-display)]";
const MONO = "font-[family-name:var(--font-hero-mono)]";
const SERIF = "font-[family-name:var(--font-hero-serif)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";

/*
  Palette
  White #FFFFFF | Deep Fjord #18364B | Iced Denim #4F91C9 | Pistachio #A8B85A | Frost #F1F6FA

  White editorial hero, no navbar, no SVG.
  Phone: status, name, rotating title, buttons, details, stacked.
  md and up: name on the left, rotating title (click a bar to jump), buttons and details on the right.
  Motion: letters of the name fly up in random order; hover a letter and it rolls to Denim.
  Title words swap with a staggered slide. Buttons fill, roll their text and pull toward the cursor.
*/

const PHRASES = [
  "I build the part of the internet you never see, so the part you do see never breaks.",
  "Java and Spring Boot services, built to stay fast and easy to maintain.",
  "REST APIs and PostgreSQL schemas designed so the next developer says thank you.",
];
const DUR = 5.2; // seconds each title stays on screen

const NAME = ["Asad", "Khan"];

const DETAILS = [
  { k: "Role", v: "Backend developer" },
  { k: "Stack", v: "Java, Spring Boot, PostgreSQL" },
  { k: "Graduating", v: "2027" },
];

/* ---------- Buttons ---------- */

const EASE = "ease-[cubic-bezier(.7,0,.2,1)]";

function Roll({ children, hover }: { children: string; hover: string }) {
  const move = `transition-transform duration-500 ${EASE} group-hover:-translate-y-full group-focus-visible:-translate-y-full`;
  return (
    <span className="relative z-10 block overflow-hidden leading-[1.35]">
      <span className={`block ${move}`}>{children}</span>
      <span aria-hidden className={`absolute left-0 top-full block ${move} ${hover}`}>
        {children}
      </span>
    </span>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Primary({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className={`${DISPLAY} group relative isolate inline-flex h-14 items-center gap-6 overflow-hidden rounded-full bg-[#A8B85A] pl-7 pr-2 text-base font-medium text-[#18364B] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#4F91C9]`}
    >
      {/* the disc grows until it floods the whole button */}
      <span aria-hidden className={`absolute right-2 top-1/2 -z-10 size-10 -translate-y-1/2 rounded-full bg-[#18364B] transition-transform duration-700 ${EASE} group-hover:scale-[10] group-focus-visible:scale-[10]`} />
      <Roll hover="text-white">{children}</Roll>
      <span className="relative grid size-10 place-items-center overflow-hidden text-white">
        <Arrow className={`transition-transform duration-500 ${EASE} group-hover:translate-x-[180%] group-hover:-translate-y-[180%]`} />
        <Arrow className={`absolute -translate-x-[180%] translate-y-[180%] transition-transform duration-500 ${EASE} group-hover:translate-x-0 group-hover:translate-y-0`} />
      </span>
    </a>
  );
}

function Secondary({ href, download, children }: { href: string; download?: boolean; children: string }) {
  return (
    <a
      href={href}
      download={download}
      className={`${DISPLAY} group relative isolate inline-flex h-14 items-center overflow-hidden rounded-full border border-[#18364B]/25 px-8 text-base font-medium text-[#18364B] outline-offset-4 transition-colors duration-500 hover:border-[#18364B] focus-visible:outline-2 focus-visible:outline-[#4F91C9]`}
    >
      {/* a round tide rises from below */}
      <span aria-hidden className={`absolute inset-x-[-15%] top-full -z-10 h-[170%] rounded-[50%] bg-[#18364B] transition-all duration-700 ${EASE} group-hover:top-[-35%] group-focus-visible:top-[-35%]`} />
      <Roll hover="text-white">{children}</Roll>
    </a>
  );
}

/* ---------- Hero ---------- */

export default function Hero7() {
  const root = useRef<HTMLElement>(null);
  const goRef = useRef<((n: number) => void) | null>(null);

  // hover on a letter: it rolls up and the Denim copy takes its place
  const roll = (e: React.PointerEvent<HTMLElement>, on: boolean) => {
    if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(e.currentTarget.querySelectorAll("[data-c]"), { yPercent: on ? -100 : 0, duration: on ? 0.55 : 0.9, ease: "expo.out", overwrite: "auto" });
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rule = q("[data-rule]");
      const vrule = q("[data-vrule]");
      const first = q("[data-c1]");
      const fade = q("[data-fade]");
      const phrases = q("[data-phrase]");
      const wordsOf = PHRASES.map((_, i) => q(`[data-pw="${i}"]`));
      const fills = q("[data-fill]");
      const magnets = q("[data-magnet]") as HTMLElement[];

      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(vrule, { scaleY: 0, transformOrigin: "center top" });
      gsap.set(first, { yPercent: 125, rotate: () => gsap.utils.random(-14, 14) });
      gsap.set(fade, { opacity: 0, y: 14 });
      gsap.set(phrases, { visibility: "visible" });
      gsap.set(wordsOf.flat(), { yPercent: 120, opacity: 0 });

      // rotating title
      let cur = -1;
      let timer: gsap.core.Tween | null = null;
      const go = (n: number) => {
        timer?.kill();
        const prev = cur;
        cur = n;
        const swap = prev >= 0 && prev !== n;
        if (swap) {
          gsap.to(wordsOf[prev], { yPercent: -120, rotate: -5, opacity: 0, duration: 0.7, ease: "power3.in", stagger: 0.02, overwrite: true });
          gsap.to(fills[prev], { scaleX: 0, transformOrigin: "right center", duration: 0.5, ease: "power3.out", overwrite: true });
        }
        gsap.fromTo(
          wordsOf[n],
          { yPercent: 120, rotate: 5, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.035, delay: swap ? 0.4 : 0, overwrite: true }
        );
        gsap.fromTo(fills[n], { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: DUR, ease: "none", overwrite: true });
        timer = gsap.delayedCall(DUR, () => go((n + 1) % PHRASES.length));
      };
      goRef.current = go;

      // intro
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(rule, { scaleX: 1, duration: 1.8 }, 0)
        .to(vrule, { scaleY: 1, duration: 1.8 }, 0.2)
        .to(first, { yPercent: 0, rotate: 0, duration: 1.6, stagger: { each: 0.07, from: "random" } }, 0.2)
        .to(fade, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.1 }, 1)
        .call(() => go(0), undefined, 0.9);

      // buttons lean toward the cursor
      const cleanups = magnets.map((m) => {
        const move = (e: PointerEvent) => {
          const r = m.getBoundingClientRect();
          gsap.to(m, { x: (e.clientX - (r.left + r.width / 2)) * 0.25, y: (e.clientY - (r.top + r.height / 2)) * 0.35, duration: 0.5, ease: "power3.out" });
        };
        const leave = () => gsap.to(m, { x: 0, y: 0, duration: 1, ease: "elastic.out(1,0.4)" });
        m.addEventListener("pointermove", move);
        m.addEventListener("pointerleave", leave);
        return () => {
          m.removeEventListener("pointermove", move);
          m.removeEventListener("pointerleave", leave);
        };
      });

      return () => {
        tl.kill();
        timer?.kill();
        goRef.current = null;
        cleanups.forEach((c) => c());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      id="top"
      className={`${VARS} ${DISPLAY} relative isolate flex min-h-[100svh] flex-col overflow-clip bg-white px-5 pb-6 pt-5 text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B] md:h-[100svh] md:min-h-[640px] md:px-12 md:pb-8 md:pt-6 lg:px-16`}
    >
      {/* status, then a hairline */}
      <div data-fade className={`flex items-center gap-2 pb-4 text-sm font-medium ${HIDDEN}`}>
        <span aria-hidden className="size-1.5 rounded-full bg-[#A8B85A]" />
        Open to internships, 2027
      </div>
      {/* <div data-rule aria-hidden className="h-px w-full bg-[#18364B]/25" /> */}

      {/* phone: stacked. md and up: name left, everything else right */}
      <div className="grid flex-1 gap-10 pt-6 md:min-h-0 md:grid-cols-12 md:gap-0 md:pt-8">
        {/* name */}
        <h1
          aria-label="Asad Khan"
          className={`${SERIF} flex cursor-default select-none flex-col self-start text-[30vw] font-normal leading-[0.82] tracking-[-0.03em] md:col-span-7 md:text-[min(27vw,40svh)]`}
        >
          {NAME.map((word, wi) => (
            <span key={word} aria-hidden className={`flex ${wi === 1 ? "md:ml-[0.3em]" : ""}`}>
              {word.split("").map((c, i) => (
                <span
                  key={i}
                  onPointerEnter={(e) => roll(e, true)}
                  onPointerLeave={(e) => roll(e, false)}
                  className="relative block overflow-hidden px-[0.025em] -mx-[0.025em] -my-[0.1em]"
                >
                  <span data-c data-c1 className="block py-[0.1em]">
                    {c}
                  </span>
                  <span data-c aria-hidden className="absolute inset-x-[0.025em] top-full block py-[0.1em] text-[#4F91C9]">
                    {c}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        {/* side column */}
        <div className="relative flex flex-col justify-between gap-10 md:col-span-5 md:col-start-8 md:pl-10">
          <div data-vrule aria-hidden className="absolute inset-y-0 left-0 hidden w-px bg-[#18364B]/25 md:block" />

          <div className="flex flex-col gap-6">
            {/* three titles stacked in one grid cell so the height never jumps */}
            <div aria-live="off" className={`${SERIF} grid text-[2rem] italic leading-[1.05] tracking-[-0.01em] md:text-[min(3.1vw,4.8svh)]`}>
              {PHRASES.map((text, i) => (
                <p key={i} data-phrase aria-hidden={i > 0 ? true : undefined} className={`col-start-1 row-start-1 ${i > 0 ? "invisible" : ""}`}>
                  {text.split(" ").map((wd, j) => (
                    <Fragment key={j}>
                      <span className="inline-block overflow-hidden py-[0.12em] align-top -my-[0.12em]">
                        <span data-pw={i} className={`inline-block ${i === 0 ? HIDDEN : ""}`}>
                          {wd}
                        </span>
                      </span>{" "}
                    </Fragment>
                  ))}
                </p>
              ))}
            </div>

            {/* three bars: one per title */}
            <div data-fade className={`flex items-center gap-2 motion-reduce:hidden ${HIDDEN}`}>
              {PHRASES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show title ${i + 1} of ${PHRASES.length}`}
                  onClick={() => goRef.current?.(i)}
                  className="group relative h-6 w-14 outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#4F91C9] md:w-16"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-[#18364B]/20 transition-colors group-hover:bg-[#18364B]/45" />
                  <span data-fill className="absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-1/2 scale-x-0 bg-[#18364B]" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div data-fade className={`flex flex-wrap items-center gap-3 md:gap-4 ${HIDDEN}`}>
              <span data-magnet className="inline-block">
                <Primary href="#projects">View projects</Primary>
              </span>
              <span data-magnet className="inline-block">
                <Secondary href="/resume.pdf" download>
                  Resume
                </Secondary>
              </span>
            </div>

            <dl data-fade className={`text-sm ${HIDDEN}`}>
              {DETAILS.map((d) => (
                <div key={d.k} className="grid grid-cols-3 gap-4 border-t border-[#18364B]/20 py-3">
                  <dt className="text-[#18364B]/55">{d.k}</dt>
                  <dd className="col-span-2 font-medium">{d.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
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