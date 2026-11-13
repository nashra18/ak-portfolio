"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Anton, Figtree } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const display = Anton({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-hero-display" });
const body = Figtree({ subsets: ["latin"], display: "swap", variable: "--font-hero-body" });
const DISPLAY = "font-[family-name:var(--font-hero-display)]";

/*
  Idea: the hero is a live traffic simulation.
  Thousands of requests stream across the screen. Where the name is, they hit a
  slow zone and pile up, so the name is literally a traffic jam you can read.

  - Move the cursor: it's a rate limiter. Requests it touches turn pink (429).
  - Press / tap: a load spike. Traffic goes 5x faster, the name still holds.
  - On load: the page starts as 503, then 502, then recovers to 200 OK.

  Palette: black, white, one hot pink (#FF2D87).
*/

const PINK = "#FF2D87";

const COPY =
  "Backend developer building fast APIs, secure auth and clean data models in Java and Spring Boot, so the products on top can scale without breaking.";

const STATS = [
  { to: 700, suffix: "+", label: "LeetCode solved" },
  { to: 6, suffix: "+", label: "GitHub projects" },
  { to: 4, suffix: "+", label: "Certifications" },
  { to: 2027, suffix: "", label: "Graduating" },
];

export default function Hero2() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = root.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const statusEl = host.querySelector<HTMLElement>("[data-status]");
    const rateEl = host.querySelector<HTMLElement>("[data-rate]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fam = display.style.fontFamily || "Impact, sans-serif";

    let alive = true;
    let visible = true;
    let w = 0;
    let h = 0;
    let N = 0;
    let mw = 0;
    let mask = new Uint8Array(0);
    let X = new Float32Array(0); // x position
    let Y = new Float32Array(0); // y position
    let Y0 = new Float32Array(0); // home lane
    let V = new Float32Array(0); // base speed
    let S = new Float32Array(0); // current speed
    let VY = new Float32Array(0); // vertical push from the cursor
    let T = new Uint8Array(0); // 0 traffic, 1 inside the name, 2 rate limited

    const sim = { mask: 0, surge: 0 };
    const ptr = { x: -9999, y: -9999, on: false };
    const RING = 90;

    /* ---- the name, rasterised once: this is the "slow zone" ---- */
    const buildMask = () => {
      mw = Math.ceil(w / 2);
      const mh = Math.ceil(h / 2);
      const oc = document.createElement("canvas");
      oc.width = mw;
      oc.height = mh;
      const c = oc.getContext("2d");
      if (!c) return;
      c.scale(0.5, 0.5); // draw in CSS pixels
      c.fillStyle = "#fff";
      c.textAlign = "center";
      c.textBaseline = "alphabetic";

      const mobile = w < 768;
      const lines = mobile ? ["ASAD", "KHAN"] : ["ASAD KHAN"];
      c.font = `100px ${fam}`;
      const widest = Math.max(...lines.map((l) => c.measureText(l).width));
      const size = Math.min((w * 0.9 * 100) / widest, (h * 0.5) / (lines.length * 0.92));
      c.font = `${size}px ${fam}`;

      const cy = h * (mobile ? 0.44 : 0.47);
      lines.forEach((l, i) => {
        const y = cy + (i - (lines.length - 1) / 2) * size * 0.92 + size * 0.36;
        c.fillText(l, w / 2, y);
      });

      const data = c.getImageData(0, 0, mw, mh).data;
      mask = new Uint8Array(mw * mh);
      for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 128 ? 1 : 0;
    };

    const init = () => {
      w = host.clientWidth;
      h = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      N = Math.min(7500, Math.round((w * h) / 170));
      X = new Float32Array(N);
      Y = new Float32Array(N);
      Y0 = new Float32Array(N);
      V = new Float32Array(N);
      S = new Float32Array(N);
      VY = new Float32Array(N);
      T = new Uint8Array(N);
      for (let i = 0; i < N; i++) {
        X[i] = Math.random() * w;
        Y[i] = Y0[i] = Math.random() * h;
        V[i] = 260 + Math.random() ** 2 * 1100;
      }
      buildMask();
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
    };

    /* ---- physics ---- */
    const advance = (dt: number) => {
      const surgeK = 1 + sim.surge * 4;
      const R2 = RING * RING;
      const damp = Math.exp(-dt * 5);
      const lane = Math.min(1, dt * 2.5);
      for (let i = 0; i < N; i++) {
        let x = X[i];
        let y = Y[i];

        const mx = (x * 0.5) | 0;
        const my = (y * 0.5) | 0;
        const inMask = x >= 0 && x < w && y >= 0 && y < h ? mask[my * mw + mx] : 0;
        const inside = inMask * sim.mask;

        const v = V[i] * surgeK * (1 - 0.95 * inside);
        S[i] = v;
        x += v * dt;

        let type = inside > 0.5 ? 1 : 0;

        if (ptr.on) {
          const dx = x - ptr.x;
          const dy = y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.001;
            VY[i] += (dy / d) * (1 - d / RING) * dt * 3500;
            type = 2;
          }
        }

        VY[i] *= damp;
        y += VY[i] * dt;
        y += (Y0[i] - y) * lane;

        if (x > w + 60) {
          x = -Math.random() * 60;
          Y0[i] = Math.random() * h;
          y = Y0[i];
          VY[i] = 0;
        }
        X[i] = x;
        Y[i] = y;
        T[i] = type;
      }
    };

    const render = () => {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, w, h);
      const p0 = new Path2D();
      const p1 = new Path2D();
      const p2 = new Path2D();
      for (let i = 0; i < N; i++) {
        const t = T[i];
        if (t === 1) {
          const len = Math.max(2, S[i] * 0.03);
          p1.rect(X[i] - len, Y[i], len, 2);
        } else if (t === 2) {
          const len = Math.max(2, S[i] * 0.03);
          p2.rect(X[i] - len, Y[i], len, 1.8);
        } else {
          const len = Math.max(1.5, S[i] * 0.035);
          p0.rect(X[i] - len, Y[i], len, 1);
        }
      }
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fill(p0);
      ctx.fillStyle = "#fff";
      ctx.fill(p1);
      ctx.fillStyle = PINK;
      ctx.fill(p2);

      if (ptr.on) {
        ctx.strokeStyle = PINK;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ptr.x, ptr.y, RING, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = PINK;
        ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("429", ptr.x + RING * 0.72, ptr.y - RING * 0.72);
      }
    };

    /* ---- events ---- */
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = true;
    };
    const onLeave = () => (ptr.on = false);
    const onDown = () => gsap.to(sim, { surge: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    const onUp = () => gsap.to(sim, { surge: 0, duration: 1.4, ease: "power3.out", overwrite: "auto" });

    let lastRate = 0;
    const tick = (_time: number, delta: number) => {
      if (!visible || !alive || !N) return;
      advance(Math.min(delta / 1000, 0.05));
      render();
      const now = performance.now();
      if (rateEl && now - lastRate > 120) {
        lastRate = now;
        const base = 12400 + 700 * Math.sin(now / 900) + 300 * Math.sin(now / 230);
        rateEl.textContent = Math.round(base * (1 + sim.surge * 5)).toLocaleString("en-US");
      }
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    let ro: ResizeObserver | null = null;
    let tickerOn = false;

    const start = () => {
      if (!alive) return;
      init();

      if (reduce) {
        sim.mask = 1;
        for (let i = 0; i < 300; i++) advance(0.016);
        render();
        if (statusEl) statusEl.textContent = "200 OK";
        return;
      }

      // intro: flood, then the name resolves out of the traffic
      sim.surge = 1;
      sim.mask = 0;
      if (statusEl) statusEl.textContent = "503";
      gsap.to(sim, { surge: 0, duration: 2.4, delay: 0.2, ease: "power3.out" });
      gsap.to(sim, { mask: 1, duration: 2.6, delay: 0.6, ease: "power2.inOut" });
      gsap.delayedCall(1.0, () => statusEl && (statusEl.textContent = "502"));
      gsap.delayedCall(2.0, () => statusEl && (statusEl.textContent = "200 OK"));

      // counters
      host.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const to = Number(n.dataset.to);
        const o = { v: to > 1000 ? to - 25 : 0 };
        gsap.to(o, {
          v: to,
          duration: 2.2,
          delay: 0.4,
          ease: "expo.out",
          onUpdate: () => (n.textContent = String(Math.round(o.v))),
          onComplete: () => (n.textContent = String(to)),
        });
      });

      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      gsap.ticker.add(tick);
      tickerOn = true;

      let t: ReturnType<typeof setTimeout>;
      ro = new ResizeObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => alive && init(), 150);
      });
      ro.observe(host);
    };

    document.fonts
      .load(`100px ${fam}`)
      .catch(() => undefined)
      .then(start);

    return () => {
      alive = false;
      io.disconnect();
      ro?.disconnect();
      if (tickerOn) gsap.ticker.remove(tick);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf(sim);
    };
  }, []);

  return (
    <header
      ref={root}
      id="top"
      className={`${display.variable} ${body.variable} relative isolate flex min-h-[100svh] flex-col justify-between overflow-clip bg-black font-[family-name:var(--font-hero-body)] text-white antialiased`}
    >
      <canvas ref={canvas} aria-hidden className="absolute inset-0 -z-10 h-full w-full" />
      <h1 className="sr-only">Asad Khan</h1>

      {/* top: numbers + live status */}
      <div className="flex flex-col gap-4 px-5 pt-5 md:flex-row md:items-start md:justify-between md:px-10 md:pt-8">
        <dl className="flex gap-4 md:gap-10">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <dd className={`${DISPLAY} flex text-[1.6rem] leading-none md:text-[2.4rem]`}>
                <span data-count data-to={s.to}>
                  {s.to}
                </span>
                {s.suffix}
              </dd>
              <dt className="text-[10px] leading-tight text-white/60 md:text-sm">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="flex items-baseline gap-4 text-sm md:flex-col md:items-end md:gap-1" aria-hidden>
          <span data-status className={`${DISPLAY} text-[1.6rem] leading-none md:text-[2.4rem]`}>
            200 OK
          </span>
          <span className="text-white/60">
            <span data-rate>12,400</span> req/s
          </span>
        </div>
      </div>

      {/* bottom: copy + actions, on a black fade so traffic never hurts readability */}
      <div className="flex flex-col gap-6 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-5 pt-24 md:flex-row md:items-end md:justify-between md:gap-16 md:px-10 md:pb-8">
        <p className="max-w-[36ch] text-[15px] font-medium leading-snug md:text-lg">{COPY}</p>
        <div className="flex items-center gap-3">
          <a
            href="#projects"
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black outline-offset-4 transition-colors duration-300 hover:bg-[#FF2D87] hover:text-white focus-visible:outline-2 focus-visible:outline-[#FF2D87] md:text-base"
          >
            View projects
          </a>
          <a
            href="/resume.pdf"
            download
            className="px-2 py-3 text-sm font-semibold underline decoration-2 underline-offset-[6px] outline-offset-4 transition-colors hover:text-[#FF2D87] focus-visible:outline-2 focus-visible:outline-[#FF2D87] md:text-base"
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------- Testimonials (placeholders: replace before publishing) ---------- */

const TESTIMONIALS = [
  { quote: "Replace this with a real quote from a client or teammate.", name: "Name", role: "Role, Company" },
  { quote: "Keep it to one or two sentences about the work you delivered.", name: "Name", role: "Role, Company" },
  { quote: "Short, specific and honest reads best.", name: "Name", role: "Role, Company" },
];

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-item]", el),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        }
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="testimonials"
      aria-labelledby="testimonials-title"
      className={`${display.variable} ${body.variable} bg-black px-5 py-16 font-[family-name:var(--font-hero-body)] text-white antialiased md:px-10 md:py-24`}
    >
      <h2 id="testimonials-title" className={`${DISPLAY} text-[clamp(3.5rem,14vw,11rem)] leading-[0.9]`}>
        KIND WORDS<span className="text-[#FF2D87]">.</span>
      </h2>
      <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-10">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} data-item className="flex flex-col gap-6 border-t border-white/30 pt-4">
            <blockquote className="text-xl font-medium leading-snug md:text-2xl">{t.quote}</blockquote>
            <figcaption className="text-sm text-white/60">
              {t.name}, {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}