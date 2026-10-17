"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import GeometrySlice from "./GeometrySlice";

/* ---------- Shuffle text: resolves out of noise in 2 seconds, on page load ---------- */

const GLYPHS = "01<>/\\{}[]=+-*#_";

function ShuffleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = Array.from(text);
      // each character settles at its own moment, roughly left to right
      const settleAt = chars.map((_, i) => (i / chars.length) * 0.6 + Math.random() * 0.32);
      el.textContent = "";
      const spans = chars.map(() => el.appendChild(document.createElement("span")));
      const o = { p: 0 };
      let step = -1;

      const render = () => {
        const s = Math.floor(o.p * 50);
        const refresh = s !== step;
        step = s;
        chars.forEach((ch, i) => {
          const sp = spans[i];
          if (ch === " " || o.p >= settleAt[i]) {
            sp.textContent = ch;
            sp.style.color = "";
          } else {
            if (refresh || !sp.textContent) sp.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            sp.style.color = "#f04427";
          }
        });
      };

      render();
      // delay 0.15 + duration 1.85 = settled in 2 seconds
      gsap.to(o, {
        p: 1,
        delay: 0.15,
        duration: 1.85,
        ease: "none",
        onUpdate: render,
        onComplete: () => {
          el.textContent = text;
        },
      });
      return () => {
        el.textContent = text;
      };
    });

    return () => mm.revert();
  }, [text]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden ref={ref} className="whitespace-pre">
        {text}
      </span>
    </>
  );
}

/* ---------- Availability ---------- */

function Availability() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // three soft pulses on page load, then it rests
      gsap.fromTo(
        el.querySelector("[data-ring]"),
        { scale: 1, opacity: 0.7 },
        { scale: 3.2, opacity: 0, duration: 1.1, ease: "power2.out", repeat: 2, delay: 0.9 }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <p ref={ref} className="flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-xs text-[#8b8780]">
      <span className="relative flex size-2.5">
        <span data-ring className="absolute inset-0 rounded-full bg-[#f04427] opacity-0" />
        <span className="relative size-2.5 rounded-full bg-[#f04427]" />
      </span>
      Available for work
    </p>
  );
}

/* ---------- Stats: numbers count up once, on page load ---------- */

const STATS = [
  { value: 700, plus: true, label: "LeetCode Problems" },
  { value: 6, plus: true, label: "Projects on GitHub" },
  { value: 4, plus: true, label: "Certifications" },
  { value: 2027, plus: false, label: "Graduating", still: true },
];

function Stats() {
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, {
          v: end,
          duration: 1.8,
          delay: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
          onComplete: () => {
            el.textContent = String(end);
          },
        });
      });
      return () => {
        root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          el.textContent = el.dataset.count ?? "";
        });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <dl ref={ref} className="grid grid-cols-4 gap-x-3 md:gap-x-6">
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col-reverse gap-1.5 md:gap-2">
          <dt className="font-[family-name:var(--font-mono)] text-[10px] leading-tight text-[#8b8780] md:text-xs">{s.label}</dt>
          <dd className="text-[clamp(1.4rem,6vw,3rem)] font-semibold leading-none tracking-tight text-[#f4f1ea] tabular-nums">
            <span data-count={s.still ? undefined : s.value}>{s.value}</span>
            {s.plus && <span className="text-[#f04427]">+</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Links ---------- */

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  icon: string;
  download?: boolean;
};

function TextLink({ href, children, icon, download }: TextLinkProps) {
  return (
    <a
      href={href}
      download={download}
      className="group/link inline-flex w-fit items-center gap-2 py-1 text-base font-medium text-[#f4f1ea] outline-offset-[6px] focus-visible:outline-2 focus-visible:outline-[#f04427]"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[#f4f1ea] transition-transform duration-500 ease-out motion-reduce:transition-none group-hover/link:scale-x-0 group-focus-visible/link:scale-x-0" />
        <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-right scale-x-0 bg-[#f04427] transition-transform duration-500 ease-out motion-reduce:transition-none group-hover/link:scale-x-100 group-focus-visible/link:scale-x-100" />
      </span>
      <span
        aria-hidden
        className="inline-block text-[#f04427] transition-transform duration-500 ease-out motion-reduce:transition-none group-hover/link:translate-x-1 group-focus-visible/link:translate-x-1"
      >
        {icon}
      </span>
    </a>
  );
}

/* ---------- Name letters ---------- */

function Letters({ text, kind }: { text: string; kind: "weight" | "blur" }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-kind={kind} className="inline-block">
          {ch}
        </span>
      ))}
    </>
  );
}

/* ---------- Hero (one screen) ---------- */

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // Page-load intro only (runs on every refresh).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(q("[data-name]"), { opacity: 1 });
      gsap
        .timeline()
        // hairlines draw
        .fromTo(q("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut", stagger: 0.12 }, 0)
        // "Asad": a variable font growing from hairline to heavy, letter by letter
        .fromTo(q('[data-kind="weight"]'), { fontWeight: 100 }, { fontWeight: 800, duration: 1.5, ease: "power3.out", stagger: 0.1 }, 0.1)
        // "Khan": serif italic coming into focus
        .fromTo(
          q('[data-kind="blur"]'),
          { opacity: 0, filter: "blur(14px)" },
          { opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power2.out", stagger: 0.1 },
          0.5
        )
        // the node between the two halves of the name
        .fromTo(q("[data-node]"), { scale: 0 }, { scale: 1, duration: 0.8, ease: "expo.out" }, 1.3)
        .fromTo(q("[data-fade]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.1 }, 0.6);
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden bg-[#0a0a0a] px-6 pb-6 pt-5 text-[#f4f1ea] md:px-12 md:pt-7 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_minmax(0,1fr)_auto_auto_auto] lg:gap-x-8 lg:px-14 lg:pb-8"
    >
      {/* intro line + availability */}
      <div className="lg:col-span-12 lg:row-start-1">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-4">
          <p className="font-[family-name:var(--font-mono)] text-[13px] text-[#f4f1ea] md:text-sm">
            <ShuffleText text="I'm a backend developer & freelancer" />
          </p>
          <div data-fade>
            <Availability />
          </div>
        </div>
        <div data-line className="h-px origin-left bg-[#262624]" />
      </div>

      {/* name: Inter (variable) + Instrument Serif italic */}
      <h1
        aria-label="Asad Khan"
        data-name
        className="mt-5 select-none leading-[0.86] text-[clamp(3.25rem,min(21vw,11svh),8rem)] opacity-0 motion-reduce:opacity-100 lg:col-span-12 lg:row-start-3 lg:mt-0 lg:flex lg:items-center lg:justify-between lg:gap-[2vw] lg:text-[clamp(4rem,min(12vw,24svh),16rem)]"
      >
        <span aria-hidden className="block pb-[0.04em] font-extrabold tracking-[-0.05em]">
          <Letters text="Asad" kind="weight" />
        </span>

        <span aria-hidden className="relative hidden h-3 flex-1 lg:block">
          <span data-line className="absolute inset-x-0 top-1/2 h-px origin-center bg-[#262624]" />
          <span className="absolute left-1/2 top-1/2 flex size-3 -translate-x-1/2 -translate-y-1/2">
            <span data-node className="size-full rounded-full bg-[#f04427]" />
          </span>
        </span>

        <span
          aria-hidden
          className="block pb-[0.04em] pl-[0.45em] font-[family-name:var(--font-serif)] text-[1.12em] italic leading-[0.8] tracking-[-0.02em] lg:pl-0"
        >
          <Letters text="Khan" kind="blur" />
        </span>
      </h1>

      {/* statement + links */}
      <div className="mt-4 lg:col-span-5 lg:row-start-2 lg:mt-0 lg:self-end lg:pb-10">
        <p data-fade className="max-w-[34ch] text-[15px] leading-relaxed text-[#8b8780] md:text-lg">
          I build backend systems with Java &amp; Spring Boot, focusing on performance, security, and products people
          actually use.
        </p>
        <div data-fade className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-1 md:mt-7">
          <TextLink href="#projects" icon="→">
            View Projects
          </TextLink>
          <TextLink href="/resume.pdf" icon="↓" download>
            Resume
          </TextLink>
        </div>
      </div>

      {/* backend diagram */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-3 lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:justify-end lg:py-0">
        <GeometrySlice />
      </div>

      {/* rule + stats */}
      <div data-line className="mt-1 h-px origin-left bg-[#262624] lg:col-span-12 lg:row-start-4 lg:mt-6" />
      <div data-fade className="pt-4 lg:col-span-12 lg:row-start-5 lg:pt-6">
        <Stats />
      </div>
    </header>
  );
}

/* ---------- Testimonials (placeholders: replace before publishing) ---------- */

const TESTIMONIALS = [
  { quote: "Replace this with a real quote from a client or teammate.", name: "Name", role: "Role, Company" },
  { quote: "Keep it to one or two sentences about the work you delivered.", name: "Name", role: "Role, Company" },
  { quote: "Short, specific and honest reads best.", name: "Name", role: "Role, Company" },
];

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="border-t border-[#262624] px-6 py-20 md:px-12 lg:px-14">
      <h2 id="testimonials-title" className="text-2xl font-semibold tracking-tight text-[#f4f1ea] md:text-3xl">
        Testimonials
      </h2>
      <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="border-t border-[#262624] pt-6">
            <blockquote className="text-lg leading-relaxed text-[#f4f1ea]">{t.quote}</blockquote>
            <figcaption className="mt-5 font-[family-name:var(--font-mono)] text-xs text-[#8b8780]">
              {t.name} <span className="text-[#f04427]">/</span> {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}