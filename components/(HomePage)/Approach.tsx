"use client";

import { useEffect, useRef, useState } from "react";

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Font is loaded once in layout.tsx. */

/* Content: edit here */

const TITLE = "My approach";
const INTRO = "The same five steps on every project, so nothing is left to guesswork.";

const STEPS = [
  { title: "Define", body: "A short written scope: who the users are and what the system must do." },
  { title: "Architecture", body: "How requests move through services, queues and data, kept simple to change." },
  { title: "Database & API design", body: "Schema and API contract, documented before any feature code." },
  { title: "MVP roadmap", body: "Small milestones with clear outcomes and dates." },
  { title: "Development & testing", body: "Built with Spring Boot, covered by unit and integration tests." },
];

/* Dot centre from the top of a step: dot top + half of its 11px size */
const DOT_TOP = "calc(0.55rem + 5.5px)";
const DOT_TOP_MD = "calc(0.8rem + 5.5px)";

const EASE = "cubic-bezier(.22,1,.36,1)";
const ACCENT = "var(--color-accent)";
const GLOW = "color-mix(in srgb, var(--color-accent) 55%, transparent)";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function Approach() {
  const list = useRef<HTMLOListElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const ol = list.current;
    if (!ol) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let ys: number[] = [];
    let target = 0; // where the screen mark is, relative to the list top
    let cur = 0; // smoothed copy of target, so everything glides instead of jumping
    let first = true;

    const dots = () => Array.from(ol.querySelectorAll<HTMLElement>("[data-dot]"));
    const fills = () => Array.from(ol.querySelectorAll<HTMLElement>("[data-fill]"));

    const measure = () => {
      const o = ol.getBoundingClientRect();
      ys = dots().map((d) => {
        const r = d.getBoundingClientRect();
        return r.top + r.height / 2 - o.top;
      });
      target = window.innerHeight * 0.6 - o.top;
      if (first) {
        cur = target;
        first = false;
      }
    };

    const apply = () => {
      if (!ys.length) return;
      const top = ys[0];
      const end = ys[ys.length - 1];
      const y = clamp(cur, top, end);

      // glowing head + comet tail follows the mark
      if (head.current) {
        const fadeIn = clamp((cur - (top - 90)) / 90, 0, 1);
        const fadeOut = clamp((end + 170 - cur) / 130, 0, 1);
        head.current.style.transform = `translate3d(0, ${y}px, 0)`;
        head.current.style.opacity = String(fadeIn * fadeOut);
      }

      // each piece of the path fills up to the head
      fills().forEach((f, i) => {
        const span = ys[i + 1] - ys[i];
        const p = span > 0 ? clamp((y - ys[i]) / span, 0, 1) : 0;
        f.style.transform = `scaleY(${p})`;
      });

      // overall progress bar on the left
      if (bar.current) bar.current.style.transform = `scaleX(${clamp((y - top) / (end - top || 1), 0, 1)})`;

      const n = ys.filter((v) => v <= cur + 0.5).length;
      setReached((prev) => (prev === n ? prev : n));
    };

    const loop = () => {
      const d = target - cur;
      cur = reduce || Math.abs(d) < 0.3 ? target : cur + d * 0.14;
      apply();
      raf = Math.abs(target - cur) < 0.3 ? 0 : requestAnimationFrame(loop);
    };

    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(loop);
    };

    measure();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const current = reached > 0 ? STEPS[reached - 1].title : "Scroll to begin";

  return (
    <section
      id="approach"
      aria-label="My approach"
      className="bg-section-bg font-display text-heading antialiased selection:bg-accent selection:text-on-accent"
    >
      <style>{`
        @keyframes ap-pop { 0% { transform: scale(.4); } 55% { transform: scale(1.9); } 100% { transform: scale(1); } }
        @keyframes ap-ring { 0% { transform: scale(1); opacity: .55; } 100% { transform: scale(4.4); opacity: 0; } }
        @keyframes ap-swap { 0% { opacity: 0; transform: translateY(10px); filter: blur(4px); } 100% { opacity: 1; transform: none; filter: none; } }
        @keyframes ap-beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.35); } }
        @media (prefers-reduced-motion: reduce) { .ap-anim { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="mx-auto grid w-full max-w-page gap-12 px-gutter py-section md:px-gutter-md md:py-section-md lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-gutter-lg">
        {/* Left: heading + progress, pinned on desktop */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="text-h2 md:text-h2-md text-heading">{TITLE}</h2>
          <p className="mt-4 max-w-[34ch] text-sub md:text-sub-md text-muted md:mt-6">{INTRO}</p>

          <div className="mt-10 hidden md:mt-14 md:block">
            {/* Progress bar */}
            <div className="h-[3px] w-full max-w-[22rem] overflow-hidden rounded-full bg-section-border">
              <span
                ref={bar}
                className="block h-full origin-left rounded-full bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {/* Current step name, swaps with a soft blur */}
            <p className="mt-5 text-sm text-muted">
              Now:{" "}
              <span key={current} className="ap-anim inline-block text-heading" style={{ animation: `ap-swap 600ms ${EASE}` }}>
                {current}
              </span>
            </p>
          </div>
        </div>

        {/* Right: the path */}
        <ol ref={list} className="relative">
          {/* Comet head: glowing orb with a tail, rides the scroll */}
          <div ref={head} aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 w-[11px] opacity-0 will-change-transform">
            <span
              className="absolute left-[4px] h-[80px] w-[3px] rounded-full"
              style={{ top: "-80px", background: `linear-gradient(to bottom, transparent, ${ACCENT})` }}
            />
            <span
              className="ap-anim absolute -left-[2px] -top-[7.5px] size-[15px] rounded-full"
              style={{
                background: ACCENT,
                boxShadow: `0 0 18px 4px ${GLOW}, 0 0 44px 10px ${GLOW}`,
                animation: "ap-beat 1.4s ease-in-out infinite",
              }}
            />
          </div>

          {STEPS.map(({ title, body }, i) => {
            const last = i === STEPS.length - 1;
            const on = i < reached; // step has been reached
            const active = i === reached - 1; // the newest one
            return (
              <li key={title} className="relative pb-14 pl-10 last:pb-0 md:pb-20 md:pl-12">
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-[4px] w-[3px] overflow-hidden rounded-full bg-section-border top-[var(--a)] bottom-[calc(-1*var(--a))] md:top-[var(--b)] md:bottom-[calc(-1*var(--b))]"
                    style={{ ["--a" as string]: DOT_TOP, ["--b" as string]: DOT_TOP_MD }}
                  >
                    <span
                      data-fill
                      className="block size-full origin-top bg-accent"
                      style={{ transform: "scaleY(0)", boxShadow: `0 0 12px 1px ${GLOW}` }}
                    />
                  </span>
                )}

                {/* Dot: pops when reached, rings pulse while it is the active step */}
                <span
                  data-dot
                  aria-hidden
                  className={`ap-anim absolute left-0 top-[0.55rem] z-10 size-[11px] rounded-full border transition-[background-color,border-color] duration-500 md:top-[0.8rem] ${
                    on ? "border-accent bg-accent" : "border-section-border bg-section-bg"
                  }`}
                  style={on ? { animation: "ap-pop 700ms cubic-bezier(.34,1.56,.64,1)" } : undefined}
                >
                  {active && (
                    <>
                      <span
                        className="ap-anim absolute -inset-px rounded-full border border-accent"
                        style={{ animation: "ap-ring 2s ease-out infinite" }}
                      />
                      <span
                        className="ap-anim absolute -inset-px rounded-full border border-accent"
                        style={{ animation: "ap-ring 2s ease-out 1s infinite" }}
                      />
                    </>
                  )}
                </span>

                {/* Content: dim and blurred until reached, then words rise out of a mask */}
                <div
                  className="ap-anim"
                  style={{
                    opacity: on ? 1 : 0.22,
                    filter: on ? "blur(0px)" : "blur(3px)",
                    transform: on ? "translateX(0)" : "translateX(18px)",
                    transition: `opacity 700ms ${EASE}, filter 700ms ${EASE}, transform 700ms ${EASE}`,
                  }}
                >
                  {/* Step number: mobile only */}
                  <span
                    className={`block text-xs font-semibold tabular-nums transition-colors duration-500 md:hidden ${on ? "text-accent" : "text-muted"}`}
                  >
                    0{i + 1}
                  </span>

                  <h3 className="mt-2 flex flex-wrap gap-x-[0.3em] text-card md:mt-0 md:text-card-md text-heading">
                    {title.split(" ").map((w, k) => (
                      <span key={k} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                        <span
                          className="ap-anim inline-block"
                          style={{
                            transform: on ? "translateY(0)" : "translateY(115%)",
                            transition: `transform 800ms ${EASE} ${k * 70}ms`,
                          }}
                        >
                          {w}
                        </span>
                      </span>
                    ))}
                  </h3>

                  <p
                    className="ap-anim mt-3 max-w-[44ch] text-body md:text-body-md text-subheading-soft"
                    style={{
                      opacity: on ? 1 : 0,
                      transform: on ? "translateY(0)" : "translateY(10px)",
                      transition: `opacity 700ms ${EASE} 180ms, transform 700ms ${EASE} 180ms`,
                    }}
                  >
                    {body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default Approach;