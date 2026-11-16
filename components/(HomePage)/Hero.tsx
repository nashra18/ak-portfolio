"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-hero-display",
});

/* One font only. DISPLAY and MONO point to the same Manrope variable,
   so Stats and Testimonials keep working without changes. */
export const VARS = manrope.variable;
export const DISPLAY = "font-[family-name:var(--font-hero-display)]";
export const MONO = "font-[family-name:var(--font-hero-display)] tabular-nums";

const HIDDEN = "opacity-0 motion-reduce:opacity-100";
const SPRING = "ease-[cubic-bezier(.22,1,.36,1)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/*
  Palette
  Obsidian #0B111B (bg) | Atlantic #253B56 (button border) | Ice Sheet #DFEAF5 (name, title)
  Tangerine #FF895D (accent, grid dots) | Glacier #A8C8EB (grid lines, role, highlight) | Storm #657E9B (quiet)

  Notes
  - Refresh glitch fixes:
    1. ASAD and KHAN are hidden in the markup too (HIDDEN), so the server HTML never flashes them
       before GSAP moves them down.
    2. The idle drift now starts the virtual pointer at its target instead of (0, 0),
       so the mesh no longer gets yanked after about 1.5s.
  - Grid animation logic is unchanged.
*/

const LINE = "#A8C8EB";
const ACCENT = "#FF895D";

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
        tx = w * (0.5 + 0.33 * Math.sin(time * 0.55));
        ty = h * (0.5 + 0.28 * Math.sin(time * 0.77 + 1.3));
        // start the virtual pointer at its target, so the mesh is not yanked from (0, 0)
        if (!moved) {
          moved = true;
          mx = pmx = tx;
          my = pmy = ty;
        }
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
      ctx.strokeStyle = LINE;
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

      ctx.fillStyle = ACCENT;
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

/* ---------- Buttons: icon sits right next to the label ---------- */

function Btn({ href, children, ghost, download }: { href: string; children: React.ReactNode; ghost?: boolean; download?: boolean }) {
  const icon = `size-4 shrink-0 transition-transform duration-500 ${SPRING}`;
  return (
    <a
      href={href}
      download={download}
      className={`group inline-flex h-12 w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-semibold leading-none transition-transform duration-500 ${SPRING} hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF895D] md:h-14 md:px-8 md:text-base ${
        ghost
          ? "border border-[#253B56] bg-[#0B111B]/60 text-[#DFEAF5] hover:border-[#657E9B]"
          : "bg-[#FF895D] text-[#0B111B]"
      }`}
    >
      {children}
      {ghost ? (
        <svg viewBox="0 0 24 24" className={`${icon} group-hover:translate-y-0.5`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className={`${icon} group-hover:translate-x-0.5`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
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
      // opacity: 1 overrides the HIDDEN class, so the words show up only once they are in position below the mask
      gsap.set(q("[data-line]"), { yPercent: 105, opacity: 1 });
      gsap.set(q("[data-fade]"), { opacity: 0, y: 12 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(g.current, { T: 4.4, duration: 4.4, ease: "none" }, 0) // grid blooms out from the centre
        .to(q("[data-line]"), { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.1 }, 0)
        .to(q("[data-fade]"), { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.5);

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
      className={`${VARS} ${DISPLAY} relative isolate flex min-h-[100svh] flex-col justify-between gap-10 overflow-clip bg-[#0B111B] px-5 pb-10 pt-24 text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B] md:justify-end md:gap-[min(4vw,5vh)] md:px-12 md:pb-12 md:pt-14 lg:px-16`}
    >
      <GridCanvas g={g} />

      {/* Name: ASAD left, KHAN right. Role and status sit beside KHAN on desktop. */}
      <h1
        aria-label="Asad Khan"
        className="relative z-10 flex select-none flex-col gap-2 text-[27vw] font-extrabold leading-[0.82] tracking-[-0.05em] md:gap-0 md:pr-14 md:text-[length:min(17vw,22vh)]"
      >
        <span aria-hidden className="block self-start overflow-hidden pb-[0.04em]">
          <span data-line className={`block will-change-transform ${HIDDEN}`}>ASAD</span>
        </span>

        <span className="flex flex-col gap-6 md:w-[min(7.2em,100%)] md:flex-row md:items-end md:justify-between">
          <span
            data-fade
            className={`order-2 flex flex-col gap-3 text-base font-semibold leading-none tracking-normal md:order-1 md:pb-[1.6vw] md:text-[length:min(1.7vw,2.6vh)] ${HIDDEN}`}
          >
            <span className="whitespace-nowrap text-[#A8C8EB]">
              Backend developer <span className="text-[#657E9B]">and freelancer</span>
            </span>
            <span className="inline-flex items-center gap-2 text-[0.8em] font-medium text-[#657E9B]">
              <span aria-hidden className="size-1.5 rounded-full bg-[#FF895D]" />
              Open to work
            </span>
          </span>

          <span aria-hidden className="order-1 block self-end overflow-hidden pb-[0.04em] md:order-2">
            <span data-line className={`block will-change-transform ${HIDDEN}`}>KHAN</span>
          </span>
        </span>
      </h1>

      {/* Title and actions */}
      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12 md:pr-14">
        <p
          data-fade
          className={`max-w-[24ch] text-[length:clamp(1.6rem,7vw,2.1rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-[#DFEAF5] md:max-w-[28ch] md:text-[length:min(2.9vw,5vh)] md:leading-[1.1] ${HIDDEN}`}
        >
          I build the <span className="text-[#A8C8EB]">part of the product</span> nobody sees, and make sure it never lets anyone down.
        </p>

        <div data-fade className={`flex flex-row flex-wrap gap-3 ${HIDDEN}`}>
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