"use client";

import { useEffect, useRef } from "react";
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

  Concept: "the part of the internet you never see".
  The page is a quiet white editorial layout with a big serif name. A lens follows
  your cursor (and wanders on its own when you stop). Inside the lens, the same page
  is inverted into Deep Fjord and a backend blueprint shows through: a request
  travelling client > gateway > service > database. Click to open the lens wider.

  Two identical layers are stacked. The top one is clipped to a circle. Only the
  bottom layer has real links, so nothing is double-focusable.
*/

const DETAILS = [
  { k: "Role", v: "Backend developer" },
  { k: "Stack", v: "Java, Spring Boot, PostgreSQL" },
  { k: "Graduating", v: "2027" },
];

/* ---------- Links (live = real link, otherwise a visual copy) ---------- */

function Primary({ href, live, dark, children }: { href: string; live?: boolean; dark?: boolean; children: React.ReactNode }) {
  const Tag: React.ElementType = live ? "a" : "span";
  return (
    <Tag
      {...(live ? { href } : {})}
      className={`${DISPLAY} group inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-base font-medium outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#4F91C9] ${
        dark ? "bg-[#F1F6FA] text-[#18364B]" : "bg-[#18364B] text-white"
      }`}
    >
      {children}
      <span className="grid size-9 place-items-center rounded-full bg-[#A8B85A] text-[#18364B] transition-transform duration-500 ease-out group-hover:rotate-[-45deg]">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Tag>
  );
}

function TextLink({ href, live, dark, download, children }: { href: string; live?: boolean; dark?: boolean; download?: boolean; children: React.ReactNode }) {
  const Tag: React.ElementType = live ? "a" : "span";
  return (
    <Tag
      {...(live ? { href, download } : {})}
      className={`${DISPLAY} group relative inline-block py-2 text-base font-medium outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#4F91C9] ${dark ? "text-[#F1F6FA]" : "text-[#18364B]"}`}
    >
      {children}
      <span className={`absolute inset-x-0 bottom-1 h-px origin-left ${dark ? "bg-[#F1F6FA]/30" : "bg-[#18364B]/30"}`} />
      <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-[#A8B85A] transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
    </Tag>
  );
}

/* ---------- Blueprint (only inside the lens) ---------- */

const NODES = [
  { x: 0, label: "Client" },
  { x: 333, label: "API gateway" },
  { x: 667, label: "Spring Boot service" },
  { x: 1000, label: "PostgreSQL" },
];
const LINKS = [
  { x1: 200, x2: 333, label: "POST /projects" },
  { x1: 533, x2: 667, label: "JWT verified" },
  { x1: 867, x2: 1000, label: "Query, 4 ms" },
];

function Blueprint() {
  return (
    <>
      <svg aria-hidden className="absolute inset-0 size-full">
        <defs>
          <pattern id="hero-plus" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M24 20v8M20 24h8" stroke="#4F91C9" strokeOpacity="0.3" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-plus)" />
      </svg>

      <div className="absolute inset-x-5 top-[41%] md:inset-x-12 lg:inset-x-16">
        <svg aria-hidden viewBox="0 0 1200 200" className="h-auto w-full overflow-visible">
          {NODES.map((n) => (
            <g key={n.label}>
              <rect x={n.x} y={72} width={200} height={56} rx={2} fill="#18364B" stroke="#4F91C9" strokeOpacity="0.7" vectorEffect="non-scaling-stroke" />
              <text x={n.x + 100} y={106} textAnchor="middle" fill="#F1F6FA" fontSize="18" style={{ fontFamily: "var(--font-hero-display)" }}>
                {n.label}
              </text>
            </g>
          ))}
          {LINKS.map((l) => (
            <g key={l.label}>
              <path d={`M${l.x1} 100H${l.x2}`} stroke="#4F91C9" strokeOpacity="0.7" fill="none" vectorEffect="non-scaling-stroke" />
              <path d={`M${l.x2 - 8} 94L${l.x2} 100L${l.x2 - 8} 106`} stroke="#4F91C9" strokeOpacity="0.7" fill="none" vectorEffect="non-scaling-stroke" />
              <path
                data-packet
                d={`M${l.x1} 100H${l.x2}`}
                pathLength={100}
                stroke="#A8B85A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8 92"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
              <text x={(l.x1 + l.x2) / 2} y={82} textAnchor="middle" fill="#4F91C9" fontSize="13" style={{ fontFamily: "var(--font-hero-mono)" }}>
                {l.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}

/* ---------- One layer of the page ---------- */

function Layer({ live, dark }: { live?: boolean; dark?: boolean }) {
  const mute = dark ? "text-[#F1F6FA]/55" : "text-[#18364B]/55";
  const soft = dark ? "text-[#F1F6FA]/75" : "text-[#18364B]/75";
  const rule = dark ? "bg-[#F1F6FA]/25" : "bg-[#18364B]/25";
  const rowLine = dark ? "border-[#F1F6FA]/20" : "border-[#18364B]/20";
  const Name: React.ElementType = live ? "h1" : "div";
  const Nav: React.ElementType = live ? "a" : "span";

  return (
    <div
      aria-hidden={live ? undefined : true}
      className={`absolute inset-0 flex flex-col px-5 pb-5 pt-5 md:px-12 md:pb-6 lg:px-16 ${dark ? "bg-[#18364B] text-[#F1F6FA]" : "bg-white text-[#18364B]"}`}
    >
      {dark && <Blueprint />}

      <div className="relative z-10 flex flex-1 flex-col">
        {/* masthead */}
        <div data-fade className={`grid grid-cols-2 items-center pb-4 text-sm font-medium md:grid-cols-3 ${HIDDEN}`}>
          <span>Asad Khan</span>
          <span className={`hidden items-center justify-center gap-2 md:flex ${soft}`}>
            <span aria-hidden className="size-1.5 rounded-full bg-[#A8B85A]" />
            Open to internships, 2027
          </span>
          <nav className={`flex items-center justify-end gap-6 ${soft}`}>
            <Nav {...(live ? { href: "#projects" } : {})}>Projects</Nav>
            <Nav {...(live ? { href: "/resume.pdf", download: true } : {})}>Resume</Nav>
          </nav>
        </div>
        <div data-rule aria-hidden className={`h-px w-full ${rule}`} />

        {/* statement + details */}
        <div className="grid content-start gap-8 pt-6 md:grid-cols-12 md:pt-8">
          <div className="flex flex-col gap-8 md:col-span-5">
            <p data-fade className={`${SERIF} max-w-[20ch] text-[1.75rem] italic leading-[1.1] md:text-[2.25rem] ${HIDDEN}`}>
              I build the part of the internet you never see, so the part you do see never breaks.
            </p>
            <div data-fade className={`flex flex-wrap items-center gap-x-8 gap-y-3 ${HIDDEN}`}>
              <Primary href="#projects" live={live} dark={dark}>
                View projects
              </Primary>
              <TextLink href="/resume.pdf" download live={live} dark={dark}>
                Resume
              </TextLink>
            </div>
          </div>

          <dl data-fade className={`hidden text-sm md:col-span-3 md:col-start-10 md:block ${HIDDEN}`}>
            {DETAILS.map((d) => (
              <div key={d.k} className={`grid grid-cols-3 gap-4 border-t py-3 ${rowLine}`}>
                <dt className={mute}>{d.k}</dt>
                <dd className="col-span-2 font-medium">{d.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* name */}
        <div data-rule aria-hidden className={`mt-auto h-px w-full ${rule}`} />
        <Name
          {...(live ? { "aria-label": "Asad Khan" } : {})}
          className={`${SERIF} mt-3 flex select-none gap-[0.2em] whitespace-nowrap text-[22vw] font-normal leading-[0.8] tracking-[-0.035em] md:mt-4`}
        >
          {["Asad", "Khan"].map((word) => (
            <span key={word} aria-hidden className="block overflow-hidden py-[0.1em] -my-[0.1em]">
              <span data-word className={`block ${HIDDEN}`}>
                {word}
              </span>
            </span>
          ))}
        </Name>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */

export default function Hero8() {
  const root = useRef<HTMLElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const lens = lensRef.current;
    const ring = ringRef.current;
    if (!el || !lens || !ring) return;

    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rules = q("[data-rule]");
      const words = q("[data-word]");
      const fade = q("[data-fade]");
      const packets = q("[data-packet]");

      let w = 0;
      let h = 0;
      let visible = true;
      const measure = () => {
        const r = el.getBoundingClientRect();
        w = r.width;
        h = r.height;
      };
      measure();

      // lens state
      const st = { k: 0, boost: 1 };
      let tx = w * 0.68;
      let ty = h * 0.46;
      let px = tx;
      let py = ty;
      let rr = 0;
      let last = -1e9;

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        tx = e.clientX - r.left;
        ty = e.clientY - r.top;
        last = performance.now();
      };
      const onDown = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("a")) return;
        gsap.fromTo(st, { boost: 1.9 }, { boost: 1, duration: 1.6, ease: "elastic.out(1,0.4)", overwrite: "auto" });
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("resize", measure);
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);

      const tick = (time: number) => {
        if (!visible) return;
        // nobody steering: the lens wanders on its own
        if (performance.now() - last > 2500) {
          tx = w * (0.5 + 0.3 * Math.sin(time * 0.35));
          ty = h * (0.5 + 0.22 * Math.sin(time * 0.5 + 1));
        }
        px += (tx - px) * 0.14;
        py += (ty - py) * 0.14;

        const base = Math.max(120, Math.min(200, Math.min(w, h) * 0.22));
        rr += (base * st.k * st.boost - rr) * 0.12;

        lens.style.clipPath = `circle(${rr.toFixed(1)}px at ${px.toFixed(1)}px ${py.toFixed(1)}px)`;
        ring.style.opacity = rr > 2 ? "1" : "0";
        ring.style.width = ring.style.height = `${(rr * 2).toFixed(1)}px`;
        ring.style.transform = `translate3d(${(px - rr).toFixed(1)}px,${(py - rr).toFixed(1)}px,0)`;
      };
      gsap.ticker.add(tick);

      // intro
      gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(words, { yPercent: 112 });
      gsap.set(fade, { opacity: 0, y: 12 });
      gsap.set(packets, { strokeDashoffset: 8 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(rules, { scaleX: 1, duration: 1.8, stagger: 0.12 }, 0)
        .to(words, { yPercent: 0, duration: 1.6, stagger: 0.14 }, 0.3)
        .to(fade, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.08 }, 0.8)
        .to(st, { k: 1, duration: 2.2 }, 1.5);

      // a request travelling through the blueprint, on loop
      const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.4, delay: 2.2 });
      packets.forEach((p, i) => loop.fromTo(p, { strokeDashoffset: 8 }, { strokeDashoffset: -92, duration: 0.9, ease: "power1.inOut" }, i * 0.8));

      return () => {
        tl.kill();
        loop.kill();
        gsap.killTweensOf(st);
        gsap.ticker.remove(tick);
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("resize", measure);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      id="top"
      className={`${VARS} ${DISPLAY} relative isolate h-[100svh] min-h-[620px] overflow-clip bg-white antialiased selection:bg-[#A8B85A] selection:text-[#18364B]`}
    >
      {/* surface: the page you see */}
      <Layer live />

      {/* lens: the page you never see (clipped to a circle) */}
      <div ref={lensRef} aria-hidden className="pointer-events-none absolute inset-0" style={{ clipPath: "circle(0px at 50% 50%)" }}>
        <Layer dark />
      </div>

      <div ref={ringRef} aria-hidden className="pointer-events-none absolute left-0 top-0 rounded-full border border-[#4F91C9]/60 opacity-0 will-change-transform" />
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