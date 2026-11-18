"use client";

import { useEffect, useRef, useState } from "react";

/* Theme (globals.css) is the single source for colours, sizes and weights.
   Wrap a key phrase in **double stars** to make it brighter.
   Motion: one soft fade when it comes into view. Plays once, skipped for reduced motion. */

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
          <span key={i} className="font-extrabold text-heading">
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
      className="bg-section-bg font-display antialiased selection:bg-accent selection:text-on-accent"
    >
      <div className="mx-auto flex min-h-[65svh] w-full max-w-page items-center px-gutter py-24 md:min-h-0 md:px-gutter-md md:py-32 lg:px-gutter-lg">
        <div
          ref={ref}
          className={`max-w-3xl transition-[opacity,transform] duration-1000 ease-out motion-reduce:transition-none ${
            seen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          }`}
        >
          <p className="text-statement text-subheading-soft">
            <Marked text={BELIEF} />
          </p>

          <p className="mt-8 max-w-[44ch] text-body md:text-body-md text-muted md:mt-10">{CAN_DO}</p>
        </div>
      </div>
    </section>
  );
}