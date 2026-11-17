"use client";

/**
 * Philosophy. Two short parts: what I believe, and what I can do for you.
 * Needs: next (next/font), Tailwind. No animation library.
 *
 * Palette
 * Obsidian #0B111B (bg) | Ice Sheet #DFEAF5 (key words) | Glacier #A8C8EB (body)
 * Storm #657E9B (supporting line) | Tangerine #FF895D (text selection only)
 *
 * Readable but calm: a medium headline, one smaller supporting line.
 * Wrap a key phrase in **double stars** to make it brighter.
 * Motion: one soft fade when it comes into view. Plays once, skipped for reduced motion.
 */

import { Manrope } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
});

/* Content: edit here */

const BELIEF =
  "I believe a good backend is the one nobody has to think about. It stays **fast**, stays **secure**, and **keeps working** as the product grows.";

const CAN_DO =
  "I design and build REST APIs, database schemas, authentication and the services behind them with Spring Boot. Everything is tested and ready to ship.";

/** Turns **phrase** into a brighter span */
function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 ? (
          <span key={i} className="font-extrabold text-[#DFEAF5]">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-label="Philosophy"
      className={`${manrope.className} bg-[#0B111B] antialiased selection:bg-[#FF895D] selection:text-[#0B111B]`}
    >
      <div className="mx-auto flex min-h-[65svh] w-full max-w-[90rem] items-center px-5 py-24 md:min-h-0 md:px-12 md:py-32 lg:px-16">
        <div
          ref={ref}
          className={`max-w-3xl transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none ${
            seen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          }`}
        >
          <p className="text-[clamp(2rem,3.2vw,2.75rem)] font-semibold leading-[1.2] tracking-[-0.04em] text-[#A8C8EB]/75">
            <Marked text={BELIEF} />
          </p>

          <p className="mt-8 max-w-[44ch] text-base font-medium leading-[1.7] text-[#657E9B] md:mt-10">{CAN_DO}</p>
        </div>
      </div>
    </section>
  );
}