"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  My approach: five steps as stacking cards, each with a small wiring diagram.
  Same language and same motion as the hero diagram (GeometrySlice):
  a request leaves an input, draws a vermilion trail, lights up the nodes it reaches,
  pulses its target, then retracts as the response.

  Layout
  - phone / tablet: "My approach" stays pinned at the top (with a 01 / 05 counter),
    the cards stack underneath it.
  - laptop: two columns. Left: the heading, the intro and a step index that follows the scroll
    (sticky). Right: the stack of cards.

  Stacking (push-up)
  - Every card sticks at the same line, the lowest slot of the stack.
  - When the next card slides over, all earlier cards move up by one title strip and dim a little
    (scrubbed with scroll), so only their titles remain: 01 Define, 02 Architecture, ...
  - The last card is pinned like all the others (the spacer at the end of the list holds the stack
    for a moment before the whole stack scrolls away).

  Diagrams (each one loops while the stack is on screen)
  01 Define               -> four inputs converge on one point
  02 Architecture         -> client -> gateway -> one of three services -> data layer
  03 Database & API       -> an endpoint -> the bus -> a data slab
  04 MVP roadmap          -> progress climbs the staircase and lights each milestone
  05 Development & test   -> code -> tests; first a test fails and loops back, then it passes and releases

  With "reduce motion" enabled in the OS, the diagrams are static. The stacking still follows the
  scroll (it is driven by the person scrolling, not by autoplay).
*/

const INK = "#f4f1ea";
const BG = "#0a0a0a";
const LINE = "#34332f";
const MUTED = "#8b8780";
const ACCENT = "#f04427";
const HAIR = 0.9;

type Pt = [number, number];
type Hit = { id: string; at: number }; // lights data-lit / data-show = id when the request reaches point `at`
type Route = { pts: Pt[]; hits: Hit[]; pulse?: string };

const stroke = { stroke: LINE, strokeWidth: HAIR } as const;
const ink = { stroke: INK, strokeWidth: 1.1 } as const;
const draw = { "data-draw": "", pathLength: 1, strokeDasharray: "1" } as const;
const ring = { fill: "none", stroke: ACCENT, strokeWidth: 1, opacity: 0 } as const;

/* ---------- the request: trail + head (drawn on top of every diagram) ---------- */

function Request() {
  return (
    <>
      <polyline data-m="trail" points="" stroke={ACCENT} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0" />
      <circle data-m="head" cx="0" cy="0" r="3.6" fill={ACCENT} opacity="0" />
    </>
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
      <rect data-pop data-lit="gw" x="86" y="28" width="28" height="28" fill={BG} {...ink} strokeWidth={1.4} />
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
        <circle key={`m-${i}`} data-pop data-lit={`m${i}`} cx={n[0]} cy={n[1]} r="4" fill={BG} {...ink} strokeWidth="1" />
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
      <rect data-pop data-lit="test" x="86" y="86" width="28" height="28" fill={BG} {...ink} strokeWidth={1.4} />
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

/* ---------- Request engine (same idea as GeometrySlice) ---------- */

function runRequest(svg: SVGSVGElement, routes: Route[]) {
  const q = (id: string) => svg.querySelector<SVGElement>(`[data-m="${id}"]`)!;
  const trail = q("trail");
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
    head.setAttribute("cx", h[0].toFixed(2));
    head.setAttribute("cy", h[1].toFixed(2));
    head.setAttribute("opacity", on);

    const reached = new Set(hits.filter((x) => st.u > 0.002 && d >= cum[x.at] - 0.01).map((x) => x.id));
    lits.forEach((el) => el.setAttribute("fill", reached.has(el.dataset.lit ?? "") ? INK : BG));
    shows.forEach((el) => el.setAttribute("opacity", reached.has(el.dataset.show ?? "") ? "1" : "0"));
  };

  const tl = gsap.timeline({
    paused: true,
    delay: 1.8,
    repeat: -1,
    onRepeat: () => {
      st.r = (st.r + 1) % routes.length;
    },
  });

  // request -> reaches its target -> the target pulses -> the response retracts
  tl.to(st, { u: 1, duration: 2.8, ease: "power2.inOut", onUpdate: render })
    .add(() => {
      const id = routes[st.r].pulse;
      const p = id ? q(id) : null;
      if (p) {
        gsap.fromTo(
          p,
          { scale: 1, opacity: 0.9, transformOrigin: "50% 50%" },
          { scale: Number(p.dataset.grow ?? 1.6), opacity: 0, duration: 1.4, ease: "power2.out" }
        );
      }
    }, ">-0.1")
    .to(st, { u: 0, duration: 2, ease: "power2.inOut", onUpdate: render }, "+=0.6")
    .to({}, { duration: 0.8 });

  render();
  return tl;
}

/* ---------- Content ---------- */

const INTRO =
  "A backend is only as good as the thinking behind it. I follow the same five steps on every project, from the first conversation to the last test, so nothing is left to guesswork.";

const STEPS: {
  n: string;
  title: string;
  lead: string;
  body: string;
  Art: () => React.JSX.Element;
  routes: Route[];
}[] = [
  {
    n: "01",
    title: "Define",
    lead: "Scope before code.",
    body: "I work with you to pin down who the users are, what the system must do, and what it must never do. The result is a short, written scope that everyone agrees on.",
    Art: DefineArt,
    routes: DEFINE_ROUTES,
  },
  {
    n: "02",
    title: "Architecture",
    lead: "Clear boundaries, simple flow.",
    body: "I map how requests move through the system: gateway, services, queues and the data layer. The result stays fast, secure, and easy to change as it grows.",
    Art: ArchitectureArt,
    routes: ARCH_ROUTES,
  },
  {
    n: "03",
    title: "Database & API design",
    lead: "Schema first, endpoints second.",
    body: "Clean models, predictable contracts, sensible indexes and proper authentication, all documented before any feature code is written.",
    Art: DataArt,
    routes: DATA_ROUTES,
  },
  {
    n: "04",
    title: "MVP roadmap",
    lead: "The smallest useful version first.",
    body: "I break the work into small milestones. Each one has a clear outcome and a date, so you always know what is being built next and what can wait.",
    Art: RoadmapArt,
    routes: ROADMAP_ROUTES,
  },
  {
    n: "05",
    title: "Development & testing",
    lead: "Nothing ships untested.",
    body: "Each milestone is built with Spring Boot and covered by unit and integration tests. If a test fails, the work goes back to code before anything ships.",
    Art: TestArt,
    routes: TEST_ROUTES,
  },
];

const N = STEPS.length;
const pad = (n: number) => String(n).padStart(2, "0");

/* ---------- Section ---------- */

export function Approach() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const cards = q("[data-step]") as HTMLElement[];
    const stackEl = q("[data-stack]")[0] as HTMLElement;
    const items = q("[data-idx]") as HTMLElement[];
    const nums = q("[data-idx-n]") as HTMLElement[];
    const count = q("[data-count]")[0] as HTMLElement | undefined;

    const stick = (c: HTMLElement) => parseFloat(getComputedStyle(c).top) || 0; // where every card sticks
    const step = () => parseFloat(getComputedStyle(stackEl).getPropertyValue("--step")) || 56; // title strip height
    const gap = () => parseFloat(getComputedStyle(cards[0]).marginBottom) || 0;

    const setActive = (a: number) => {
      items.forEach((it, k) => (it.style.color = k === a ? INK : MUTED));
      nums.forEach((nm, k) => (nm.style.color = k === a ? ACCENT : MUTED));
      if (count) count.textContent = `${pad(a + 1)} / ${pad(N)}`;
    };

    /* scroll-driven part: always on (it follows the person's scroll, it is not autoplay) */
    const ctx = gsap.context(() => {
      setActive(0);

      // when card j slides over the stack, every earlier card moves up by one title strip and dims a little
      for (let j = 1; j < N; j++) {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: cards[j],
            start: () => `top ${stick(cards[j]) + cards[j].offsetHeight + gap()}px`,
            end: () => `top ${stick(cards[j])}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        for (let i = 0; i < j; i++) {
          const k = j - i; // cards sitting on top of card i once card j has arrived
          const shade = cards[i].querySelector("[data-shade]");
          tl.fromTo(cards[i], { y: () => -(k - 1) * step() }, { y: () => -k * step(), immediateRender: false }, 0);
          if (shade) tl.fromTo(shade, { opacity: (k - 1) * 0.14 }, { opacity: k * 0.14, immediateRender: false }, 0);
        }
      }

      // step index (left column) and counter (phone header) follow the stack
      for (let i = 1; i < N; i++) {
        ScrollTrigger.create({
          trigger: cards[i],
          start: () => `top ${stick(cards[i]) + cards[i].offsetHeight * 0.5}px`,
          onEnter: () => setActive(i),
          onLeaveBack: () => setActive(i - 1),
        });
      }
    }, el);

    /* autoplay part: skipped with "reduce motion" */
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        q("[data-head]"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 80%", once: true } }
      );

      const loops: gsap.core.Timeline[] = [];
      cards.forEach((card, i) => {
        const r = gsap.utils.selector(card);
        const svg = r("svg")[0] as unknown as SVGSVGElement;

        // the diagram is laid out once, when its card comes into view
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true } })
          .fromTo(r("[data-draw]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", stagger: 0.06 }, 0)
          .fromTo(r("[data-pop]"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0.4);

        loops.push(runRequest(svg, STEPS[i].routes));
      });

      // the requests only run while the stack is on screen
      ScrollTrigger.create({
        trigger: stackEl,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
      });
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="approach" aria-label="My approach" className="bg-[#0a0a0a] px-6 py-20 text-[#f4f1ea] md:px-12 md:py-28 lg:px-14">
      {/*
        --head : height of the pinned heading bar (phone / tablet only)
        --top  : gap between the pinned heading and the stack
        --step : height of one title strip
        --stick: the line where every card sticks (the lowest slot of the stack)
      */}
      <div
        style={{ "--stick": `calc(var(--head) + var(--top) + ${N - 1} * var(--step))` } as React.CSSProperties}
        className="flex flex-col [--head:52px] [--step:52px] [--top:12px] md:[--head:60px] md:[--step:64px] md:[--top:16px] lg:grid lg:grid-cols-12 lg:gap-x-12 lg:[--head:0px] lg:[--step:64px] lg:[--top:24px]"
      >
        {/* phone / tablet: heading stays pinned while the cards stack beneath it */}
        <div
          data-head
          className="sticky top-0 z-30 -mx-6 flex h-[var(--head)] items-center justify-between border-b border-[#262624] bg-[#0a0a0a] px-6 md:-mx-12 md:px-12 lg:hidden"
        >
          <h2 className="text-xl font-semibold tracking-tight md:text-2xl">My approach</h2>
          <span data-count className="font-[family-name:var(--font-mono)] text-xs text-[#8b8780]">
            01 / {pad(N)}
          </span>
        </div>
        <p data-head className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-[#8b8780] md:text-base lg:hidden">
          {INTRO}
        </p>

        {/* laptop: sticky left column with the heading, the intro and a step index */}
        <div data-head className="hidden lg:sticky lg:top-[var(--top)] lg:col-span-4 lg:row-start-1 lg:block lg:self-start">
          <h2 className="text-6xl font-semibold leading-[0.95] tracking-[-0.04em] xl:text-7xl">My approach</h2>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-[#8b8780]">{INTRO}</p>
          <ul className="mt-10 border-t border-[#262624]">
            {STEPS.map((s) => (
              <li
                key={s.n}
                data-idx
                style={{ color: MUTED }}
                className="flex items-baseline gap-4 border-b border-[#262624] py-3 transition-colors duration-300 motion-reduce:transition-none"
              >
                <span data-idx-n style={{ color: MUTED }} className="font-[family-name:var(--font-mono)] text-xs transition-colors duration-300 motion-reduce:transition-none">
                  {s.n}
                </span>
                <span className="text-base">{s.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* the stack */}
        <ol data-stack className="mt-10 lg:col-span-8 lg:col-start-5 lg:row-start-1 lg:mt-0">
          {STEPS.map(({ n, title, lead, body, Art }) => (
            <li
              key={n}
              data-step
              style={{ top: "var(--stick)" }}
              className="sticky mb-6 flex min-h-[340px] flex-col border border-[#262624] bg-[#0d0d0c] will-change-transform md:mb-10 md:min-h-[400px] lg:min-h-[360px] lg:h-[clamp(360px,calc(100svh_-_var(--stick)_-_32px),520px)]"
            >
              {/* title strip: what stays visible once the next cards cover the rest */}
              <div className="flex h-[var(--step)] shrink-0 items-center gap-3 border-b border-[#262624] px-5 md:gap-4 md:px-8 lg:px-10">
                <span className="font-[family-name:var(--font-mono)] text-xs text-[#f04427]">{n}</span>
                <h3 className="text-lg font-semibold tracking-tight md:text-2xl lg:text-3xl">{title}</h3>
              </div>

              {/* diagram (left) + text (right) */}
              <div className="grid flex-1 grid-cols-[104px_1fr] items-center gap-x-5 px-5 py-6 md:grid-cols-[160px_1fr] md:gap-x-8 md:px-8 lg:grid-cols-[220px_1fr] lg:gap-x-12 lg:px-10">
                <div aria-hidden>
                  <svg viewBox="0 0 200 200" fill="none" className="aspect-square w-full">
                    <Art />
                    <Request />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium leading-snug tracking-tight text-[#f4f1ea] md:text-xl lg:text-2xl">{lead}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#8b8780] md:mt-3 md:text-base lg:max-w-[44ch]">{body}</p>
                </div>
              </div>

              {/* dims the card as newer ones stack on top of it */}
              <div data-shade aria-hidden className="pointer-events-none absolute inset-0 bg-[#0a0a0a] opacity-0" />
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