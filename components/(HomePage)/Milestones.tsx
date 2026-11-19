"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CARD =
  "border border-section-border bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-section-border)_55%,transparent)_0%,color-mix(in_srgb,var(--color-section-border)_18%,transparent)_60%,color-mix(in_srgb,var(--color-section-border)_12%,transparent)_100%)] transition-colors duration-500 hover:border-button-ghost-border-hover/70";

/* Same hover as the Education card: the card bends toward the cursor,
   with a natural spotlight and a glowing border that follow the pointer. */
const SPOTLIGHT = {
  background:
    "radial-gradient(260px circle at var(--mx) var(--my), color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)",
} as const;

const BORDER_GLOW = {
  padding: 1,
  background:
    "radial-gradient(200px circle at var(--mx) var(--my), var(--color-accent), transparent 70%)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as const;

type Item = { name: string; meta?: string };

const DATA: { title: string; text: string; items: Item[] }[] = [
  {
    title: "Hackathons",
    text: "Building solutions, collaborating with teams, and solving real world challenges under tight deadlines.",
    items: [
      { name: "Smart India Hackathon", meta: "2025" },
      { name: "Bharatiya Antariksh Hackathon", meta: "ISRO, 2026" },
      { name: "HACKHAZARDS '26", meta: "2026" },
      { name: "GDG HackFest 2.0", meta: "2026" },
    ],
  },
  {
    title: "Certifications",
    text: "Focused on backend development, AI, and software engineering.",
    items: [
      { name: "Oracle AI Foundations Associate" },
      { name: "HackerRank Java (Basic)" },
      { name: "Tata GenAI Data Analytics Simulation" },
    ],
  },
];

export default function Milestones() {
  const root = useRef<HTMLElement>(null);

  /* Scroll entrance (unchanged) */
  useIso(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.selector(el)("[data-fade]");

      gsap.set(items, { opacity: 0, y: 10 });

      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.06,
            overwrite: true,
          }),
      });
    });

    return () => mm.revert();
  }, []);

  /* Tilt + cursor glow (mouse), light follows the tap (touch) */
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (!window.matchMedia("(hover: hover)").matches) {
      const touchCards = Array.from(el.querySelectorAll<HTMLElement>("[data-glow]"));
      const offs = touchCards.map((card) => {
        const down = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
          card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
        };
        card.addEventListener("pointerdown", down);
        return () => card.removeEventListener("pointerdown", down);
      });
      return () => offs.forEach((fn) => fn());
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-glow]"));
    const cleanups = cards.map((card) => {
      let rx: ((v: number) => void) | null = null;
      let ry: ((v: number) => void) | null = null;
      if (!reduce) {
        gsap.set(card, { transformPerspective: 900 });
        rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
        ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
      }

      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        rx?.((0.5 - py) * 12);
        ry?.((px - 0.5) * 14);
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      };
      const leave = () => {
        rx?.(0);
        ry?.(0);
      };

      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      return () => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section
      ref={root}
      id="milestones"
      className="relative isolate overflow-clip bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto w-full max-w-page px-gutter py-section md:px-gutter-md md:py-section-md lg:px-gutter-lg">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {DATA.map((group) => (
            <div key={group.title} className="h-full" style={{ perspective: "900px" }}>
            <div
              data-glow
              className={`group/card relative flex h-full flex-col gap-6 rounded-2xl p-5 [transform-style:preserve-3d] [@media(hover:none)]:shadow-[0_14px_32px_-16px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6 md:gap-7 md:p-7 ${CARD}`}
              style={{ ["--mx" as string]: "50%", ["--my" as string]: "20%" }}
            >
              {/* Glow layers (fade in on hover, follow the cursor) */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 [@media(hover:none)]:opacity-100"
                style={SPOTLIGHT}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 [@media(hover:none)]:opacity-50"
                style={BORDER_GLOW}
              />

              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-subheading/40 to-transparent"
              />

              <div className="relative flex flex-col gap-2 [transform:translateZ(18px)]">
                <h2
                  data-fade
                  className={`select-none text-[1.5rem] leading-tight tracking-[-0.04em] text-heading sm:text-[1.65rem] md:text-title-md ${HIDDEN}`}
                >
                  {group.title}
                </h2>

                <p
                  data-fade
                  className={`max-w-[40ch] text-[11px] font-medium leading-[1.6] text-subheading-soft sm:text-xs md:text-[13px] ${HIDDEN}`}
                >
                  {group.text}
                </p>
              </div>

              <ul className="relative flex flex-col gap-1 [transform:translateZ(18px)]">
                {group.items.map((it, i) => (
                  <li
                    key={it.name}
                    data-fade
                    className={`group/row grid grid-cols-[1.5rem_1fr_auto] items-center gap-x-2 rounded-xl px-2.5 py-2.5 transition-colors duration-500 ${SPRING} hover:bg-section-bg/45 sm:py-3 md:grid-cols-[1.8rem_1fr_auto] md:px-3 md:py-3 ${HIDDEN}`}
                  >
                    <span className="text-[9px] font-semibold tabular-nums text-subheading transition-colors duration-500 group-hover/row:text-accent sm:text-[10px]">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[12px] font-semibold leading-[1.35] tracking-[-0.015em] text-heading sm:text-[13px] md:text-sm">
                      {it.name}
                    </span>

                    {it.meta && (
                      <span className="whitespace-nowrap rounded-full border border-section-border bg-section-bg/40 px-2 py-1 text-[9px] font-medium leading-none tabular-nums text-subheading transition-colors duration-500 group-hover/row:border-button-ghost-border-hover sm:text-[10px]">
                        {it.meta}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}