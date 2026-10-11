/**
 * Dip: the passivation end of the line. Four tanks on one plinth, for a blue
 * or a yellow trivalent finish, a black one, and the sealer black parts go
 * through after it, numbered by one to four dots on their fronts, under an
 * overhead rail. The pointer picks the tank nearest it on screen; the hoist
 * lifts the part, travels and dips it there, and that tank's rim turns bright.
 * At rest the part sits in the blue tank. The slider is how deep it dips.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run,
  seg, tween, tset, tval, tdone, mk, place, pointer, put, register, disposer, solid,
} = HL;

const TH = 30, WT = 3, Y0 = 0, Y1 = 40, YM = 20, END = 204;
const RAIL = 72, UP = 50, PW = 10, PH = 20;
const FINISHES = ["blue", "yellow", "black", "seal"];

/** The four tanks, left to right, one station each. */
function layout() {
  const tanks = [], stations = [];
  FINISHES.forEach((name, i) => {
    const x0 = i * 50;
    tanks.push({ x0, x1: x0 + 42, h: TH, comps: [[x0, x0 + 42]], dots: i + 1 });
    stations.push({ x: x0 + 21, top: TH, tank: i, comp: 0, name });
  });
  return { tanks, stations };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const { tanks, stations } = layout();
  const REST = 0;

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-6, -6, -5], [END, Y1 + 6, -5], [END, -6, -5], [-6, Y1 + 6, -5], [-6, YM, RAIL + 4], [END, YM, RAIL + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-6, -6, END, Y1 + 6, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, -5, 0));
  const post = (x) => { const [r, i] = rings(x - 2, YM - 2, x + 2, YM + 2, 1.2, 0.5); put(solid(g), prism(P, front, r, i, 0, RAIL)); };
  post(-3);

  // Each tank: a far half (body and openings) and a near half (the front wall from the openings down).
  for (const t of tanks) {
    const outer = rrect(t.x0, Y0, t.x1, Y1, 5, 5);
    const inners = t.comps.map(([a, b]) => rrect(a + WT, Y0 + WT, b - WT, Y1 - WT, 3, 4));
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
    // the tank's number: one to four dots on its front
    for (let k = 0; k < t.dots; k++) place(mk("circle", { r: 1.3, class: "dot m" }, near), P(t.x0 + 8 + k * 4.5, Y1, 8));
  }
  post(END - 3);

  // The rack: a wire and a flat part, moved in the paint order to just after the far half of the tank it is over.
  const rack = mk("g", {}, g), wire = mk("path", { class: "nf" }, rack), part = solid(rack);
  const [prr, pri] = rings(-1, YM - PW, 1, YM + PW, 0.9, 0.45);
  const [rr, ri] = rings(-6, YM - 2, END, YM + 2, 1.2, 0.5);
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
  name: "dip",
  means: "Passivation: the hoist dips the zinc-plated part into the finish you point at, blue, yellow, or black and then sealer.",
  rules: [1, 4, 5, 8, 10],
  range: [10, 15, 20],
  tour: [[150, 150], [250, 200], [300, 220], null],
  mount,
});
