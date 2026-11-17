"use client";

/**
 * Footer. Very clean.
 * Needs: next (next/font), Tailwind. No animation library.
 *
 * Palette
 * Atlantic #253B56 (whole footer bg) | Tangerine #FF895D (email button, on hover only)
 * Ice Sheet #DFEAF5 (headline, email, links) | Glacier #A8C8EB (quiet text, softened)
 * Obsidian #0B111B (text on the button when hovered)
 *
 * Left: headline and one Gmail button (outlined, arrow inside it, fills Tangerine on hover).
 * Right: two short link columns. Bottom: one quiet row.
 * Always at least 80% of the screen height. No dividers, no animation.
 * This is the Contact section: it carries id="contact" for the navbar.
 */

import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
});

/* Content: edit here */

const EMAIL = "khanasad1907@gmail.com";
const SUBJECT = "Let’s build something together";

/** Opens a Gmail compose window with your address filled in */
const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(SUBJECT)}`;

const DATA = {
  headline: "Let’s build something together.",
  navigate: [
    { label: "About", id: "about" },
    { label: "Experience", id: "experience" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Approach", id: "approach" },
  ],
  connect: [
    { label: "LinkedIn", href: "https://linkedin.com/in/meranaamkhann" },
    { label: "GitHub", href: "https://github.com/meranaamkhann" },
    { label: "LeetCode", href: "https://leetcode.com/meranaamkhann" },
  ],
  copyright: "© 2026 Designed and developed by Asad Khan. All rights reserved.",
};

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D]";
const LINK =
  "text-[15px] font-medium text-[#DFEAF5] transition-colors duration-300 [@media(hover:hover)]:hover:text-[#FF895D]";

export default function Footer() {
  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      id="contact"
      className={`${manrope.className} bg-[#253B56] text-[#DFEAF5] antialiased [-webkit-tap-highlight-color:transparent] selection:bg-[#FF895D] selection:text-[#0B111B]`}
    >
      <div className="mx-auto flex min-h-[80svh] w-full max-w-[90rem] flex-col px-5 pt-24 md:px-12 md:pt-32 lg:px-16">
        {/* middle: takes the free space and centres its content */}
        <div className="flex flex-1 flex-col justify-center gap-16 md:flex-row md:items-end md:justify-between md:gap-12">
          {/* left: headline and the Gmail block */}
          <div className="w-full max-w-xl">
            <h2 className="max-w-[14ch] text-[clamp(2rem,4.8vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.045em]">
              {DATA.headline}
            </h2>

            <p className="mt-8 text-sm font-semibold text-[#A8C8EB]/70 md:mt-10">Email me</p>

            <a
              href={GMAIL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Email ${EMAIL} with Gmail`}
              className={`group mt-3 inline-flex max-w-full items-center gap-2.5 rounded-full border border-[#DFEAF5]/35 px-6 py-3.5 text-[#DFEAF5] transition-colors duration-300 [@media(hover:hover)]:hover:border-[#FF895D] [@media(hover:hover)]:hover:bg-[#FF895D] [@media(hover:hover)]:hover:text-[#0B111B] ${FOCUS}`}
            >
              <span className="min-w-0 break-all text-sm font-extrabold tracking-[-0.01em] md:text-base">{EMAIL}</span>
              <svg
                viewBox="0 0 24 24"
                className="size-4 shrink-0 transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-y-0.5 [@media(hover:hover)]:group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M7 17L17 7M8 7h9v9" />
              </svg>
            </a>
          </div>

          {/* right: two short columns */}
          <div className="flex gap-16 md:gap-20">
            <nav aria-label="Footer">
              <h3 className="text-xs font-semibold text-[#A8C8EB]/70 md:text-sm">Navigate</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {DATA.navigate.map((l) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`} onClick={(e) => go(e, l.id)} className={`${LINK} ${FOCUS}`}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h3 className="text-xs font-semibold text-[#A8C8EB]/70 md:text-sm">Connect</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {DATA.connect.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className={`${LINK} ${FOCUS}`}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* bottom row: quiet, always at the bottom */}
        <div className="flex items-end justify-between gap-4 pb-8 pt-20 text-xs font-medium text-[#A8C8EB]/70 md:pb-10 md:text-sm">
          <p className="max-w-[28ch] leading-[1.6] md:max-w-none">{DATA.copyright}</p>
          <button
            type="button"
            onClick={toTop}
            className={`shrink-0 cursor-pointer transition-colors duration-300 [@media(hover:hover)]:hover:text-[#FF895D] ${FOCUS}`}
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}