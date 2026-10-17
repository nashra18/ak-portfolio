"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
  A backend request path, drawn as a wiring diagram.

  clients -> gateway -> service bus -> four services -> data bus -> data store (solid vermilion slabs)

  A request enters from a client, crosses the gateway, is routed to one service,
  reaches the data store, then retracts as the response. A dashed lane at the bottom
  carries a queue of jobs. No literal servers or cloud icons: just nodes, buses and routes.

  Motion is always on (slow and small). With "reduce motion" enabled in the OS,
  the intro and the store pulse are skipped.
*/

const INK = "#f4f1ea";
const BG = "#0a0a0a";
const LINE = "#34332f";
const ACCENT = "#f04427";
const HAIR = 0.9;

type Pt = { x: number; y: number };
const f = (n: number) => n.toFixed(2);

// columns and rows
const X = { client: 40, gate: 128, busA: 182, svc: 236, busB: 290, store: 326 };
const CLIENT_Y = [110, 200, 290];
const SVC_Y = [92, 164, 236, 308];
const MID = 200;
const LANE = { y: 358, x0: 128, x1: 370 };
const STORE = { x: X.store, y: 168, w: 44, h: 64, slab: 18, gap: 5 };
const SLABS = [0, 1, 2].map((i) => STORE.y + i * (STORE.slab + STORE.gap));

function buildPath(i: number, j: number) {
  const yc = CLIENT_Y[i];
  const ys = SVC_Y[j];
  const pts: Pt[] = [
    { x: X.client + 5, y: yc },
    { x: X.gate, y: yc },
    { x: X.gate, y: MID },
    { x: X.busA, y: MID },
    { x: X.busA, y: ys },
    { x: X.svc - 7, y: ys }, // index 5: reaches the service
    { x: X.svc + 7, y: ys },
    { x: X.busB, y: ys },
    { x: X.busB, y: MID },
    { x: X.store, y: MID },
  ];
  const cum = [0];
  for (let k = 1; k < pts.length; k++) {
    cum.push(cum[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
  }
  return { pts, cum, total: cum[cum.length - 1] };
}
const PATHS = CLIENT_Y.map((_, i) => SVC_Y.map((_, j) => buildPath(i, j)));
const ROUTES: [number, number][] = [
  [1, 1],
  [0, 3],
  [2, 0],
  [1, 2],
  [0, 0],
  [2, 3],
];

function along(c: number, s: number, u: number) {
  const { pts, cum, total } = PATHS[c][s];
  const d = u * total;
  const out: Pt[] = [pts[0]];
  let head = pts[0];
  for (let k = 1; k < pts.length; k++) {
    if (cum[k] <= d) {
      out.push(pts[k]);
      head = pts[k];
    } else {
      const t = (d - cum[k - 1]) / (cum[k] - cum[k - 1]);
      head = {
        x: pts[k - 1].x + (pts[k].x - pts[k - 1].x) * t,
        y: pts[k - 1].y + (pts[k].y - pts[k - 1].y) * t,
      };
      out.push(head);
      break;
    }
  }
  return {
    head,
    points: out.map((p) => `${f(p.x)},${f(p.y)}`).join(" "),
    atService: u > 0 && d >= cum[5] - 0.01,
  };
}

const laneX = (q: number, k: number) => LANE.x0 + ((q + k / 3) % 1) * (LANE.x1 - LANE.x0);
const REST = { c: 1, s: 1, u: 1 };

export default function GeometrySlice() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const q = (id: string) => svg.querySelector<SVGElement>(`[data-id="${id}"]`)!;
    const all = (sel: string) => Array.from(svg.querySelectorAll<SVGElement>(sel));
    const trail = q("trail");
    const head = q("head");
    const pulse = q("pulse");
    const clients = all("[data-client]");
    const services = all("[data-svc]");
    const jobs = all("[data-job]");
    const draws = all("[data-draw]");
    const pops = all("[data-pop]");
    const slabs = all("[data-slab]");
    const lane = q("lane");

    const state = { c: REST.c, s: REST.s, u: REST.u, q: 0 };

    const render = () => {
      const r = along(state.c, state.s, state.u);
      const show = state.u > 0.002 ? "1" : "0";
      trail.setAttribute("points", r.points);
      trail.setAttribute("opacity", show);
      head.setAttribute("cx", f(r.head.x));
      head.setAttribute("cy", f(r.head.y));
      head.setAttribute("opacity", show);
      clients.forEach((el, i) => el.setAttribute("fill", i === state.c && state.u > 0.002 ? INK : BG));
      services.forEach((el, i) => el.setAttribute("fill", i === state.s && r.atService ? INK : BG));
      jobs.forEach((el, k) => el.setAttribute("cx", f(laneX(state.q, k))));
    };

    const mm = gsap.matchMedia();

    mm.add(
      {
        full: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const reduced = Boolean(ctx.conditions?.reduced);
        let step = 0;

        state.c = ROUTES[0][0];
        state.s = ROUTES[0][1];
        state.u = 0;
        render();
        gsap.ticker.add(render);

        // intro on page load
        if (!reduced) {
          gsap.fromTo(draws, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.07 });
          gsap.fromTo(pops, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.04, delay: 0.6 });
          gsap.fromTo(slabs, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.12, delay: 0.9 });
          gsap.fromTo(lane, { opacity: 0 }, { opacity: 1, duration: 1.2, delay: 1 });
        }

        // queue: jobs flow along the lane
        gsap.to(state, { q: 1, duration: 8, ease: "none", repeat: -1 });

        // request -> gateway -> service -> data store, then the response retracts
        const tl = gsap.timeline({
          delay: reduced ? 0.4 : 2,
          repeat: -1,
          onRepeat: () => {
            step = (step + 1) % ROUTES.length;
            state.c = ROUTES[step][0];
            state.s = ROUTES[step][1];
          },
        });
        tl.to(state, { u: 1, duration: 2.8, ease: "power2.inOut" });
        if (!reduced) {
          tl.fromTo(
            pulse,
            { attr: { x: STORE.x, y: STORE.y, width: STORE.w, height: STORE.h }, opacity: 0.9 },
            {
              attr: { x: STORE.x - 9, y: STORE.y - 9, width: STORE.w + 18, height: STORE.h + 18 },
              opacity: 0,
              duration: 1.4,
              ease: "power2.out",
            },
            ">-0.1"
          );
        }
        tl.to(state, { u: 0, duration: 2, ease: "power2.inOut" }, "+=0.6").to({}, { duration: 0.8 });

        return () => gsap.ticker.remove(render);
      }
    );

    return () => mm.revert();
  }, []);

  const rest = along(REST.c, REST.s, REST.u);
  const stroke = { stroke: LINE, strokeWidth: HAIR } as const;
  const draw = { "data-draw": "", pathLength: 1, strokeDasharray: "1" } as const;

  return (
    <div aria-hidden className="pointer-events-none aspect-square h-full max-h-[600px] max-w-full">
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" className="h-full w-full" fill="none" ref={svgRef}>
        {/* client -> gateway */}
        {CLIENT_Y.map((y) => (
          <line key={`cl-${y}`} {...draw} {...stroke} x1={X.client + 5} y1={y} x2={X.gate} y2={y} />
        ))}
        {/* gateway -> service bus */}
        <line {...draw} {...stroke} x1={X.gate} y1={MID} x2={X.busA} y2={MID} />
        <line {...draw} {...stroke} x1={X.busA} y1={SVC_Y[0]} x2={X.busA} y2={SVC_Y[3]} />
        {SVC_Y.map((y) => (
          <line key={`sa-${y}`} {...draw} {...stroke} x1={X.busA} y1={y} x2={X.svc - 7} y2={y} />
        ))}
        {/* services -> data bus -> store */}
        {SVC_Y.map((y) => (
          <line key={`sb-${y}`} {...draw} {...stroke} x1={X.svc + 7} y1={y} x2={X.busB} y2={y} />
        ))}
        <line {...draw} {...stroke} x1={X.busB} y1={SVC_Y[0]} x2={X.busB} y2={SVC_Y[3]} />
        <line {...draw} {...stroke} x1={X.busB} y1={MID} x2={X.store} y2={MID} />

        {/* gateway: the one solid ink line */}
        <line {...draw} x1={X.gate} y1={76} x2={X.gate} y2={324} stroke={INK} strokeWidth={1.4} />

        {/* queue lane */}
        <line data-id="lane" x1={LANE.x0} y1={LANE.y} x2={LANE.x1} y2={LANE.y} stroke={LINE} strokeWidth={HAIR} strokeDasharray="2 5" />

        {/* data store: three solid slabs */}
        {SLABS.map((y) => (
          <rect key={`slab-${y}`} data-slab x={STORE.x} y={y} width={STORE.w} height={STORE.slab} fill={ACCENT} />
        ))}
        <rect data-id="pulse" x={STORE.x} y={STORE.y} width={STORE.w} height={STORE.h} stroke={ACCENT} strokeWidth="1" opacity="0" />

        {/* nodes */}
        {CLIENT_Y.map((y, i) => (
          <circle key={`c-${i}`} data-pop data-client={i} cx={X.client} cy={y} r="5" fill={BG} stroke={INK} strokeWidth="1" />
        ))}
        <rect data-pop x={X.gate - 7} y={MID - 7} width="14" height="14" fill={BG} stroke={INK} strokeWidth="1.2" />
        {SVC_Y.map((y, i) => (
          <rect key={`s-${i}`} data-pop data-svc={i} x={X.svc - 7} y={y - 7} width="14" height="14" fill={BG} stroke={INK} strokeWidth="1" />
        ))}

        {/* queued jobs */}
        {[0, 1, 2].map((k) => (
          <circle key={`job-${k}`} data-job={k} cx={laneX(0, k)} cy={LANE.y} r="2.4" fill={INK} />
        ))}

        {/* the request */}
        <polyline data-id="trail" points={rest.points} stroke={ACCENT} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        <circle data-id="head" cx={rest.head.x} cy={rest.head.y} r="3.6" fill={ACCENT} />
      </svg>
    </div>
  );
}