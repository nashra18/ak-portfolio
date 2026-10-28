"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-skills-display" });
const body = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-skills-body" });
const DISPLAY = "font-[family-name:var(--font-skills-display)]";

/*
  What I know: same theme as Approach and Projects.

  1. Heading: letters rise out of a mask. The intro is scrubbed (each word lights up as you scroll).
  2. Marquee band: two lines of skills slide in opposite directions, driven by your scroll
     (scroll down and they move, stop scrolling and they stop). One line is filled, one is outlined.
  3. Category rows: six calm bars. Hover a row and charcoal fills it from the bottom.

  Palette
  Cream     #F6F7EB  background, text on charcoal
  Charcoal  #393E41  text, band, hover fill
  Vermilion #E94F37  full stop, band dots
*/

const GROUPS: { title: string; items: string[] }[] = [
  { title: "Languages", items: ["Java", "Python", "C++"] },
  { title: "Backend", items: ["Spring Boot", "REST APIs", "Spring Security", "JWT Auth", "MVC Architecture"] },
  { title: "Database", items: ["MySQL", "JPA", "Hibernate"] },
  { title: "AI / Data", items: ["Scikit-learn", "Pandas", "NumPy", "Feature Engineering"] },
  { title: "Core CS", items: ["DSA", "OOP", "Operating Systems", "DBMS"] },
  { title: "Tools", items: ["Git", "GitHub", "Maven", "Postman"] },
];

const ALL = GROUPS.flatMap((g) => g.items);
const ALL_REVERSED = [...ALL].reverse();

const INTRO = "The languages, frameworks and tools I use to build backends, ship them, and make sense of data.";

/* ---------- text splitters ---------- */

const MASK = "-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-top";

function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").flatMap((w, i) => {
        const word = (
          <span key={i} aria-hidden className={`${MASK} whitespace-nowrap`}>
            {Array.from(w).map((c, k) => (
              <span key={k} data-char className="inline-block will-change-transform">
                {c}
              </span>
            ))}
          </span>
        );
        return i ? [" ", word] : [word];
      })}
    </>
  );
}

function ScrubWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden>
          {i ? " " : ""}
          <span data-scrub>{w}</span>
        </span>
      ))}
    </>
  );
}

/* ---------- marquee ---------- */

function Track({ items, outline, id }: { items: string[]; outline?: boolean; id: string }) {
  return (
    <div data-track={id} aria-hidden className="flex w-max items-center whitespace-nowrap will-change-transform">
      {[0, 1].map((k) => (
        <div key={k} className="flex items-center gap-6 pr-6 md:gap-10 md:pr-10">
          {items.map((t) => (
            <span key={`${k}-${t}`} className="flex items-center gap-6 md:gap-10">
              <span
                className={`${DISPLAY} text-[2.75rem] font-bold leading-none tracking-[-0.04em] md:text-7xl xl:text-8xl ${
                  outline ? "text-transparent [-webkit-text-stroke:1.5px_#F6F7EB]" : "text-[#F6F7EB]"
                }`}
              >
                {t}
              </span>
              <span className="h-3 w-3 shrink-0 rounded-full bg-[#E94F37] md:h-4 md:w-4" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- section ---------- */

export function Skills() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);

    const mm = gsap.matchMedia();
    mm.add(
      {
        full: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (mc) => {
        if (mc.conditions?.reduced) return; // everything is visible by default

        const headEl = q("[data-head]")[0];
        const paraEl = q("[data-para]")[0];
        const band = q("[data-band]")[0];

        /* heading */
        gsap.fromTo(
          q("[data-head] [data-char]"),
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.035,
            scrollTrigger: { trigger: headEl, start: "top 95%", once: true },
          }
        );

        /* intro: scrubbed, each word lights up as you scroll */
        gsap.fromTo(
          q("[data-scrub]"),
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: "none",
            duration: 3,
            stagger: 1,
            scrollTrigger: { trigger: paraEl, start: "top 90%", end: "bottom 55%", scrub: 0.6 },
          }
        );

        /* marquee band: opens from the bottom, then both lines slide with the scroll */
        gsap.fromTo(
          band,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: band, start: "top 90%", once: true },
          }
        );
        const slide = { trigger: band, start: "top bottom", end: "bottom top", scrub: 0.8 };
        gsap.fromTo(q('[data-track="a"]'), { xPercent: 0 }, { xPercent: -50, ease: "none", scrollTrigger: slide });
        gsap.fromTo(q('[data-track="b"]'), { xPercent: -50 }, { xPercent: 0, ease: "none", scrollTrigger: slide });

        /* every row */
        q("[data-row]").forEach((row) => {
          const r = gsap.utils.selector(row);
          const chars = r("[data-rtitle] [data-char]");
          const chips = r("[data-chip]");

          gsap.set(row, { clipPath: "inset(100% 0% 0% 0%)" });
          gsap.set(chars, { yPercent: 118 });
          gsap.set(chips, { opacity: 0, scale: 0.8 });

          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
            .to(row, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" }, 0)
            .to(chars, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.03 }, 0.35)
            .to(chips, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(2)", stagger: 0.06 }, 0.6);
        });

        /* fonts change the heading size, so measure the triggers again once they are ready */
        document.fonts?.ready.then(() => ScrollTrigger.refresh());
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="skills"
      aria-label="Tech stack"
      className={`${display.variable} ${body.variable} overflow-hidden bg-[#F6F7EB] px-5 py-16 font-[family-name:var(--font-skills-body)] text-[#393E41] antialiased md:px-12 md:py-28 lg:px-16`}
    >
      {/* heading */}
      <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-12 lg:items-end lg:gap-x-12">
        <h2
          data-head
          aria-label="What I know"
          className={`${DISPLAY} text-[2.75rem] font-bold leading-[0.9] tracking-[-0.055em] md:text-7xl lg:col-span-8 xl:text-[8rem]`}
        >
          <Chars text="What I know" />
          <span className="text-[#E94F37]">.</span>
        </h2>
        <p data-para aria-label={INTRO} className="max-w-[40ch] text-lg font-medium leading-[1.6] md:text-xl lg:col-span-4 lg:pb-3">
          <ScrubWords text={INTRO} />
        </p>
      </div>

      {/* marquee band */}
      <div
        data-band
        className="mb-12 flex flex-col gap-4 overflow-hidden rounded-[28px] bg-[#393E41] py-6 md:mb-16 md:gap-6 md:rounded-[40px] md:py-10"
      >
        <Track id="a" items={ALL} />
        <Track id="b" items={ALL_REVERSED} outline />
      </div>

      {/* category rows */}
      <ul className="flex flex-col gap-3 md:gap-4">
        {GROUPS.map((g) => (
          <li
            key={g.title}
            data-row
            className="group relative overflow-hidden rounded-[24px] bg-[#393E41]/[0.07] md:rounded-[32px]"
          >
            {/* charcoal fills the row from the bottom on hover */}
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 bg-[#393E41] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-y-100"
            />

            <div className="relative grid gap-5 p-6 transition-colors duration-500 group-hover:text-[#F6F7EB] md:p-8 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:px-10 lg:py-9">
              <h3
                data-rtitle
                aria-label={g.title}
                className={`${DISPLAY} text-[2.25rem] font-bold leading-[0.95] tracking-[-0.045em] md:text-5xl lg:col-span-4 xl:text-6xl`}
              >
                <Chars text={g.title} />
              </h3>

              <ul className="flex flex-wrap gap-2 md:gap-3 lg:col-span-8">
                {g.items.map((t) => (
                  <li
                    key={t}
                    data-chip
                    className="rounded-full border border-[#393E41]/40 px-4 py-2 text-[15px] font-semibold transition-colors duration-500 group-hover:border-[#F6F7EB]/50 md:px-5 md:py-2.5 md:text-lg"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;