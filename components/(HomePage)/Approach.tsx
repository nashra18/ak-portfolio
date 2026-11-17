"use client";

/**
 * Approach: a vertical path. Looks different from Skills on purpose.
 * Needs: next (next/font), Tailwind. No animation library.
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (path track) | Ice Sheet #DFEAF5 (titles)
 * Glacier #A8C8EB (body) | Storm #657E9B (intro) | Tangerine #FF895D (the filled path and dots)
 *
 * The path is drawn in pieces, one from each dot to the next dot, so it starts
 * at the first circle and ends exactly at the last circle. Each piece fills
 * with Tangerine as you scroll. The text never animates.
 * Desktop: heading stays pinned on the left while the path scrolls on the right.
 * Phone: heading on top, path below.
 */

import { Manrope } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "800"],
  display: "swap",
});

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

export function Approach() {
  const list = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(0);

  // Fill each piece of the path as the screen mark passes it
  useEffect(() => {
    const ol = list.current;
    if (!ol) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const mark = window.innerHeight * 0.6;
      const dots = Array.from(ol.querySelectorAll<HTMLElement>("[data-dot]"));
      const fills = Array.from(ol.querySelectorAll<HTMLElement>("[data-fill]"));
      const ys = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return r.top + r.height / 2;
      });

      fills.forEach((f, i) => {
        const span = ys[i + 1] - ys[i];
        const p = span > 0 ? Math.min(Math.max((mark - ys[i]) / span, 0), 1) : 0;
        f.style.transform = `scaleY(${p})`;
      });

      const n = ys.filter((y) => y <= mark).length;
      setReached((prev) => (prev === n ? prev : n));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="approach"
      aria-label="My approach"
      className={`${manrope.className} bg-[#0B111B] text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B]`}
    >
      <div className="mx-auto grid w-full max-w-[90rem] gap-12 px-5 py-20 md:px-12 md:py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-24 lg:px-16">
        {/* Left: heading, pinned on desktop */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="text-[12vw] font-extrabold leading-[0.95] tracking-[-0.055em] md:text-6xl lg:text-7xl">{TITLE}</h2>
          <p className="mt-4 max-w-[34ch] text-sm font-medium leading-[1.65] text-[#657E9B] md:mt-6 md:text-base">{INTRO}</p>
        </div>

        {/* Right: the path */}
        <ol ref={list} className="relative">
          {STEPS.map(({ title, body }, i) => {
            const last = i === STEPS.length - 1;
            return (
              <li key={title} className="relative pb-14 pl-10 last:pb-0 md:pb-20 md:pl-12">
                {/* piece of path from this dot down to the next dot (none after the last dot) */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute left-[4px] w-[3px] overflow-hidden rounded-full bg-[#253B56] top-[var(--a)] bottom-[calc(-1*var(--a))] md:top-[var(--b)] md:bottom-[calc(-1*var(--b))]"
                    style={{ ["--a" as string]: DOT_TOP, ["--b" as string]: DOT_TOP_MD }}
                  >
                    <span data-fill className="block size-full origin-top scale-y-0 bg-[#FF895D]" />
                  </span>
                )}

                {/* the dot sits on top of the path */}
                <span
                  data-dot
                  aria-hidden
                  className={`absolute left-0 top-[0.55rem] z-10 size-[11px] rounded-full border transition-[background-color,border-color,box-shadow] duration-500 motion-reduce:transition-none md:top-[0.8rem] ${
                    i < reached ? "border-[#FF895D] bg-[#FF895D]" : "border-[#253B56] bg-[#0B111B]"
                  } ${i === reached - 1 ? "shadow-[0_0_0_5px_rgba(255,137,93,0.16)]" : ""}`}
                />

                <div>
                  <h3 className="text-2xl font-extrabold leading-tight tracking-[-0.04em] md:text-4xl">{title}</h3>
                  <p className="mt-3 max-w-[44ch] text-sm font-medium leading-[1.7] text-[#A8C8EB]/70 md:text-base">{body}</p>
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