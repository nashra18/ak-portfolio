"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
  Request lifecycle as geometry (compact version).

  - Request: gateway -> one of six services -> data core, then retracts as the response.
  - Scattered lines with dots drifting along them: other traffic in the system.
  - Dashed ring and a ring of dots rotate slowly: background processes.
*/

// Set to false to preview the motion even if your OS has "reduce animations" turned on.
const RESPECT_REDUCED_MOTION = true;

const C = { x: 620, y: 520 };
const CORE_R = 80;
const WORKER_R = 130;
const SVC_R = 190;
const GATE_R = 300;
const OUT_R = 400;

const rad = (d: number) => (d * Math.PI) / 180;
const polar = (r: number, deg: number) => ({
  x: C.x + r * Math.cos(rad(deg)),
  y: C.y + r * Math.sin(rad(deg)),
});
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(b.x - a.x, b.y - a.y);
const f = (n: number) => n.toFixed(1);

const ANGLES = [-160, -100, -40, 20, 80, 140];
const S = ANGLES.map((a) => polar(SVC_R, a));
const G = polar(GATE_R, 160);
const G_OUT = { x: G.x - 420 * 0.94, y: G.y + 420 * 0.34 };
const ROUTE_ORDER = [3, 1, 4, 0, 5, 2];

// Scattered lines, each with a dot that drifts along it.
const LINES = [
  { a: [120, 300], b: [920, 130], t0: 0.2, t1: 0.85, dur: 14 },
  { a: [260, 940], b: [1000, 430], t0: 0.8, t1: 0.25, dur: 17 },
  { a: [430, 40], b: [790, 990], t0: 0.15, t1: 0.7, dur: 19, accent: true },
  { a: [-60, 660], b: [720, 740], t0: 0.6, t1: 0.2, dur: 12 },
  { a: [560, -40], b: [1050, 650], t0: 0.3, t1: 0.9, dur: 16 },
  { a: [180, 570], b: [1010, 900], t0: 0.75, t1: 0.3, dur: 21 },
];
const lerp = (l: (typeof LINES)[number], t: number) => ({
  x: l.a[0] + (l.b[0] - l.a[0]) * t,
  y: l.a[1] + (l.b[1] - l.a[1]) * t,
});

const RING_DOTS = [30, 150, 265];

function route(k: number, u: number) {
  const L1 = dist(G, S[k]);
  const L2 = dist(S[k], C);
  const d = u * (L1 + L2);
  const pts = [G];
  let p: { x: number; y: number };
  if (d <= L1) {
    const t = d / L1;
    p = { x: G.x + (S[k].x - G.x) * t, y: G.y + (S[k].y - G.y) * t };
  } else {
    pts.push(S[k]);
    const t = (d - L1) / L2;
    p = { x: S[k].x + (C.x - S[k].x) * t, y: S[k].y + (C.y - S[k].y) * t };
  }
  pts.push(p);
  return {
    p,
    points: pts.map((q) => `${f(q.x)},${f(q.y)}`).join(" "),
    atService: u > 0 && d >= L1 - 0.5,
  };
}

const ns = { vectorEffect: "non-scaling-stroke" } as const;
const REST = { k: 3, u: 1 };

export default function GeometrySlice() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const q = (id: string) => svg.querySelector<SVGElement>(`[data-id="${id}"]`)!;
    const trail = q("trail");
    const packet = q("packet");
    const worker = q("worker");
    const tether = q("tether");
    const pulse = q("pulse");
    const ringDashed = q("ring-dashed");
    const ringDots = q("ring-dots");
    const services = Array.from(svg.querySelectorAll<SVGElement>("[data-svc]"));
    const dots = Array.from(svg.querySelectorAll<SVGElement>("[data-dot]"));

    const state = { k: REST.k, u: REST.u, w: 40 };
    const dotT = LINES.map((l) => ({ t: l.t0 }));

    const render = () => {
      const r = route(state.k, state.u);
      const visible = state.u > 0.002 ? "1" : "0";
      trail.setAttribute("points", r.points);
      trail.setAttribute("opacity", visible);
      packet.setAttribute("cx", f(r.p.x));
      packet.setAttribute("cy", f(r.p.y));
      packet.setAttribute("opacity", visible);
      services.forEach((el, i) => {
        const on = i === state.k && r.atService;
        el.setAttribute("fill", on ? "#f04427" : "#faf9f6");
        el.setAttribute("stroke", on ? "#f04427" : "#171717");
      });
      const w = polar(WORKER_R, state.w);
      worker.setAttribute("cx", f(w.x));
      worker.setAttribute("cy", f(w.y));
      tether.setAttribute("x2", f(w.x));
      tether.setAttribute("y2", f(w.y));
      dots.forEach((el, i) => {
        const p = lerp(LINES[i], dotT[i].t);
        el.setAttribute("cx", f(p.x));
        el.setAttribute("cy", f(p.y));
      });
    };

    const mm = gsap.matchMedia();
    const origin = `${C.x} ${C.y}`;

    mm.add(RESPECT_REDUCED_MOTION ? "(prefers-reduced-motion: no-preference)" : "all", () => {
      let step = 0;
      state.k = ROUTE_ORDER[0];
      state.u = 0;
      render();

      // one render per frame, driven by the ticker
      gsap.ticker.add(render);

      // scattered dots drift along their lines
      LINES.forEach((l, i) => {
        gsap.to(dotT[i], { t: l.t1, duration: l.dur, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });

      // slow rotation: dashed ring one way, ring of dots the other, worker orbits the core
      gsap.to(ringDashed, { rotation: 360, svgOrigin: origin, duration: 70, ease: "none", repeat: -1 });
      gsap.to(ringDots, { rotation: -360, svgOrigin: origin, duration: 110, ease: "none", repeat: -1 });
      gsap.to(state, { w: state.w + 360, duration: 48, ease: "none", repeat: -1 });

      // request -> service -> core -> response
      const tl = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          step = (step + 1) % ROUTE_ORDER.length;
          state.k = ROUTE_ORDER[step];
        },
      });
      tl.to(state, { u: 1, duration: 3.2, ease: "power2.inOut" })
        .fromTo(
          pulse,
          { attr: { r: CORE_R }, opacity: 0.9 },
          { attr: { r: CORE_R + 55 }, opacity: 0, duration: 1.6, ease: "power2.out" },
          ">-0.1"
        )
        .to(state, { u: 0, duration: 2.4, ease: "power2.inOut" }, "+=0.8")
        .to({}, { duration: 1.2 });

      return () => gsap.ticker.remove(render);
    });

    mm.add(RESPECT_REDUCED_MOTION ? "(prefers-reduced-motion: reduce)" : "(max-width: 0px)", () => {
      render();
    });

    return () => mm.revert();
  }, []);

  const rest = route(REST.k, REST.u);
  const w0 = polar(WORKER_R, 40);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 right-0 h-[52svh] w-full [clip-path:polygon(0_100%,100%_16%,100%_100%)] lg:top-0 lg:h-full lg:w-[62%] lg:[clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        fill="none"
      >
        {/* structure */}
        <g stroke="#d8d4ce" strokeWidth="1">
          {[WORKER_R, SVC_R, GATE_R].map((r) => (
            <circle key={r} cx={C.x} cy={C.y} r={r} {...ns} />
          ))}
          <line x1="-200" y1={C.y} x2="1400" y2={C.y} {...ns} />
          <line x1={C.x} y1="-200" x2={C.x} y2="1200" {...ns} />
          {S.map((p, i) => (
            <line key={`spoke-${i}`} x1={C.x} y1={C.y} x2={p.x} y2={p.y} {...ns} />
          ))}
          {/* scattered lines */}
          {LINES.map((l, i) => (
            <line key={`line-${i}`} x1={l.a[0]} y1={l.a[1]} x2={l.b[0]} y2={l.b[1]} {...ns} />
          ))}
        </g>

        {/* rotating circle lines */}
        <circle data-id="ring-dashed" cx={C.x} cy={C.y} r={OUT_R} stroke="#171717" strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 9" {...ns} />
        <g data-id="ring-dots">
          <circle cx={C.x} cy={C.y} r={OUT_R + 70} stroke="#d8d4ce" strokeWidth="1" {...ns} />
          {RING_DOTS.map((a) => {
            const p = polar(OUT_R + 70, a);
            return <circle key={a} cx={p.x} cy={p.y} r="4" fill="#171717" />;
          })}
        </g>

        {/* incoming request, running off the crop */}
        <line x1={G_OUT.x} y1={G_OUT.y} x2={G.x} y2={G.y} stroke="#171717" strokeWidth="1.25" {...ns} />

        {/* data core */}
        <path d={`M${C.x - CORE_R} ${C.y} A${CORE_R} ${CORE_R} 0 0 1 ${C.x + CORE_R} ${C.y} Z`} fill="#171717" />
        <circle cx={C.x} cy={C.y} r={CORE_R} stroke="#171717" strokeWidth="1.25" {...ns} />
        <circle data-id="pulse" cx={C.x} cy={C.y} r={CORE_R} stroke="#f04427" strokeWidth="1.5" opacity="0" {...ns} />

        {/* gateway */}
        <circle cx={G.x} cy={G.y} r="10" fill="#faf9f6" stroke="#171717" strokeWidth="1.5" {...ns} />
        <circle cx={G.x} cy={G.y} r="3.5" fill="#171717" />

        {/* services */}
        {S.map((p, i) => (
          <circle
            key={`svc-${i}`}
            data-svc={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill={i === REST.k ? "#f04427" : "#faf9f6"}
            stroke={i === REST.k ? "#f04427" : "#171717"}
            strokeWidth="1.5"
            {...ns}
          />
        ))}

        {/* background worker around the core */}
        <line data-id="tether" x1={C.x} y1={C.y} x2={w0.x} y2={w0.y} stroke="#171717" strokeOpacity="0.35" strokeWidth="1" {...ns} />
        <circle data-id="worker" cx={w0.x} cy={w0.y} r="4" fill="#171717" />

        {/* dots drifting along the scattered lines */}
        {LINES.map((l, i) => {
          const p = lerp(l, l.t0);
          return (
            <circle
              key={`dot-${i}`}
              data-dot={i}
              cx={p.x}
              cy={p.y}
              r={l.accent ? 4.5 : 3.5}
              fill={l.accent ? "#f04427" : "#171717"}
            />
          );
        })}

        {/* the request */}
        <polyline data-id="trail" points={rest.points} stroke="#f04427" strokeWidth="1.75" strokeLinejoin="round" {...ns} />
        <circle data-id="packet" cx={rest.p.x} cy={rest.p.y} r="7" fill="#f04427" />
      </svg>
    </div>
  );
}