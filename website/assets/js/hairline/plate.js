/**
 * Plate: alkaline zinc plating. A part hangs from a flight bar between two
 * anode baskets full of zinc balls, in a tank on two skids. The pointer's
 * height sets how long it plates: the zinc layer on the part thickens (its
 * crease marks the steel core inside) while balls in the baskets dissolve.
 * The part carries the bright stroke. The slider is the target thickness, in µm.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, seg,
  spring, stepS, flatDot, mk, pointer, put, register, disposer, solid,
} = HL;

const X1 = 120, Y1 = 70, TH = 56, WT = 4, WR = 8, ZL = 48, BAR = 72, PY = 35;
const PX0 = 44, PX1 = 76, PTOP = 62, BT = ZL + 6, REST = 0.45;
/** The zinc balls in one basket: [x, y offset from its middle], and the order they dissolve in. */
const BALLS = [];
for (let i = 0; i < 9; i++) for (const dy of [-2, 2]) BALLS.push([30 + i * 7.5 + (dy > 0 ? 3.5 : 0), dy, ((i * 7 + (dy > 0 ? 5 : 0)) % 18) / 18]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;

  const C = Cam(45, 0.5, 1.74);
  fit(C, [[-6, 6, -6], [126, 64, -6], [126, 6, -6], [-6, 64, -6], [60, -12, BAR + 30], [60, 82, BAR + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(0, 0, X1, Y1, WR, 6), inner = rrect(WT, WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const g = mk("g", {}, svg);


  // far: the skids, the body, the rim's inner edge and the bath
  for (const y of [6, 56]) { const [r, i] = rings(-6, y, 126, y + 8, 2, 0.8); put(solid(g), prism(P, front, r, i, -6, 0)); }
  mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, TH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, inner, TH)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, inner, ZL)), class: "lo" }, g);

  // back to front: the far basket, the part, the near basket
  // an anode basket: an open collar above the bath, its zinc balls on top
  const basket = (y) => {
    const [r, i] = rings(26, y - 4, 94, y + 4, 2, 1.2);
    put(solid(g), prism(P, front, r, i, ZL, BT));
    return BALLS.map(([x, dy, o]) => ({ o, el: flatDot(g, C, 1.6, "dot m"), at: P(x, y + dy, BT - 0.5) }));
  };
  const balls = basket(13);
  const part = solid(g);
  part.sil.classList.add("hi");
  const hang = P(60, PY, BAR);
  mk("path", { d: seg(hang, P(PX0 + 3, PY, PTOP)) + seg(hang, P(PX1 - 3, PY, PTOP)), class: "nf hi" }, g);
  balls.push(...basket(57));
  balls.forEach((b) => b.el.setAttribute("transform", `translate(${b.at[0]} ${b.at[1]})`));

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

  const time = spring(REST, { eps: 0.002 });
  let drawn = NaN;

  /** How far the plating has gone, 0 to 1, after the slider's target thickness. */
  const level = (t) => clamp(t * top / 20, 0, 1);

  function draw(t) {
    const L = level(t);
    if (L === drawn) return;
    drawn = L;
    // the zinc layer: the silhouette grows round a core whose outline stays put
    const th = 1 + 2.8 * L, [r, i] = rings(PX0 - th + 1, PY - th, PX1 + th - 1, PY + th, 1, th - 0.7);
    put(part, prism(P, front, r, i, ZL, PTOP + th - 1));
    for (const b of balls) b.el.setAttribute("class", b.o < L * 0.95 ? "dot off" : "dot m");
  }

  const B = register(stage, (dt) => { const m = stepS(time, dt); draw(time.x); return m; });
  bag.add(B.unregister);

  function retarget(sy) {
    time.t = sy === null ? REST : clamp((250 - sy) / 170, 0, 1);
    read.textContent = sy === null ? "rest" : `zinc ${Math.round(time.t * top)} µm`;
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
  name: "plate",
  means: "Alkaline zinc plating: the longer it runs, the thicker the zinc on the part, and the emptier the anode baskets.",
  rules: [1, 3, 5, 6],
  range: [8, 12, 20],
  tour: [[200, 230], [200, 90], [200, 160], null],
  mount,
});
