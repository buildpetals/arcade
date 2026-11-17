/* Build Petals Arcade kit (Soft Paper look): shared HUD, screens, vector pieces, input and loyalty messaging.
   A game calls Arcade.run({...}). See any game folder for an example. */
(function () {
  const A = (window.Arcade = {});
  const LEVELS = 10;
  A.LEVELS = LEVELS;

  /* ---------- fonts + styles ---------- */
  const head = document.head;
  head.insertAdjacentHTML("beforeend",
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet">');
  const css = `
  :root{--navy:#101a42;--ink:#2a3260;--lav:#b79ae0;--lav2:#9a7fd0;--sky:#9fd3f5;--cream:#fffaf0;--gold:#ffd166;--rose:#e2577f;--paper:#f6efff;--shadow:0 3px 8px rgba(40,30,70,.18)}
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{margin:0;height:100%;color:var(--ink);font-family:"Fredoka",system-ui,sans-serif;font-weight:500;overflow:hidden;user-select:none;-webkit-user-select:none}
  body{background:linear-gradient(#ece2fb,#f8f1ff 60%);display:flex;flex-direction:column;align-items:center;position:relative}
  body::after{content:"";position:fixed;left:0;right:0;bottom:0;height:34%;z-index:-1;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 120' preserveAspectRatio='none'%3E%3Cpath d='M0 50 C120 20 240 70 400 35 V120 H0Z' fill='%23e3d6f8'/%3E%3Cpath d='M0 80 C140 55 260 100 400 70 V120 H0Z' fill='%23d9c9f4'/%3E%3C/svg%3E") bottom/100% 100% no-repeat}
  #app{width:100%;height:100%;max-width:640px;display:flex;flex-direction:column;align-items:center;padding:10px 10px 12px;gap:8px}
  header{width:100%;display:flex;align-items:center;justify-content:space-between;gap:6px}
  .ttl{font:700 clamp(15px,4.4vw,20px)/1.2 "Fredoka",sans-serif;display:flex;align-items:center;gap:6px;color:var(--ink);text-decoration:none;letter-spacing:.02em}
  .ttl span{color:var(--lav2)} .ttl i{font-style:normal;color:var(--lav2);font-size:.8em}
  .row{display:flex;gap:6px;align-items:center}
  .pill{background:#fff;border-radius:999px;padding:5px 11px;font-weight:800;font-size:clamp(11px,3vw,14px);white-space:nowrap;box-shadow:var(--shadow);color:var(--ink)}
  .pill b{color:var(--rose)}
  .ibtn{background:#fff;color:var(--lav2);border:0;border-radius:12px;width:34px;height:34px;font-size:15px;cursor:pointer;box-shadow:var(--shadow);flex:none}
  .ibtn:active{transform:translateY(1px);box-shadow:0 1px 3px rgba(40,30,70,.2)}
  .home{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:48px;padding:10px 14px;border-radius:16px;background:var(--gold);color:var(--navy);font:700 17px "Fredoka",sans-serif;text-decoration:none;box-shadow:var(--shadow);flex:none}
  #bar{width:100%;height:10px;border-radius:99px;background:#fff;box-shadow:inset 0 1px 2px rgba(40,30,70,.12);overflow:hidden;flex:none}
  #bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#cbb6ee,#f3a5b7);border-radius:99px;transition:width .25s}
  #stage{position:relative;flex:1;width:100%;min-height:0;display:flex;align-items:center;justify-content:center}
  #cv{display:block;border-radius:20px;box-shadow:0 6px 18px rgba(40,30,70,.22),0 0 0 4px #fff;touch-action:none}
  .ov{position:absolute;inset:0;bottom:calc(-1 * var(--padh,0px));z-index:5;display:flex;align-items:center;justify-content:center;padding:12px;background:rgba(236,226,251,.35)}
  .card{background:var(--cream);color:var(--ink);border-radius:22px;padding:20px 18px 16px;width:min(94%,390px);text-align:center;box-shadow:0 10px 30px rgba(40,30,70,.25);max-height:100%;overflow:auto}
  .card h1{margin:2px 0 8px;font:700 26px/1.2 "Fredoka",sans-serif;color:var(--ink)} .card h1 span{color:var(--lav2)}
  .card p{margin:6px 0;font-size:15px;line-height:1.4;font-weight:600}
  .legend{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:10px 0 4px}
  .legend div{display:flex;align-items:center;gap:4px;background:#fff;border-radius:12px;padding:3px 8px 3px 3px;font-size:12px;font-weight:800;box-shadow:0 2px 5px rgba(40,30,70,.12)}
  .btn{display:inline-block;background:var(--lav);color:#fff;border:0;border-radius:14px;padding:12px 22px;font:700 17px "Fredoka",sans-serif;cursor:pointer;box-shadow:0 4px 10px rgba(122,90,190,.35);text-decoration:none;margin:6px 4px 2px}
  .btn:active{transform:translateY(2px)}
  .btn.alt{background:#fff;color:var(--lav2);box-shadow:var(--shadow)} .btn.ghost{background:transparent;box-shadow:none;border:2px solid var(--lav);color:var(--lav2);padding:10px 16px;font-size:15px}
  .btn:disabled{opacity:.55}
  .hint{font-size:12px!important;opacity:.7}
  .big{font:700 40px/1.1 "Fredoka",sans-serif;color:var(--rose);margin:6px 0}
  .stars{font-size:22px;letter-spacing:2px;margin:2px 0}
  .pts{font-size:14px;font-weight:700;margin:6px 0}
  .levels{display:grid;grid-template-columns:repeat(10,1fr);gap:4px;margin:8px 0}
  .levels span{height:10px;border-radius:99px;background:#e9e0f8} .levels span.on{background:var(--lav)}
  #dpad{display:none;grid-template-columns:repeat(3,54px);grid-template-rows:repeat(2,46px);gap:6px;flex:none}
  #dpad button{background:#fff;border:0;color:var(--lav2);border-radius:14px;font-size:20px;touch-action:none;box-shadow:var(--shadow)}
  #dpad button:active{background:var(--lav);color:#fff}
  #dpad .up{grid-column:2;grid-row:1}#dpad .left{grid-column:1;grid-row:2}#dpad .down{grid-column:2;grid-row:2}#dpad .right{grid-column:3;grid-row:2}
  @media (pointer:coarse){#dpad.on{display:grid}}
  .hidden{display:none!important}
  .toast{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:#fff;color:var(--rose);font-weight:800;padding:6px 14px;border-radius:999px;font-size:14px;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap;box-shadow:var(--shadow)}
  .toast.on{opacity:1}
  @media (max-width:460px){header{flex-wrap:wrap;justify-content:center;row-gap:6px}.ttl{width:100%;justify-content:center}.pill{padding:4px 9px}}
  #app:not(.playing) #dpad{visibility:hidden}
  #app.swipeall.playing{touch-action:none}
  @media (max-height:640px){
    .card{padding:14px 14px 12px}
    .card h1{font-size:21px;margin:2px 0 6px}
    .card p{font-size:14px;margin:4px 0}
    .legend{margin:6px 0 2px;gap:4px}
    .legend div{font-size:11px;padding:2px 6px 2px 2px}
    .legend canvas{width:22px!important;height:22px!important}
    .btn{padding:9px 18px;font-size:16px;margin:4px 4px 2px}
    .big{font-size:30px;margin:4px 0}
    .levels{margin:6px 0}
  }`;
  head.insertAdjacentHTML("beforeend", "<style>" + css + "</style>");

  /* ---------- safe storage ---------- */
  A.store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  /* ---------- pixel sprites (10x10, '.' = empty) ---------- */
  const G = { g: "#4cc36a", G: "#2b8a44" };
  const ART = {
    rose: { name: "Rose", pal: Object.assign({ p: "#ff8fc2", P: "#d94f8c", w: "#ffd6ea" }, G), art: ["...PPPP...", "..PppppP..", ".PpPwwPpP.", ".PppPPppP.", ".PpppppPP.", "..PPpPPP..", "...PPPP...", ".gg.g.....", "..ggG.gg..", "....G....."] },
    tulip: { name: "Tulip", pal: Object.assign({ r: "#ff5a5f", R: "#c3283a", w: "#ffb3b5" }, G), art: ["..r.rr.r..", "..rrrRrr..", "..rwrrRr..", "..rwrrRr..", "..rrrrRr..", "...RRRR...", "....gG....", ".gg.gG....", "..gggG....", "....gG...."] },
    daisy: { name: "Daisy", pal: { w: "#ffffff", W: "#d9d4f0", y: "#ffd166", Y: "#f08c00" }, art: ["....ww....", ".w..ww..w.", "..wwWWww..", "..wWyyWw..", "wwWyYYyWww", "wwWyYYyWww", "..wWyyWw..", "..wwWWww..", ".w..ww..w.", "....ww...."] },
    bluebell: { name: "Bachelor's Button", pal: { b: "#4f7cff", B: "#2b4bc9", l: "#9fb8ff", w: "#ffffff", y: "#ffd166" }, art: [".b..b..b..", "..bBlBb...", "b.blBlb.b.", ".bBbwbBb..", "bblwywlbb.", ".bBbwbBb..", "b.blBlb.b.", "..bBlBb...", ".b..b..b..", ".........."] },
    sunflower: { name: "Sunflower", pal: { y: "#ffd166", Y: "#f2a900", b: "#8a4b1f", B: "#5c2e0e" }, art: ["...yYYy...", "..yYyyYy..", ".yybbbbyy.", "yYbbBbbbYy", "yybBbbBbyy", "yybbbBbbyy", "yYbbBbbbYy", ".yybbbbyy.", "..yYyyYy..", "...yYYy..."] },
    mystery: { name: "Mystery box", pal: { y: "#ffd166", Y: "#e0a400", n: "#101a42" }, art: ["YYYYYYYYYY", "YyyyyyyyyY", "YyyynnnyyY", "YyynyyynyY", "YyyyyyynyY", "YyyyynnyyY", "YyyyynyyyY", "YyyyyyyyyY", "YyyyynyyyY", "YYYYYYYYYY"] },
    weed: { name: "Weed", pal: { g: "#6fd24a", G: "#2e7d1f", b: "#8a4b1f", B: "#5c2e0e", r: "#ff5a5f", k: "#101a42" }, art: ["....g.....", ".g..gg..g.", ".gg.g..gg.", "..gggggg..", "..gkGGkg..", ".ggGrrGgg.", ".gggGGggg.", "...gGGg...", "bbbbbbbbbb", "BbBbBbBbBb"] },
    bug: { name: "Beetle", pal: { k: "#22223a", K: "#5a3d8a", p: "#c9b5ec" }, art: ["..k....k..", "...k..k...", "...kkkk...", "..kKKKKk..", ".kKpKKpKk.", "kkKKKKKKkk", ".kKpKKpKk.", "..kKKKKk..", ".k.kkkk.k.", "k........k"] },
    bee: { name: "Bee", pal: { w: "#ffffff", W: "#cfe3ff", y: "#ffd166", k: "#22223a", n: "#ffffff" }, art: ["..........", "..ww.ww...", ".wWwwWw...", "..ww.ww...", ".ykkykky..", "yykkykkyyn", "yykkykkyyk", ".ykkykky..", "..k...k...", ".........."] },
    ladybug: { name: "Lady Bird", pal: { r: "#e8343f", k: "#1a1a2a", w: "#ffffff" }, art: ["...kkkk...", "..kwkkwk..", ".rrrrkrrr.", "rrkrrkrkrr", "rrrrrkrrrr", "rkrrrkrrkr", "rrrrrkrrrr", ".rrkrkrkr.", "..rrrkrr..", "...k..k..."] },
    frog: { name: "Frog", pal: { g: "#6fd24a", G: "#2e7d1f", w: "#ffffff", k: "#101a42", p: "#ff8fc2" }, art: ["..........", ".ww....ww.", "wkwg..gwkw", ".wwggggww.", ".gggggggg.", "gGggppggGg", "gGggggggGg", ".gGGggGGg.", "gg.g..g.gg", "g........g"] },
    vase: { name: "Vase", pal: { b: "#4f7cff", B: "#2b4bc9", w: "#cfe3ff", p: "#ff8fc2", y: "#ffd166", g: "#4cc36a" }, art: ["..p.y.p...", "..g.g.g...", "...ggg....", "...BBB....", "..BbbbB...", ".BbwbbbB..", ".BbwbbbB..", ".BbbbbbB..", "..BbbbB...", "...BBB...."] },
    lily: { name: "Lily", pal: { w: "#ffffff", W: "#d9d4f0", y: "#ffd166", Y: "#f08c00", g: "#4cc36a", G: "#2b8a44" }, art: ["....w.....", "...wWw....", ".w.wWw.w..", ".wwwywww..", "..wyYyw...", ".wwwywww..", ".w.wWw.w..", "....g.....", "..g.g.....", "...gG....."] },
    poppy: { name: "Poppy", pal: { o: "#ff7a3d", O: "#c94a12", k: "#22223a", K: "#4a3a6a", g: "#4cc36a", G: "#2b8a44" }, art: ["..oooo....", ".oOooOo...", "oOooooOo..", "ooOkkOoo..", "oookKkoo..", "oOokkoOo..", ".oOooOo...", "..oooo.g..", ".....gg...", "....gG...."] },
    pot: { name: "Flower pot", pal: { o: "#c96a3a", O: "#8a3f1c", b: "#5c2e0e", g: "#4cc36a", G: "#2b8a44", y: "#ffd166" }, art: ["....y.....", "...yGy....", "....g.....", "..g.g.g...", "...ggg....", "OOOOOOOOOO", ".oooooooo.", ".oOooooOo.", "..oooooo..", "..OOOOOO.."] },
    hedge: { name: "Hedge", pal: { g: "#4cc36a", G: "#2b8a44", d: "#1f6b32", p: "#ff8fc2", b: "#8a4b1f" }, art: [".gGgGgGg..", "gGgdgGgdg.", "GgpgGgGgG.", "gGgGgdgpg.", "GdgGgGgGg.", "gGgpgGdgG.", "GgGgGgGgg.", ".gGdgGgG..", "...bb.bb..", "...bb.bb.."] },
    hive: { name: "Beehive", pal: { y: "#ffd166", Y: "#e0a400", b: "#8a4b1f", k: "#22223a" }, art: ["....bb....", "...YYYY...", "..yyyyyy..", ".YYYYYYYY.", ".yyykkyyy.", "YYYkkkkYYY", "yyyykkyyyy", ".YYYYYYYY.", "..yyyyyy..", "...YYYY..."] },
    mower: { name: "Mower", pal: { r: "#e8343f", R: "#a3202a", k: "#22223a", w: "#cfd3e6", g: "#6fd24a" }, art: ["......kk..", ".......k..", "......k...", ".rrrrrk...", "rRrrrrr...", "rrrrrrrr..", "RRRRRRRR..", ".kk...kk..", ".kwk.kwk..", "gkkggkkggg"] },
    bud: { name: "Bud", pal: { p: "#ff8fc2", P: "#d94f8c", g: "#4cc36a", G: "#2b8a44" }, art: ["....pp....", "...pPPp...", "...pPpp...", "...gPPg...", "....gg....", "....gG....", ".gg.gG....", "..ggGG.gg.", "....gGgg..", "....gG...."] },
    snail: { name: "Snail", pal: { s: "#c98450", S: "#8a4b1f", b: "#ffd6a0", k: "#22223a" }, art: ["..........", "....SSS...", "...SsssS..", "..SsSSsS..", "..SsSsSS..", "k.SssssS..", "bk.SSSS...", "bbbbbbbbb.", ".bbbbbbbbb", ".........."] },
  };
  ART.phantom = { name: "Phantom Rose (glow)", pal: Object.assign({}, ART.rose.pal, { p: "#b8ffc8", P: "#4dd97a", w: "#ffffff", g: "#9dffb0", G: "#4dd97a" }), art: ART.rose.art, glow: "#9dffb0" };

  function bake(s) {
    const c = document.createElement("canvas"); c.width = c.height = 10;
    const x = c.getContext("2d");
    s.art.forEach((row, y) => [...row].forEach((ch, i) => { if (s.pal[ch]) { x.fillStyle = s.pal[ch]; x.fillRect(i, y, 1, 1); } }));
    return c;
  }
  A.sprites = {};
  for (const k in ART) A.sprites[k] = Object.assign({ key: k }, ART[k], { img: bake(ART[k]) });
  /* make a recoloured copy: Arcade.variant("rose","blueRose",{p:"#8fc7ff",P:"#4f7cff"},"Blue Rose") */
  A.variant = (base, key, pal, name) => {
    const b = ART[base], s = { name: name || b.name, pal: Object.assign({}, b.pal, pal), art: b.art };
    return (A.sprites[key] = Object.assign({ key }, s, { img: bake(s) }));
  };
  A.drawSprite = (ctx, s, x, y, size, opt) => {
    if (typeof s === "string") s = A.sprites[s];
    ctx.save(); ctx.imageSmoothingEnabled = false;
    if (opt && opt.alpha != null) ctx.globalAlpha = opt.alpha;
    if (s.glow || (opt && opt.glow)) { ctx.shadowColor = (opt && opt.glow) || s.glow; ctx.shadowBlur = size * 0.6 + Math.sin(performance.now() / 180) * size * 0.2; }
    ctx.drawImage(s.img, x, y, size, size); ctx.restore();
  };
  A.thumb = (s, px) => {
    if (typeof s === "string") s = A.sprites[s];
    const c = document.createElement("canvas"); c.width = c.height = px; c.style.width = c.style.height = px + "px"; c.style.imageRendering = "pixelated";
    const x = c.getContext("2d"); x.imageSmoothingEnabled = false; x.drawImage(s.img, 0, 0, px, px); return c;
  };
  /* building-block brick with studs */
  A.brick = (ctx, x, y, w, h, body, top, stud, studs) => {
    const u = Math.max(1, Math.round(Math.min(w, h) / 10));
    ctx.fillStyle = body; ctx.fillRect(x + u, y + u, w - 2 * u, h - 2 * u);
    ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(x + u, y + h - 3 * u, w - 2 * u, 2 * u);
    ctx.fillStyle = top; ctx.fillRect(x + u, y + u, w - 2 * u, u);
    const n = studs || Math.max(1, Math.round(w / h)), s = Math.round(Math.min(h * 0.36, (w / n) * 0.5));
    for (let i = 0; i < n; i++) {
      const cx = x + (w / n) * (i + 0.5) - s / 2, cy = y + (h - s) / 2 - u;
      ctx.fillStyle = stud; ctx.fillRect(cx, cy, s, s);
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(cx, cy, s, u);
    }
  };
  /* board background: soft garden lawn (style B) with a faint checker */
  A.grid = (ctx, W, H, cell) => {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#b6e4a2"); g.addColorStop(1, "#86c77a");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.08)";
    for (let y = 0; y < H / cell; y++) for (let x = 0; x < W / cell; x++) if ((x + y) % 2 === 0) ctx.fillRect(x * cell, y * cell, cell, cell);
  };
  /* outline for text drawn on the board, so it reads on the light lawn */
  A.ink = (ctx) => { ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.strokeStyle = "rgba(16,26,66,.85)"; };
  /* ---------- Soft Paper art: smooth vector pieces cut from paper, with soft shadows ---------- */
  const SP = (A.softPaper = {});
  const mixc = (h, t, a) => { const p = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16)); const x = p(h), y = p(t); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * a).toString(16).padStart(2, "0")).join(""); };
  SP.lt = (h, a) => mixc(h, "#ffffff", a); SP.dk = (h, a) => mixc(h, "#000000", a);
  /* fill a path as a piece of paper: soft drop shadow, a faint light sheen, a thin bright edge */
  SP.piece = (c, p, col, u) => {
    u = u || 1;
    c.save(); c.shadowColor = "rgba(40,30,70,.24)"; c.shadowBlur = 4 * u; c.shadowOffsetY = 2 * u; c.fillStyle = col; c.fill(p); c.restore();
    c.save(); c.clip(p); c.fillStyle = "rgba(255,255,255,.10)"; c.fill(p); c.restore();
    c.save(); c.lineWidth = 0.7 * u; c.strokeStyle = "rgba(255,255,255,.45)"; c.stroke(p); c.restore();
  };
  const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 7); return p; };
  const ell = (x, y, rx, ry, a) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, a || 0, 0, 7); return p; };
  const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2)); return p; };
  SP.rr = rr; SP.circ = circ; SP.ell = ell;
  const pc = SP.piece;
  const eyes = (c, x, y, r, d) => [-1, 1].forEach((s) => { c.fillStyle = "#fff"; c.beginPath(); c.arc(x + s * d, y, r, 0, 7); c.fill(); c.fillStyle = "#101a42"; c.beginPath(); c.arc(x + s * d + r * 0.2, y + r * 0.15, r * 0.55, 0, 7); c.fill(); });
  const stroke = (c, pts, col, w) => { c.save(); c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = col; c.lineWidth = w; c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.stroke(); c.restore(); };
  function petals(c, x, y, r, col, n, rx, ry, rot) { for (let k = 0; k < n; k++) { const a = (k * 2 * Math.PI) / n - Math.PI / 2 + (rot || 0); pc(c, ell(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * (rx || 0.48), r * (ry || 0.3), a), col); } }
  const leaf = (c, x, y, r, a, col) => { pc(c, ell(x, y, r, r * 0.45, a), col || "#5fae5a"); stroke(c, [[x - Math.cos(a) * r * 0.7, y - Math.sin(a) * r * 0.7], [x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7]], "rgba(30,80,30,.35)", 1.2); };
  /* every painter draws inside a 100 x 100 box */
  const PAINT = {
    rose(c, o) { const p = (o && o.p) || "#f27aa3", P = (o && o.P) || "#d94f8c"; leaf(c, 26, 76, 16, -0.7); leaf(c, 74, 76, 16, 0.7); petals(c, 50, 48, 46, p, 5, 0.44, 0.36); pc(c, circ(50, 48, 19), SP.lt(p, 0.15)); pc(c, circ(50, 47, 12), P); pc(c, circ(52, 45, 6), SP.lt(P, 0.2)); },
    tulip(c) { stroke(c, [[50, 70], [50, 98]], "#4f9e4c", 6); leaf(c, 36, 86, 14, -0.9); const p = new Path2D(); p.moveTo(22, 20); p.lineTo(36, 38); p.lineTo(50, 10); p.lineTo(64, 38); p.lineTo(78, 20); p.quadraticCurveTo(84, 74, 50, 76); p.quadraticCurveTo(16, 74, 22, 20); pc(c, p, "#ef5b62"); const q = new Path2D(); q.moveTo(50, 14); q.quadraticCurveTo(64, 46, 50, 74); q.quadraticCurveTo(38, 46, 50, 14); pc(c, q, "#d63f4a"); },
    daisy(c) { petals(c, 50, 50, 58, "#ffffff", 12, 0.3, 0.12); pc(c, circ(50, 50, 16), "#ffc93c"); pc(c, circ(47, 47, 6), "#ffe08f"); },
    bluebell(c) { petals(c, 50, 50, 54, "#6f8ff5", 8, 0.34, 0.16); petals(c, 50, 50, 36, "#a9bbff", 8, 0.3, 0.14, 0.4); pc(c, circ(50, 50, 10), "#ffffff"); pc(c, circ(50, 50, 5), "#ffd166"); },
    sunflower(c) { petals(c, 50, 50, 56, "#ffc93c", 14, 0.28, 0.13); pc(c, circ(50, 50, 22), "#8a4b1f"); c.fillStyle = "rgba(255,255,255,.18)"; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(50 + Math.cos(i * 2.4) * 11 * ((i % 3) / 3 + 0.3), 50 + Math.sin(i * 2.4) * 11 * ((i % 3) / 3 + 0.3), 2.2, 0, 7); c.fill(); } },
    phantom(c) { PAINT.rose(c, { p: "#9df2bd", P: "#3fcf78" }); },
    mystery(c) { pc(c, rr(14, 14, 72, 72, 16), "#ffd166"); pc(c, rr(14, 40, 72, 12, 3), "#f4b942"); pc(c, rr(44, 14, 12, 72, 3), "#f4b942"); c.font = "700 44px Fredoka, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillStyle = "#101a42"; c.fillText("?", 50, 53); },
    weed(c) { [-0.5, 0, 0.5].forEach((a) => { const p = new Path2D(); p.moveTo(40, 82); p.lineTo(50 + Math.sin(a) * 46, 10 + Math.abs(a) * 26); p.lineTo(60, 82); p.closePath(); pc(c, p, "#4c8a3a"); }); pc(c, circ(50, 66, 18), "#3e7a30"); stroke(c, [[38, 58], [46, 63]], "#101a42", 3); stroke(c, [[62, 58], [54, 63]], "#101a42", 3); pc(c, rr(10, 84, 80, 12, 6), "#8a5a3b"); },
    bug(c) { pc(c, circ(50, 30, 14), "#2a2a3a"); pc(c, ell(50, 60, 30, 32), "#7e5fb5"); stroke(c, [[50, 30], [50, 92]], "#2a2a3a", 2); eyes(c, 50, 28, 4, 6); },
    bee(c) { pc(c, ell(40, 26, 18, 12, -0.5), "#e8f6ff"); pc(c, ell(62, 26, 16, 11, 0.4), "#e8f6ff"); const b = ell(50, 58, 36, 26); pc(c, b, "#ffd166"); c.save(); c.clip(b); c.fillStyle = "#101a42"; [-12, 6].forEach((o) => c.fillRect(50 + o, 30, 9, 60)); c.restore(); eyes(c, 76, 54, 5, 0); },
    ladybug(c) { pc(c, circ(50, 22, 16), "#2a2a38"); pc(c, circ(50, 56, 36), "#e8484f"); c.fillStyle = "#22222e"; c.fillRect(49, 22, 2, 70); [[-16, -10], [16, -10], [-14, 14], [14, 14]].forEach(([a, b]) => { c.beginPath(); c.arc(50 + a, 56 + b, 6, 0, 7); c.fill(); }); eyes(c, 50, 20, 4, 7); },
    frog(c) { pc(c, circ(32, 34, 12), "#6cc96a"); pc(c, circ(68, 34, 12), "#6cc96a"); pc(c, ell(50, 60, 38, 28), "#6cc96a"); eyes(c, 50, 33, 7, 18); stroke(c, [[38, 64], [50, 70], [62, 64]], "#2c5a2c", 3); },
    vase(c) { [["#f27aa3", 34], ["#ffd166", 50], ["#b79ae0", 66]].forEach(([col, x], i) => { stroke(c, [[x, 40], [50, 52]], "#4f9e4c", 3); petals(c, x, 20 + (i % 2) * 6, 22, col, 5); }); const p = new Path2D(); p.moveTo(36, 44); p.lineTo(64, 44); p.quadraticCurveTo(62, 52, 76, 70); p.quadraticCurveTo(80, 96, 50, 96); p.quadraticCurveTo(20, 96, 24, 70); p.quadraticCurveTo(38, 52, 36, 44); pc(c, p, "#8fb4f5"); },
    lily(c) { leaf(c, 30, 84, 16, -0.4, "#5fae5a"); petals(c, 50, 46, 48, "#ffffff", 6, 0.4, 0.18); pc(c, circ(50, 46, 9), "#ffd166"); },
    poppy(c) { stroke(c, [[50, 64], [50, 98]], "#4f9e4c", 5); petals(c, 50, 42, 40, "#ff7a3d", 4, 0.5, 0.42, Math.PI / 4); pc(c, circ(50, 42, 12), "#2a2a3a"); },
    pot(c) { stroke(c, [[50, 44], [50, 20]], "#4f9e4c", 4); leaf(c, 38, 30, 10, -0.6); petals(c, 50, 16, 24, "#ffd166", 5); const p = new Path2D(); p.moveTo(20, 54); p.lineTo(80, 54); p.lineTo(72, 94); p.lineTo(28, 94); p.closePath(); pc(c, p, "#d9825b"); pc(c, rr(16, 48, 68, 14, 4), "#e39470"); },
    hedge(c) { [[30, 50], [52, 38], [72, 52], [42, 66], [64, 68]].forEach(([x, y]) => pc(c, circ(x, y, 22), "#4f9e4c")); [[36, 44], [64, 60]].forEach(([x, y]) => pc(c, circ(x, y, 5), "#f27aa3")); pc(c, rr(42, 84, 16, 14, 3), "#8a5a3b"); },
    hive(c) { stroke(c, [[50, 2], [50, 14]], "#8a5a3b", 4); [[14, 30], [26, 42], [36, 56], [26, 70], [14, 84]].forEach(([y], i) => pc(c, rr(50 - [18, 30, 36, 30, 18][i], y - 8, [36, 60, 72, 60, 36][i], 16, 8), "#ffc93c")); pc(c, ell(50, 66, 8, 10), "#5a3a1a"); },
    mower(c) { stroke(c, [[66, 50], [92, 14]], "#444b66", 6); pc(c, rr(12, 40, 64, 34, 8), "#ef6f8e"); pc(c, circ(24, 80, 11), "#101a42"); pc(c, circ(64, 80, 11), "#101a42"); },
    bud(c) { stroke(c, [[50, 60], [50, 98]], "#4f9e4c", 6); leaf(c, 34, 82, 14, -0.6); leaf(c, 66, 86, 14, 0.6); const p = new Path2D(); p.moveTo(50, 6); p.quadraticCurveTo(80, 36, 68, 62); p.lineTo(32, 62); p.quadraticCurveTo(20, 36, 50, 6); pc(c, p, "#f27aa3"); const s = new Path2D(); s.moveTo(28, 48); s.quadraticCurveTo(50, 42, 72, 48); s.lineTo(66, 68); s.lineTo(34, 68); s.closePath(); pc(c, s, "#5fae5a"); },
    snail(c) { pc(c, ell(52, 78, 42, 12), "#e8c9a0"); pc(c, circ(44, 52, 28), "#ff8a5c"); c.strokeStyle = "#b85a35"; c.lineWidth = 3; c.beginPath(); for (let a = 0; a < 12; a += 0.3) { const r = 24 * (1 - a / 13); c.lineTo(44 + Math.cos(a) * r, 52 + Math.sin(a) * r); } c.stroke(); eyes(c, 86, 70, 5, 0); },
  };
  SP.paint = PAINT;
  /* draw a named piece at any size; pieces are rendered once per pixel size and cached */
  const cache = new Map();
  SP.img = (key, px, glow) => {
    px = Math.max(8, Math.round(px)); const id = key + "|" + px;
    if (cache.has(id)) return cache.get(id);
    const pad = Math.ceil(px * 0.12), c = document.createElement("canvas"); c.width = c.height = px + pad * 2;
    const x = c.getContext("2d"); x.translate(pad, pad); x.scale(px / 100, px / 100);
    if (glow) { x.save(); x.shadowColor = glow; x.shadowBlur = 18 * (px / 100); }
    (PAINT[key] || PAINT.mystery)(x); if (glow) x.restore();
    const out = { c, pad }; cache.set(id, out); return out;
  };
  A.drawSprite = (ctx, s, x, y, size, opt) => {
    const key = typeof s === "string" ? s : s.key;
    if (!PAINT[key] && typeof s !== "string" && s.img) { ctx.save(); ctx.imageSmoothingEnabled = false; ctx.drawImage(s.img, x, y, size, size); ctx.restore(); return; }
    const t = ctx.getTransform(), k = Math.hypot(t.a, t.b) || 1, im = SP.img(key, size * k, key === "phantom" ? "#9dffb0" : null);
    ctx.save(); ctx.imageSmoothingEnabled = true;
    if (opt && opt.alpha != null) ctx.globalAlpha = opt.alpha;
    if (key === "phantom") { ctx.shadowColor = "#9dffb0"; ctx.shadowBlur = size * 0.4 + Math.sin(performance.now() / 180) * size * 0.15; }
    const sz = size * (1 + (2 * im.pad) / (im.c.width - 2 * im.pad));
    ctx.drawImage(im.c, x - (sz - size) / 2, y - (sz - size) / 2, sz, sz); ctx.restore();
  };
  A.thumb = (s, px) => {
    const key = typeof s === "string" ? s : s.key, d = Math.min(window.devicePixelRatio || 1, 2), im = SP.img(key, px * d);
    const c = document.createElement("canvas"); c.width = c.height = px * d; c.style.width = c.style.height = px + "px";
    c.getContext("2d").drawImage(im.c, 0, 0, px * d, px * d); return c;
  };
  /* a rounded paper block (replaces the pixel brick; same arguments) */
  A.brick = (ctx, x, y, w, h, body) => { const m = Math.max(1, Math.min(w, h) * 0.06); pc(ctx, rr(x + m, y + m, w - 2 * m, h - 2 * m, Math.min(w, h) * 0.28), body, Math.min(w, h) / 20); };
  /* board background: pastel lawn with layered paper hills */
  A.grid = (ctx, W, H) => {
    ctx.fillStyle = "#c9e8b6"; ctx.fillRect(0, 0, W, H);
    ["#bfe2a9", "#b2db9b", "#a6d48e"].forEach((col, i) => {
      const p = new Path2D(), y0 = H * (0.42 + i * 0.2); p.moveTo(0, H); p.lineTo(0, y0);
      p.bezierCurveTo(W * 0.3, y0 - H * 0.08, W * 0.6, y0 + H * 0.07, W, y0 - H * 0.03); p.lineTo(W, H); p.closePath();
      ctx.save(); ctx.shadowColor = "rgba(40,60,30,.18)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = -2; ctx.fillStyle = col; ctx.fill(p); ctx.restore();
    });
  };
  A.ink = (ctx) => { ctx.lineWidth = 3.5; ctx.lineJoin = "round"; ctx.strokeStyle = "rgba(42,50,96,.85)"; };
  A.font = (px, w) => `${w || 700} ${px}px Fredoka, system-ui, sans-serif`;
  A.rand = (a, b) => a + Math.random() * (b - a);
  A.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  A.lerpLevel = (level, a, b) => a + (b - a) * ((level - 1) / (LEVELS - 1));
  /* Speed-up during a level: 1 at the start, rising perSec per second of play, capped at 1 + max. */
  A.speedUp = (kit, perSec, max) => 1 + Math.min(max == null ? 0.3 : max, (perSec == null ? 0.015 : perSec) * (kit.levelTime || 0));

  const TITLES = ["SPROUT!", "BUDDING!", "BLOOMING!", "GREEN THUMB!", "GARDENER!", "FLORIST!", "BOUQUET PRO!", "PETAL MASTER!", "BLOOM LEGEND!", "FULL BOUQUET!"];

  /* ---------- run a game ---------- */
  A.run = (game) => {
    const W = game.width || 360, H = game.height || 480;
    document.title = `${game.title.join(" ")} · Build Petals Arcade`;
    document.body.innerHTML = `
<div id="app">
  <a class="home hidden" id="homeBtn" href="https://www.buildpetals.com/rewards" target="_top">◀ Back to Petals Rewards</a>
  <header>
    <a class="ttl" href="../" target="_self" title="Back to the arcade"><i>◀</i><span style="color:var(--ink)">${game.title[0]}</span> <span>${game.title[1]}</span></a>
    <div class="row">
      <div class="pill">Lv <b id="lvl">1</b> · <b id="goal">0/0</b></div>
      <div class="pill">Score <b id="score">0</b></div>
      <div class="pill hidden" id="info"></div>
    </div>
    <div class="row">
      <button class="ibtn" id="pauseBtn" title="Pause" aria-label="Pause">❚❚</button>
      <button class="ibtn" id="fsBtn" title="Full screen" aria-label="Full screen">⛶</button>
    </div>
  </header>
  <div id="bar"><i></i></div>
  <div id="stage">
    <canvas id="cv" aria-label="${game.title.join(" ")} game board"></canvas>
    <div class="toast" id="toast"></div>
    <div class="ov" id="startScreen"><div class="card">
      <h1>${game.title[0]} <span>${game.title[1]}</span></h1>
      <p>${game.blurb}</p>
      <div class="legend" id="legend"></div>
      <button class="btn" id="startBtn">▶ Play</button>
      <p class="hint" id="progStart" style="font-weight:700"></p>
      <p class="hint" id="bestStart"></p>
      <p class="hint">${game.hint}</p>
    </div></div>
    <div class="ov hidden" id="pauseScreen"><div class="card"><h1>PAUSED</h1><button class="btn" id="resumeBtn">▶ Resume</button></div></div>
    <div class="ov hidden" id="levelScreen"><div class="card">
      <p class="hint" style="margin:0">Level <span id="lcNum">1</span> cleared!</p>
      <h1 id="lcTitle"></h1><div class="stars" id="lcStars"></div><p id="lcBonus"></p>
      <div class="levels" id="lcLevels"></div><p id="lcNext" style="font-weight:600"></p>
      <button class="btn" id="nextBtn">Next level ▶</button>
    </div></div>
    <div class="ov hidden" id="overScreen"><div class="card">
      <p style="margin:0;font-weight:600" id="overHead">Game over</p>
      <div class="big" id="finalScore">0</div>
      <p id="levelLine" style="font-weight:600;margin:2px 0"></p>
      <div class="levels" id="overLevels"></div>
      <p id="bestLine" class="hint"></p>
      <div class="pts hidden" id="points"></div>
      <button class="btn ghost hidden" id="loginBtn">Log in to collect points</button>
      <button class="btn" id="againBtn">↻ Play Again</button>
      <a class="btn alt" href="../" target="_self">More games</a>
      <p style="margin:8px 0 0"><a href="https://www.buildpetals.com/product-page/mystery-flower" target="_top" style="color:var(--navy);font-weight:700">Shop Mystery Flowers →</a></p>
    </div></div>
  </div>
  <div id="dpad" class="${game.dpad ? "on" : ""}">
    <button class="up" data-d="up" aria-label="Up">▲</button><button class="left" data-d="left" aria-label="Left">◀</button>
    <button class="down" data-d="down" aria-label="Down">▼</button><button class="right" data-d="right" aria-label="Right">▶</button>
  </div>
</div>`;
    const $ = (id) => document.getElementById(id);
    const cv = $("cv"), ctx = cv.getContext("2d"), stage = $("stage");
    (game.legend || []).forEach((l) => {
      const d = document.createElement("div");
      d.appendChild(A.thumb(l.sprite, 28)); d.append(l.label); $("legend").appendChild(d);
    });

    const bestKey = "bp_" + game.id + "_best", lvlKey = "bp_" + game.id + "_bestlvl";
    const kit = {
      W, H, level: 1, score: 0, got: 0, cleared: 0, lives: null, levelTime: 0, state: "start", now: performance.now(), startTime: 0,
      best: A.store.get(bestKey, 0), bestLevel: A.store.get(lvlKey, 0),
      goal() { return game.goal(kit.level); },
      add(n) { kit.score += n; hud(); },
      collect(n) {
        kit.got += n == null ? 1 : n; hud();
        if (kit.got >= kit.goal() && kit.state === "play") levelClear();
      },
      setInfo(t) { const e = $("info"); if (t == null) e.classList.add("hidden"); else { e.classList.remove("hidden"); e.innerHTML = t; } },
      loseLife() {
        if (kit.lives == null || kit.state !== "play") return;
        kit.lives--; hearts();
        if (kit.lives <= 0) gameOver(false); else toast("Ouch! " + kit.lives + " left");
      },
      fail() { if (kit.state === "play") gameOver(false); },
      toast,
    };
    A.kit = kit;
    const hearts = () => kit.setInfo(kit.lives == null ? null : '<b style="color:#ff8fc2">' + "♥".repeat(Math.max(0, kit.lives)) + "</b>");
    function hud() {
      $("score").textContent = kit.score; $("lvl").textContent = kit.level;
      const g = kit.goal(); $("goal").textContent = `${Math.min(kit.got, g)}/${g}`;
      document.querySelector("#bar i").style.width = (100 * Math.min(1, kit.got / g)) + "%";
    }
    function bestText() { return kit.best ? `Best: ${kit.best} pts · ${kit.bestLevel}/${LEVELS} levels cleared` : ""; }
    $("bestStart").textContent = bestText();

    /* canvas sizing: logical W×H scaled to fit */
    let scale = 1;
    function resize() {
      const r = stage.getBoundingClientRect();
      scale = Math.max(0.3, Math.min((r.width - 6) / W, (r.height - 6) / H));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.style.width = W * scale + "px"; cv.style.height = H * scale + "px";
      const dp = $("dpad"), dpOn = getComputedStyle(dp).display !== "none";
      stage.style.setProperty("--padh", dpOn ? dp.getBoundingClientRect().height + 8 + "px" : "0px");
      cv.width = Math.round(W * scale * dpr); cv.height = Math.round(H * scale * dpr);
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0); ctx.imageSmoothingEnabled = true;
    }
    window.addEventListener("resize", resize);

    function setupLevel() {
      /* Hearts carry over between levels in a run (a fresh run, or a run continued from saved progress, starts full);
         every 3 levels cleared in the run gives one heart back. A game can opt out with carryLives: false. */
      kit.got = 0; kit.levelTime = 0;
      if (!game.lives) kit.lives = null;
      else if (game.carryLives === false || kit.lives == null || kit.lives <= 0 || kit.level === (kit.runStart || 1) || kit.state === "start" || kit.state === "over") kit.lives = game.lives;
      else if ((kit.level - kit.runStart) % 3 === 0 && kit.lives < game.lives) { kit.lives++; toast("+1 heart!"); }
      hearts();
      if (!game.lives) kit.setInfo(null);
      game.setup(kit.level, kit); hud();
    }
    function show(id) {
      ["startScreen", "pauseScreen", "levelScreen", "overScreen"].forEach((s) => $(s).classList.toggle("hidden", s !== id));
      $("app").classList.toggle("playing", !id);
    }
    function levelBar(el, n) { el.innerHTML = Array.from({ length: LEVELS }, (_, i) => `<span class="${i < n ? "on" : ""}"></span>`).join(""); }
    /* Monthly saved progress (members, sent by the Build Petals page): pick up after the last level cleared
       this month; clearing all levels locks the game until the 1st of next month. Guests always start at Level 1. */
    let prog = null;
    function startLevel() { return prog && prog.level > 0 && prog.level < LEVELS ? prog.level + 1 : 1; }
    function applyProgress() {
      const locked = !!(prog && prog.locked);
      const s = startLevel();
      $("startBtn").disabled = locked; $("againBtn").disabled = locked;
      $("startBtn").textContent = locked ? "Cleared this month" : s > 1 ? `▶ Continue at Level ${s}` : "▶ Play";
      $("againBtn").textContent = locked ? `Back on ${prog.reset || "the 1st"}` : s > 1 ? `↻ Continue at Level ${s}` : "↻ Play Again";
      $("progStart").textContent = locked ? `You cleared all ${LEVELS} levels this month. It's back on ${prog.reset || "the 1st"}.`
        : prog && prog.level > 0 ? `Saved this month: ${prog.level} / ${LEVELS} levels cleared` : "";
    }
    function start() {
      if (prog && prog.locked) return;
      const s = startLevel();
      kit.score = 0; kit.level = s; kit.cleared = s - 1; kit.runStart = s; kit.startTime = Date.now();
      setupLevel(); kit.state = "play"; show(null);
    }
    function pause() { if (kit.state === "play") { kit.state = "pause"; show("pauseScreen"); } }
    function resume() { if (kit.state === "pause") { kit.state = "play"; show(null); } }
    let toastT;
    function toast(t) { const el = $("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("on"), 1300); }

    function levelClear() {
      kit.cleared = kit.level;
      const bonus = 50 * kit.level; kit.score += bonus; hud();
      if (kit.level >= LEVELS) return gameOver(true);
      kit.state = "level";
      $("lcNum").textContent = kit.level; $("lcTitle").textContent = TITLES[kit.level - 1];
      $("lcStars").textContent = "🌸".repeat(Math.min(3, 1 + Math.floor(kit.level / 4)));
      $("lcBonus").textContent = `Level bonus +${bonus} · Score ${kit.score}`;
      levelBar($("lcLevels"), kit.cleared);
      $("lcNext").textContent = `Level ${kit.level + 1}: ${game.goalLabel(kit.level + 1)}`;
      show("levelScreen");
    }
    function nextLevel() { if (kit.state !== "level") return; kit.level++; setupLevel(); kit.state = "play"; show(null); }

    function gameOver(won) {
      kit.state = "over";
      const newBest = kit.score > kit.best;
      if (newBest) { kit.best = kit.score; A.store.set(bestKey, kit.best); }
      if (kit.cleared > kit.bestLevel) { kit.bestLevel = kit.cleared; A.store.set(lvlKey, kit.bestLevel); }
      $("bestStart").textContent = bestText();
      $("overHead").textContent = won ? "🏆 You cleared every level!" : "Game over";
      $("finalScore").textContent = kit.score;
      $("levelLine").textContent = won ? `All ${LEVELS} levels cleared!` : `Levels cleared: ${kit.cleared} / ${LEVELS}`;
      levelBar($("overLevels"), kit.cleared);
      $("bestLine").textContent = newBest && kit.score > 0 ? "🎉 New personal best!" : `Personal best: ${kit.best}`;
      $("points").classList.add("hidden"); $("loginBtn").classList.add("hidden");
      if (window.parent !== window) send({ type: "gameOver", game: game.id, score: kit.score, levelsCleared: kit.cleared, startLevel: kit.runStart || 1, durationMs: Date.now() - kit.startTime });
      if (prog) { prog.level = Math.max(prog.level, kit.cleared); prog.locked = prog.level >= LEVELS; applyProgress(); }
      if (game.over) game.over(kit, won);
      show("overScreen");
    }

    /* messaging with the Wix page (only shows text if loyalty is connected and the page answers) */
    function send(msg) { try { window.parent.postMessage(Object.assign({ source: "buildpetals-arcade" }, msg), "*"); } catch (e) {} }
    window.addEventListener("message", (e) => {
      const m = e.data; if (!m || m.source !== "buildpetals-site") return;
      if (m.type === "progress") {
        if (!m.enabled || !m.games) return;
        const lvl = Math.max(0, Number(m.games[game.id]) || 0);
        prog = { level: lvl, locked: lvl >= LEVELS, reset: m.resetLabel };
        if (kit.state === "start" || kit.state === "over") applyProgress();
        return;
      }
      if (m.type !== "pointsResult") return;
      if (prog && m.level != null) { prog.level = Math.max(prog.level, Number(m.level) || 0); prog.locked = prog.level >= LEVELS; if (m.resetLabel) prog.reset = m.resetLabel; applyProgress(); }
      const msgs = {
        awarded: `🌸 +${m.points} loyalty points!${m.balance != null ? ` Balance: ${m.balance}` : ""}${m.todayLeft != null ? ` · ${m.todayLeft} more available today` : ""}`,
        capped: "You've hit today's arcade points limit. Come back tomorrow!",
        monthCap: "You've earned this month's arcade points max. Thanks for playing!",
        noGain: prog ? "Clear a new level to earn more points this month." : "Beat your best level today to earn more points.",
        locked: `You cleared this game for the month. It's back on ${m.resetLabel || "the 1st"}.`,
        belowMin: `Clear ${m.minLevels} level${m.minLevels === 1 ? "" : "s"} to earn loyalty points.`,
        login: "Members earn loyalty points for playing.",
        error: "Couldn't add points right now. Try again later.",
      };
      const p = $("points"); p.classList.remove("hidden"); p.textContent = msgs[m.status] || "";
      $("loginBtn").classList.toggle("hidden", m.status !== "login");
    });
    $("loginBtn").onclick = () => send({ type: "login", game: game.id });

    /* input */
    const toLocal = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / scale, (e.clientY - r.top) / scale]; };
    cv.addEventListener("pointerdown", (e) => { if (kit.state !== "play") return; e.preventDefault(); const [x, y] = toLocal(e); game.pointerDown && game.pointerDown(x, y, kit); });
    cv.addEventListener("pointermove", (e) => { if (kit.state !== "play") return; const [x, y] = toLocal(e); game.pointerMove && game.pointerMove(x, y, kit, e.buttons > 0 || e.pointerType === "touch"); });
    cv.addEventListener("pointerup", (e) => { if (kit.state !== "play") return; const [x, y] = toLocal(e); game.pointerUp && game.pointerUp(x, y, kit); });
    /* Swipes: on the board, or anywhere on the screen for games that set swipeAnywhere (e.g. Petal Snake). */
    let tx = null, ty = null;
    const swipeArea = game.swipeAnywhere ? document : stage, swipeMin = game.swipeStep || (game.swipeAnywhere ? 16 : 22);
    if (game.swipeAnywhere) $("app").classList.add("swipeall");
    swipeArea.addEventListener("touchstart", (e) => {
      if (e.target.closest && e.target.closest("button, a")) { tx = ty = null; return; }
      const t = e.touches[0]; tx = t.clientX; ty = t.clientY;
    }, { passive: true });
    swipeArea.addEventListener("touchmove", (e) => {
      if (kit.state === "play" && (tx !== null || swipeArea === stage)) e.preventDefault();
      if (tx === null || !game.swipe) return;
      const t = e.touches[0], dx = t.clientX - tx, dy = t.clientY - ty;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > swipeMin) {
        game.swipe(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"), kit);
        tx = t.clientX; ty = t.clientY;
      }
    }, { passive: false });
    swipeArea.addEventListener("touchend", () => { tx = ty = null; });
    document.querySelectorAll("#dpad button").forEach((b) => b.addEventListener("pointerdown", (e) => { e.preventDefault(); if (kit.state === "play" && game.swipe) game.swipe(b.dataset.d, kit); }));
    const held = (A.keys = {});
    window.addEventListener("keyup", (e) => { held[e.key] = false; });
    window.addEventListener("keydown", (e) => {
      held[e.key] = true;
      if (kit.state === "play" && game.key && game.key(e.key, kit)) { e.preventDefault(); return; }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
      if (e.key === " " || e.key === "p" || e.key === "P" || e.key === "Enter" || e.key === "Escape") {
        e.preventDefault();
        if (kit.state === "play") pause(); else if (kit.state === "pause") resume(); else if (kit.state === "level") nextLevel(); else if (e.key !== "Escape") start();
      }
    });

    $("startBtn").onclick = start; $("againBtn").onclick = start; $("resumeBtn").onclick = resume; $("nextBtn").onclick = nextLevel;
    $("pauseBtn").onclick = () => (kit.state === "play" ? pause() : resume());
    /* Full screen. Inside buildpetals.com the page fills the window with the game and shows big Exit / Rewards
       buttons, so players never leave the site. Opened on its own, use the browser's full screen if it has one. */
    const embedded = window.parent !== window;
    let pageFull = false;
    function fsLabel(on) { $("fsBtn").textContent = on ? "✕" : "⛶"; $("fsBtn").title = on ? "Exit full screen" : "Full screen"; $("fsBtn").setAttribute("aria-label", $("fsBtn").title); }
    window.addEventListener("message", (e) => {
      const m = e.data; if (!m || m.source !== "buildpetals-site" || m.type !== "fullscreen") return;
      pageFull = !!m.on; fsLabel(pageFull); setTimeout(resize, 50);
    });
    const nativeFs = !!(document.fullscreenEnabled && document.documentElement.requestFullscreen);
    if (!embedded && !nativeFs) $("fsBtn").classList.add("hidden");
    $("fsBtn").onclick = () => {
      if (embedded) return send({ type: "fullscreen", on: !pageFull });
      if (document.fullscreenElement) return document.exitFullscreen().catch(() => {});
      if (nativeFs) document.documentElement.requestFullscreen().catch(() => {});
    };
    if (!embedded) document.addEventListener("fullscreenchange", () => { fsLabel(!!document.fullscreenElement); setTimeout(resize, 50); });
    /* A game opened on its own (an old full-screen tab or a shared link): a big, clear way back to buildpetals.com. */
    if (!embedded) $("homeBtn").classList.remove("hidden");
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
    window.addEventListener("blur", pause);

    /* loop */
    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; kit.now = now;
      if (kit.state === "play") { kit.levelTime += dt; game.update(dt, kit); }
      ctx.save(); game.draw(ctx, kit); ctx.restore();
      requestAnimationFrame(loop);
    }
    setupLevel(); resize(); requestAnimationFrame(loop);
    send({ type: "ready", game: game.id });
    return kit;
  };
})();
