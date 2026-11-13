"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Bricolage_Grotesque({ subsets: ["latin"], display: "swap", variable: "--font-hero-display" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap", variable: "--font-hero-serif" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-hero-mono" });

export const VARS = `${display.variable} ${serif.variable} ${mono.variable}`;
export const DISPLAY = "font-[family-name:var(--font-hero-display)]";
export const MONO = "font-[family-name:var(--font-hero-mono)]";
const SERIF = "font-[family-name:var(--font-hero-serif)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";

/*
  Palette
  Frost #F1F6FA | Deep Fjord #18364B | Iced Denim #4F91C9 | Pistachio #A8B85A (accent) | White #FFFFFF

  Notes
  - No loader. The hero plays straight away: ASAD from the left, KHAN from the right, and the grid
    lines grow out from the centre and settle.
  - ASAD and KHAN start a full screen width outside the viewport (110vw), so neither is ever visible
    before it slides in.
  - Phones: the name group (ASAD KHAN, Open to work, role) is lifted up, so the intro, paragraph and buttons get more room.
  - Sizes use min(vw, vh), so the hero fits the screen at any browser zoom, including 110%.
  - The grid is frame-rate independent and pauses when the hero is off screen.
*/

const DENIM = "#4F91C9";
const PISTACHIO = "#A8B85A";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type G = { T: number };

const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------- Spring-mesh grid that blooms out from the centre ---------- */

function GridCanvas({ g }: { g: React.MutableRefObject<G> }) {
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = cv.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let nc = 0;
    let nr = 0;
    let minorA = 0.13;
    let majorA = 0.34;
    let xs: number[] = [];
    let ys: number[] = [];
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let vDelay: number[] = [];
    let vDur: number[] = [];
    let hDelay: number[] = [];
    let hDur: number[] = [];
    let visible = true;

    const build = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const phone = w < 768;
      const cell = phone ? 46 : 40; // bigger cells on phones, so it never feels crowded
      minorA = phone ? 0.08 : 0.12;
      majorA = phone ? 0.24 : 0.3;
      nc = Math.max(2, Math.round(w / cell));
      nr = Math.max(2, Math.round(h / cell));
      xs = Array.from({ length: nc + 1 }, (_, i) => (i * w) / nc);
      ys = Array.from({ length: nr + 1 }, (_, j) => (j * h) / nr);
      const N = (nc + 1) * (nr + 1);
      ox = new Float32Array(N);
      oy = new Float32Array(N);
      vx = new Float32Array(N);
      vy = new Float32Array(N);
      // lines start at the centre and spread outwards
      vDelay = xs.map((_, i) => (Math.abs(i - nc / 2) / (nc / 2)) * 1.1 + rnd(i + 1) * 0.25);
      vDur = xs.map((_, i) => 1.1 + rnd(i + 50) * 0.4);
      hDelay = ys.map((_, j) => 0.15 + (Math.abs(j - nr / 2) / (nr / 2)) * 1.1 + rnd(j + 100) * 0.25);
      hDur = ys.map((_, j) => 1.2 + rnd(j + 150) * 0.4);
    };
    build();

    let lw = w;
    let lh = h;
    const ro = new ResizeObserver(() => {
      const r = host.getBoundingClientRect();
      if (Math.abs(r.width - lw) > 1 || Math.abs(r.height - lh) > 80) {
        build();
        lw = w;
        lh = h;
      }
    });
    ro.observe(host);

    let tx = 0;
    let ty = 0;
    let mx = 0;
    let my = 0;
    let pmx = 0;
    let pmy = 0;
    let cvx = 0;
    let cvy = 0;
    let moved = false;
    let last = -1e9;
    const waves: { x: number; y: number; t: number }[] = [];

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      last = performance.now();
      if (!moved) {
        moved = true;
        mx = pmx = tx;
        my = pmy = ty;
      }
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a")) return;
      const r = host.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    /* physics */
    const integrate = (time: number, dt: number, idle: boolean) => {
      const R = w < 768 ? 150 : 200;
      const LIMIT = 80;
      const gain = idle ? 0.55 : 1;
      const stride = nr + 1;

      for (let i = 0; i <= nc; i++) {
        for (let j = 0; j <= nr; j++) {
          const k = i * stride + j;
          const px = xs[i] + ox[k];
          const py = ys[j] + oy[k];

          if (moved) {
            const dx = px - mx;
            const dy = py - my;
            const d = Math.hypot(dx, dy);
            if (d < R) {
              const f = (1 - d / R) ** 2 * gain;
              vx[k] += (cvx * 0.16 + (dx / (d || 1)) * 0.9) * f * dt;
              vy[k] += (cvy * 0.16 + (dy / (d || 1)) * 0.9) * f * dt;
            }
          }

          vx[k] += Math.sin(time * 0.7 + j * 0.35 + i * 0.12) * 0.012 * dt;
          vy[k] += Math.cos(time * 0.6 + i * 0.3 + j * 0.1) * 0.012 * dt;

          let ax = 0;
          let ay = 0;
          let c = 0;
          if (i > 0) { ax += ox[k - stride]; ay += oy[k - stride]; c++; }
          if (i < nc) { ax += ox[k + stride]; ay += oy[k + stride]; c++; }
          if (j > 0) { ax += ox[k - 1]; ay += oy[k - 1]; c++; }
          if (j < nr) { ax += ox[k + 1]; ay += oy[k + 1]; c++; }
          vx[k] += (-ox[k] * 0.035 + (ax / c - ox[k]) * 0.12) * dt;
          vy[k] += (-oy[k] * 0.035 + (ay / c - oy[k]) * 0.12) * dt;
        }
      }

      for (let n = waves.length - 1; n >= 0; n--) {
        const wv = waves[n];
        wv.t += 0.0167 * dt;
        if (wv.t > 2.8) {
          waves.splice(n, 1);
          continue;
        }
        const front = wv.t * 640;
        const fade = Math.exp(-wv.t * 1.3);
        for (let i = 0; i <= nc; i++) {
          for (let j = 0; j <= nr; j++) {
            const k = i * stride + j;
            const dx = xs[i] + ox[k] - wv.x;
            const dy = ys[j] + oy[k] - wv.y;
            const d = Math.hypot(dx, dy) || 1;
            const e = Math.exp(-(((d - front) / 38) ** 2)) * fade * 2.4 * dt;
            vx[k] += (dx / d) * e;
            vy[k] += (dy / d) * e;
          }
        }
      }

      const damp = Math.pow(0.9, dt);
      for (let k = 0; k < vx.length; k++) {
        vx[k] *= damp;
        vy[k] *= damp;
        ox[k] = Math.max(-LIMIT, Math.min(LIMIT, ox[k] + vx[k] * dt));
        oy[k] = Math.max(-LIMIT, Math.min(LIMIT, oy[k] + vy[k] * dt));
      }
    };

    const step = (time: number, dt: number) => {
      const idle = performance.now() - last > 2200;
      if (idle && g.current.T > 1.5) {
        moved = true;
        tx = w * (0.5 + 0.33 * Math.sin(time * 0.55));
        ty = h * (0.5 + 0.28 * Math.sin(time * 0.77 + 1.3));
      }
      if (moved) {
        const k = 1 - Math.exp(-dt * 0.11);
        mx += (tx - mx) * k;
        my += (ty - my) * k;
        const vk = 1 - Math.exp(-dt * 0.3);
        cvx += ((mx - pmx) / dt - cvx) * vk;
        cvy += ((my - pmy) / dt - cvy) * vk;
      }
      pmx = mx;
      pmy = my;

      const n = Math.max(1, Math.ceil(dt / 0.8));
      const sub = dt / n;
      for (let s = 0; s < n; s++) integrate(time, sub, idle);
    };

    /* drawing */
    const pointAt = (vertical: boolean, line: number, f: number): [number, number] => {
      const n = vertical ? nr : nc;
      const m = Math.min(n - 1, Math.floor(f));
      const t = f - m;
      const at = (q: number): [number, number] => {
        const k = vertical ? line * (nr + 1) + q : q * (nr + 1) + line;
        const i = vertical ? line : q;
        const j = vertical ? q : line;
        return [xs[i] + ox[k], ys[j] + oy[k]];
      };
      const [ax, ay] = at(m);
      const [bx, by] = at(m + 1);
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    };

    const trace = (vertical: boolean, line: number, a: number, b: number) => {
      const n = vertical ? nr : nc;
      const fa = a * n;
      const fb = b * n;
      const pts: number[] = [];
      pts.push(...pointAt(vertical, line, fa));
      for (let m = Math.floor(fa) + 1; m < fb; m++) pts.push(...pointAt(vertical, line, m));
      pts.push(...pointAt(vertical, line, fb));
      ctx.moveTo(pts[0], pts[1]);
      for (let p = 2; p < pts.length - 2; p += 2) {
        ctx.quadraticCurveTo(pts[p], pts[p + 1], (pts[p] + pts[p + 2]) / 2, (pts[p + 1] + pts[p + 3]) / 2);
      }
      ctx.lineTo(pts[pts.length - 2], pts[pts.length - 1]);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = DENIM;
      const { T } = g.current;
      const heads: [number, number][] = [];

      const line = (vertical: boolean, idx: number, delay: number, dur: number) => {
        const raw = clamp01((T - delay) / dur);
        if (raw <= 0) return;
        const p = easeOut(raw);
        const settle = clamp01((T - delay - dur) / 1.2);
        const base = idx % 4 === 0 ? majorA : minorA;
        ctx.globalAlpha = base + 0.4 * (1 - settle);
        ctx.lineWidth = 1 + 0.25 * (1 - settle);
        ctx.beginPath();
        trace(vertical, idx, 0.5 - p / 2, 0.5 + p / 2);
        ctx.stroke();
        if (p < 1) {
          const n = vertical ? nr : nc;
          heads.push(pointAt(vertical, idx, (0.5 - p / 2) * n), pointAt(vertical, idx, (0.5 + p / 2) * n));
        }
      };
      for (let i = 0; i <= nc; i++) line(true, i, vDelay[i], vDur[i]);
      for (let j = 0; j <= nr; j++) line(false, j, hDelay[j], hDur[j]);

      ctx.fillStyle = PISTACHIO;
      ctx.globalAlpha = 0.95;
      heads.forEach(([x, y]) => ctx.fillRect(x - 2.5, y - 2.5, 5, 5));

      // markers light up only where the cloth is moving
      const live = clamp01((T - 1.5) / 1.5);
      if (live > 0) {
        const stride = nr + 1;
        for (let i = 0; i <= nc; i++) {
          for (let j = 0; j <= nr; j++) {
            const k = i * stride + j;
            const disp = Math.hypot(ox[k], oy[k]);
            if (disp < 2) continue;
            const s = Math.min(6, 1 + disp * 0.1);
            ctx.globalAlpha = Math.min(1, disp / 16) * live;
            ctx.fillRect(xs[i] + ox[k] - s / 2, ys[j] + oy[k] - s / 2, s, s);
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (time: number, deltaTime: number) => {
      if (!visible) return;
      const dt = Math.min(3, Math.max(0.2, deltaTime / 16.667));
      if (!reduce) step(time, dt);
      draw();
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [g]);

  return <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}

/* ---------- Buttons: compact pills with the label and the light circle side by side ---------- */

function Btn({ href, children, ghost, download }: { href: string; children: React.ReactNode; ghost?: boolean; download?: boolean }) {
  const base = `${DISPLAY} group inline-flex w-fit items-center gap-3 whitespace-nowrap rounded-full text-sm font-semibold transition-transform duration-500 ${SPRING} hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F91C9] md:text-lg`;
  const icon = `size-3.5 transition-transform duration-500 ${SPRING} md:size-4`;
  return (
    <a
      href={href}
      download={download}
      className={
        ghost
          ? `${base} border border-[#18364B]/50 bg-[#F1F6FA]/60 py-[3px] pl-5 pr-[3px] text-[#18364B] hover:border-[#18364B] md:py-[5px] md:pl-6 md:pr-[5px]`
          : `${base} bg-[#A8B85A] py-1 pl-5 pr-1 text-[#18364B] md:py-[6px] md:pl-6 md:pr-[6px]`
      }
    >
      {children}
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#18364B]/10 text-[#18364B] md:size-10">
        {ghost ? (
          <svg viewBox="0 0 24 24" className={`${icon} group-hover:translate-y-0.5`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className={`${icon} group-hover:translate-x-0.5`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </span>
    </a>
  );
}

/* ---------- Hero ---------- */

export default function Hero3() {
  const root = useRef<HTMLElement>(null);
  const g = useRef<G>({ T: 0 });

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const asad = q("[data-asad]");
      const khan = q("[data-khan]");
      const dot = q("[data-dot]");
      const fade = q("[data-fade]");
      const hint = q("[data-hint]");

      // both words start a full screen width outside the viewport, so they are never visible before they slide in
      gsap.set(asad, { x: "-110vw", opacity: 1 });
      gsap.set(khan, { x: "110vw", opacity: 1 });
      gsap.set(dot, { scale: 0, opacity: 1, transformOrigin: "50% 100%" });
      gsap.set(fade, { opacity: 0, y: 24 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(g.current, { T: 4.4, duration: 4.4, ease: "none" }, 0) // grid blooms out from the centre
        .to(asad, { x: 0, duration: 1.6, ease: "expo.out" }, 0.3)
        .to(khan, { x: 0, duration: 1.6, ease: "expo.out" }, 0.3)
        .to(fade, { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, 0.8)
        .to(dot, { scale: 1, duration: 0.8, ease: "back.out(2)" }, 1.3);

      gsap.to(hint, { y: 8, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // on scroll the two words part in opposite directions
      gsap.to(q("[data-scroll-l]"), {
        xPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.8 },
      });
      gsap.to(q("[data-scroll-r]"), {
        xPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.8 },
      });

      return () => {
        tl.kill();
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      g.current.T = 10;
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      id="top"
      className={`${VARS} ${DISPLAY} relative isolate flex min-h-[100svh] flex-col justify-between gap-10 overflow-clip bg-[#F1F6FA] px-5 pb-10 pt-24 text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B] md:justify-end md:gap-[min(4vw,5vh)] md:px-12 md:pb-12 md:pt-14 lg:px-16`}
    >
      <GridCanvas g={g} />

      {/* Scroll hint on the right edge */}
      <div data-fade className={`absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 md:right-6 md:flex ${HIDDEN}`}>
        <span className="text-sm font-medium text-[#18364B]/70 [writing-mode:vertical-rl]">Scroll to explore</span>
        <span data-hint className="grid size-9 place-items-center rounded-full bg-[#A8B85A] text-[#18364B]">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </span>
      </div>

      {/* Name: ASAD left, KHAN right. On desktop the pair is a little closer than full width.
          On phones the whole name group (ASAD KHAN, Open to work, role) sits near the top, and the intro and buttons sit at the bottom with space between. */}
      <h1
        aria-label="Asad Khan"
        className="relative z-10 flex select-none flex-col gap-2 text-[27vw] font-extrabold leading-[0.82] tracking-[-0.05em] md:gap-0 md:pr-14 md:text-[length:min(17vw,22vh)]"
      >
        <span aria-hidden data-scroll-l className="block self-start">
          <span data-asad className={`block will-change-transform ${HIDDEN}`}>ASAD</span>
        </span>

        <span className="flex flex-col gap-6 md:w-[min(7.2em,100%)] md:flex-row md:items-end md:justify-between">
          <span data-fade className={`order-2 flex flex-col gap-4 text-base font-medium leading-[1.3] tracking-normal md:order-1 md:pb-[1.6vw] md:text-[length:min(1.7vw,2.6vh)] ${HIDDEN}`}>
            <span className="inline-flex w-fit items-center gap-2.5 rounded-full bg-[#18364B] px-4 py-2 text-sm text-[#F1F6FA]">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#A8B85A] opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-[#A8B85A]" />
              </span>
              Open to work
            </span>
            <span>
              Backend developer
              <br />
              <span className="text-[#4F91C9]">and freelancer</span>
            </span>
          </span>

          <span aria-hidden data-scroll-r className="order-1 block self-end md:order-2">
            <span data-khan className={`block will-change-transform ${HIDDEN}`}>
              KHAN<span data-dot className={`ml-[0.04em] inline-block size-[0.12em] rounded-full bg-[#A8B85A] ${HIDDEN}`} />
            </span>
          </span>
        </span>
      </h1>

      {/* Intro and actions */}
      <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12 md:pr-14">
        <div data-fade className={`flex max-w-[34rem] flex-col gap-5 md:gap-4 ${HIDDEN}`}>
          <p className={`${SERIF} text-[2rem] leading-[1.12] tracking-[-0.01em] md:text-[length:min(2.75rem,5.2vh)] md:leading-[1.08]`}>
            I build the <em>part of the product</em> nobody sees, and make sure it never lets anyone down.
          </p>
          <p className="max-w-[44ch] text-base leading-[1.7] text-[#18364B]/75 md:text-lg md:leading-[1.6]">
            Java and Spring Boot services, REST APIs and PostgreSQL schemas that stay fast under load and are easy for the next developer to pick up.
          </p>
        </div>
        <div data-fade className={`flex w-full flex-row flex-wrap gap-4 md:w-auto md:gap-3 ${HIDDEN}`}>
          <Btn href="#projects">View projects</Btn>
          <Btn href="/resume.pdf" download ghost>
            Resume
          </Btn>
        </div>
      </div>
    </header>
  );
}

/* Keep your existing Stats and Testimonials components below this line, unchanged.
   They use VARS, DISPLAY and MONO, which are exported from this file. */