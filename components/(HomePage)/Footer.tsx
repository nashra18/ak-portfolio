"use client";

/**
 * Footer, minimal. 90vw on every screen.
 * Needs: next (next/font), gsap (ScrollTrigger), Tailwind.
 *
 * Palette
 * Frost #F1F6FA | Ink #0F1C26 | Pistachio #A8B85A
 *
 * Only three things: a big email, small links, a bottom line.
 */

import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-ft-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-ft-mono" });

const DISPLAY = "font-[family-name:var(--font-ft-display)]";
const MONO = "font-[family-name:var(--font-ft-mono)]";
const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Brand icons (filled, 24x24) */

const ICONS: Record<string, string> = {
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  GitHub:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  LeetCode:
    "M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z",
};

/* Content: edit here */

const DATA = {
  label: "Open to new opportunities",
  email: "khanasad1907@gmail.com",
  emailHref: "mailto:khanasad1907@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://linkedin.com/in/meranaamkhann" },
    { label: "GitHub", href: "https://github.com/meranaamkhann" },
    { label: "LeetCode", href: "https://leetcode.com/meranaamkhann" },
  ],
  name: "Asad Khan",
  right: "© 2026",
};

/* Footer */

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);

      gsap.fromTo(
        q("[data-in]"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );

      gsap.fromTo(
        q("[data-rule]"),
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

    return () => mm.revert();
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      ref={root}
      className={`${display.variable} ${mono.variable} ${DISPLAY} bg-[#0F1C26] text-[#F1F6FA] antialiased selection:bg-[#A8B85A] selection:text-[#0F1C26]`}
    >
      <div className="mx-auto w-[90vw] pt-20 md:pt-28">
        {/* label */}
        <p data-in className={`${MONO} flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-[#F1F6FA]/50`}>
          <span className="size-1.5 rounded-full bg-[#A8B85A]" />
          {DATA.label}
        </p>

        {/* email */}
        <a
          data-in
          href={DATA.emailHref}
          className="group/mail mt-6 inline-block max-w-full focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#A8B85A] md:mt-8"
        >
          <span className="block break-all text-[clamp(1.75rem,6.5vw,6rem)] font-normal leading-[1.05] tracking-[-0.04em] transition-colors duration-500 group-hover/mail:text-[#A8B85A]">
            {DATA.email}
          </span>
          <span
            className={`mt-3 block h-px origin-left scale-x-0 bg-[#A8B85A] transition-transform duration-700 ${EASE} group-hover/mail:scale-x-100 md:mt-4`}
          />
        </a>

        {/* links */}
        <ul data-in className="mt-12 flex flex-wrap gap-x-8 gap-y-3 md:mt-16 md:gap-x-10">
          {DATA.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-base text-[#F1F6FA]/60 transition-colors duration-300 hover:text-[#A8B85A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8B85A] md:text-lg"
              >
                <svg viewBox="0 0 24 24" className="size-4 shrink-0 md:size-[18px]" fill="currentColor" aria-hidden>
                  <path d={ICONS[l.label]} />
                </svg>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* hairline */}
        <div data-rule className="mt-16 h-px origin-left bg-[#F1F6FA]/15 md:mt-24" />

        {/* bottom row: the only bold thing is the name */}
        <div data-in className="flex items-center justify-between gap-4 py-6 md:py-8">
          <p className="text-sm font-extrabold tracking-[-0.01em] md:text-base">{DATA.name}</p>

          <div className={`${MONO} flex items-center gap-5 text-[11px] text-[#F1F6FA]/45 md:gap-8 md:text-xs`}>
            <span>{DATA.right}</span>
            <button
              onClick={toTop}
              className="cursor-pointer transition-colors duration-300 hover:text-[#A8B85A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A8B85A]"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}