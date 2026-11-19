"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Wrap a key phrase in **double stars** to make it brighter.
   Motion: words light up with the scroll position, forward only.
   dim -> orange -> their own colour. It never reverses and never replays. */

/* Content: edit here */

const BELIEF =
  "I believe a good backend is the one nobody has to think about. It stays **fast**, stays **secure**, and **keeps working** as the product grows.";

const CAN_DO =
  "I design and build REST APIs, database schemas, authentication and the services behind them with Spring Boot. Everything is tested and ready to ship.";

const ACCENT = "#FF895D";
const DIM = "#2B323C";

type Piece = { text: string; bold: boolean };

/** Splits text into words. **phrase** pieces are marked bold, and punctuation stays attached to its word. */
function toWords(text: string): Piece[][] {
  const words: Piece[][] = [];
  let cur: Piece[] = [];
  text.split(/\*\*(.+?)\*\*/g).forEach((seg, i) => {
    const bold = i % 2 === 1;
    seg.split(/(\s+)/).forEach((tok) => {
      if (!tok) return;
      if (/^\s+$/.test(tok)) {
        if (cur.length) words.push(cur);
        cur = [];
      } else {
        cur.push({ text: tok, bold });
      }
    });
  });
  if (cur.length) words.push(cur);
  return words;
}

function Words({ text }: { text: string }) {
  return (
    <>
      {toWords(text).map((word, i) => (
        <span key={i} className="mr-[0.26em] inline-block last:mr-0">
          {word.map((p, k) => (
            <span
              key={k}
              data-scrub-word
              className={`inline-block ${p.bold ? "font-extrabold text-heading" : ""}`}
            >
              {p.text}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((p) => {
        const words = Array.from(p.querySelectorAll<HTMLElement>("[data-scrub-word]"));

        // read each word's real theme colour before dimming it
        const finals = words.map((w) => getComputedStyle(w).color);
        gsap.set(words, { color: DIM });

        // paused timeline, progress is set directly from the scroll position
        const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
        words.forEach((w, i) => {
          tl.to(w, { color: ACCENT, duration: 1 }, i * 0.5).to(w, { color: finals[i], duration: 1 }, i * 0.5 + 1);
        });

        let max = 0; // furthest point reached, so it only moves forward

        ScrollTrigger.create({
          trigger: p,
          start: "top 85%",
          end: "bottom 45%",
          onUpdate: (self) => {
            if (self.progress <= max) return;
            max = self.progress;
            tl.progress(max);

            if (max >= 1) {
              // done: hand colours back to the theme and stop listening
              gsap.set(words, { clearProps: "color" });
              self.kill();
            }
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-label="Philosophy"
      className="bg-section-bg font-display antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto flex min-h-[65svh] w-full max-w-page items-center px-gutter py-24 md:min-h-0 md:px-gutter-md md:py-32 lg:px-gutter-lg">
        <div className="max-w-3xl">
          <p data-scrub className="text-statement text-subheading-soft">
            <Words text={BELIEF} />
          </p>

          <p data-scrub className="mt-8 max-w-[44ch] text-body md:text-body-md text-muted md:mt-10">
            <Words text={CAN_DO} />
          </p>
        </div>
      </div>
    </section>
  );
}