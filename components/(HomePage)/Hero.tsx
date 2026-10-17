"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import GeometrySlice from "./GeometrySlice";

/* ---------- Shuffle text: scrambles into place once, on page load ---------- */

const GLYPHS = "abcdefghijklmnopqrstuvwxyz<>/_-+=*#";

/* Text scrambles into place once, on page load. */
function ShuffleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const o = { p: 0 };
      let step = -1;
      let noise: string[] = [];

      const render = () => {
        const s = Math.floor(o.p * 40);
        if (s !== step) {
          step = s;
          noise = Array.from(text, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        }
        const reveal = Math.floor(o.p * text.length);
        el.textContent = Array.from(text, (ch, i) => (ch === " " || i < reveal ? ch : noise[i])).join("");
      };

      render();
      gsap.to(o, {
        p: 1,
        duration: 1.8,
        delay: 0.3,
        ease: "power1.inOut",
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
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden ref={ref}>
        {text}
      </span>
    </span>
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

    // numbers count up once, on page load
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
    <dl ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col-reverse gap-2">
          <dt className="font-[family-name:var(--font-mono)] text-xs tracking-[0.04em] text-[#8b8780]">{s.label}</dt>
          <dd className="text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-none tracking-tight text-[#f4f1ea] tabular-nums">
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

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // Page-load intro only. The name itself is never animated.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline()
        .fromTo(q("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut", stagger: 0.15 }, 0)
        .fromTo(q("[data-fade]"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.1 }, 0.5);
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0a0a0a] px-6 pb-8 pt-6 text-[#f4f1ea] md:px-12 md:pt-8 lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto_auto_auto] lg:gap-x-8 lg:px-14"
    >
      {/* intro line */}
      <div className="lg:col-span-12 lg:row-start-1">
        <p className="pb-4 font-[family-name:var(--font-mono)] text-sm text-[#8b8780]">
          <ShuffleText text="I'm a backend developer & freelancer" />
        </p>
        <div data-line className="h-px origin-left bg-[#262624]" />
      </div>

      {/* name */}
      <h1
        aria-label="Asad Khan"
        className="mt-8 select-none leading-[0.84] tracking-[-0.05em] text-[clamp(4.5rem,26vw,10rem)] lg:col-span-12 lg:row-start-3 lg:mt-0 lg:flex lg:items-center lg:justify-between lg:gap-[2vw] lg:text-[clamp(5rem,12.5vw,16rem)]"
      >
        <span aria-hidden className="block pb-[0.06em] font-extrabold">
          ASAD
        </span>
        <span aria-hidden className="relative hidden h-px flex-1 bg-[#262624] lg:block">
          <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f04427]" />
        </span>
        <span aria-hidden className="block pb-[0.06em] pl-[0.5em] font-extralight lg:pl-0">
          KHAN
        </span>
      </h1>

      {/* statement + links */}
      <div className="mt-6 lg:col-span-5 lg:row-start-2 lg:mt-0 lg:self-end lg:pb-12">
        <p data-fade className="max-w-[34ch] text-[17px] leading-relaxed text-[#8b8780] md:text-lg">
          I build backend systems with Java &amp; Spring Boot, focusing on performance, security, and products people
          actually use.
        </p>
        <div data-fade className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 md:mt-8">
          <TextLink href="#projects" icon="→">
            View Projects
          </TextLink>
          <TextLink href="/resume.pdf" icon="↓" download>
            Resume
          </TextLink>
        </div>
      </div>

      {/* geometry */}
      <div className="flex flex-1 items-center justify-center py-8 lg:col-span-6 lg:col-start-7 lg:row-start-2 lg:min-h-0 lg:justify-end lg:py-6">
        <GeometrySlice />
      </div>

      {/* rule + stats */}
      <div data-line className="mt-2 h-px origin-left bg-[#262624] lg:col-span-12 lg:row-start-4 lg:mt-8" />
      <div data-fade className="pt-8 lg:col-span-12 lg:row-start-5">
        <Stats />
      </div>
    </header>
  );
}


/* ---------- Testimonials (placeholders: replace before publishing) ---------- */

// Placeholder copy: replace each entry with a real quote before publishing.
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