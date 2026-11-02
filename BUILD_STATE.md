# Build State — Millionaire Race 2.5D

This file records the build telemetry for the project: wall-clock time, token consumption, model/agent attribution and validation. It reflects the original delivery plus the later pacing, inspection, readability, fullscreen, ledger, auto-roll, affordability and match-length updates.

---

## Session

| Field | Value |
| --- | --- |
| Project | **Millionaire Race 2.5D — Wealth & Asset Tycoon Studio** |
| Repository | https://github.com/somphol/millionaire-race-2.5d |
| Live demo | https://somphol.github.io/millionaire-race-2.5d/ |
| Session ID | `ses_e67a68f85ffe5oCsIETmyBfVZY` |
| Agent | **OpenCode** |
| Model | **DeepSeek V4.1 Flash** |
| Provider / model ID | `opencode-go` · `deepseek-v4.1-flash` |
| Working directory | `/Users/somphol` |
| Project directory | `~/Projects/millionaire-race-2.5d` |

---

## Wall-clock build time

| Field | Value |
| --- | --- |
| Started | **2026-11-01 10:22:40 PST** (`2026-11-01T10:22:40-08:00`) |
| First delivery | **2026-11-01 11:11:06 PST** — 48 min 25 sec |
| v1.1 feature snapshot | **2026-11-01 12:00:59 PST** — **98 min 18 sec cumulative** |
| Compact dice tray | **2026-11-01 15:04 PST** |
| Latest feature snapshot | **2026-11-01 17:08:32 PST** — session spans multiple sittings; wall clock includes idle gaps |
| Delivered | Complete playable game, three core source files, six screenshots, docs, license and build telemetry |

### Approximate build log

| Time (PST) | Phase |
| --- | --- |
| 10:22 | Kickoff, environment audit, project scaffold |
| 10:26 | Game data model, tiles, economy constants, card deck |
| 10:30 | Lobby UI and 2.5D Canvas board renderer |
| 10:36 | Three.js + Cannon.js dice, Canvas 2D fallback, Web Audio |
| 10:44 | Full turn engine, AI, mortgages, bankruptcy, persistence |
| 10:52 | Headless Chrome visual checks, tile/token polish |
| 11:00 | 30-round simulation, targeted economy tests, mobile layout |
| 11:06 | Final screenshots, README, license, build telemetry |
| 11:11 | GitHub publication and Pages deployment |
| 11:13–12:00 | v1.1: speed control, manual review/Continue, tile inspector, text scaling, settings modal |
| 14:57–15:04 | Compact floating dice tray; board stays visible; mobile below-board placement |
| 15:15–16:12 | Pawn-step slider; sidebar/ledger cap and current-round filter; raised occupied tiles; total-only dice readout; fullscreen; Auto auto-roll; affordability guidance; configurable max rounds; screenshots and re-publication |
| 16:15–17:08 | External pawn lane with larger tokens; labeled fullscreen controls in lobby/dock/settings; lockout pay/forfeit persistence; final screenshots and re-publication |

> Times are derived from the session record, screenshots and the telemetry capture point. The final documentation commit and final assistant message occur slightly after the capture.

---

## Token consumption

Session totals reported by OpenCode. Four snapshots are shown so the original build, the v1.1 update, the compact-tray tweak and the latest feature pass can be compared.

| Token class | First delivery (11:11:06) | v1.1 (12:00:59) | Compact tray (15:04) | Latest (17:08:32) |
| --- | ---: | ---: | ---: | ---: |
| Input (uncached) | 407,174 | 568,437 | 1,506,897 | **1,868,774** |
| Output | 89,097 | 132,455 | 142,708 | **214,487** |
| Reasoning | 138,514 | 223,128 | 249,664 | **469,487** |
| Cache read | 30,218,112 | 73,790,976 | 87,262,080 | **214,478,464** |
| Cache write | 1,842 | 1,842 | 1,842 | **1,842** |
| **Grand total (all classes)** | **30,854,739** | **74,716,838** | **89,163,191** | **217,033,054** |

Derived views at the latest snapshot:

| View | Count |
| --- | ---: |
| Input + output | 2,083,261 |
| Input + output + reasoning | 2,552,748 |
| Cache traffic (read + write) | 214,480,306 |
| Provider-reported session cost | **$0.00** |

### Reading these numbers

- **Cache read** dominates because the agent re-reads the growing conversation context on every turn; it is shown separately rather than hidden.
- The session spans **multiple sittings**. Wall-clock time includes idle breaks; the primary active build through v1.1 is 98m 18s, with several short follow-up passes for the compact tray, pacing, inspection, readability, fullscreen, ledger, auto-roll, affordability and match-length work. Token counts are cumulative and therefore include the resumed conversations.
- **Reasoning** tokens are the model's internal reasoning budget, reported by the provider.
- The **grand total** is input + output + reasoning + cache read + cache write.
- Counts were captured **before** this file's final write, the README edit, the commit, the push and the final reply. The live session total will be marginally higher.
- Cost is exactly as returned by the session store at capture time (0.0); any provider-side billing is outside this record.

---

## Delivery

| Item | Value |
| --- | --- |
| Core source lines | **6,156** across `index.html`, `style.css`, `script.js` |
| HTML | 393 lines |
| CSS | 1,648 lines |
| JavaScript | 4,115 lines |
| Screenshots | 6 (board, review, tile card, settings, dice, lobby) |
| Dependencies | None to install; Three.js + Cannon.js + Google Fonts via CDN |
| Build step | None |
| License | MIT |

### Feature additions

- **Table speed** — 0.5×, 0.75×, 1×, 1.5×, 2×, 3×; scales AI thinking, action handoffs, after-GO pauses and review timing.
- **Pawn step time** — dedicated 80–1200 ms slider (default 200 ms) for the box-to-box hop, independent of table speed.
- **Manual / Auto turn flow** — Manual pauses after a human turn with **Continue →**, a REVIEW badge and an autosaved review state. **Auto rolls the human dice for you** and advances automatically; switching Auto mid-review resumes immediately.
- **Configurable match length** — **Max rounds** in the lobby (5–99, default 30), stored in the match save and used by the header, board footer, round-limit win and log round clamp.
- **Raised occupied tiles + external lane** — boxes with players lift 12 logical pixels with a taller side, shadow, player-colored rim and occupant initials; every pawn also sits on a 72px outer rail aligned to its tile, with a current-player glow and click hit-testing.
- **Fullscreen** — labeled entry points in the lobby, dock and Table Settings, plus the header ⤢ and **F** shortcut; the Fullscreen API state updates labels and `aria-pressed`.
- **Current-round ledger** — the Match Ledger shows only the current round (R chip), capped at 280 px and scrollable; the Quick Guide collapses at 125%+ so the sidebar cannot overlap it.
- **Clickable tile inspector** — canvas hit-testing with hover outline, pointer cursor and a large detail card (price, rent/yield, owner, tier, status, cash shortfall, crash exposure, tax bill and current position).
- **Cash vs net worth guidance** — purchases use liquid cash; a short purchase disables Buy, offers Pass and explains the exact shortfall and that owned assets are not spendable. Auto-mortgage is only for forced rent/tax payments.
- **Dice total only** — the compact dice tray and centre board display only the total steps; individual die values are not shown in text, and the log records only the total.
- **Text-size scaling** — A−/A+ and Table Settings, 100% / 110% / 125% / 140%; rem UI scale plus a proportional Canvas label boost. Header labels collapse to icons at 125%+; Rules is icon-only so the full action set stays on one row.
- **Saved lockout decision** — paying the $10,000 exit fee or forfeiting the turn is written to the save immediately; a reload cannot replay a lost turn or charge the fee twice.
- **Settings modal** — table speed, pawn step, turn flow, text size, display/fullscreen, rules link and inspector hint; all preferences persist in `localStorage`.
- **Keyboard** — `R` rolls, `Space`/`Enter` continues a manual review, `F` toggles fullscreen, `Esc` closes dialogs.

### Validation performed

- ✅ JavaScript syntax check with JavaScriptCore.
- ✅ Headless Chrome renders at 1920×1080, 1440×900 and 390×844, with no console errors.
- ✅ Real 3D physics dice verified under WebGL (SwiftShader): settle detection, upward-face reading, result matches the dice state.
- ✅ Canvas 2D dice fallback verified with WebGL disabled.
- ✅ Three full **120-turn / 30-round** games with random dice, cards, rent, taxes, lockouts and purchases; all ended correctly on the round-limit tiebreak.
- ✅ Targeted checks: 50% auto-mortgage, bankruptcy asset release, last-tycoon win, GO salary + 10% dividends, tax loophole consumption, $1,000,000 victory, AI buy threshold (> $20,000 reserve), AI lockout threshold (> $30,000 cash), save/load round-trip.
- ✅ **Pacing:** pawn step 400 ms measured ~429 ms and stayed ~421–430 ms at table speed 0.5× and 3×; table speed controls AI/turn timing separately.
- ✅ **Auto flow:** human Auto starts without a Roll click; the Roll button is hidden; the turn advances to the AI seat without a review; switching Auto while in review resumes, and switching Auto while awaiting a roll starts the roll.
- ✅ **Affordability:** cash $60,000 vs a $100,000 property shows a $40,000 shortfall, disables Buy, offers **Pass (cash short)**, logs the net-worth explanation and does not auto-skip the decision.
- ✅ **Max rounds:** a 5-round game started from the lobby ended with “5 rounds complete”, header `5 / 5`, and save/load preserved `maxRounds`.
- ✅ **Fullscreen:** the Fullscreen API toggled in and out; ⤡/⤢ icon and `aria-pressed` updated.
- ✅ **Raised tiles:** occupied tiles lift 12 px; a synthetic click on the raised top returns the correct tile; badges show all occupants.
- ✅ **Dice total:** the compact tray shows one total chip only; no individual die chips; caption and log contain only the total.
- ✅ **Ledger:** current round only; at 140% with many entries the panel is 280 px, scrolls internally and does not overlap the leaderboard; Quick Guide collapses at 125%+.
- ✅ **Header:** the full action set (fullscreen, icon-only Rules, Save/Load/New) stays on one row at 110% and 140%.
- ✅ **Text scaling:** 110% keeps one header row; 125%/140% icon-collapse keeps one row; log text grew from 11.5 px to 16.1 px at 140%.
- ✅ **External lane:** 72 px outer rail, tokens aligned to all 24 tiles, current-player glow, lane hit-test returns the correct tile.
- ✅ **Lockout persistence:** paying saved $90,000 cash and cleared lockout across reload (no second fee); losing persisted a review state that could not be replayed as a normal turn.
- ✅ **Fullscreen:** labeled lobby/dock/settings controls and API toggle; icon and `aria-pressed` updated.
- ✅ **Management:** inspector blocked while dice/pawns are moving and during AI turns; review state survives reload; preferences survive reload.
- ✅ Responsive lobby, settings, tile, rules, win and card modals.

---

## Credits

- **Built end-to-end with [OpenCode](https://opencode.ai)** — an open-source AI coding agent.
- **Model: DeepSeek V4.1 Flash** via `opencode-go` (`deepseek-v4.1-flash`).
- Design, game engine, Canvas renderer, physics integration, audio synthesis, tile inspector, pacing system, fullscreen, ledger, copy, tests and documentation were produced in this session.
- Libraries: [Three.js](https://threejs.org) r152, [Cannon.js](https://schteppe.github.io/cannon.js/) 0.6.2, [Google Fonts](https://fonts.google.com) (Outfit, Playfair Display).
- All game artwork is procedural (Canvas + emoji); no paid or third-party image assets were used.

---

*Snapshot captured 2026-11-01 17:08:32 PST. Machine-readable mirror: [build-state.json](build-state.json).*
