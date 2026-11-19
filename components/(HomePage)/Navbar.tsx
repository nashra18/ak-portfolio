"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Theme (globals.css) is the single source for colours and fonts.
   Fonts: font-display (Manrope) and font-logo (Orbitron), both loaded in layout.tsx. */

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

/* Brand icons (filled, 24x24), same as the footer */

const ICONS: Record<string, string> = {
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  GitHub:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  LeetCode:
    "M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z",
};

/* Content: edit here */

const LINKS = [
  { label: "About", id: "about" },
  { label: "Education & Experience", id: "experience" },
  { label: "My Stack", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/meranaamkhann" },
  { label: "GitHub", href: "https://github.com/meranaamkhann" },
  { label: "LeetCode", href: "https://leetcode.com/meranaamkhann" },
];

const EASE = "ease-[cubic-bezier(.22,1,.36,1)]";

/* Contact is the footer: use id="contact" if it exists, otherwise the <footer> tag itself */
const findSection = (id: string) =>
  document.getElementById(id) ?? (id === "contact" ? document.querySelector("footer") : null);

function Socials({ size, tabbable = true }: { size: string; tabbable?: boolean }) {
  return (
    <ul className="flex items-center gap-2">
      {SOCIALS.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            tabIndex={tabbable ? 0 : -1}
            className={`grid ${size} place-items-center rounded-full border border-section-border text-heading transition-[color,border-color,transform] duration-300 [@media(hover:hover)]:hover:-translate-y-0.5 [@media(hover:hover)]:hover:border-accent [@media(hover:hover)]:hover:text-accent motion-reduce:transition-none ${FOCUS}`}
          >
            <svg viewBox="0 0 24 24" className="size-[15px]" fill="currentColor" aria-hidden>
              <path d={ICONS[s.label]} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pill, setPill] = useState({ left: 0, width: 0, show: false });

  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Highlight the section that is in the middle of the screen
  useEffect(() => {
    const map = new Map<Element, string>();
    LINKS.forEach((l) => {
      const el = findSection(l.id);
      if (el) map.set(el, l.id);
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(map.get(e.target) ?? "")),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    map.forEach((_, el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Scroll: hide going down, show going up, bottom = Contact
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;

      setScrolled(y > 8);

      const dy = y - lastY;
      if (y < 80) {
        setHidden(false);
        lastY = y;
      } else if (Math.abs(dy) > 6) {
        setHidden(dy > 0);
        lastY = y;
      }

      // at the very bottom of the page, Contact (the footer) is the active one
      if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) setActive("contact");
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sliding pill behind the active desktop link
  useEffect(() => {
    const measure = () => {
      const el = linkRefs.current[active];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, show: true });
      else setPill((p) => ({ ...p, show: false }));
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  // Menu open: close with Escape, and when the screen grows to desktop
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const go = useCallback((e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    findSection(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }, []);

  const goTop = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
  };

  const away = hidden && !open;

  return (
    <>
      {/* blurs the whole page behind the menu, tap to close (phone and tablet) */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[55] [-webkit-tap-highlight-color:transparent] bg-section-bg/50 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <header
        onFocusCapture={() => setHidden(false)}
        className={`pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center font-display antialiased transition-transform duration-500 ${EASE} [-webkit-tap-highlight-color:transparent] selection:bg-accent selection:text-on-accent motion-reduce:transition-none md:top-5 ${
          away ? "-translate-y-[160%]" : "translate-y-0"
        }`}
      >
        <nav aria-label="Main" className="pointer-events-auto relative w-[90vw] max-w-5xl">
          {/* the thin pill */}
          <div
            className={`relative flex h-12 items-center justify-between rounded-full border pl-5 pr-2 backdrop-blur-md transition-[background-color,border-color] duration-500 md:pl-6 lg:pr-3 ${
              scrolled ? "border-card-border bg-section-bg/90" : "border-section-border bg-section-bg/70"
            }`}
          >
            {/* Logo */}
            <a href="#" onClick={goTop} aria-label="Home" className={`group flex items-center gap-1.5 ${FOCUS}`}>
              <span className="font-logo text-xl font-extrabold leading-none tracking-[0.12em] text-heading">AK</span>
              <span
                className={`mt-1.5 size-1.5 bg-accent transition-transform duration-500 ${EASE} [@media(hover:hover)]:group-hover:rotate-90 motion-reduce:transition-none`}
                aria-hidden
              />
            </a>

            {/* Desktop links, with a pill that slides to the active one */}
            <ul className="relative hidden items-center gap-1 lg:flex">
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 my-auto h-8 rounded-full bg-chip-bg transition-[transform,width,opacity] duration-500 ${EASE} motion-reduce:transition-none ${
                  pill.show ? "opacity-100" : "opacity-0"
                }`}
                style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
              />
              {LINKS.map((l) => (
                <li key={l.id} className="relative">
                  <a
                    ref={(el) => {
                      linkRefs.current[l.id] = el;
                    }}
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`block rounded-full px-4 py-1.5 text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 [@media(hover:hover)]:hover:text-heading ${FOCUS} ${
                      active === l.id ? "text-heading" : "text-muted"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop socials */}
            <div className="hidden lg:block">
              <Socials size="size-8" />
            </div>

            {/* Menu button: phone and tablet only */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`grid size-9 cursor-pointer place-items-center rounded-full text-heading transition-colors duration-300 [@media(hover:hover)]:hover:bg-section-border/60 lg:hidden ${FOCUS}`}
            >
              <span className="relative block h-2 w-4" aria-hidden>
                <span
                  className={`absolute left-0 block h-px w-4 bg-current transition-all duration-300 ${
                    open ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-4 bg-current transition-all duration-300 ${
                    open ? "top-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>

          {/* Menu panel */}
          <div
            id="mobile-menu"
            aria-hidden={!open}
            className={`absolute inset-x-0 top-full mt-2 rounded-[1.75rem] border border-section-border bg-section-bg/95 p-2 backdrop-blur-md transition-[opacity,transform,visibility] duration-300 lg:hidden ${
              open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            }`}
          >
            <ul className="flex flex-col">
              {LINKS.map((l, i) => (
                <li
                  key={l.id}
                  className={`transition-[opacity,transform] duration-500 ${EASE} motion-reduce:transition-none ${
                    open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
                >
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => go(e, l.id)}
                    tabIndex={open ? 0 : -1}
                    aria-current={active === l.id ? "true" : undefined}
                    className={`flex items-center gap-4 rounded-full px-5 py-3 text-base font-semibold tracking-[-0.01em] transition-colors duration-300 [@media(hover:hover)]:hover:bg-section-border/40 ${FOCUS} ${
                      active === l.id ? "text-heading" : "text-subheading"
                    }`}
                  >
                    <span
                      className={`w-5 text-xs tabular-nums transition-colors duration-300 ${
                        active === l.id ? "text-accent" : "text-muted"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    {l.label}
                    <span
                      aria-hidden
                      className={`ml-auto size-1.5 rounded-full bg-accent transition-[opacity,transform] duration-300 ${
                        active === l.id ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div
              className={`px-3 pb-3 pt-5 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: open ? "380ms" : "0ms" }}
            >
              <Socials size="size-10" tabbable={open} />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}