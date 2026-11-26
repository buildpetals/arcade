/* Smoke test for every Arcade game: loads the lobby and each game at phone and desktop size, presses Play,
   plays random taps / keys for a few seconds, and fails on any script error, a blank board or a lobby
   link to a missing game.  Run: npm test  (serves the repo itself on a free port). */
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const ROOT = path.resolve(__dirname, "..");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]); if (p.endsWith("/")) p += "index.html";
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
});
const games = fs.readdirSync(ROOT).filter((d) => fs.existsSync(path.join(ROOT, d, "index.html")) && d !== "tests");
const only = process.argv.slice(2);
const VIEWS = [{ name: "phone", width: 390, height: 780, hasTouch: true, isMobile: true }, { name: "desktop", width: 1100, height: 800 }];

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/`;
  // block the external font request so the test is offline-safe
  const browser = await chromium.launch(), fails = [];
  const page0 = await browser.newPage(); await page0.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page0.goto(base);
  const slugs = await page0.evaluate(() => GAMES.filter((g) => g.slug).map((g) => g.slug));
  for (const s of slugs) if (!games.includes(s)) fails.push(`lobby links to "${s}" but there is no ${s}/index.html`);
  for (const g of games) if (!slugs.includes(g)) fails.push(`${g}/ exists but is not in the lobby GAMES list`);
  await page0.close();

  for (const slug of games.filter((g) => !only.length || only.includes(g))) {
    for (const v of VIEWS) {
      const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, hasTouch: !!v.hasTouch, isMobile: !!v.isMobile });
      const page = await ctx.newPage(), errs = [];
      await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
      page.on("pageerror", (e) => errs.push(e.message));
      page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
      // never leave the game page during random play
      await page.route("**/*", (r) => (r.request().isNavigationRequest() && r.request().frame() === page.mainFrame() && !r.request().url().startsWith(base + slug + "/") ? r.abort() : r.continue()));
      await page.goto(base + slug + "/");
      await page.click("#startBtn");
      const box = await page.locator("#cv").boundingBox();
      const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      for (let i = 0; i < 30; i++) {
        const state = await page.evaluate(() => Arcade.kit.state).catch(() => "gone");
        if (state === "over" || state === "gone") break;
        if (state === "level") { await page.click("#nextBtn").catch(() => {}); continue; }
        const x = box.x + Math.random() * box.width, y = box.y + Math.random() * box.height;
        if (v.hasTouch) await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
        await page.keyboard.press(keys[i % 4]);
        await page.waitForTimeout(120);
      }
      const blank = await page.evaluate(() => {
        const c = document.getElementById("cv"), d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
        const first = d.slice(0, 4).join(); for (let i = 0; i < d.length; i += 4 * 97) if (d.slice(i, i + 4).join() !== first) return false; return true;
      });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (errs.length) fails.push(`${slug} (${v.name}): ${[...new Set(errs)].join(" | ")}`);
      if (blank) fails.push(`${slug} (${v.name}): the game board is blank`);
      if (overflow) fails.push(`${slug} (${v.name}): the page scrolls sideways`);
      console.log(`${errs.length || blank || overflow ? "FAIL" : "ok  "} ${slug} (${v.name})`);
      await ctx.close();
    }
  }
  await browser.close(); server.close();
  if (fails.length) { console.error("\n" + fails.join("\n")); process.exit(1); }
  console.log(`\nAll ${games.length} games passed.`);
})().catch((e) => { console.error(e); process.exit(1); });
