"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-hero-display" });
const body = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-hero-body" });
const DISPLAY = "font-[family-name:var(--font-hero-display)]";

/*
  Palette
  Cream #F6F7EB · Vermilion #E94F37 · Charcoal #393E41
*/

const HIDDEN = "opacity-0 motion-reduce:opacity-100";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* ---------- Name: every letter slides up inside a mask ---------- */

function SplitLine({ text, dot }: { text: string; dot?: boolean }) {
  return (
    <span
      aria-hidden
      className="-mx-[0.06em] -mb-[0.2em] -mt-[0.1em] block overflow-hidden whitespace-nowrap px-[0.06em] pb-[0.2em] pt-[0.1em]"
    >
      {Array.from(text).map((ch, i) => (
        <span key={i} data-ch className={`inline-block will-change-transform ${HIDDEN}`}>
          {ch}
        </span>
      ))}
      {dot && (
        <span
          data-dot
          className={`ml-[0.04em] inline-block size-[0.14em] rounded-full bg-[#E94F37] ${HIDDEN}`}
        />
      )}
    </span>
  );
}

/* ---------- Buttons ---------- */

function useMagnet(ref: React.RefObject<HTMLAnchorElement | null>, strength = 0.3) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
      const qx = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const qy = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * strength);
        qy((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        qx(0);
        qy(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  }, [ref, strength]);
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnet(ref);
  return (
    <a
      ref={ref}
      href={href}
      className="group/cta relative inline-flex w-full items-center justify-between gap-2 overflow-hidden rounded-full bg-[#E94F37] py-1 pl-4 pr-1 outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#393E41] md:w-fit md:justify-start md:gap-4 md:py-2 md:pl-7 md:pr-2"
    >
      <span
        aria-hidden
        className="absolute inset-0 translate-y-full bg-[#393E41] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-y-0 group-focus-visible/cta:translate-y-0 motion-reduce:transition-none"
      />
      <span className={`${DISPLAY} relative whitespace-nowrap text-[13px] font-semibold text-[#F6F7EB] md:text-lg`}>
        {children}
      </span>
      <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-[#F6F7EB] text-[#393E41] transition-colors duration-500 group-hover/cta:bg-[#E94F37] group-hover/cta:text-[#F6F7EB] md:size-11">
        <svg
          viewBox="0 0 24 24"
          className="size-4 -rotate-45 transition-transform duration-500 ease-out group-hover/cta:rotate-0 motion-reduce:transition-none md:size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

function GhostButton({ href, children, download }: { href: string; children: React.ReactNode; download?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnet(ref, 0.22);
  return (
    <a
      ref={ref}
      href={href}
      download={download}
      className="group/ghost relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-[#393E41] px-4 py-2.5 outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#E94F37] md:w-fit md:gap-3 md:px-7 md:py-3.5"
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-y-full bg-[#393E41] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/ghost:translate-y-0 group-focus-visible/ghost:translate-y-0 motion-reduce:transition-none"
      />
      <span
        className={`${DISPLAY} relative text-[13px] font-semibold text-[#393E41] transition-colors duration-500 group-hover/ghost:text-[#F6F7EB] md:text-lg`}
      >
        {children}
      </span>
      <svg
        viewBox="0 0 24 24"
        className="relative size-4 text-[#393E41] transition-all duration-500 group-hover/ghost:translate-y-0.5 group-hover/ghost:text-[#F6F7EB] motion-reduce:transition-none md:size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
      </svg>
    </a>
  );
}

/* ---------- Stats: 2x2 grid on phone, 4 across on desktop ---------- */

const ICONS = {
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  folder: <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14.5L7 22l5-3 5 3-1.5-7.5" />
    </>
  ),
  cap: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
    </>
  ),
};

const STATS: { to: number; suffix: string; label: string; icon: keyof typeof ICONS }[] = [
  { to: 700, suffix: "+", label: "LeetCode solved", icon: "code" },
  { to: 6, suffix: "+", label: "GitHub projects", icon: "folder" },
  { to: 4, suffix: "+", label: "Certifications", icon: "award" },
  { to: 2027, suffix: "", label: "Graduating", icon: "cap" },
];

function Stats() {
  const ref = useRef<HTMLDListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = Array.from(root.querySelectorAll<HTMLElement>("[data-stat]"));
      const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));

      gsap.fromTo(
        items,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 92%", once: true },
        }
      );

      counters.forEach((el) => {
        const to = Number(el.dataset.to);
        const from = to > 1000 ? to - 25 : 0;
        const o = { v: from };
        el.textContent = String(from);
        gsap.to(o, {
          v: to,
          duration: 2.2,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
          scrollTrigger: { trigger: root, start: "top 92%", once: true },
        });
      });

      return () => {
        counters.forEach((el) => (el.textContent = el.dataset.to ?? ""));
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <dl ref={ref} className="grid grid-cols-2 md:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          data-stat
          className={`flex min-w-0 flex-col gap-3 border-[#393E41]/25 py-4 md:gap-3 md:py-2 md:pl-8 md:first:pl-0 ${HIDDEN} ${
            i % 2 === 1 ? "border-l pl-4" : ""
          } ${i > 1 ? "border-t md:border-t-0" : ""} ${i > 0 ? "md:border-l" : ""}`}
        >
          <dt className="flex min-w-0 items-center gap-1.5 text-[#393E41]/70 md:gap-2">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-3.5 shrink-0 text-[#E94F37] md:size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[s.icon]}
            </svg>
            <span className="truncate whitespace-nowrap text-[10px] font-medium uppercase leading-none tracking-[0.08em] md:text-sm md:normal-case md:tracking-normal">
              {s.label}
            </span>
          </dt>
          <dd
            className={`${DISPLAY} flex items-start text-[clamp(2.5rem,13vw,3.5rem)] font-semibold leading-none tracking-[-0.05em] text-[#393E41] tabular-nums md:text-[clamp(2.75rem,7vw,5.5rem)]`}
          >
            <span data-count data-to={s.to}>
              {s.to}
            </span>
            {s.suffix && <span className="text-[#E94F37]">{s.suffix}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- Marquee: plain, steady, one direction ---------- */

const STACK = ["Java", "Spring Boot", "REST APIs", "PostgreSQL", "JWT Auth", "Microservices", "Redis", "Docker"];

function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(el, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      if (typeof IntersectionObserver === "undefined") return () => tween.kill();
      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tween.play() : tween.pause()));
      io.observe(el);
      return () => {
        io.disconnect();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="overflow-hidden bg-[#393E41] py-3 md:py-4">
      <span className="sr-only">{STACK.join(", ")}</span>
      <div ref={track} aria-hidden className="flex w-max">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 items-center">
            {STACK.map((s) => (
              <li
                key={`${k}-${s}`}
                className={`${DISPLAY} flex items-center gap-4 pr-4 text-lg font-medium leading-none text-[#F6F7EB] md:gap-8 md:pr-8 md:text-3xl`}
              >
                {s}
                <span className="text-[#E94F37]">/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const letters = q("[data-ch]");
      const dot = q("[data-dot]");
      const fade = q("[data-fade]");
      const rule = q("[data-rule]");

      gsap.set(letters, { yPercent: 125, opacity: 1 });
      gsap.set(dot, { scale: 0, opacity: 1, transformOrigin: "50% 100%" });
      gsap.set(fade, { opacity: 0, y: 24 });
      gsap.set(rule, { scaleX: 0, opacity: 1, transformOrigin: "0% 50%" });

      gsap
        .timeline({ delay: 0.1, defaults: { overwrite: "auto" } })
        .to(letters, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.055 }, 0)
        .to(dot, { scale: 1, duration: 0.8, ease: "back.out(2.2)" }, 0.95)
        .to(rule, { scaleX: 1, duration: 1.4, ease: "power3.inOut" }, 0.5)
        .to(fade, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.7);

      // scroll: the two name lines drift apart, the copy softens
      const scroll = { trigger: el, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true };
      gsap.to(q("[data-name-a]"), { xPercent: -14, ease: "none", scrollTrigger: scroll });
      gsap.to(q("[data-name-b]"), { xPercent: 12, ease: "none", scrollTrigger: scroll });
      gsap.to(q("[data-copy]"), { y: -40, opacity: 0.35, ease: "none", scrollTrigger: scroll });
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <header
        ref={root}
        id="top"
        className={`${display.variable} ${body.variable} relative isolate flex min-h-[100svh] flex-col overflow-clip bg-[#F6F7EB] font-[family-name:var(--font-hero-body)] text-[#393E41] antialiased`}
      >
        {/* grain only */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-[0.07] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-5 pb-2 pt-12 md:px-12 md:pb-0 md:pt-14 lg:px-16">
          {/* the name */}
          <div className="flex flex-col justify-center pb-6 md:flex-1 md:py-10">
            <h1
              aria-label="Asad Khan"
              className={`${DISPLAY} flex select-none flex-col text-[33vw] font-bold leading-[0.82] tracking-[-0.06em] md:text-[17vw]`}
            >
              <div data-name-a>
                <SplitLine text="Asad" />
              </div>
              <div data-name-b className="ml-[6vw] md:ml-[16vw]">
                <SplitLine text="Khan" dot />
              </div>
            </h1>
          </div>

          <div data-rule className={`h-[2px] origin-left bg-[#393E41] ${HIDDEN}`} />

          {/* copy + buttons: on phone the buttons sit at the bottom of this block */}
          <div
            data-copy
            className="flex flex-1 flex-col gap-8 py-5 md:flex-none md:flex-row md:items-center md:justify-between md:gap-16 md:py-10"
          >
            <p
              data-fade
              className={`${DISPLAY} max-w-[30ch] text-[1.2rem] font-medium leading-[1.3] tracking-[-0.02em] md:max-w-[34ch] md:text-[clamp(1.35rem,2.4vw,2rem)] ${HIDDEN}`}
            >
              Backend developer building fast APIs, secure auth and clean data models in Java and Spring Boot, so the
              products on top can scale without breaking.
            </p>
            <div
              data-fade
              className={`mt-auto grid grid-cols-2 gap-2.5 md:mt-0 md:flex md:flex-wrap md:items-center md:gap-4 ${HIDDEN}`}
            >
              <PrimaryButton href="#projects">View projects</PrimaryButton>
              <GhostButton href="/resume.pdf" download>
                Resume
              </GhostButton>
            </div>
          </div>

          <div data-rule className={`h-px origin-left bg-[#393E41]/25 ${HIDDEN}`} />
          <div className="md:py-10">
            <Stats />
          </div>
        </div>
      </header>

      <Marquee />
    </>
  );
}

/* ---------- Testimonials (placeholders: replace before publishing) ---------- */

const TESTIMONIALS = [
  { quote: "Replace this with a real quote from a client or teammate.", name: "Name", role: "Role, Company" },
  { quote: "Keep it to one or two sentences about the work you delivered.", name: "Name", role: "Role, Company" },
  { quote: "Short, specific and honest reads best.", name: "Name", role: "Role, Company" },
];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 70, rotate: (i: number) => (i % 2 ? 2 : -2) },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        }
      );
      gsap.fromTo(
        "[data-title]",
        { xPercent: 8 },
        { xPercent: -8, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className={`${display.variable} ${body.variable} overflow-hidden bg-[#F6F7EB] px-5 py-16 font-[family-name:var(--font-hero-body)] text-[#393E41] antialiased md:px-12 md:py-24 lg:px-16`}
    >
      <h2
        id="testimonials-title"
        data-title
        className={`${DISPLAY} whitespace-nowrap text-[clamp(3.5rem,12vw,9rem)] font-bold leading-none tracking-[-0.05em]`}
      >
        Kind words<span className="text-[#E94F37]">.</span>
      </h2>

      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            data-card
            className={`flex flex-col justify-between rounded-3xl p-6 md:min-h-[320px] md:p-8 ${
              i === 1 ? "bg-[#E94F37] text-[#F6F7EB]" : "bg-[#393E41] text-[#F6F7EB]"
            }`}
          >
            <span aria-hidden className={`${DISPLAY} text-6xl font-bold leading-none md:text-7xl ${i === 1 ? "text-[#393E41]" : "text-[#E94F37]"}`}>
              “
            </span>
            <blockquote className="mt-3 text-lg leading-[1.45] md:mt-4 md:text-xl">{t.quote}</blockquote>
            <figcaption className="mt-6 text-sm opacity-80 md:mt-8">
              {t.name} / {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}