/**
 * Scrub: an electro cleaner. A part hangs from a flight bar between two steel
 * electrode plates that stand just clear of the bath, in a tank on two skids. The pointer's
 * height sets the current: gas bubbles rise off the part and scrub it, more of
 * them and higher as the current climbs, nearest the part first. The part and
 * its wires carry the bright stroke. The slider is the line's top current, in A/dm².
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, seg,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const X1 = 120, Y1 = 70, TH = 56, WT = 4, WR = 8, ZL = 48, BAR = 72, PY = 35;
const PX0 = 44, PX1 = 76, PTOP = 62, ET = ZL + 3, REST = 0.4;
/** Bubbles round the part: [x, y, when it starts (0..1 of the current), how high it climbs]. */
const BUBBLES = [
  [47, 31, 0.05, 1], [52, 39, 0.1, 0.8], [58, 30.5, 0.15, 1.2], [63, 39.5, 0.08, 0.9], [69, 31, 0.2, 1.1],
  [74, 38.5, 0.12, 0.7], [50, 28, 0.3, 1.3], [61, 42, 0.35, 1], [67, 27.5, 0.4, 1.2], [72, 42.5, 0.32, 0.9],
  [45, 41, 0.45, 0.8], [56, 26, 0.5, 1.4], [79, 34, 0.55, 1], [41, 33, 0.6, 1.1], [64, 45, 0.65, 0.9],
  [53, 44.5, 0.7, 1.2], [70, 24.5, 0.75, 1.3], [59, 23, 0.8, 1], [76, 45, 0.85, 1.1], [47, 24, 0.9, 1.2],
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;

  const C = Cam(45, 0.5, 1.74);
  fit(C, [[-6, 6, -6], [126, 64, -6], [126, 6, -6], [-6, 64, -6], [60, -12, BAR + 30], [60, 82, BAR + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(0, 0, X1, Y1, WR, 6), inner = rrect(WT, WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const g = mk("g", {}, svg);
  const plate = (x0, x1, y, t, z0, z1) => { const [r, i] = rings(x0, y - t, x1, y + t, 1, 0.45); return prism(P, front, r, i, z0, z1); };

  // far: the skids, the body, the rim's inner edge and the bath
  for (const y of [6, 56]) { const [r, i] = rings(-6, y, 126, y + 8, 2, 0.8); put(solid(g), prism(P, front, r, i, -6, 0)); }
  mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, TH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, inner, TH)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, inner, ZL)), class: "lo" }, g);

  // back to front: the far electrode, the bubbles behind the part, the part, the bubbles in front, the near electrode
  put(solid(g), plate(22, 98, 14, 1, ZL, ET));
  const back = mk("g", {}, g);
  const part = solid(g);
  put(part, plate(PX0, PX1, PY, 1.5, ZL, PTOP));
  part.sil.classList.add("hi");
  const hang = P(60, PY, BAR);
  mk("path", { d: seg(hang, P(PX0 + 3, PY, PTOP)) + seg(hang, P(PX1 - 3, PY, PTOP)), class: "nf hi" }, g);
  const fore = mk("g", {}, g);
  put(solid(g), plate(22, 98, 56, 1, ZL, ET));

  const bubbles = BUBBLES.map(([x, y, t, h]) => ({ x, y, t, h, el: mk("ellipse", { rx: 0, ry: 0, class: "nf" }, y < PY ? back : fore) }));

  // near: one opaque piece from the rim's inner edge down to the floor, and a sight glass set into it
  const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
  const iF = LR(ringAt(P, run(inner, front), TH)), oT = LR(ringAt(P, run(outer, front), TH)), oB = LR(ringAt(P, run(outer, front), 0));
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), class: "fo" }, g);
  mk("path", { d: open(oT), class: "nf lo" }, g);
  mk("path", { d: open(iF), class: "nf" }, g);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, g);
  const onFront = (ring) => ring.map((q) => P(q.u, Y1, q.v));
  mk("path", { d: poly(onFront(rrect(14, 12, 23, 52, 3.5, 5))), class: "nf" }, g);
  mk("path", { d: poly(onFront(rrect(16, 14, 21, 50, 1.8, 5))), class: "nf lo" }, g);
  mk("path", { d: seg(P(16, Y1, ZL - 2), P(21, Y1, ZL - 2)), class: "nf" }, g);

  // the flight bar, across the tank, painted last: it sits above everything
  const [br, bi] = rings(57, -12, 63, 82, 1.5, 0.6);
  put(solid(g), prism(P, front, br, bi, BAR, BAR + 3));

  const amp = spring(REST, { eps: 0.002 });
  let drawn = NaN;

  /** The share of the bubbles' climb the current gives, after the slider's top current. */
  const level = (a) => a * top / 12;

  function draw(a) {
    const L = level(a);
    if (L === drawn) return;
    drawn = L;
    for (const b of bubbles) {
      const k = clamp((L - b.t) / 0.25, 0, 1), r = k ? 1.5 + b.h * 1.2 : 0;
      const [sx, sy] = P(b.x, b.y, ZL + 1.5 + k * b.h * 42 * L);
      b.el.setAttribute("cx", sx); b.el.setAttribute("cy", sy);
      b.el.setAttribute("rx", r); b.el.setAttribute("ry", r);
    }
  }

  const B = register(stage, (dt) => { const m = stepS(amp, dt); draw(amp.x); return m; });
  bag.add(B.unregister);

  function retarget(sy) {
    amp.t = sy === null ? REST : clamp((250 - sy) / 170, 0, 1);
    read.textContent = sy === null ? "rest" : `${Math.round(amp.t * top)} A/dm²`;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => retarget(p[1]), leave: () => retarget(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { top = v; drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "scrub",
  means: "An electro cleaner: the more current you give it, the more gas bubbles rise off the part and scrub it clean.",
  rules: [1, 3, 5, 6],
  range: [5, 8, 12],
  tour: [[200, 230], [200, 90], [200, 160], null],
  mount,
});
