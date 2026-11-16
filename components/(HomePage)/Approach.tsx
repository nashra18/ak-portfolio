"use client";

/**
 * Approach section, in the Milestones card theme. Self-contained.
 * Needs: next (next/font), Tailwind. No gsap.
 *
 * Palette
 * Obsidian #0B111B (section bg, diagram panel) | Atlantic #253B56 (card edge)
 * Card fill #142030 (Atlantic at 35% over Obsidian, solid so stacked cards never show through each other)
 * Ice Sheet #DFEAF5 (titles, lit nodes) | Glacier #A8C8EB (numbers, targets in the diagrams)
 * Storm #657E9B (intro, labels) | Tangerine #FF895D (request trail, selection)
 *
 * Five steps as stacking cards, each with a small wiring diagram.
 * Layout and stacking are unchanged. Motion: masked words rise once, the gauge fades in,
 * each diagram draws itself once when its card arrives, then a small request loops through it.
 */

import { Manrope } from "next/font/google";
import { useEffect, useLayoutEffect, useRef } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "800"],
  display: "swap",
  variable: "--font-approach-display",
});

const DISPLAY = "font-[family-name:var(--font-approach-display)]";
const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Card: same soft dark blue and thin edge as Milestones. The fill is solid because the cards overlap. */
const CARD = "bg-[#142030] border border-[#253B56]";

const INK = "#DFEAF5"; // lit nodes, head of the request
const BG = "#0B111B"; // diagram panel, also the fill of an unlit node
const LINE = "rgba(223,234,245,0.5)"; // diagram lines
const SLATE = "rgba(223,234,245,0.7)"; // guide line of the request
const STEEL = "#FF895D"; // trail, halo and pulse rings
const ACCENT = "#A8C8EB"; // where the request lands
const HAIR = 1;

type Pt = [number, number];
type Hit = { id: string; at: number }; // lights data-lit / data-show = id when the request reaches point `at`
type Route = { pts: Pt[]; hits: Hit[]; pulse?: string };

const stroke = { stroke: LINE, strokeWidth: HAIR } as const;
const ink = { stroke: INK, strokeWidth: 1.4 } as const;
const draw = { "data-draw": "", pathLength: 1, strokeDasharray: "1" } as const;
const ring = { fill: "none", stroke: STEEL, strokeWidth: 1.4, opacity: 0 } as const;

/* ---------- splits a string into masked words so each one can rise on its own ---------- */

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").flatMap((w, i) => {
        const word = (
          <span
            key={i}
            aria-hidden
            className="-mb-[0.14em] -mt-[0.06em] inline-block overflow-hidden pb-[0.14em] pt-[0.06em] align-top"
          >
            <span data-word className="inline-block opacity-0 will-change-transform motion-reduce:opacity-100">
              {w}
            </span>
          </span>
        );
        return i ? [" ", word] : [word];
      })}
    </>
  );
}

/* ---------- the request: trail + head (drawn on top of every diagram) ---------- */

function Request() {
  return (
    <>
      <polyline data-m="guide" points="" stroke={SLATE} strokeWidth="1" strokeDasharray="1.5 4" strokeLinejoin="round" opacity="0" />
      <polyline data-m="trail" points="" stroke={STEEL} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" opacity="0" />
      <circle data-m="halo" cx="0" cy="0" r="9" stroke={STEEL} strokeWidth="1" opacity="0" />
      <circle data-m="head" cx="0" cy="0" r="3.6" fill={INK} opacity="0" />
    </>
  );
}

/* ---------- drafting frame: corner marks + ruler ticks ---------- */

const TICKS = [40, 60, 80, 100, 120, 140, 160].map((v) => `M4 ${v}H7M${v} 196V193`).join("");

function Frame() {
  return (
    <g aria-hidden stroke={LINE} strokeWidth={HAIR} fill="none" opacity="0.9">
      <path d="M4 16V4H16M184 4H196V16M196 184V196H184M16 196H4V184" />
      <path d={TICKS} />
    </g>
  );
}

/* ---------- 01 Define: four inputs converge on one point ---------- */

const IN: Pt[] = [[100, 20], [180, 100], [100, 180], [20, 100]];
const IN_MID: Pt[] = [[100, 60], [140, 100], [100, 140], [60, 100]];

function DefineArt() {
  return (
    <>
      <rect data-pop x="20" y="20" width="160" height="160" stroke={LINE} strokeWidth={HAIR} strokeDasharray="2 5" />
      <line {...draw} {...stroke} x1="100" y1="20" x2="100" y2="60" />
      <line {...draw} {...stroke} x1="100" y1="140" x2="100" y2="180" />
      <line {...draw} {...stroke} x1="20" y1="100" x2="60" y2="100" />
      <line {...draw} {...stroke} x1="140" y1="100" x2="180" y2="100" />
      <rect {...draw} {...ink} x="60" y="60" width="80" height="80" />
      <circle data-pop cx="100" cy="100" r="4.5" fill={ACCENT} />
      <circle data-m="pulse" data-grow="3.2" cx="100" cy="100" r="6" {...ring} />
      {IN.map((p, k) => (
        <circle key={`in-${k}`} data-pop data-lit={`in-${k}`} cx={p[0]} cy={p[1]} r="4" fill={BG} {...ink} />
      ))}
    </>
  );
}

const DEFINE_ROUTES: Route[] = [0, 2, 1, 3].map((k) => ({
  pts: [IN[k], IN_MID[k], [100, 100]],
  hits: [{ id: `in-${k}`, at: 0 }],
  pulse: "pulse",
}));

/* ---------- 02 Architecture: client, gateway, services, data layer ---------- */

const AX = [44, 100, 156];

function ArchitectureArt() {
  return (
    <>
      <line {...draw} {...stroke} x1="100" y1="18.5" x2="100" y2="28" />
      <line {...draw} {...stroke} x1="100" y1="56" x2="100" y2="72" />
      <line {...draw} {...stroke} x1="44" y1="72" x2="156" y2="72" />
      {AX.map((x) => (
        <line key={`d-${x}`} {...draw} {...stroke} x1={x} y1="72" x2={x} y2="88" />
      ))}
      {AX.map((x) => (
        <line key={`u-${x}`} {...draw} {...stroke} x1={x} y1="116" x2={x} y2="148" />
      ))}
      <circle data-pop data-lit="client" cx="100" cy="14" r="4.5" fill={BG} {...ink} />
      <rect data-pop data-lit="gw" x="86" y="28" width="28" height="28" fill={BG} {...ink} strokeWidth={1.6} />
      {AX.map((x, i) => (
        <rect key={`n-${x}`} data-pop data-lit={`svc-${i}`} x={x - 14} y="88" width="28" height="28" fill={BG} {...ink} />
      ))}
      <rect data-pop x="30" y="148" width="140" height="24" fill={ACCENT} />
      <rect data-m="pulse" data-grow="1.18" x="30" y="148" width="140" height="24" {...ring} />
    </>
  );
}

const ARCH_ROUTES: Route[] = [1, 0, 2].map((i) => ({
  pts: [[100, 14], [100, 42], [100, 72], [AX[i], 72], [AX[i], 102], [AX[i], 148]],
  hits: [
    { id: "client", at: 0 },
    { id: "gw", at: 1 },
    { id: `svc-${i}`, at: 4 },
  ],
  pulse: "pulse",
}));

/* ---------- 03 Database & API design: endpoints -> bus -> data slabs ---------- */

const DY = [72, 102, 132];

function DataArt() {
  return (
    <>
      {DY.map((y) => (
        <line key={`a-${y}`} {...draw} {...stroke} x1="29" y1={y} x2="76" y2={y} />
      ))}
      <line {...draw} {...ink} x1="76" y1={DY[0]} x2="76" y2={DY[2]} />
      {DY.map((y) => (
        <line key={`b-${y}`} {...draw} {...stroke} x1="76" y1={y} x2="120" y2={y} />
      ))}
      {DY.map((y, i) => (
        <circle key={`e-${i}`} data-pop data-lit={`ep-${i}`} cx="24" cy={y} r="5" fill={BG} {...ink} />
      ))}
      {DY.map((y, i) => (
        <rect key={`s-${i}`} data-pop x="120" y={y - 10} width="56" height="20" fill={ACCENT} />
      ))}
      {DY.map((y, i) => (
        <rect key={`p-${i}`} data-m={`pulse-${i}`} data-grow="1.3" x="120" y={y - 10} width="56" height="20" {...ring} />
      ))}
    </>
  );
}

const DATA_ROUTES: Route[] = ([[0, 1], [2, 0], [1, 2], [1, 1]] as [number, number][]).map(([i, j]) => ({
  pts: [[24, DY[i]], [76, DY[i]], [76, DY[j]], [120, DY[j]]],
  hits: [{ id: `ep-${i}`, at: 0 }],
  pulse: `pulse-${j}`,
}));

/* ---------- 04 MVP roadmap: staircase of milestones ---------- */

function RoadmapArt() {
  const nodes: Pt[] = [[24, 160], [64, 120], [104, 80], [144, 40]];
  return (
    <>
      <line {...draw} {...stroke} x1="24" y1="160" x2="176" y2="160" />
      {nodes.slice(1).map((n) => (
        <line key={`v-${n[0]}`} {...draw} {...stroke} x1={n[0]} y1={n[1]} x2={n[0]} y2="160" />
      ))}
      <path {...draw} {...ink} strokeLinejoin="round" d="M24 160 H64 V120 H104 V80 H144 V40 H176" />
      {nodes.slice(0, 3).map((n, i) => (
        <circle key={`m-${i}`} data-pop data-lit={`m${i}`} cx={n[0]} cy={n[1]} r="4" fill={BG} {...ink} strokeWidth="1.3" />
      ))}
      <circle data-pop cx="144" cy="40" r="5.5" fill={ACCENT} />
      <circle data-m="pulse" data-grow="2.6" cx="144" cy="40" r="5.5" {...ring} />
    </>
  );
}

const ROADMAP_ROUTES: Route[] = [
  {
    pts: [[24, 160], [64, 160], [64, 120], [104, 120], [104, 80], [144, 80], [144, 40]],
    hits: [
      { id: "m0", at: 0 },
      { id: "m1", at: 2 },
      { id: "m2", at: 4 },
    ],
    pulse: "pulse",
  },
];

/* ---------- 05 Development & testing: code -> tests -> release, with a fail loop ---------- */

function TestArt() {
  return (
    <>
      <line {...draw} {...stroke} x1="48" y1="100" x2="86" y2="100" />
      <line {...draw} {...stroke} x1="114" y1="100" x2="156" y2="100" />
      {/* a failing test sends the work back to code */}
      <path {...draw} {...stroke} strokeLinejoin="round" d="M100 114 V152 H34 V114" />
      <rect data-pop data-lit="code" x="20" y="86" width="28" height="28" fill={BG} {...ink} />
      <rect data-pop data-lit="test" x="86" y="86" width="28" height="28" fill={BG} {...ink} strokeWidth={1.6} />
      <polyline data-show="check" {...draw} {...ink} strokeLinecap="round" strokeLinejoin="round" points="93,100 98,106 108,94" />
      <circle data-pop cx="166" cy="100" r="10" fill={ACCENT} />
      <circle data-m="pulse" data-grow="2" cx="166" cy="100" r="10" {...ring} />
    </>
  );
}

const TEST_ROUTES: Route[] = [
  // a test fails: back to code
  {
    pts: [[34, 100], [100, 100], [100, 152], [34, 152], [34, 114]],
    hits: [
      { id: "code", at: 0 },
      { id: "test", at: 1 },
    ],
  },
  // all tests pass: release
  {
    pts: [[34, 100], [100, 100], [166, 100]],
    hits: [
      { id: "code", at: 0 },
      { id: "test", at: 1 },
      { id: "check", at: 1 },
    ],
    pulse: "pulse",
  },
];

/* ---------- Request engine: a small requestAnimationFrame loop, no library ---------- */

const REQ_FWD = 2800; // request travels to its target
const REQ_HOLD = 600; // rests on the target
const REQ_BACK = 2000; // response retracts
const REQ_PAUSE = 800; // rests at the start
const REQ_PERIOD = REQ_FWD + REQ_HOLD + REQ_BACK + REQ_PAUSE;
const REQ_PULSE_AT = REQ_FWD - 100;

const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

function runRequest(svg: SVGSVGElement, routes: Route[], reduced: boolean) {
  const q = (id: string) => svg.querySelector<SVGElement>(`[data-m="${id}"]`)!;
  const guide = q("guide");
  const trail = q("trail");
  const halo = q("halo");
  const head = q("head");
  const lits = Array.from(svg.querySelectorAll<SVGElement>("[data-lit]"));
  const shows = Array.from(svg.querySelectorAll<SVGElement>("[data-show]"));

  const geo = routes.map(({ pts }) => {
    const cum = [0];
    for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    return { cum, total: cum[cum.length - 1] };
  });

  const st = { r: 0, u: 0 };

  const render = () => {
    const { pts, hits } = routes[st.r];
    const { cum, total } = geo[st.r];
    const d = st.u * total;
    const out: Pt[] = [pts[0]];
    let h: Pt = pts[0];
    for (let k = 1; k < pts.length; k++) {
      if (cum[k] <= d) {
        out.push(pts[k]);
        h = pts[k];
      } else {
        const t = (d - cum[k - 1]) / (cum[k] - cum[k - 1] || 1);
        h = [pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * t, pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * t];
        out.push(h);
        break;
      }
    }
    const on = st.u > 0.002 ? "1" : "0";
    trail.setAttribute("points", out.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" "));
    trail.setAttribute("opacity", on);
    guide.setAttribute("points", pts.map((p) => `${p[0]},${p[1]}`).join(" "));
    guide.setAttribute("opacity", on);
    head.setAttribute("cx", h[0].toFixed(2));
    head.setAttribute("cy", h[1].toFixed(2));
    head.setAttribute("opacity", on);
    halo.setAttribute("cx", h[0].toFixed(2));
    halo.setAttribute("cy", h[1].toFixed(2));
    halo.setAttribute("opacity", st.u > 0.002 ? "0.5" : "0");

    const reached = new Set(hits.filter((x) => st.u > 0.002 && d >= cum[x.at] - 0.01).map((x) => x.id));
    lits.forEach((el) => el.setAttribute("fill", reached.has(el.dataset.lit ?? "") ? INK : BG));
    shows.forEach((el) => el.setAttribute("opacity", reached.has(el.dataset.show ?? "") ? "1" : "0"));
  };

  // the target pulses once when the request lands
  const firePulse = () => {
    const id = routes[st.r].pulse;
    const p = id ? q(id) : null;
    if (!p || typeof p.animate !== "function") return;
    p.style.transformBox = "fill-box";
    p.style.transformOrigin = "50% 50%";
    p.animate(
      [
        { transform: "scale(1)", opacity: 0.9 },
        { transform: `scale(${Number(p.dataset.grow ?? 1.6)})`, opacity: 0 },
      ],
      { duration: 1400, easing: "cubic-bezier(.25,.46,.45,.94)" }
    );
  };

  const delay = reduced ? 400 : 1800;
  let t = 0;
  let last = 0;
  let raf = 0;
  let pulsedCycle = -1;

  const tick = () => {
    const a = t - delay;
    if (a < 0) {
      if (st.u !== 0) {
        st.u = 0;
        render();
      }
      return;
    }
    const cycle = Math.floor(a / REQ_PERIOD);
    const c = a - cycle * REQ_PERIOD;
    st.r = cycle % routes.length;

    if (c < REQ_FWD) st.u = easeInOut(c / REQ_FWD);
    else if (c < REQ_FWD + REQ_HOLD) st.u = 1;
    else if (c < REQ_FWD + REQ_HOLD + REQ_BACK) st.u = 1 - easeInOut((c - REQ_FWD - REQ_HOLD) / REQ_BACK);
    else st.u = 0;
    render();

    if (!reduced && c >= REQ_PULSE_AT && pulsedCycle !== cycle) {
      pulsedCycle = cycle;
      firePulse();
    }
  };

  const frame = (now: number) => {
    t += Math.min(100, now - last);
    last = now;
    tick();
    raf = requestAnimationFrame(frame);
  };

  render();
  return {
    play() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    pause() {
      cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}

/* ---------- Content ---------- */

const INTRO =
  "A backend is only as good as the thinking behind it. I follow the same five steps on every project, from the first conversation to the last test, so nothing is left to guesswork.";

const STEPS: {
  n: string;
  title: string;
  lead: string;
  body: string;
  out: string; // what you hold at the end of the step
  Art: () => React.JSX.Element;
  routes: Route[];
}[] = [
  {
    n: "01",
    title: "Define",
    lead: "Scope before code.",
    body: "I work with you to pin down who the users are, what the system must do, and what it must never do. The result is a short, written scope that everyone agrees on.",
    out: "A one-page written scope",
    Art: DefineArt,
    routes: DEFINE_ROUTES,
  },
  {
    n: "02",
    title: "Architecture",
    lead: "Clear boundaries, simple flow.",
    body: "I map how requests move through the system: gateway, services, queues and the data layer. The result stays fast, secure, and easy to change as it grows.",
    out: "System diagram and service map",
    Art: ArchitectureArt,
    routes: ARCH_ROUTES,
  },
  {
    n: "03",
    title: "Database & API design",
    lead: "Schema first, endpoints second.",
    body: "Clean models, predictable contracts, sensible indexes and proper authentication, all documented before any feature code is written.",
    out: "Schema and API contract",
    Art: DataArt,
    routes: DATA_ROUTES,
  },
  {
    n: "04",
    title: "MVP roadmap",
    lead: "The smallest useful version first.",
    body: "I break the work into small milestones. Each one has a clear outcome and a date, so you always know what is being built next and what can wait.",
    out: "A dated milestone plan",
    Art: RoadmapArt,
    routes: ROADMAP_ROUTES,
  },
  {
    n: "05",
    title: "Development & testing",
    lead: "Nothing ships untested.",
    body: "Each milestone is built with Spring Boot and covered by unit and integration tests. If a test fails, the work goes back to code before anything ships.",
    out: "A tested, release-ready build",
    Art: TestArt,
    routes: TEST_ROUTES,
  },
];

const N = STEPS.length;

/* ---------- Ring gauge (laptop, left column) ---------- */

// one tick on the ring at the end of every step
const GAUGE_TICKS = Array.from({ length: N }, (_, i) => {
  const a = -Math.PI / 2 + (2 * Math.PI * (i + 1)) / N;
  const f = (r: number, t: "x" | "y") => (70 + r * (t === "x" ? Math.cos(a) : Math.sin(a))).toFixed(2);
  return `M${f(59, "x")} ${f(59, "y")}L${f(66, "x")} ${f(66, "y")}`;
}).join("");

function Gauge() {
  return (
    <div aria-hidden data-fade className="relative mt-12 aspect-square w-[132px] opacity-0 motion-reduce:opacity-100">
      <svg viewBox="0 0 140 140" fill="none" className="absolute inset-0 h-full w-full">
        <circle cx="70" cy="70" r="52" stroke="rgba(223,234,245,0.15)" strokeWidth="1.5" />
        <circle
          data-gauge-arc
          cx="70"
          cy="70"
          r="52"
          stroke="#A8C8EB"
          strokeWidth="3.5"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - 1 / N}
          transform="rotate(-90 70 70)"
        />
        <path d={GAUGE_TICKS} stroke="rgba(223,234,245,0.5)" strokeWidth="1.5" />
      </svg>
      <div className="absolute inset-0 flex items-baseline justify-center pt-[46px]">
        <span data-gauge-n className="text-4xl font-extrabold leading-none tracking-[-0.04em] text-[#DFEAF5] tabular-nums">
          01
        </span>
        <span className="ml-1 text-[11px] font-semibold text-[#657E9B]">/0{N}</span>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */

export function Approach() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    const el = root.current;
    if (!el) return;
    const all = <T extends Element>(s: string, from: ParentNode = el) => Array.from(from.querySelectorAll<T>(s));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = all<HTMLElement>("[data-step]");
    const shades = all<HTMLElement>("[data-shade]");
    const stackEl = el.querySelector<HTMLElement>("[data-stack]")!;
    const gaugeArc = el.querySelector<SVGCircleElement>("[data-gauge-arc]");
    const gaugeN = el.querySelector<HTMLElement>("[data-gauge-n]");

    /*
      Push-up stacking. One function, called on every scroll, works out everything from the scroll position:
      how far each card has travelled towards the stack (p), how far each older card is pushed up, how dark
      it is, and where the gauge is. It measures from the stack (a plain block that never moves or
      transforms), so it does not depend on any earlier state.
    */
    let stick = 0; // where every card sticks
    let step = 0; // height of one title strip
    let gap = 0; // space between cards
    let hs: number[] = []; // card heights
    let nat: number[] = []; // natural top of each card, measured from the top of the stack
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const measure = () => {
      const cs = getComputedStyle(cards[0]);
      stick = parseFloat(cs.top) || 0;
      gap = parseFloat(cs.marginBottom) || 0;
      step = parseFloat(getComputedStyle(stackEl).getPropertyValue("--step")) || 56;
      hs = cards.map((c) => c.offsetHeight);
      nat = [0];
      for (let j = 1; j < N; j++) nat[j] = nat[j - 1] + hs[j - 1] + gap;
    };
    const update = () => {
      if (!nat.length) return;
      const base = stackEl.getBoundingClientRect().top; // natural top of card 01
      const p: number[] = new Array(N).fill(0); // 0 = card j still below the stack, 1 = card j has arrived
      let sum = 0;
      let active = 0;
      for (let j = 1; j < N; j++) {
        const len = hs[j - 1] + gap; // distance card j travels while it slides over the one before it
        p[j] = clamp01((stick + len - (base + nat[j])) / len);
        sum += p[j];
        if (p[j] > 0.6) active = j;
      }
      // every card that has arrived above card i pushes it up by one title strip and dims it a little
      for (let i = 0; i < N; i++) {
        let k = 0;
        for (let j = i + 1; j < N; j++) k += p[j];
        cards[i].style.transform = `translate3d(0, ${(-k * step).toFixed(2)}px, 0)`;
        shades[i].style.opacity = (k * 0.14).toFixed(3);
      }
      gaugeArc?.setAttribute("stroke-dashoffset", String(1 - (1 + sum) / N));
      if (gaugeN && gaugeN.textContent !== STEPS[active].n) gaugeN.textContent = STEPS[active].n;
    };
    const refresh = () => {
      measure();
      update();
    };

    refresh();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", refresh);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : null;
    ro?.observe(stackEl);
    cards.forEach((c) => ro?.observe(c));
    document.fonts?.ready.then(refresh);

    /* intro: masked words rise, then the gauge fades in */
    if (!reduced) {
      const rise = (words: HTMLElement[], start: number, dur: number, stagger: number, ease: string) => {
        words.forEach((w) => {
          w.style.opacity = "1";
          w.style.transform = "translateY(110%)";
        });
        void el.offsetWidth; // commit the start position before the transition begins
        words.forEach((w, i) => {
          w.style.transition = `transform ${dur}ms ${ease} ${start + i * stagger}ms`;
          w.style.transform = "translateY(0)";
        });
        return start + Math.max(0, words.length - 1) * stagger + dur;
      };

      const titles = all<HTMLElement>("[data-title]");
      const paras = all<HTMLElement>("[data-para]");
      let fadeStart = 1500;
      titles.forEach((title, k) => {
        const titleEnd = rise(all<HTMLElement>("[data-word]", title), 200, 1400, 90, "cubic-bezier(.16,1,.3,1)");
        const paraEnd = rise(all<HTMLElement>("[data-word]", paras[k]), titleEnd - 1000, 1100, 14, "cubic-bezier(.165,.84,.44,1)");
        fadeStart = paraEnd - 700;
      });

      const fades = all<HTMLElement>("[data-fade]");
      fades.forEach((f) => {
        f.style.opacity = "0";
        f.style.transform = "translateY(16px)";
      });
      void el.offsetWidth;
      fades.forEach((f) => {
        f.style.transition = `opacity 900ms cubic-bezier(.215,.61,.355,1) ${fadeStart}ms, transform 900ms cubic-bezier(.215,.61,.355,1) ${fadeStart}ms`;
        f.style.opacity = "1";
        f.style.transform = "none";
      });
    }

    /* diagrams: each one draws itself once when its card comes into view, then its request loops */
    const parts = cards.map((card) => {
      const draws = all<SVGElement>("[data-draw]", card);
      const pops = all<SVGElement>("[data-pop]", card);
      if (!reduced) {
        draws.forEach((d) => (d.style.strokeDashoffset = "1"));
        pops.forEach((p) => {
          p.style.transformBox = "fill-box";
          p.style.transformOrigin = "50% 50%";
          p.style.transform = "scale(0)";
        });
      }
      return { draws, pops };
    });

    const reveal = (i: number) => {
      const { draws, pops } = parts[i];
      void cards[i].offsetWidth;
      draws.forEach((d, k) => {
        d.style.transition = `stroke-dashoffset 1200ms cubic-bezier(.45,0,.55,1) ${k * 60}ms`;
        d.style.strokeDashoffset = "0";
      });
      pops.forEach((p, k) => {
        p.style.transition = `transform 600ms cubic-bezier(.215,.61,.355,1) ${400 + k * 50}ms, fill 300ms ease 0ms`;
        p.style.transform = "scale(1)";
      });
    };

    let cardIo: IntersectionObserver | null = null;
    if (!reduced && typeof IntersectionObserver !== "undefined") {
      cardIo = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            reveal(cards.indexOf(e.target as HTMLElement));
            cardIo?.unobserve(e.target);
          }),
        { rootMargin: "0px 0px -15% 0px" }
      );
      cards.forEach((c) => cardIo!.observe(c));
    } else if (!reduced) {
      cards.forEach((_, i) => reveal(i));
    }

    // the requests only run while the stack is on screen
    const loops = cards.map((card, i) => runRequest(card.querySelector("svg") as SVGSVGElement, STEPS[i].routes, reduced));
    const setRunning = (on: boolean) => loops.forEach((l) => (on ? l.play() : l.pause()));
    let stackIo: IntersectionObserver | null = null;
    if (typeof IntersectionObserver === "undefined") {
      setRunning(true);
    } else {
      stackIo = new IntersectionObserver((entries) => setRunning(entries.some((e) => e.isIntersecting)));
      stackIo.observe(stackEl);
    }

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", refresh);
      ro?.disconnect();
      cardIo?.disconnect();
      stackIo?.disconnect();
      setRunning(false);
    };
  }, []);

  return (
    <section
      ref={root}
      id="approach"
      aria-label="My approach"
      className={`${manrope.variable} ${DISPLAY} bg-[#0B111B] px-5 py-16 text-[#DFEAF5] antialiased selection:bg-[#FF895D] selection:text-[#0B111B] md:px-12 md:py-28 lg:px-16`}
    >
      {/*
        --top  : gap above the stack (the finished stack starts here, level with the heading)
        --step : height of one title strip
        --stick: the line where every card sticks (the lowest slot of the stack)
        --gap  : space between cards
        --card : card height on laptop
      */}
      <div
        style={{ "--stick": `calc(var(--top) + ${N - 1} * var(--step))` } as React.CSSProperties}
        className="mx-auto flex w-full max-w-[90rem] flex-col [--gap:1.5rem] [--step:52px] [--top:16px] md:[--gap:2.5rem] md:[--step:64px] md:[--top:24px] lg:grid lg:grid-cols-12 lg:gap-x-12 lg:[--card:clamp(360px,calc(100svh_-_var(--stick)_-_32px),520px)] lg:[--gap:4rem]"
      >
        {/* phone / tablet: plain heading and intro above the stack */}
        <h2
          data-title
          aria-label="My approach"
          className="text-[2.5rem] font-extrabold leading-none tracking-[-0.055em] text-[#DFEAF5] md:text-6xl lg:hidden"
        >
          <Words text="My approach" />
        </h2>
        <p
          data-para
          aria-label={INTRO}
          className="mt-4 max-w-[48ch] text-[15px] font-medium leading-[1.7] text-[#657E9B] md:text-lg lg:hidden"
        >
          <Words text={INTRO} />
        </p>

        {/*
          laptop: sticky left column. Its height runs from --top to the bottom of the last card,
          so it is released at the same moment as the stack.
        */}
        <div className="hidden lg:sticky lg:top-[var(--top)] lg:col-span-4 lg:row-start-1 lg:block lg:h-[calc(var(--stick)_-_var(--top)_+_var(--card)_+_var(--gap))] lg:self-start">
          <h2
            data-title
            aria-label="My approach"
            className="-mt-[0.07em] text-6xl font-extrabold leading-[0.92] tracking-[-0.055em] text-[#DFEAF5] xl:text-7xl"
          >
            <Words text="My approach" />
          </h2>
          <p data-para aria-label={INTRO} className="mt-6 max-w-[36ch] text-base font-medium leading-[1.7] text-[#657E9B]">
            <Words text={INTRO} />
          </p>
          <Gauge />
        </div>

        {/* the stack */}
        <ol data-stack className="mt-10 md:mt-14 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mt-0">
          {STEPS.map(({ n, title, lead, body, out, Art }) => (
            <li
              key={n}
              data-step
              style={{ top: "var(--stick)" }}
              className={`sticky mb-[var(--gap)] flex min-h-[340px] flex-col overflow-hidden rounded-[2rem] will-change-transform md:min-h-[400px] lg:h-[var(--card)] lg:min-h-[360px] ${CARD}`}
            >
              {/* title strip: what stays visible once the next cards cover the rest */}
              <div className="flex h-[var(--step)] shrink-0 items-center gap-3 px-6 md:gap-4 md:px-9 lg:px-11">
                <span className="text-xs font-semibold tabular-nums text-[#A8C8EB] md:text-sm">{n}</span>
                <h3 className="text-lg font-extrabold leading-none tracking-[-0.03em] text-[#DFEAF5] md:text-2xl lg:text-3xl">{title}</h3>
              </div>

              {/* diagram (left) + text (right) */}
              <div className="grid flex-1 grid-cols-[104px_1fr] items-center gap-x-5 px-6 pb-7 pt-3 md:grid-cols-[160px_1fr] md:gap-x-8 md:px-9 md:pb-9 lg:grid-cols-[240px_1fr] lg:gap-x-12 lg:px-11">
                <div
                  aria-hidden
                  className="rounded-xl border border-[#253B56] bg-[#0B111B] bg-[radial-gradient(rgba(223,234,245,0.12)_1px,transparent_1px)] bg-[length:14px_14px]"
                >
                  <svg
                    viewBox="0 0 200 200"
                    fill="none"
                    className="aspect-square w-full [&_[data-lit]]:transition-[fill] [&_[data-lit]]:duration-300 motion-reduce:[&_[data-lit]]:transition-none"
                  >
                    <Frame />
                    <Art />
                    <Request />
                  </svg>
                </div>
                <div>
                  <p className="text-[15px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#DFEAF5] [text-wrap:balance] md:text-xl lg:text-[1.75rem]">
                    {lead}
                  </p>
                  <p className="mt-2 text-[13.5px] font-medium leading-[1.65] text-[#DFEAF5]/70 [text-wrap:pretty] md:mt-3 md:text-[16px] md:leading-[1.7] lg:max-w-[46ch]">
                    {body}
                  </p>
                  {/* what you hold at the end of this step */}
                  <p className="mt-6 hidden items-baseline gap-3 md:flex">
                    <span className="text-sm font-semibold text-[#657E9B]">You get</span>
                    <span className="text-[15px] font-semibold tracking-[-0.01em] text-[#A8C8EB]">{out}</span>
                  </p>
                </div>
              </div>

              {/* dims the card as newer ones stack on top of it */}
              <div data-shade aria-hidden className="pointer-events-none absolute inset-0 bg-[#0B111B] opacity-0" />
            </li>
          ))}
          {/* holds the finished stack on screen for a moment, so the last card is pinned like the others */}
          <li aria-hidden className="h-[40svh]" />
        </ol>
      </div>
    </section>
  );
}

export default Approach;