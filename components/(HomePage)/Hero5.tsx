"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Space_Grotesk, Geist_Mono } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", variable: "--font-hero-display" });
const mono = Geist_Mono({ subsets: ["latin"], display: "swap", variable: "--font-hero-mono" });
const VARS = `${display.variable} ${mono.variable}`;
const DISPLAY = "font-[family-name:var(--font-hero-display)]";
const MONO = "font-[family-name:var(--font-hero-mono)]";
const HIDDEN = "opacity-0 motion-reduce:opacity-100";

/*
  Palette
  Frost #F1F6FA | Deep Fjord #18364B | Iced Denim #4F91C9 | Pistachio #A8B85A | White #FFFFFF

  What changed to make it feel natural
  - Every intro line has its own start time and speed (no robotic stagger), and the
    lines are wiped away the same uneven way.
  - The grid is now a real spring mesh. Each crossing has a position and a velocity.
    Your cursor drags the cloth along with its own speed, it wobbles back, and the
    motion travels to neighbouring crossings. A click sends a shockwave.
  - When you stop, a soft breeze keeps the cloth breathing and a ghost pointer wanders.
  - Pistachio markers light up only where the cloth is actually moving.
  - The letters of the name drift slightly with the pointer, each at its own depth.
*/

const DENIM = "#4F91C9";
const PISTACHIO = "#A8B85A";

type G = { T: number; rest: number };

const rnd = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- Spring-mesh grid ---------- */

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
    let xs: number[] = [];
    let ys: number[] = [];
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    // per-line timings (organic: every line has its own delay and speed)
    let vHead: [number, number][] = [];
    let vTail: [number, number][] = [];
    let hHead: [number, number][] = [];
    let hTail: [number, number][] = [];
    let visible = true;

    const build = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cell = w < 768 ? 30 : 38;
      nc = Math.max(2, Math.round(w / cell));
      nr = Math.max(2, Math.round(h / cell));
      xs = Array.from({ length: nc + 1 }, (_, i) => (i * w) / nc);
      ys = Array.from({ length: nr + 1 }, (_, j) => (j * h) / nr);
      const N = (nc + 1) * (nr + 1);
      ox = new Float32Array(N);
      oy = new Float32Array(N);
      vx = new Float32Array(N);
      vy = new Float32Array(N);
      vHead = xs.map((_, i) => [(i / nc) * 0.8 + rnd(i + 1) * 0.5, 0.9 + rnd(i + 50) * 0.6]);
      vTail = xs.map((_, i) => [2.9 + (i / nc) * 0.6 + rnd(i + 200) * 0.5, 0.9 + rnd(i + 250) * 0.5]);
      hHead = ys.map((_, j) => [0.9 + (j / nr) * 0.7 + rnd(j + 100) * 0.5, 0.9 + rnd(j + 150) * 0.6]);
      hTail = ys.map((_, j) => [3.4 + (j / nr) * 0.6 + rnd(j + 300) * 0.4, 0.9 + rnd(j + 350) * 0.5]);
    };
    build();

    // pointer
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
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", build);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    /* physics */
    const R = 180;
    const step = (time: number, dt: number) => {
      const idle = performance.now() - last > 2200;
      if (idle && g.current.rest > 0.3) {
        moved = true;
        tx = w * (0.5 + 0.33 * Math.sin(time * 0.55));
        ty = h * (0.5 + 0.28 * Math.sin(time * 0.77 + 1.3));
      }
      if (moved) {
        mx += (tx - mx) * 0.1 * dt;
        my += (ty - my) * 0.1 * dt;
      }
      cvx += ((mx - pmx) - cvx) * 0.25;
      cvy += ((my - pmy) - cvy) * 0.25;
      pmx = mx;
      pmy = my;
      const gain = idle ? 0.55 : 1;
      const stride = nr + 1;

      for (let i = 0; i <= nc; i++) {
        for (let j = 0; j <= nr; j++) {
          const k = i * stride + j;
          const px = xs[i] + ox[k];
          const py = ys[j] + oy[k];

          // the cursor drags the cloth along its own velocity, with a soft dimple
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

          // a slow breeze so it never goes fully still
          vx[k] += Math.sin(time * 0.7 + j * 0.35 + i * 0.12) * 0.012 * dt;
          vy[k] += Math.cos(time * 0.6 + i * 0.3 + j * 0.1) * 0.012 * dt;

          // spring home + share motion with neighbours
          let ax = 0;
          let ay = 0;
          let c = 0;
          if (i > 0) { ax += ox[k - stride]; ay += oy[k - stride]; c++; }
          if (i < nc) { ax += ox[k + stride]; ay += oy[k + stride]; c++; }
          if (j > 0) { ax += ox[k - 1]; ay += oy[k - 1]; c++; }
          if (j < nr) { ax += ox[k + 1]; ay += oy[k + 1]; c++; }
          vx[k] += (-ox[k] * 0.04 + (ax / c - ox[k]) * 0.1) * dt;
          vy[k] += (-oy[k] * 0.04 + (ay / c - oy[k]) * 0.1) * dt;
        }
      }

      // shockwaves
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
            const e = Math.exp(-(((d - front) / 34) ** 2)) * fade * 2.4 * dt;
            vx[k] += (dx / d) * e;
            vy[k] += (dy / d) * e;
          }
        }
      }

      const damp = Math.pow(0.9, dt);
      for (let k = 0; k < vx.length; k++) {
        vx[k] *= damp;
        vy[k] *= damp;
        ox[k] = Math.max(-70, Math.min(70, ox[k] + vx[k] * dt));
        oy[k] = Math.max(-70, Math.min(70, oy[k] + vy[k] * dt));
      }
    };

    /* drawing */
    const node = (vertical: boolean, line: number, m: number): [number, number] => {
      const k = vertical ? line * (nr + 1) + m : m * (nr + 1) + line;
      const i = vertical ? line : m;
      const j = vertical ? m : line;
      return [xs[i] + ox[k], ys[j] + oy[k]];
    };

    const trace = (vertical: boolean, line: number, a: number, b: number) => {
      const n = vertical ? nr : nc;
      const fa = a * n;
      const fb = b * n;
      const pts: number[] = [];
      const at = (f: number) => {
        const i0 = Math.min(n - 1, Math.floor(f));
        const t = f - i0;
        const [ax, ay] = node(vertical, line, i0);
        const [bx, by] = node(vertical, line, i0 + 1);
        pts.push(ax + (bx - ax) * t, ay + (by - ay) * t);
      };
      at(fa);
      for (let m = Math.floor(fa) + 1; m < fb; m++) {
        const [x, y] = node(vertical, line, m);
        pts.push(x, y);
      }
      at(fb);
      // smooth through midpoints so displaced lines curve instead of kinking
      ctx.moveTo(pts[0], pts[1]);
      for (let p = 2; p < pts.length - 2; p += 2) {
        ctx.quadraticCurveTo(pts[p], pts[p + 1], (pts[p] + pts[p + 2]) / 2, (pts[p + 1] + pts[p + 3]) / 2);
      }
      ctx.lineTo(pts[pts.length - 2], pts[pts.length - 1]);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const { T, rest } = g.current;

      if (rest > 0.001) {
        ctx.strokeStyle = DENIM;
        ctx.lineWidth = 1;
        for (const major of [false, true]) {
          ctx.globalAlpha = (major ? 0.34 : 0.13) * rest;
          ctx.beginPath();
          for (let i = 0; i <= nc; i++) if ((i % 4 === 0) === major) trace(true, i, 0, 1);
          for (let j = 0; j <= nr; j++) if ((j % 4 === 0) === major) trace(false, j, 0, 1);
          ctx.stroke();
        }

        // markers light up only where the cloth is moving
        ctx.fillStyle = PISTACHIO;
        const stride = nr + 1;
        for (let i = 0; i <= nc; i++) {
          for (let j = 0; j <= nr; j++) {
            const k = i * stride + j;
            const disp = Math.hypot(ox[k], oy[k]);
            if (disp < 2) continue;
            const s = Math.min(6, 1 + disp * 0.1);
            ctx.globalAlpha = Math.min(1, disp / 16) * rest;
            ctx.fillRect(xs[i] + ox[k] - s / 2, ys[j] + oy[k] - s / 2, s, s);
          }
        }
      }

      // intro: each line draws and retracts on its own clock
      if (T > 0 && T < 5.7) {
        ctx.strokeStyle = DENIM;
        ctx.lineWidth = 1.25;
        ctx.globalAlpha = 0.95;
        const heads: [number, number][] = [];
        ctx.beginPath();
        for (let i = 0; i <= nc; i++) {
          const head = ease(clamp01((T - vHead[i][0]) / vHead[i][1]));
          const tail = Math.min(head, ease(clamp01((T - vTail[i][0]) / vTail[i][1])));
          if (head > tail) trace(true, i, tail, head);
          if (head > 0 && head < 1 && tail === 0) heads.push([xs[i], head * h]);
        }
        for (let j = 0; j <= nr; j++) {
          const head = ease(clamp01((T - hHead[j][0]) / hHead[j][1]));
          const tail = Math.min(head, ease(clamp01((T - hTail[j][0]) / hTail[j][1])));
          if (head > tail) trace(false, j, tail, head);
          if (head > 0 && head < 1 && tail === 0) heads.push([head * w, ys[j]]);
        }
        ctx.stroke();
        ctx.fillStyle = PISTACHIO;
        heads.forEach(([x, y]) => ctx.fillRect(x - 2.5, y - 2.5, 5, 5));
      }
      ctx.globalAlpha = 1;
    };

    let prev = 0;
    const tick = (time: number) => {
      if (!visible) return;
      const dt = Math.min(2.5, prev ? (time - prev) / 0.0167 : 1);
      prev = time;
      if (!reduce) step(time, dt);
      draw();
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", build);
    };
  }, [g]);

  return <canvas ref={cv} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}

/* ---------- Name ---------- */

function Word({ t, dot }: { t: string; dot?: boolean }) {
  return (
    <span aria-hidden className="-mx-[0.04em] -my-[0.06em] block overflow-hidden whitespace-nowrap px-[0.04em] py-[0.06em]">
      {Array.from(t).map((c, i) => (
        <span key={i} data-ch className={`inline-block ${HIDDEN}`}>
          {c}
        </span>
      ))}
      {dot && <span data-dot className={`ml-[0.04em] inline-block size-[0.13em] rounded-full bg-[#A8B85A] ${HIDDEN}`} />}
    </span>
  );
}

/* ---------- Buttons ---------- */

function Btn({ href, children, ghost, download }: { href: string; children: React.ReactNode; ghost?: boolean; download?: boolean }) {
  const base = `${DISPLAY} inline-flex items-center gap-3 rounded-full text-lg font-bold transition-transform duration-300 hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4F91C9] md:text-xl`;
  return (
    <a
      href={href}
      download={download}
      className={
        ghost
          ? `${base} border-2 border-[#18364B] bg-[#F1F6FA]/70 px-6 py-3 text-[#18364B]`
          : `${base} bg-[#A8B85A] py-2 pl-6 pr-2 text-[#18364B]`
      }
    >
      {children}
      {!ghost && (
        <span className="grid size-10 place-items-center rounded-full bg-[#18364B] text-[#F1F6FA]">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </a>
  );
}

/* ---------- Hero ---------- */

export default function Hero5() {
  const root = useRef<HTMLElement>(null);
  const g = useRef<G>({ T: 0, rest: 0 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const letters = q("[data-ch]");
      const dot = q("[data-dot]");
      const fade = q("[data-fade]");
      gsap.set(letters, { yPercent: 120, opacity: 1 });
      gsap.set(dot, { scale: 0, opacity: 1, transformOrigin: "50% 100%" });
      gsap.set(fade, { opacity: 0, y: 24 });

      const G = g.current;
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(G, { T: 5.8, duration: 5.8, ease: "none" }, 0) // drives every line's own clock
        .to(letters, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: { each: 0.08, from: "random" } }, 3.5)
        .to(dot, { scale: 1, duration: 0.8, ease: "back.out(2.2)" }, 4.5)
        .to(G, { rest: 1, duration: 1.6, ease: "power2.out" }, 3.9)
        .to(fade, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 }, 4.2);

      // each letter drifts with the pointer at its own depth
      const fine = window.matchMedia("(pointer: fine)").matches;
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (fine) {
        const movers = (letters as HTMLElement[]).map((l, i) => {
          const d = 5 + (i % 4) * 5;
          return { x: gsap.quickTo(l, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(l, "y", { duration: 1.2, ease: "power3.out" }), d };
        });
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.d * 2);
            m.y(ny * m.d);
          });
        };
        window.addEventListener("pointermove", onMove);
      }

      // scroll: the name lifts away a little slower than the page
      gsap.to(q("[data-name]"), {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });

      return () => {
        tl.kill();
        if (onMove) window.removeEventListener("pointermove", onMove);
      };
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      g.current.rest = 1;
    });

    return () => mm.revert();
  }, []);

  return (
    <header
      ref={root}
      id="top"
      className={`${VARS} ${DISPLAY} relative isolate flex h-[100svh] min-h-[560px] flex-col justify-between overflow-clip bg-[#F1F6FA] px-5 pb-6 pt-5 text-[#18364B] antialiased selection:bg-[#A8B85A] selection:text-[#18364B] md:px-12 md:pb-10 lg:px-16`}
    >
      <GridCanvas g={g} />

      <div data-fade className={`${MONO} relative z-10 flex justify-between text-xs md:text-sm ${HIDDEN}`}>
        <span>Backend developer</span>
        <span className="text-[#18364B]/65">Java and Spring Boot</span>
      </div>

      <h1
        data-name
        aria-label="Asad Khan"
        className="relative z-10 flex select-none flex-col text-[33vw] font-bold leading-[0.8] tracking-[-0.05em] md:flex-row md:gap-[0.2em] md:text-[15vw]"
      >
        <Word t="ASAD" />
        <Word t="KHAN" dot />
      </h1>

      <div data-fade className={`relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 ${HIDDEN}`}>
        <div className="flex max-w-[34ch] flex-col gap-3 md:max-w-[38ch]">
          <p className="text-[1.2rem] font-medium leading-[1.3] tracking-[-0.01em] md:text-[1.7rem]">
            I build the part of the internet you never see, so the part you do see never breaks.
          </p>
          <p className={`${MONO} text-xs text-[#18364B]/65`}>Drag your cursor through the grid. Click to send a shockwave.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn href="#projects">View projects</Btn>
          <Btn href="/resume.pdf" download ghost>
            Resume
          </Btn>
        </div>
      </div>
    </header>
  );
}

/* ---------- Stats ---------- */

const STATS = [
  { to: 700, suffix: "+", label: "LeetCode problems solved" },
  { to: 6, suffix: "+", label: "GitHub projects" },
  { to: 4, suffix: "+", label: "Certifications" },
  { to: 2027, suffix: "", label: "Graduating" },
];

export function Stats() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
      counters.forEach((el) => {
        const to = Number(el.dataset.to);
        const o = { v: to > 1000 ? to - 25 : 0 };
        el.textContent = String(o.v);
        gsap.to(o, {
          v: to,
          duration: 2.2,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = String(Math.round(o.v));
          },
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });
      });
      return () => counters.forEach((el) => (el.textContent = el.dataset.to ?? ""));
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className={`${VARS} ${DISPLAY} bg-[#18364B] px-5 py-20 text-[#F1F6FA] antialiased md:px-12 md:py-32 lg:px-16`}>
      <p className="max-w-[22ch] text-3xl font-medium leading-[1.1] tracking-[-0.02em] md:text-5xl">The work adds up.</p>
      <dl className="mt-12 grid grid-cols-2 gap-y-10 md:mt-20 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex min-w-0 flex-col gap-3 border-[#4F91C9]/40 pl-4 md:pl-8 ${i % 2 === 1 ? "border-l" : ""} ${i > 0 ? "md:border-l" : "md:border-l-0 md:pl-0"} ${i === 2 ? "max-md:border-l-0 max-md:pl-0" : ""}`}
          >
            <dd className="flex items-start text-[clamp(3rem,15vw,4.5rem)] font-bold leading-[0.85] tracking-[-0.04em] tabular-nums md:text-[8vw]">
              <span data-count data-to={s.to}>
                {s.to}
              </span>
              {s.suffix && <span className="text-[#A8B85A]">{s.suffix}</span>}
            </dd>
            <dt className={`${MONO} text-xs text-[#F1F6FA]/70 md:text-sm`}>{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ---------- Testimonials (placeholders: replace before publishing) ---------- */

const TESTIMONIALS = [
  { quote: "Replace this with a real quote from a client or teammate.", name: "Name", role: "Role, Company" },
  { quote: "Keep it to one or two sentences about the work you delivered.", name: "Name", role: "Role, Company" },
  { quote: "Short, specific and honest reads best.", name: "Name", role: "Role, Company" },
];

const CARDS = ["bg-[#18364B] text-[#F1F6FA]", "bg-[#4F91C9] text-white", "bg-[#A8B85A] text-[#18364B]"];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-card]", el),
        { opacity: 0, y: 70, rotate: (i: number) => (i % 2 ? 2 : -2) },
        { opacity: 1, y: 0, rotate: 0, duration: 1, ease: "power3.out", stagger: 0.15, scrollTrigger: { trigger: el, start: "top 75%", once: true } }
      );
      gsap.fromTo(
        "[data-title]",
        { xPercent: 6 },
        { xPercent: -6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className={`${VARS} ${DISPLAY} overflow-hidden bg-[#F1F6FA] px-5 py-16 text-[#18364B] antialiased md:px-12 md:py-24 lg:px-16`}
    >
      <h2 id="testimonials-title" data-title className="whitespace-nowrap text-[clamp(4rem,17vw,14rem)] font-bold leading-[0.85] tracking-[-0.05em]">
        Kind words<span className="text-[#A8B85A]">.</span>
      </h2>
      <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-3 md:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} data-card className={`flex flex-col justify-between rounded-3xl p-6 md:min-h-[320px] md:p-8 ${CARDS[i % 3]}`}>
            <span aria-hidden className="text-8xl font-bold leading-[0.7] md:text-9xl">
              “
            </span>
            <blockquote className="mt-3 text-lg leading-[1.45] md:mt-4 md:text-xl">{t.quote}</blockquote>
            <figcaption className={`${MONO} mt-6 text-xs opacity-80 md:mt-8`}>
              {t.name}, {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}