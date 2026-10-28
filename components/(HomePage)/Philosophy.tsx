
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-philosophy-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-philosophy-body",
});

const DISPLAY = "font-[family-name:var(--font-philosophy-display)]";

function Sparkle({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M20 2C20 12 25 17 38 20C25 23 20 28 20 38C20 28 15 23 2 20C15 17 20 12 20 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function BackendPhilosophy() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const content = section.querySelector("[data-content]");
      const words = gsap.utils.toArray<HTMLElement>(
        "[data-word]",
        section
      );
      const sparkles = gsap.utils.toArray<HTMLElement>(
        "[data-sparkle]",
        section
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(content, {
          autoAlpha: 0,
          y: 55,
        });

        gsap.set(words, {
          autoAlpha: 0,
          y: 22,
        });

        gsap.set(sparkles, {
          autoAlpha: 0,
          scale: 0,
          rotate: -45,
        });

        const entrance = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            end: "center 45%",
            scrub: 0.8,
          },
        });

        entrance
          .to(content, {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
          })
          .to(
            words,
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.12,
              ease: "power2.out",
            },
            0.12
          )
          .to(
            sparkles,
            {
              autoAlpha: 1,
              scale: 1,
              rotate: 0,
              stagger: 0.1,
              ease: "back.out(2)",
            },
            0.28
          );

        gsap.to(sparkles, {
          scale: 0.72,
          rotate: 20,
          autoAlpha: 0.35,
          duration: 1.4,
          stagger: {
            each: 0.22,
            repeat: -1,
            yoyo: true,
          },
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            end: "bottom 35%",
            toggleActions: "play pause resume pause",
          },
        });

        gsap.to(content, {
          autoAlpha: 0,
          y: -38,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "center 35%",
            end: "bottom 15%",
            scrub: 0.8,
          },
        });

        gsap.to(sparkles, {
          autoAlpha: 0,
          scale: 0.2,
          rotate: 35,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "center 30%",
            end: "bottom 15%",
            scrub: 0.8,
          },
        });

        return () => {
          entrance.scrollTrigger?.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([content, ...words], {
          clearProps: "all",
        });
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      aria-labelledby="philosophy-title"
      className={`${display.variable} ${body.variable} relative isolate flex min-h-[85svh] items-center overflow-hidden bg-[#F6F7EB] px-6 py-28 text-[#393E41] md:min-h-screen md:px-16 lg:px-24`}
    >
      {/* Subtle background grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative sparkles */}
      <Sparkle
        className="absolute left-[12%] top-[25%] w-4 text-[#E94F37] md:w-6"
      />

      <Sparkle
        className="absolute right-[14%] top-[30%] w-3 text-[#E94F37] md:w-5"
      />

      <Sparkle
        className="absolute bottom-[25%] right-[23%] w-3 text-[#393E41]/60 md:w-4"
      />

      <Sparkle
        className="absolute bottom-[28%] left-[18%] w-2.5 text-[#E94F37] md:w-4"
      />

      <div
        data-content
        className="mx-auto w-full max-w-6xl"
      >
        {/* Eyebrow */}
        <div className="mb-10 flex items-center gap-3 md:mb-14">
          <span className="h-2 w-2 rounded-full bg-[#E94F37]" />

          <p className="font-[family-name:var(--font-philosophy-body)] text-[10px] font-medium uppercase tracking-[0.24em] text-[#393E41]/65 md:text-xs">
            A philosophy of building
          </p>

          <span className="h-px flex-1 bg-[#393E41]/15" />
        </div>

        <h2
          id="philosophy-title"
          className={`${DISPLAY} max-w-5xl text-[clamp(2.7rem,7.4vw,7rem)] font-semibold leading-[1.06] tracking-[-0.065em]`}
        >
          <span className="block">
            Good systems
          </span>

          <span className="block">
            <span data-word className="inline-block">
              aren't
            </span>{" "}
            <span
              data-word
              className="inline-block text-[#E94F37]"
            >
              noticed.
            </span>
          </span>

          <span className="mt-2 block text-[#393E41]/45">
            They're trusted.
          </span>
        </h2>

        <div className="mt-10 flex flex-col gap-6 border-t border-[#393E41]/20 pt-6 md:mt-14 md:flex-row md:items-end md:justify-between md:pt-8">
          <p className="max-w-lg font-[family-name:var(--font-philosophy-body)] text-sm leading-7 text-[#393E41]/75 md:text-base md:leading-8">
            I build backend systems with a focus on
            reliability, security, and simplicity. Every API,
            every data model, every decision should make the
            product stronger — so it can grow without becoming
            harder to maintain.
          </p>

          <span className={`${DISPLAY} text-sm font-medium tracking-tight text-[#393E41]/60 md:text-base`}>
            Built to work.{" "}
            <span className="text-[#E94F37]">Built to last.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
