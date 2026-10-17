"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
  A pentagram inside a ring: five entry points joined by chords.
  Each chord crosses its neighbour at an inner node (a service).
  A request enters at the edge, runs along a chord to a service, reaches the core,
  then retracts as the response. Dots drift along chords, a dashed ring turns,
  and one small worker orbits the core.

  Motion: always on (the request, drifting dots and worker are slow and small).
  With "reduce motion" enabled in the OS, the intro, the pulse and the ring rotation are skipped.
*/

const INK = "#f4f1ea";
const BG = "#0a0a0a";
const LINE = "#34332f";
const ACCENT = "#f04427";
const HAIR = 0.8;

const C = { x: 200, y: 200 };
const CORE_R = 38;
const ORBIT_R = 118;
const ENTRY_R = 170;
const DASH_R = 188;

type Pt = { x: number; y: number };
const rad = (d: number) => (d * Math.PI) / 180;
const polar = (r: number, deg: number): Pt => ({
  x: C.x + r * Math.cos(rad(deg)),
  y: C.y + r * Math.sin(rad(deg)),
});
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);
const f = (n: number) => n.toFixed(2);

function intersect(p1: Pt, p2: Pt, p3: Pt, p4: Pt): Pt {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  const a = p1.x * p2.y - p1.y * p2.x;
  const b = p3.x * p4.y - p3.y * p4.x;
  return {
    x: (a * (p3.x - p4.x) - (p1.x - p2.x) * b) / d,
    y: (a * (p3.y - p4.y) - (p1.y - p2.y) * b) / d,
  };
}

const IDX = [0, 1, 2, 3, 4];
const E = IDX.map((k) => polar(ENTRY_R, 270 + 72 * k));
const CHORDS = IDX.map((k) => ({ a: E[k], b: E[(k + 2) % 5] }));
const P = IDX.map((k) => intersect(E[k], E[(k + 2) % 5], E[(k + 1) % 5], E[(k + 3) % 5]));

const DOTS = [
  { c: 0, t0: 0.15, t1: 0.85, dur: 9 },
  { c: 2, t0: 0.8, t1: 0.2, dur: 12 },
  { c: 3, t0: 0.3, t1: 0.9, dur: 10 },
];
const dotPoint = (i: number, t: number): Pt => {
  const ch = CHORDS[DOTS[i].c];
  return { x: ch.a.x + (ch.b.x - ch.a.x) * t, y: ch.a.y + (ch.b.y - ch.a.y) * t };
};

const ROUTE_ORDER = [0, 2, 4, 1, 3];

function route(k: number, u: number) {
  const L1 = dist(E[k], P[k]);
  const L2 = dist(P[k], C);
  const d = u * (L1 + L2);
  const pts: Pt[] = [E[k]];
  let p: Pt;
  if (d <= L1) {
    const t = d / L1;
    p = { x: E[k].x + (P[k].x - E[k].x) * t, y: E[k].y + (P[k].y - E[k].y) * t };
  } else {
    pts.push(P[k]);
    const t = (d - L1) / L2;
    p = { x: P[k].x + (C.x - P[k].x) * t, y: P[k].y + (C.y - P[k].y) * t };
  }
  pts.push(p);
  return {
    p,
    points: pts.map((q) => `${f(q.x)},${f(q.y)}`).join(" "),
    atService: u > 0 && d >= L1 - 0.3,
  };
}

const REST = { k: 0, u: 1 };

export default function GeometrySlice() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const q = (id: string) => svg.querySelector<SVGElement>(`[data-id="${id}"]`)!;
    const trail = q("trail");
    const head = q("head");
    const worker = q("worker");
    const pulse = q("pulse");
    const core = q("core");
    const dashed = q("dashed");
    const entries = Array.from(svg.querySelectorAll<SVGElement>("[data-entry]"));
    const services = Array.from(svg.querySelectorAll<SVGElement>("[data-svc]"));
    const dots = Array.from(svg.querySelectorAll<SVGElement>("[data-dot]"));
    const draws = Array.from(svg.querySelectorAll<SVGElement>("[data-draw]"));
    const pops = Array.from(svg.querySelectorAll<SVGElement>("[data-pop]"));

    const state = { k: REST.k, u: REST.u, w: 40 };
    const dotT = DOTS.map((d) => ({ t: d.t0 }));

    const render = () => {
      const r = route(state.k, state.u);
      const show = state.u > 0.002 ? "1" : "0";
      trail.setAttribute("points", r.points);
      trail.setAttribute("opacity", show);
      head.setAttribute("cx", f(r.p.x));
      head.setAttribute("cy", f(r.p.y));
      head.setAttribute("opacity", show);
      entries.forEach((el, i) => el.setAttribute("fill", i === state.k && state.u > 0.002 ? INK : BG));
      services.forEach((el, i) => el.setAttribute("fill", i === state.k && r.atService ? INK : BG));
      const w = polar(ORBIT_R, state.w);
      worker.setAttribute("cx", f(w.x));
      worker.setAttribute("cy", f(w.y));
      dots.forEach((el, i) => {
        const p = dotPoint(i, dotT[i].t);
        el.setAttribute("cx", f(p.x));
        el.setAttribute("cy", f(p.y));
      });
    };

    const mm = gsap.matchMedia();
    const origin = `${C.x} ${C.y}`;

    mm.add(
      {
        full: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const reduced = Boolean(ctx.conditions?.reduced);
        let step = 0;

        state.k = ROUTE_ORDER[0];
        state.u = 0;
        render();
        gsap.ticker.add(render);

        // intro on page load
        if (!reduced) {
          gsap.fromTo(draws, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.1 });
          gsap.fromTo(pops, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.04, delay: 0.7 });
          gsap.fromTo(core, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.2, ease: "expo.out", delay: 0.4 });
          gsap.to(dashed, { rotation: 360, svgOrigin: origin, duration: 70, ease: "none", repeat: -1 });
        }

        // dots drift on chords, worker orbits the core
        DOTS.forEach((d, i) => {
          gsap.to(dotT[i], { t: d.t1, duration: d.dur, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });
        gsap.to(state, { w: state.w + 360, duration: 40, ease: "none", repeat: -1 });

        // request -> service -> core -> response
        const tl = gsap.timeline({
          delay: reduced ? 0.5 : 2.2,
          repeat: -1,
          onRepeat: () => {
            step = (step + 1) % ROUTE_ORDER.length;
            state.k = ROUTE_ORDER[step];
          },
        });
        tl.to(state, { u: 1, duration: 2.4, ease: "power2.inOut" });
        if (!reduced) {
          tl.fromTo(
            pulse,
            { attr: { r: CORE_R }, opacity: 0.9 },
            { attr: { r: CORE_R + 42 }, opacity: 0, duration: 1.6, ease: "power2.out" },
            ">-0.1"
          );
        }
        tl.to(state, { u: 0, duration: 1.9, ease: "power2.inOut" }, "+=0.7").to({}, { duration: 1.2 });

        return () => gsap.ticker.remove(render);
      }
    );

    return () => mm.revert();
  }, []);

  const rest = route(REST.k, REST.u);
  const w0 = polar(ORBIT_R, 40);

  return (
    <div
      aria-hidden
      className="pointer-events-none aspect-square w-[min(84vw,400px)] sm:w-[min(62vw,460px)] lg:h-full lg:max-h-[640px] lg:w-auto lg:max-w-full"
    >
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" className="h-full w-full" fill="none" ref={svgRef}>
        {/* guide rings */}
        <circle data-draw cx={C.x} cy={C.y} r={ENTRY_R} pathLength={1} strokeDasharray="1" stroke={LINE} strokeWidth={HAIR} />
        <circle data-draw cx={C.x} cy={C.y} r={ORBIT_R} pathLength={1} strokeDasharray="1" stroke={LINE} strokeWidth={HAIR} />
        <circle data-id="dashed" cx={C.x} cy={C.y} r={DASH_R} stroke={INK} strokeOpacity="0.45" strokeWidth={HAIR} strokeDasharray="1.2 5.5" />

        {/* pentagram chords */}
        {CHORDS.map((c, i) => (
          <line key={`chord-${i}`} data-draw x1={c.a.x} y1={c.a.y} x2={c.b.x} y2={c.b.y} pathLength={1} strokeDasharray="1" stroke={LINE} strokeWidth={HAIR} />
        ))}

        {/* core: solid half above, outline below */}
        <path data-id="core" d={`M${C.x - CORE_R} ${C.y} A${CORE_R} ${CORE_R} 0 0 1 ${C.x + CORE_R} ${C.y} Z`} fill={ACCENT} />
        <path d={`M${C.x - CORE_R} ${C.y} A${CORE_R} ${CORE_R} 0 0 0 ${C.x + CORE_R} ${C.y}`} stroke={INK} strokeWidth={HAIR + 0.2} />
        <circle data-id="pulse" cx={C.x} cy={C.y} r={CORE_R} stroke={ACCENT} strokeWidth="1" opacity="0" />

        {/* services (inner crossings) and entries (ring points) */}
        {P.map((p, i) => (
          <circle key={`svc-${i}`} data-pop data-svc={i} cx={p.x} cy={p.y} r="3.2" fill={BG} stroke={INK} strokeWidth="1" />
        ))}
        {E.map((p, i) => (
          <circle key={`entry-${i}`} data-pop data-entry={i} cx={p.x} cy={p.y} r="4.5" fill={BG} stroke={INK} strokeWidth="1" />
        ))}

        {/* worker + drifting dots */}
        <circle data-id="worker" cx={w0.x} cy={w0.y} r="2.8" fill={INK} />
        {DOTS.map((d, i) => {
          const p = dotPoint(i, d.t0);
          return <circle key={`dot-${i}`} data-dot={i} cx={p.x} cy={p.y} r="2.4" fill={INK} />;
        })}

        {/* the request */}
        <polyline data-id="trail" points={rest.points} stroke={ACCENT} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
        <circle data-id="head" cx={rest.p.x} cy={rest.p.y} r="3.4" fill={ACCENT} />
      </svg>
    </div>
  );
}