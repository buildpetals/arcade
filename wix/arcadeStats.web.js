// Build Petals Arcade: play counts and monthly leaderboards (Velo backend web module).
// Copy this file into the Wix editor as  backend/arcadeStats.web.js  (Code panel > Backend > + > New Web Module).
// It needs two CMS collections (Admin-only permissions are fine; this code reads and writes with suppressAuth):
//   ArcadePlays : game (Text), month (Text), plays (Number)
//   ArcadeScores: memberId (Text), name (Text), game (Text), month (Text), score (Number), levels (Number)
import { Permissions, webMethod } from "wix-web-module";
import wixData from "wix-data";
import { currentMember } from "wix-members-backend";

const OPT = { suppressAuth: true };
const TZ = "America/New_York";
const MIN_MS_PER_LEVEL = 4000;          // a cleared level faster than this is treated as not genuine
const MAX_SCORE_PER_LEVEL = 10000;      // generous per-level score ceiling; raise it if a real player hits it

function monthKey() {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" }).formatToParts(new Date());
  return p.find((x) => x.type === "year").value + "-" + p.find((x) => x.type === "month").value;
}
const okGame = (g) => typeof g === "string" && /^[a-z0-9-]{2,40}$/.test(g);

async function me() {
  try {
    const m = await currentMember.getMember({ fieldsets: ["FULL"] });
    if (!m) return null;
    const c = m.contactDetails || {}, first = (c.firstName || "").trim(), last = (c.lastName || "").trim();
    // the owner's choice: first name + last initial; fall back to the profile nickname, then "Gardener"
    const name = first ? first + (last ? " " + last[0].toUpperCase() + "." : "") : ((m.profile && m.profile.nickname) || "Gardener");
    return { id: m._id, name: name.slice(0, 24) };
  } catch (e) { return null; }
}

async function bumpPlays(game, month) {
  const r = await wixData.query("ArcadePlays").eq("game", game).eq("month", month).limit(1).find(OPT);
  if (r.items.length) { const it = r.items[0]; it.plays = (it.plays || 0) + 1; await wixData.update("ArcadePlays", it, OPT); }
  else await wixData.insert("ArcadePlays", { game, month, plays: 1 }, OPT);
}

/* Does this result look like a real run? (Scores come from the player's browser, so check before showing them.) */
function plausible(m) {
  const levels = Number(m.levelsCleared), start = Number(m.startLevel) || 1, score = Number(m.score), ms = Number(m.durationMs);
  if (!Number.isInteger(levels) || levels < 0 || levels > 10) return false;
  if (!Number.isFinite(score) || score < 0) return false;
  const runLevels = Math.max(0, levels - (start - 1));
  if (!Number.isFinite(ms) || ms < runLevels * MIN_MS_PER_LEVEL) return false;
  if (score > (runLevels + 1) * MAX_SCORE_PER_LEVEL) return false;
  return true;
}

async function board(game, month, who) {
  const r = await wixData.query("ArcadeScores").eq("game", game).eq("month", month).descending("score").limit(100).find(OPT);
  const rows = r.items;
  const top = rows.slice(0, 10).map((x) => ({ name: x.name, score: x.score, levels: x.levels, me: !!who && x.memberId === who.id }));
  const i = who ? rows.findIndex((x) => x.memberId === who.id) : -1;
  return { top, myRank: i >= 0 ? i + 1 : null, myBest: i >= 0 ? rows[i].score : null };
}

/* Call on every "gameOver" message from a game. Counts the play, saves a member's monthly best,
   and returns that game's leaderboard to post back into the game. */
export const recordGameOver = webMethod(Permissions.Anyone, async (m) => {
  if (!m || !okGame(m.game)) return null;
  const month = monthKey();
  await bumpPlays(m.game, month);
  const who = await me();
  if (who && plausible(m)) {
    const r = await wixData.query("ArcadeScores").eq("memberId", who.id).eq("game", m.game).eq("month", month).limit(1).find(OPT);
    const score = Math.round(Number(m.score)), levels = Number(m.levelsCleared);
    if (!r.items.length) await wixData.insert("ArcadeScores", { memberId: who.id, name: who.name, game: m.game, month, score, levels }, OPT);
    else {
      const it = r.items[0];
      if (score > it.score || levels > it.levels || it.name !== who.name) {
        it.score = Math.max(it.score, score); it.levels = Math.max(it.levels, levels); it.name = who.name;
        await wixData.update("ArcadeScores", it, OPT);
      }
    }
  }
  return board(m.game, month, who);
});

/* One game's leaderboard (for the game's start screen). */
export const getGameBoard = webMethod(Permissions.Anyone, async (game) => (okGame(game) ? board(game, monthKey(), await me()) : null));

/* Everything the lobby needs: plays per game, the whole-Arcade board and each game's top 10. */
export const getArcadeStats = webMethod(Permissions.Anyone, async () => {
  const month = monthKey(), who = await me();
  const [plays, scores] = await Promise.all([
    wixData.query("ArcadePlays").eq("month", month).limit(1000).find(OPT),
    wixData.query("ArcadeScores").eq("month", month).limit(1000).find(OPT),
  ]);
  const playMap = {}; plays.items.forEach((p) => (playMap[p.game] = p.plays));
  const boards = {}, totals = {};
  for (const s of scores.items) {
    (boards[s.game] = boards[s.game] || []).push(s);
    const t = (totals[s.memberId] = totals[s.memberId] || { name: s.name, levels: 0, score: 0, me: !!who && s.memberId === who.id });
    t.levels += s.levels || 0; t.score += s.score || 0;
  }
  for (const g in boards) boards[g] = boards[g].sort((a, b) => b.score - a.score).slice(0, 10).map((x) => ({ name: x.name, score: x.score, levels: x.levels, me: !!who && x.memberId === who.id }));
  const overall = Object.values(totals).sort((a, b) => b.levels - a.levels || b.score - a.score).slice(0, 10);
  return { plays: playMap, overall, boards };
});
