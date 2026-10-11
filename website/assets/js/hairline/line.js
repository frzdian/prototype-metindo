/**
 * Line: an alkaline zinc plating line on one plinth. Six process tanks, each
 * followed by a twin rinse tank, an extra tank for black parts, and a drying
 * oven, under an overhead rail. The pointer picks the station nearest it on
 * screen; the hoist lifts the part, travels along the rail and lowers it into
 * that station, whose rim takes the bright stroke. At rest the part sits in
 * the zinc tank. The slider is how deep the part is lowered.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run,
  seg, tween, tset, tval, tdone, mk, pointer, put, register, disposer, solid,
} = HL;

const TH = 26, OH = 40, WT = 2.5, Y0 = 0, Y1 = 30, YM = 15;
const RAIL = 66, UP = 46, PW = 7.5, PH = 17;
const LETTERS = ["a", "b", "c", "d", "e", "f"];

/** The tanks, left to right, and the stations the hoist can lower into. */
function layout() {
  const tanks = [], stations = [];
  LETTERS.forEach((l, i) => {
    const x0 = i * 54;
    tanks.push({ x0, x1: x0 + 26, h: TH, comps: [[x0, x0 + 26]] });
    stations.push({ x: x0 + 13, top: TH, tank: tanks.length - 1, comp: 0, name: `step ${l}` });
    tanks.push({ x0: x0 + 29, x1: x0 + 49, h: TH, comps: [[x0 + 29, x0 + 39], [x0 + 39, x0 + 49]] });
    stations.push({ x: x0 + 34, top: TH, tank: tanks.length - 1, comp: 0, name: `rinse ${l}1` });
    stations.push({ x: x0 + 44, top: TH, tank: tanks.length - 1, comp: 1, name: `rinse ${l}2` });
  });
  tanks.push({ x0: 324, x1: 350, h: TH, comps: [[324, 350]] });
  stations.push({ x: 337, top: TH, tank: tanks.length - 1, comp: 0, name: "step x" });
  tanks.push({ x0: 355, x1: 387, h: OH, comps: [[365, 377]], slot: true });
  stations.push({ x: 371, top: OH, tank: tanks.length - 1, comp: 0, name: "oven g" });
  return { tanks, stations };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const { tanks, stations } = layout();
  const REST = stations.findIndex((s) => s.name === "step d");

  const C = Cam(45, 0.5, 1.12);
  fit(C, [[-6, -6, -5], [393, 36, -5], [393, -6, -5], [-6, 36, -5], [-6, YM, RAIL + 4], [393, YM, RAIL + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-6, -6, 393, 36, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, -5, 0));
  const post = (x) => { const [r, i] = rings(x - 2, YM - 2, x + 2, YM + 2, 1.2, 0.5); put(solid(g), prism(P, front, r, i, 0, RAIL)); };
  post(-3);

  // Each tank: a far half (body and openings) and a near half (the front wall from the openings down).
  for (const t of tanks) {
    const outer = rrect(t.x0, Y0, t.x1, Y1, 4, 5);
    const yi0 = t.slot ? 5 : Y0 + WT, yi1 = t.slot ? 25 : Y1 - WT;
    const inners = t.comps.map(([a, b], k) => rrect(a + (k === 0 && !t.slot ? WT : 1), yi0, b - (k === t.comps.length - 1 && !t.slot ? WT : 1), yi1, 2, 4));
    t.far = mk("g", {}, g);
    mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, t.h)))), class: "sil" }, t.far);
    t.rim = inners.map((r) => mk("path", { d: poly(ringAt(P, r, t.h)), class: "nf" }, t.far));
    const near = mk("g", {}, g);
    const iF = inners.map((r) => LR(ringAt(P, run(r, front), t.h)));
    const oT = LR(ringAt(P, run(outer, front), t.h)), oB = LR(ringAt(P, run(outer, front), 0));
    mk("path", { d: poly([...iF.flat(), oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), class: "fo" }, near);
    mk("path", { d: open(oT), class: "nf lo" }, near);
    t.lip = iF.map((pts) => mk("path", { d: open(pts), class: "nf" }, near));
    mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, near);
    if (t.slot) {
      // the oven door, set into its front face
      const onFront = (ring) => ring.map((q) => P(q.u, Y1, q.v));
      mk("path", { d: poly(onFront(rrect(t.x0 + 4, 5, t.x1 - 4, 33, 3, 5))), class: "nf" }, near);
      mk("path", { d: seg(P(t.x1 - 8, Y1, 16), P(t.x1 - 8, Y1, 22)), class: "nf" }, near);
    }
  }
  post(390);

  // The rack: a wire and a flat part, moved in the paint order to just after the far half of the tank it is over.
  const rack = mk("g", {}, g), wire = mk("path", { class: "nf" }, rack), part = solid(rack);
  const [prr, pri] = rings(-1, YM - PW, 1, YM + PW, 0.9, 0.45);
  const [rr, ri] = rings(-6, YM - 2, 393, YM + 2, 1.2, 0.5);
  put(solid(g), prism(P, front, rr, ri, RAIL, RAIL + 3));
  const car = solid(g);
  const [cr, ci] = rings(-4, YM - 3.5, 4, YM + 3.5, 1.6, 0.7);

  const cx = tween(stations[REST].x), dip = tween(1);
  let want = REST, lowered = true, lastKey = "", host = null;

  const shift = (ring, dx) => ring.map((q) => ({ ...q, u: q.u + dx }));
  const nearest = (x) => stations.reduce((a, s, i) => (Math.abs(s.x - x) < Math.abs(stations[a].x - x) ? i : a), 0);

  function drawRack(x, f) {
    const s = stations[nearest(x)], bot = UP + (s.top - depth - UP) * f;
    const key = x.toFixed(2) + "|" + bot.toFixed(2);
    if (key === lastKey) return;
    lastKey = key;
    const t = tanks[s.tank];
    if (host !== t) { host = t; t.far.after(rack); }
    put(part, prism(P, front, shift(prr, x), shift(pri, x), bot, bot + PH));
    put(car, prism(P, front, shift(cr, x), shift(ci, x), RAIL - 2, RAIL + 5));
    wire.setAttribute("d", seg(P(x, YM, RAIL - 2), P(x, YM - PW + 1, bot + PH)) + seg(P(x, YM, RAIL - 2), P(x, YM + PW - 1, bot + PH)));
  }

  function mark(i, on) {
    const s = stations[i], t = tanks[s.tank];
    t.rim[s.comp].classList.toggle("hi", on);
    t.lip[s.comp].classList.toggle("hi", on);
  }
  mark(REST, true);

  const B = register(stage, (_dt, now) => {
    const x = tval(cx, now);
    // lower the part once the hoist has arrived over the station it was sent to
    if (!lowered && tdone(cx, now) && Math.abs(x - stations[want].x) < 0.01) { lowered = true; tset(dip, 1, now, 0); }
    drawRack(x, tval(dip, now));
    return !tdone(cx, now) || !tdone(dip, now) || !lowered;
  });
  bag.add(B.unregister);

  function choose(i, label) {
    read.textContent = label;
    if (i === want) return;
    const now = performance.now();
    mark(want, false); mark(i, true);
    want = i; lowered = false;
    tset(dip, 0, now, 0);
    tset(cx, stations[i].x, now, 300);
    B.wake();
  }

  // Hit test: the station whose resting rim centre is nearest the pointer's screen x. Rims never move.
  const sx = stations.map((s) => P(s.x, YM, s.top)[0]);
  const pick = (x) => sx.reduce((a, v, i) => (Math.abs(v - x) < Math.abs(sx[a] - x) ? i : a), 0);

  bag.add(pointer(stage, {
    move: (p) => { const i = pick(p[0]); choose(i, stations[i].name); },
    leave: () => choose(REST, "rest"),
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { depth = v; lastKey = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "line",
  means: "A plating line: the hoist carries the part along the rail and lowers it into the tank you point at.",
  rules: [1, 4, 5, 6, 8],
  range: [8, 12, 16],
  tour: [[70, 170], [300, 210], [190, 190], null],
  mount,
});
