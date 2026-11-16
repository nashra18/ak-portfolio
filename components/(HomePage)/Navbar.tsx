"use client";

/**
 * Navbar. Self-contained.
 * Needs: next (next/font), Tailwind.
 *
 * Palette
 * Obsidian #0B111B (bg) | Atlantic #253B56 (borders) | Ice Sheet #DFEAF5 (main text)
 * Tangerine #FF895D (accent) | Glacier #A8C8EB (active link) | Storm #657E9B (quiet text)
 *
 * Logo: "AK" in Orbitron (robotic). Links and the rest: Manrope.
 * Links do not open pages. They scroll to a section on the same page: #about, #experience, #skills, #projects, #contact.
 * Desktop (lg and up): links in the middle, GitHub on the right.
 * Phone and tablet: GitHub icon and a menu icon on the right. The menu opens a full screen list.
 * The active section is highlighted while scrolling.
 */

import { Manrope, Orbitron } from "next/font/google";
import { useCallback, useEffect, useState } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-nav-display",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
  variable: "--font-nav-logo",
});

const DISPLAY = "font-[family-name:var(--font-nav-display)]";
const LOGO = "font-[family-name:var(--font-nav-logo)]";

/* Content: edit here */

const GITHUB = "https://github.com/your-username"; // put your GitHub link here

const LINKS = [
  { label: "About", id: "about" },
  { label: "Education & Experience", id: "experience" },
  { label: "My Stack", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  // Background appears after a little scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section that is in the middle of the screen
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Menu open: lock scroll, close with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // small delay so the scroll lock is released before scrolling
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }, 50);
  }, []);

  const goTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  };

  return (
    <>
      <header
        className={`${manrope.variable} ${orbitron.variable} ${DISPLAY} fixed inset-x-0 top-0 z-[60] antialiased transition-[background-color,border-color,backdrop-filter] duration-300 selection:bg-[#FF895D] selection:text-[#0B111B] ${
          scrolled && !open
            ? "border-b border-[#253B56] bg-[#0B111B]/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-5 md:h-20 md:px-12 lg:px-16"
        >
          {/* Logo */}
          <a
            href="#"
            onClick={goTop}
            aria-label="Home"
            className="group flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D]"
          >
            <span className={`${LOGO} text-[1.6rem] font-extrabold leading-none tracking-[0.12em] text-[#DFEAF5] md:text-3xl`}>
              AK
            </span>
            <span className="mt-2 size-1.5 bg-[#FF895D] md:mt-3 md:size-2" aria-hidden />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 lg:flex xl:gap-11">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 hover:text-[#DFEAF5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D] ${
                    active === l.id ? "text-[#A8C8EB]" : "text-[#657E9B]"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="grid size-10 place-items-center rounded-full border border-[#253B56] text-[#DFEAF5] transition-colors duration-300 hover:border-[#657E9B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D]"
            >
              <GithubIcon />
            </a>

            {/* Menu icon: phone and tablet only */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-[#253B56] text-[#DFEAF5] transition-colors duration-300 hover:border-[#657E9B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D] lg:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden>
                <span
                  className={`absolute left-0 block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] w-5 rounded-full bg-current transition-all duration-300 ${
                    open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu: full screen. A sibling of the header, because backdrop-blur on the header would trap a fixed child. */}
      <div
        id="mobile-menu"
        className={`${manrope.variable} ${DISPLAY} fixed inset-0 z-[55] bg-[#0B111B] antialiased transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="mx-auto flex h-full w-full max-w-[90rem] flex-col justify-between px-5 pb-10 pt-28 md:px-12">
          <ul className="flex flex-col divide-y divide-dashed divide-[#253B56] border-y border-dashed border-[#253B56]">
            {LINKS.map((l, i) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => go(e, l.id)}
                  tabIndex={open ? 0 : -1}
                  className="flex items-baseline gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D]"
                >
                  <span className="text-xs font-semibold tabular-nums text-[#A8C8EB]">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`text-[1.75rem] font-extrabold leading-[1] tracking-[-0.045em] transition-colors duration-300 ${
                      active === l.id ? "text-[#A8C8EB]" : "text-[#DFEAF5]"
                    }`}
                  >
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="flex w-fit items-center gap-2 text-sm font-semibold text-[#657E9B] transition-colors hover:text-[#DFEAF5]"
          >
            <GithubIcon />
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}