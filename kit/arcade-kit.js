/* Build Petals Arcade kit: shared HUD, screens, pixel sprites, input and loyalty messaging.
   A game calls Arcade.run({...}). See any game folder for an example. */
(function () {
  const A = (window.Arcade = {});
  const LEVELS = 10;
  A.LEVELS = LEVELS;

  /* ---------- fonts + styles ---------- */
  const head = document.head;
  head.insertAdjacentHTML("beforeend",
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Press+Start+2P&display=swap" rel="stylesheet">');
  const css = `
  :root{--navy:#101a42;--navy2:#17245a;--grid:rgba(143,199,255,.10);--lav:#b9a7f5;--lav2:#8f7ae6;--sky:#8fc7ff;--cream:#fff6e5;--gold:#ffd166}
  *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
  html,body{margin:0;height:100%;background:var(--navy);color:var(--cream);font-family:"Fredoka",system-ui,sans-serif;overflow:hidden;user-select:none;-webkit-user-select:none}
  body{background:linear-gradient(var(--grid) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,var(--grid) 1px,transparent 1px) 0 0/24px 24px,radial-gradient(ellipse at top,var(--navy2),var(--navy) 70%);display:flex;flex-direction:column;align-items:center}
  #app{width:100%;height:100%;max-width:640px;display:flex;flex-direction:column;align-items:center;padding:10px 10px 12px;gap:8px}
  header{width:100%;display:flex;align-items:center;justify-content:space-between;gap:6px}
  .ttl{font-family:"Press Start 2P",monospace;font-size:clamp(10px,3.2vw,15px);line-height:1.25;display:flex;align-items:center;gap:8px;color:var(--cream);text-decoration:none}
  .ttl span{color:var(--lav)} .ttl i{font-style:normal;color:var(--sky);font-size:.9em}
  .row{display:flex;gap:6px;align-items:center}
  .pill{background:rgba(255,246,229,.08);border:2px dashed rgba(185,167,245,.55);border-radius:999px;padding:4px 9px;font-weight:600;font-size:clamp(11px,3vw,14px);white-space:nowrap}
  .pill b{color:var(--gold)}
  .ibtn{background:var(--lav);color:var(--navy);border:0;border-radius:10px;width:32px;height:32px;font-size:15px;cursor:pointer;box-shadow:0 3px 0 var(--lav2);flex:none}
  .ibtn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--lav2)}
  #bar{width:100%;height:8px;border-radius:99px;background:rgba(185,167,245,.18);overflow:hidden;flex:none}
  #bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--lav),var(--gold));transition:width .2s}
  #stage{position:relative;flex:1;width:100%;min-height:0;display:flex;align-items:center;justify-content:center}
  #cv{display:block;border-radius:14px;box-shadow:0 0 0 3px rgba(185,167,245,.6),0 12px 30px rgba(0,0,0,.35);touch-action:none}
  .ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:12px}
  .card{background:var(--cream);color:var(--navy);border-radius:18px;padding:18px 18px 16px;width:min(94%,390px);text-align:center;box-shadow:0 6px 0 var(--lav2),0 18px 40px rgba(0,0,0,.4);max-height:100%;overflow:auto}
  .card h1{margin:4px 0 8px;font:400 20px/1.3 "Press Start 2P",monospace} .card h1 span{color:var(--lav2)}
  .card p{margin:6px 0;font-size:15px;line-height:1.35;font-weight:500}
  .legend{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:10px 0 4px}
  .legend div{display:flex;align-items:center;gap:4px;background:#fff;border:2px dashed #d9cff8;border-radius:10px;padding:3px 7px 3px 3px;font-size:12px;font-weight:600}
  .btn{display:inline-block;background:var(--lav);color:var(--navy);border:0;border-radius:12px;padding:11px 20px;font:700 17px "Fredoka",sans-serif;cursor:pointer;box-shadow:0 4px 0 var(--lav2);text-decoration:none;margin:6px 4px 2px}
  .btn:active{transform:translateY(3px);box-shadow:0 1px 0 var(--lav2)}
  .btn.alt{background:var(--sky);box-shadow:0 4px 0 #5c9be0} .btn.ghost{background:transparent;box-shadow:none;border:2px dashed var(--lav2);padding:9px 16px;font-size:15px}
  .hint{font-size:12px!important;opacity:.7}
  .big{font:400 30px/1.2 "Press Start 2P",monospace;color:var(--lav2);margin:6px 0}
  .stars{font-size:22px;letter-spacing:2px;margin:2px 0}
  .pts{font-size:14px;font-weight:600;margin:6px 0}
  .levels{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;margin:8px 0}
  .levels span{height:10px;border-radius:3px;background:#e3dcf8} .levels span.on{background:var(--lav2)}
  #dpad{display:none;grid-template-columns:repeat(3,54px);grid-template-rows:repeat(2,46px);gap:6px;flex:none}
  #dpad button{background:rgba(185,167,245,.22);border:2px solid rgba(185,167,245,.6);color:var(--cream);border-radius:12px;font-size:20px;touch-action:none}
  #dpad button:active{background:var(--lav);color:var(--navy)}
  #dpad .up{grid-column:2;grid-row:1}#dpad .left{grid-column:1;grid-row:2}#dpad .down{grid-column:2;grid-row:2}#dpad .right{grid-column:3;grid-row:2}
  @media (pointer:coarse){#dpad.on{display:grid}}
  .hidden{display:none!important}
  .toast{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:var(--gold);color:var(--navy);font-weight:700;padding:4px 12px;border-radius:999px;font-size:14px;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap}
  .toast.on{opacity:1}
  @media (max-width:460px){header{flex-wrap:wrap;justify-content:center;row-gap:6px}.ttl{width:100%;justify-content:center}.pill{padding:3px 7px}}`;
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
  A.grid = (ctx, W, H, cell) => {
    ctx.fillStyle = "#0d1638"; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "rgba(143,199,255,.045)";
    for (let y = 0; y < H / cell; y++) for (let x = 0; x < W / cell; x++) if ((x + y) % 2 === 0) ctx.fillRect(x * cell, y * cell, cell, cell);
  };
  A.rand = (a, b) => a + Math.random() * (b - a);
  A.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  A.lerpLevel = (level, a, b) => a + (b - a) * ((level - 1) / (LEVELS - 1));

  const TITLES = ["SPROUT!", "BUDDING!", "BLOOMING!", "GREEN THUMB!", "GARDENER!", "FLORIST!", "BOUQUET PRO!", "PETAL MASTER!", "BLOOM LEGEND!", "FULL BOUQUET!"];

  /* ---------- run a game ---------- */
  A.run = (game) => {
    const W = game.width || 360, H = game.height || 480;
    document.title = `${game.title.join(" ")} · Build Petals Arcade`;
    document.body.innerHTML = `
<div id="app">
  <header>
    <a class="ttl" href="../" target="_self" title="Back to the arcade"><i>◀</i><span style="color:var(--cream)">${game.title[0]}</span> <span>${game.title[1]}</span></a>
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
      W, H, level: 1, score: 0, got: 0, cleared: 0, lives: null, state: "start", now: performance.now(), startTime: 0,
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
      cv.width = Math.round(W * scale * dpr); cv.height = Math.round(H * scale * dpr);
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    }
    window.addEventListener("resize", resize);

    function setupLevel() {
      kit.got = 0; kit.lives = game.lives || null; hearts();
      if (!game.lives) kit.setInfo(null);
      game.setup(kit.level, kit); hud();
    }
    function show(id) { ["startScreen", "pauseScreen", "levelScreen", "overScreen"].forEach((s) => $(s).classList.toggle("hidden", s !== id)); }
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
    let tx = null, ty = null;
    stage.addEventListener("touchstart", (e) => { const t = e.touches[0]; tx = t.clientX; ty = t.clientY; }, { passive: true });
    stage.addEventListener("touchmove", (e) => {
      if (kit.state === "play") e.preventDefault();
      if (tx === null || !game.swipe) return;
      const t = e.touches[0], dx = t.clientX - tx, dy = t.clientY - ty;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 22) {
        game.swipe(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"), kit);
        tx = t.clientX; ty = t.clientY;
      }
    }, { passive: false });
    stage.addEventListener("touchend", () => { tx = ty = null; });
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
    $("fsBtn").onclick = () => {
      const el = document.documentElement;
      if (document.fullscreenElement) return document.exitFullscreen();
      if (document.fullscreenEnabled && el.requestFullscreen) el.requestFullscreen().catch(() => window.open(location.href, "_blank"));
      else window.open(location.href, "_blank");
    };
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
    window.addEventListener("blur", pause);

    /* loop */
    let last = performance.now();
    function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; kit.now = now;
      if (kit.state === "play") game.update(dt, kit);
      ctx.save(); game.draw(ctx, kit); ctx.restore();
      requestAnimationFrame(loop);
    }
    setupLevel(); resize(); requestAnimationFrame(loop);
    send({ type: "ready", game: game.id });
    return kit;
  };
})();
