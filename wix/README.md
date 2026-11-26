# Wix side of the Arcade: most played + leaderboards

The games and lobby (this repo) already understand two new messages from the Build Petals page. Until the page sends them, nothing changes for players.

| Message the page sends | To | What it shows |
| --- | --- | --- |
| `{ source: "buildpetals-site", type: "stats", plays, overall, boards }` | the lobby iframe | "Most played" and "Leaderboards" tabs |
| `{ source: "buildpetals-site", type: "leaderboard", game, top, myRank, myBest }` | a game iframe | "Top this month" on the start and game-over cards |

## 1. Collections (CMS)
- **ArcadePlays**: `game` (Text), `month` (Text), `plays` (Number)
- **ArcadeScores**: `memberId` (Text), `name` (Text), `game` (Text), `month` (Text), `score` (Number), `levels` (Number)

Admin-only permissions are fine.

## 2. Backend
Add [`arcadeStats.web.js`](arcadeStats.web.js) as `backend/arcadeStats.web.js`.

## 3. Rewards page code
Add these lines to the page that holds the Arcade. Change `#arcade` to your HTML element's ID, and keep your existing points code.

```js
import { recordGameOver, getGameBoard, getArcadeStats } from "backend/arcadeStats.web";

$w.onReady(() => {
  const frame = $w("#arcade");
  frame.onMessage(async (event) => {
    const m = event.data;
    if (!m || m.source !== "buildpetals-arcade") return;
    // ...your existing handling (points, progress, full screen) stays as it is...
    if (m.type === "lobbyReady") frame.postMessage(Object.assign({ source: "buildpetals-site", type: "stats" }, await getArcadeStats()));
    if (m.type === "ready") { const b = await getGameBoard(m.game); if (b) frame.postMessage(Object.assign({ source: "buildpetals-site", type: "leaderboard", game: m.game }, b)); }
    if (m.type === "gameOver") { const b = await recordGameOver(m); if (b) frame.postMessage(Object.assign({ source: "buildpetals-site", type: "leaderboard", game: m.game }, b)); }
  });
});
```


## Rules
- **Names:** a member's first name and last initial, for example "Dana R." If the profile has no first name, the board falls back to the nickname, then "Gardener".
- **Months:** boards are monthly, counted in New York time, matching the monthly level progress.
- **Whole-Arcade board:** sums each member's best levels cleared across all games this month. Total score breaks ties.
- **Cheat filter:** a result does not count if it cleared a level in under 4 seconds, or scored more than 10,000 per level in the run. The tuning values are at the top of the backend file.
- **Play counts:** a play counts every finished game, guests included. Play counts are not filtered for cheating, so treat them as a popularity signal, not exact numbers.
