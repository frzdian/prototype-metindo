/**
 * Soak: a degreasing tank on two skids, with a flat part hung from a flight
 * bar. The pointer's height lowers the rack; the part sinks into the bath and
 * the oil droplets on the surface lift and break up, spreading out from the
 * part as it goes deeper. The rack (bar wires and part) carries the bright
 * stroke. The slider is how far the cleaning reaches, in world units.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, ringAt, rings, rrect, run, seg,
  spring, stepS, flatDot, mk, place, pointer, put, register, disposer, solid,
} = HL;

const X1 = 120, Y1 = 70, TH = 56, WT = 4, WR = 8, ZL = 48;
const LMAX = 36, REST = 20, WIRE = 10, PH = 30, PX0 = 42, PX1 = 78, PY = 35;
const DROPS = [
  [14, 12], [30, 20], [24, 46], [12, 30], [96, 14], [106, 34], [86, 44], [100, 46],
  [50, 50], [66, 16], [44, 22], [78, 26], [70, 47], [32, 50], [58, 44], [90, 38],
];

/** How much of the part is under the bath, 0 to 1, for a rack lifted by l. */
const soaked = (l) => clamp((ZL - (TH - WIRE - PH + l)) / PH, 0, 1);
/** A droplet's distance to the part's footprint on the surface. */
const reach = (x, y) => Math.hypot(Math.max(0, Math.abs(x - (PX0 + PX1) / 2) - (PX1 - PX0) / 2), y - PY);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = false;

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

  // droplets behind the part's plane are painted before it, the rest after
  const back = mk("g", {}, g), rack = mk("g", {}, g), fore = mk("g", {}, g);
  const drops = DROPS.map(([x, y]) => {
    const parent = y < PY ? back : fore;
    return { x, y, d: reach(x, y), a: flatDot(parent, C, 2, "dot m"), b: flatDot(parent, C, 1.4, "dot m"), sp: spring(0, { eps: 0.002 }), drawn: NaN };
  });

  const [pr, pi] = rings(PX0, PY - 1.5, PX1, PY + 1.5, 1.2, 0.6);
  const part = solid(rack), wires = mk("path", { class: "nf hi" }, rack);
  part.sil.classList.add("hi");

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

  function drawDrop(dp) {
    const l = dp.sp.x;
    if (l === dp.drawn) return;
    dp.drawn = l;
    const z = ZL + l * 9;
    place(dp.a, P(dp.x - l * 6, dp.y - l * 3, z));
    place(dp.b, P(dp.x + l * 5, dp.y + l * 4, z + l * 4));
    const cls = l > 0.5 ? "dot off" : "dot m";
    dp.a.setAttribute("class", cls); dp.b.setAttribute("class", cls);
  }

  const B = register(stage, (dt) => {
    let m = stepS(lift, dt);
    drawRack(lift.x);
    // the cleaning front follows the part down: a droplet lifts once the front passes it
    const front = soaked(lift.x) * R;
    for (const dp of drops) {
      dp.sp.t = clamp((front - dp.d) / 10, 0, 1);
      if (stepS(dp.sp, dt)) m = true;
      drawDrop(dp);
    }
    return m;
  });
  bag.add(B.unregister);

  function retarget(sy) {
    over = sy !== null;
    lift.t = over ? clamp((LMAX * (250 - sy)) / 170, 0, LMAX) : REST;
    read.textContent = over ? `soak ${Math.round(soaked(lift.t) * 20) * 5}%` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => retarget(p[1]), leave: () => retarget(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "soak",
  means: "A part lowered into a degreasing bath: the deeper it soaks, the further the oil lifts off the surface around it.",
  rules: [1, 3, 5, 6],
  range: [30, 55, 85],
  tour: [[200, 90], [200, 245], [200, 170], null],
  mount,
});
