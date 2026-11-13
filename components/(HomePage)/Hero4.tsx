"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Space_Grotesk, Geist_Mono } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", variable: "--font-hero-display" });
const mono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-hero-mono" });
const VARS = `${display.variable} ${mono.variable}`;

const DISPLAY = "font-[family-name:var(--font-hero-display)]";
const MONO = "font-[family-name:var(--font-hero-mono)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";

/*
  Concept: "Iced Denim"
  The page is a frozen surface. Your cursor (or finger) is a warm spot that thaws it
  and shows what is underneath: the requests, tokens, queries and status codes.
  Hold to thaw everything. Scrolling melts the whole hero into the dark section below.

  Palette
  Frost       #F1F6FA  surface
  Deep Fjord  #18364B  ink and the world under the ice
  Iced Denim  #4F91C9  lens edge, secondary text on dark
  Pistachio   #A8B85A  the one warm accent
  White       #FFFFFF
*/

/* ---------- The wall of backend text living under the ice ---------- */

const WALL = [
  "GET", "/api/v1/users/42", "200", "3ms", "jwt.verified", "role=USER", "redis.hit", "POST",
  "/api/v1/orders", "201", "INSERT", "COMMIT", "SELECT", "pk=42", "401", "no.bearer.token",
  "@Transactional", "SpringBoot", "PostgreSQL", "Docker", "users::42", "ttl=600", "ratelimit.ok",
];

function Wall() {
  return (
    <p
      className={`${MONO} pointer-events-none absolute inset-0 select-none overflow-hidden break-words px-5 py-4 text-[12px] leading-[2] md:px-12 md:text-[13px] lg:px-16`}
    >
      {Array.from({ length: 520 }, (_, i) => {
        const t = WALL[(i * 7 + (i >> 3)) % WALL.length];
        const c = /^(GET|POST|INSERT|SELECT)$/.test(t)
          ? "text-[#A8B85A]"
          : /^\d{3}$/.test(t)
            ? "text-white"
            : "text-[#4F91C9]/70";
        return (
          <span key={i} className={c}>
            {t}{" "}
          </span>
        );
      })}
    </p>
  );
}

/* ---------- Name ---------- */

function Name({ anim }: { anim?: boolean }) {
  const word = (t: string, dot?: boolean) => (
    <span
      aria-hidden
      className="-mx-[0.04em] -my-[0.06em] block overflow-hidden whitespace-nowrap px-[0.04em] py-[0.06em]"
    >
      {Array.from(t).map((c, i) => (
        <span key={i} {...(anim ? { "data-ch": "" } : {})} className={`inline-block ${anim ? HIDDEN : ""}`}>
          {c}
        </span>
      ))}
      {dot && (
        <span
          {...(anim ? { "data-dot": "" } : {})}
          className={`ml-[0.04em] inline-block size-[0.13em] rounded-full bg-[#A8B85A] ${anim ? HIDDEN : ""}`}
        />
      )}
    </span>
  );
  const cls = `${DISPLAY} flex select-none flex-col text-[33vw] font-bold leading-[0.8] tracking-[-0.05em] md:flex-row md:gap-[0.2em] md:text-[15vw]`;
  return anim ? (
    <h1 aria-label="Asad Khan" className={cls}>
      {word("ASAD")}
      {word("KHAN", true)}
    </h1>
  ) : (
    <div className={cls}>
      {word("ASAD")}
      {word("KHAN", true)}
    </div>
  );
}

/* ---------- Buttons ---------- */

function Btn({
  href,
  children,
  ghost,
  dark,
  download,
}: {
  href: string;
  children: React.ReactNode;
  ghost?: boolean;
  dark?: boolean;
  download?: boolean;
}) {
  const inner = ghost ? (
    <>{children}</>
  ) : (
    <>
      {children}
      <span className="grid size-10 place-items-center rounded-full bg-[#18364B] text-[#F1F6FA]">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </>
  );
  const base = `${DISPLAY} inline-flex items-center gap-3 rounded-full text-lg font-bold transition-transform duration-300 md:text-xl`;
  const cls = ghost
    ? `${base} border-2 px-6 py-3 ${dark ? "border-[#F1F6FA] text-[#F1F6FA]" : "border-[#18364B] text-[#18364B] hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F91C9]"}`
    : `${base} bg-[#A8B85A] py-2 pl-6 pr-2 text-[#18364B] ${dark ? "" : "hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F91C9]"}`;
  if (dark)
    return (
      <span aria-hidden className={cls}>
        {inner}
      </span>
    );
  return (
    <a href={href} download={download} className={cls}>
      {inner}
    </a>
  );
}

/* ---------- One layout, drawn twice: frost on top, fjord underneath ---------- */

function Content({ dark }: { dark?: boolean }) {
  const ink = dark ? "text-[#F1F6FA]" : "text-[#18364B]";
  const sub = dark ? "text-[#F1F6FA]/70" : "text-[#18364B]/65";
  const f = dark ? "" : `data-fade ${HIDDEN}`;
  return (
    <div className={`relative z-10 flex h-full flex-col justify-between px-5 pb-6 pt-5 md:px-12 md:pb-10 lg:px-16 ${ink}`}>
      <div {...(dark ? {} : { "data-fade": "" })} className={`${MONO} flex justify-between text-xs md:text-sm ${dark ? "" : HIDDEN}`}>
        <span>Backend developer</span>
        <span className={sub}>Java and Spring Boot</span>
      </div>

      <Name anim={!dark} />

      <div
        {...(dark ? {} : { "data-fade": "" })}
        className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 ${dark ? "" : HIDDEN}`}
      >
        <div className="flex max-w-[34ch] flex-col gap-3 md:max-w-[38ch]">
          <p className="text-[1.2rem] font-medium leading-[1.3] tracking-[-0.01em] md:text-[1.7rem]">
            I build the part of the internet you never see, so the part you do see never breaks.
          </p>
          <p className={`${MONO} text-xs ${sub}`}>Move over the ice to look underneath. Press and hold to thaw it all.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn href="#projects" dark={dark}>
            View projects
          </Btn>
          <Btn href="/resume.pdf" download ghost dark={dark}>
            Resume
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const under = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    const layer = under.current;
    const rg = ring.current;
    const lb = label.current;
    if (!el || !layer || !rg || !lb) return;

    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();
    const lens = { x: 0, y: 0, r: 0, s: 0 };
    let w = 0;
    let h = 0;
    let maxR = 0;

    const size = () => {
      const b = el.getBoundingClientRect();
      w = b.width;
      h = b.height;
      maxR = Math.hypot(w, h);
    };

    const paint = () => {
      const R = lens.r + lens.s;
      layer.style.clipPath = `circle(${R}px at ${lens.x}px ${lens.y}px)`;
      rg.style.width = rg.style.height = `${lens.r * 2}px`;
      rg.style.transform = `translate(${lens.x - lens.r}px, ${lens.y - lens.r}px)`;
      rg.style.opacity = String(Math.max(0, 1 - lens.s / 160));
      lb.style.opacity = lens.r > 240 || lens.r < 40 ? "0" : "1";
    };

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      size();
      lens.x = w / 2;
      lens.y = h / 2;

      const coarse = window.matchMedia("(pointer: coarse)").matches;
      let px = 0;
      let py = 0;
      let last = -1e9;
      let hold = false;
      let intro = false;

      const onMove = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        last = performance.now();
      };
      const onDown = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("a")) return;
        onMove(e);
        hold = true;
      };
      const onUp = () => {
        hold = false;
      };

      const tick = (time: number) => {
        const b = el.getBoundingClientRect();
        let tx: number;
        let ty: number;
        if (performance.now() - last > 2500) {
          // nobody is steering: the warm spot drifts on its own
          tx = w * (0.5 + 0.32 * Math.sin(time * 0.7));
          ty = h * (0.5 + 0.28 * Math.sin(time * 0.93 + 1));
        } else {
          tx = px - b.left;
          ty = py - b.top;
        }
        const target = !intro ? 0 : hold ? maxR : coarse ? 100 : 150;
        lens.x += (tx - lens.x) * 0.14;
        lens.y += (ty - lens.y) * 0.14;
        lens.r += (target - lens.r) * (hold ? 0.06 : 0.1);
        paint();
      };

      window.addEventListener("pointermove", onMove);
      el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      window.addEventListener("resize", size);
      gsap.ticker.add(tick);

      // scrolling pins the hero and melts it into the dark section below
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=120%",
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          lens.s = Math.pow(self.progress, 1.6) * maxR;
        },
      });

      // intro: letters rise, copy fades in, then the lens opens
      const letters = q("[data-ch]");
      const dot = q("[data-dot]");
      const fade = q("[data-fade]");
      gsap.set(letters, { yPercent: 120, opacity: 1 });
      gsap.set(dot, { scale: 0, opacity: 1, transformOrigin: "50% 100%" });
      gsap.set(fade, { opacity: 0, y: 24 });
      gsap
        .timeline({ delay: 0.1 })
        .to(letters, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.07 }, 0)
        .to(dot, { scale: 1, duration: 0.8, ease: "back.out(2.2)" }, 0.9)
        .to(fade, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 }, 0.6);
      const open = gsap.delayedCall(1.3, () => {
        intro = true;
      });

      return () => {
        open.kill();
        st.kill();
        gsap.ticker.remove(tick);
        window.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        window.removeEventListener("resize", size);
      };
    });

    // reduced motion: a still lens, nothing pinned
    mm.add("(prefers-reduced-motion: reduce)", () => {
      size();
      lens.x = w * 0.62;
      lens.y = h * 0.5;
      lens.r = 150;
      paint();
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      id="top"
      className={`${VARS} ${DISPLAY} relative isolate h-[100svh] touch-pan-y overflow-clip bg-[#F1F6FA] antialiased selection:bg-[#A8B85A] selection:text-[#18364B]`}
    >
      {/* the ice: a faint grid, like frost on glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(#4F91C9 1px, transparent 1px), linear-gradient(90deg, #4F91C9 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="absolute inset-0">
        <Content />
      </div>

      {/* what lives underneath */}
      <div
        ref={under}
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#18364B]"
        style={{ clipPath: "circle(0px at 50% 50%)" }}
      >
        <Wall />
        <Content dark />
      </div>

      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 rounded-full border border-[#4F91C9]"
        style={{ width: 0, height: 0 }}
      >
        <span
          ref={label}
          className={`${MONO} absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#4F91C9] px-3 py-1 text-[11px] text-white`}
        >
          under the hood
        </span>
      </div>
    </header>
  );
}

/* ---------- Stats: lives on the same Deep Fjord the hero melts into ---------- */

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
    <section
      ref={ref}
      className={`${VARS} ${DISPLAY} bg-[#18364B] px-5 py-20 text-[#F1F6FA] antialiased md:px-12 md:py-32 lg:px-16`}
    >
      <p className="max-w-[22ch] text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-5xl">
        Under the ice, the work adds up.
      </p>
      <dl className="mt-12 grid grid-cols-2 gap-y-10 md:mt-20 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex min-w-0 flex-col gap-3 border-[#4F91C9]/40 pl-4 md:pl-8 ${i % 2 === 1 ? "border-l" : ""} ${i > 0 ? "md:border-l" : "md:border-l-0 md:pl-0"} ${i === 2 ? "max-md:border-l-0 max-md:pl-0" : ""}`}
          >
            <dd className="flex items-start text-[clamp(3rem,15vw,4.5rem)] font-bold leading-[0.85] tracking-[-0.04em] tabular-nums md:text-[8vw]">
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

const CARDS = [
  "bg-[#18364B] text-[#F1F6FA]",
  "bg-[#4F91C9] text-white",
  "bg-[#A8B85A] text-[#18364B]",
];

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
      <h2
        id="testimonials-title"
        data-title
        className="whitespace-nowrap text-[clamp(4rem,17vw,14rem)] font-bold leading-[0.85] tracking-[-0.05em]"
      >
        Kind words<span className="text-[#A8B85A]">.</span>
      </h2>
      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={i}
            data-card
            className={`flex flex-col justify-between rounded-3xl p-6 md:min-h-[320px] md:p-8 ${CARDS[i % 3]}`}
          >
            <span aria-hidden className="text-8xl font-bold leading-[0.7] md:text-9xl">
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