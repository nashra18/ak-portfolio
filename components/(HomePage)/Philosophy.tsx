"use client";

/**
 * Philosophy section, built on the About theme. Just one paragraph.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Frost #F1F6FA | Deep Fjord #18364B | Iced Denim #4F91C9
 *
 * Scroll moment (plays once)
 * The paragraph lights up word by word as it comes into view.
 */

import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-phil-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--font-phil-serif" });

const DISPLAY = "font-[family-name:var(--font-phil-display)]";
const SERIF = "font-[family-name:var(--font-phil-serif)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

const TEXT =
  "I build backend systems with a focus on reliability, security, and simplicity. Every API, every data model, every decision should make the product stronger, so it can grow without becoming harder to maintain.";

/** Important words in Iced Denim */
const HI_WORDS = ["reliability", "security", "simplicity"];

export default function BackendPhilosophy() {
  const root = useRef<HTMLElement>(null);
  const words = TEXT.split(" ");

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);

      gsap.fromTo(
        q("[data-word]"),
        { opacity: 0.14, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: q("[data-text]")[0], start: "top 80%", once: true },
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className={`${display.variable} ${serif.variable} ${DISPLAY} relative isolate flex min-h-[70svh] items-center overflow-clip bg-[#F1F6FA] px-5 py-28 text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B] md:px-12 lg:px-16`}
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <p
          data-text
          className="max-w-5xl text-[clamp(1.75rem,3.8vw,3.75rem)] font-semibold leading-[1.22] tracking-[-0.03em]"
        >
          {words.map((w, i) => {
            const clean = w.replace(/[^a-zA-Z]/g, "");
            const hi = HI_WORDS.includes(clean);
            return (
              <span
                key={i}
                data-word
                className={`mr-[0.26em] inline-block will-change-transform ${hi ? `${SERIF} font-normal italic text-[#4F91C9]` : ""}`}
              >
                {w}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}