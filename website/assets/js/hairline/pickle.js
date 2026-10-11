/**
 * Pickle: an acid pickling tank on two skids, with a flat part hung from a
 * flight bar. The part's face is spotted with rust and scale. The pointer's
 * height lowers the rack; whatever has been under the acid comes back clean,
 * so the part shows a clean lower band and a rusty top. When the part is back
 * at rest a fresh one hangs in its place. The slider is how much rust it carries.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, seg,
  spring, stepS, mk, place, pointer, put, register, disposer, solid,
} = HL;

const X1 = 120, Y1 = 70, TH = 56, WT = 4, WR = 8, ZL = 48;
const LMAX = 36, REST = 34, WIRE = 10, PH = 30, PX0 = 42, PX1 = 78, PY = 35;
/** Rust spots on the part's face: [u along the part, v up from its bottom], clustered in patches. */
const RUST = [
  [46, 4], [49, 6], [47, 9], [52, 3], [58, 11], [61, 8], [64, 12], [70, 4], [73, 7], [71, 10],
  [45, 15], [48, 18], [55, 17], [67, 16], [74, 18], [50, 22], [53, 25], [57, 21], [62, 24], [66, 27],
  [70, 23], [75, 26], [45, 26], [59, 14], [68, 20], [52, 12], [63, 4], [56, 27], [48, 13], [72, 14],
];
/** The part's bottom for a rack lifted by l. */
const bottom = (l) => TH - WIRE - PH + l;
const REST_LOW = ZL - 0.45 * PH;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let N = value, over = false, low = REST_LOW;

  const C = Cam(45, 0.5, 1.74);
  fit(C, [[-6, 6, -6], [126, 64, -6], [126, 6, -6], [-6, 64, -6], [60, -12, TH + LMAX + 3], [60, 82, TH + LMAX + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(0, 0, X1, Y1, WR, 6), inner = rrect(WT, WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const g = mk("g", {}, svg);

  // far: the skids, the body, the rim's inner edge and the bath
  for (const y of [6, 56]) { const [r, i] = rings(-6, y, 126, y + 8, 2, 0.8); put(solid(g), prism(P, front, r, i, -6, 0)); }
  mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, TH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, inner, TH)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, inner, ZL)), class: "lo" }, g);

  const rack = mk("g", {}, g);

  const [pr, pi] = rings(PX0, PY - 1.5, PX1, PY + 1.5, 1.2, 0.6);
  const part = solid(rack), wires = mk("path", { class: "nf hi" }, rack);
  part.sil.classList.add("hi");
  const tide = mk("path", { class: "nf lo" }, rack);
  const spots = RUST.map(([u, v]) => ({ u, v, el: mk("circle", { r: 0, class: "dot m" }, rack) }));

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
  const bar = solid(g);

  const lift = spring(REST, { eps: 0.02 });
  let drawnLift = NaN;

  function drawRack(l) {
    if (l === drawnLift) return;
    drawnLift = l;
    const zb = TH + l, top = zb - WIRE, bot = top - PH;
    put(bar, prism(P, front, br, bi, zb, zb + 3));
    const from = Math.max(bot, ZL);
    put(part, top > ZL ? prism(P, front, pr, pi, from, top) : { sil: "", crease: "" });
    // the wires end at the part's top, or where they enter the bath
    const k = top >= ZL ? 1 : (zb - ZL) / WIRE, hang = P(60, PY, zb);
    const end = (x) => P(60 + (x - 60) * k, PY, zb - WIRE * k);
    wires.setAttribute("d", seg(hang, end(PX0 + 2)) + seg(hang, end(PX1 - 2)));
  }

  // A spot shows while it is above the bath and has never been under it.
  function drawSpots(l) {
    const bot = bottom(l);
    spots.forEach((s, i) => {
      const z = bot + s.v, show = i < N && z > ZL + 0.6 && low + s.v > ZL;
      s.el.setAttribute("r", show ? (i % 3 === 0 ? 2 : 1.4) : 0);
      if (show) place(s.el, P(s.u, PY + 1.6, z));
    });
    // the tide line: how far up the acid has reached, while it is above the bath
    const zt = bot + (ZL - low);
    tide.setAttribute("d", zt > ZL + 0.6 && ZL - low < PH ? seg(P(PX0 + 1, PY + 1.6, zt), P(PX1 - 1, PY + 1.6, zt)) : "");
  }

  let drawn = "";
  const B = register(stage, (dt) => {
    const m = stepS(lift, dt);
    if (over) low = Math.min(low, bottom(lift.x));
    // back at rest, a fresh part hangs in its place
    else if (Math.abs(lift.x - REST) < 0.3) low = REST_LOW;
    const key = lift.x.toFixed(2) + "|" + low.toFixed(2) + "|" + N;
    if (key !== drawn) { drawn = key; drawRack(lift.x); drawSpots(lift.x); }
    return m;
  });
  bag.add(B.unregister);

  function retarget(sy) {
    over = sy !== null;
    lift.t = over ? clamp((LMAX * (250 - sy)) / 170, 0, LMAX) : REST;
    const clean = clamp((ZL - Math.min(low, bottom(lift.t))) / PH, 0, 1);
    read.textContent = over ? `clean ${Math.round(clean * 20) * 5}%` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => retarget(p[1]), leave: () => retarget(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { N = Math.round(v); drawn = ""; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pickle",
  means: "A rusty part lowered into a pickling acid: wherever it has been under the bath, it comes back clean.",
  rules: [1, 5, 6, 8],
  range: [12, 20, 30],
  tour: [[200, 200], [200, 245], [200, 110], null],
  mount,
});
