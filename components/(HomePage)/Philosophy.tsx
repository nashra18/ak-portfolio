"use client";

/**
 * Philosophy section, same theme as About. Just one paragraph.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (borders) | Ice Sheet #DFEAF5 (main text)
 * Tangerine #FF895D (accent) | Glacier #A8C8EB (highlights) | Storm #657E9B (quiet text)
 *
 * Type scale (one font, three weights): 800 key words, 600 headline.
 * Motion: the paragraph lights up word by word as it comes into view. Plays once.
 */

import { Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-phil-display",
});

const DISPLAY = "font-[family-name:var(--font-phil-display)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Content: edit here */

const TEXT =
  "I build backend systems with a focus on reliability, security, and simplicity. Every API, every data model, every decision should make the product stronger, so it can grow without becoming harder to maintain.";

/** Key words in Glacier */
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
      className={`${manrope.variable} ${DISPLAY} relative isolate -mt-px flex min-h-[70svh] items-center overflow-clip bg-[#0B111B] px-5 py-28 text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B] md:px-12 lg:px-16`}
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <p
          data-text
          className="max-w-5xl text-[clamp(1.75rem,3.8vw,3.75rem)] font-semibold leading-[1.18] tracking-[-0.035em]"
        >
          {words.map((w, i) => {
            const clean = w.replace(/[^a-zA-Z]/g, "");
            const hi = HI_WORDS.includes(clean);
            return (
              <span
                key={i}
                data-word
                className={`mr-[0.26em] inline-block will-change-transform ${
                  hi ? "font-extrabold text-[#A8C8EB]" : ""
                }`}
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