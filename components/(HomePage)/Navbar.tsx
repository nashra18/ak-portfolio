"use client";

import { useEffect, useState } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-nav-display" });
const body = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-nav-body" });
const DISPLAY = "font-[family-name:var(--font-nav-display)]";

/*
  Palette (same as the Approach section and the footer)
  Cream    #F6F7EB  text, icons
  Charcoal #393E41  menu panel, icons on the buttons
  Coral    #FF6B54  buttons
  Coral    #FF8A75  hover on the dark panel
*/

type IconProps = React.SVGProps<SVGSVGElement>;

const GitHubIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

const EMAIL = "khanasad1907@gmail.com";
const GITHUB = "https://github.com/meranaamkhann";

const BTN =
  "relative flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B54] text-[#393E41] transition-colors duration-300 hover:bg-[#F6F7EB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Escape closes the menu, and the page behind it does not scroll while it is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`${display.variable} ${body.variable} font-[family-name:var(--font-nav-body)] antialiased`}>
      {/* bar: menu on the left, GitHub on the right */}
      <div className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-5 py-5 md:px-12 md:py-6 lg:px-16">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
          className={`${BTN} ${open ? "focus-visible:outline-[#F6F7EB]" : "focus-visible:outline-[#393E41]"}`}
        >
          <span
            aria-hidden
            className={`absolute h-[1.8px] w-5 rounded-full bg-current transition-transform duration-500 motion-reduce:transition-none ${
              open ? "rotate-45" : "-translate-y-[4px]"
            }`}
          />
          <span
            aria-hidden
            className={`absolute h-[1.8px] w-5 rounded-full bg-current transition-transform duration-500 motion-reduce:transition-none ${
              open ? "-rotate-45" : "translate-y-[4px]"
            }`}
          />
        </button>

        <a
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={`${BTN} ${open ? "focus-visible:outline-[#F6F7EB]" : "focus-visible:outline-[#393E41]"}`}
        >
          <GitHubIcon aria-hidden="true" className="h-5 w-5" />
        </a>
      </div>

      {/* menu: drops from the top, blurred */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`fixed inset-0 z-50 h-[100svh] overflow-y-auto overscroll-contain bg-[#393E41]/90 backdrop-blur-2xl transition-[transform,visibility] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none ${
          open ? "visible translate-y-0" : "invisible -translate-y-full"
        }`}
      >
        <div className="mx-auto flex h-full min-h-0 max-w-[1400px] flex-col justify-between px-5 pb-[4svh] pt-[14svh] text-[#F6F7EB] md:px-12 lg:px-16">
          <nav aria-label="Primary">
            <ul className="border-t border-[#F6F7EB]/30">
              {NAV.map(({ label, href }, i) => (
                <li
                  key={label}
                  style={{ transitionDelay: open ? `${300 + i * 70}ms` : "0ms" }}
                  className={`border-b border-[#F6F7EB]/30 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  <a
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`${DISPLAY} block py-[1.2svh] text-[clamp(1.75rem,7svh,4.25rem)] font-bold leading-[1] tracking-[-0.05em] transition-colors duration-300 hover:text-[#FF8A75] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#FF8A75] motion-reduce:transition-none`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div
            style={{ transitionDelay: open ? "700ms" : "0ms" }}
            className={`mt-[3svh] transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <p className="text-sm text-[#F6F7EB]/80">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              className={`${DISPLAY} mt-1 inline-block break-all text-lg font-semibold tracking-[-0.03em] transition-colors duration-300 hover:text-[#FF8A75] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF8A75] motion-reduce:transition-none md:text-2xl`}
            >
              {EMAIL}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}