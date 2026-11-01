# Build State — Millionaire Race 2.5D

This file records the build telemetry for the project: wall-clock time, token consumption, model/agent attribution and validation. It now reflects the **review, pacing, tile-inspector and readability update** in addition to the original delivery.

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
| Feature-update snapshot | **2026-11-01 12:00:59 PST** — **98 min 18 sec cumulative** |
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
| 11:13–12:00 | v1.1: speed control, manual review/Continue, clickable tile inspector, text-size scaling, new settings modal, screenshots and re-publication |

> Times are derived from the session record, screenshots and the telemetry capture point. The final documentation commit and final assistant message occur slightly after the capture.

---

## Token consumption

Session totals reported by OpenCode. Two snapshots are shown so the original build and the follow-up update can be compared.

| Token class | At first delivery (11:11:06) | At feature snapshot (12:00:59) |
| --- | ---: | ---: |
| Input (uncached) | 407,174 | **568,437** |
| Output | 89,097 | **132,455** |
| Reasoning | 138,514 | **223,128** |
| Cache read | 30,218,112 | **73,790,976** |
| Cache write | 1,842 | **1,842** |
| **Grand total (all classes)** | **30,854,739** | **74,716,838** |

Derived views at the feature snapshot:

| View | Count |
| --- | ---: |
| Input + output | 700,892 |
| Input + output + reasoning | 924,020 |
| Cache traffic (read + write) | 73,792,818 |
| Provider-reported session cost at capture | **$0.00** |

### Reading these numbers

- **Cache read** dominates because the agent re-reads the growing conversation context on every turn; it is shown separately rather than hidden.
- **Reasoning** tokens are the model's internal reasoning budget, reported by the provider.
- The **grand total** is input + output + reasoning + cache read + cache write.
- Counts were captured **before** this file's final write, the README edit, the commit, the push and the final reply. The live session total will be marginally higher.
- Cost is exactly as returned by the session store at capture time (0.0); any provider-side billing is outside this record.

---

## Delivery

| Item | Value |
| --- | --- |
| Core source lines | **5,500** across `index.html`, `style.css`, `script.js` |
| HTML | 359 lines |
| CSS | 1,480 lines |
| JavaScript | 3,661 lines |
| Screenshots | 6 (board, review, tile card, settings, dice, lobby) |
| Dependencies | None to install; Three.js + Cannon.js + Google Fonts via CDN |
| Build step | None |
| License | MIT |

### v1.1 additions

- **Movement speed** — 0.5×, 0.75×, 1×, 1.5×, 2×, 3×; scales pawn hops, after-GO pauses, AI thinking/action delays and review delays.
- **Manual / Auto turn flow** — Manual (default) pauses after a human turn with a **Continue →** button, a REVIEW leaderboard badge and an autosaved review state. AI turns continue automatically.
- **Clickable tile inspector** — canvas hit-testing with hover outline, pointer cursor and a large detail card (price, rent/yield, owner, tier, status, dynamic exposure and position notes).
- **Text-size scaling** — A−/A+ and Table Settings, 100% / 110% / 125% / 140%; rem-based UI scale plus a proportional Canvas label boost. Header labels collapse to icons at 125%+ so the top bar stays on one row.
- **Settings modal** — speed, turn flow, text size, rules link and tile-inspector hint; all preferences persist in `localStorage`.
- **Keyboard** — `Space` / `Enter` continues a manual review; `R` rolls; `Esc` closes the new dialogs.

### Validation performed

- ✅ JavaScript syntax check with JavaScriptCore.
- ✅ Headless Chrome renders at 1920×1080, 1440×900 and 390×844, with no console errors.
- ✅ Real 3D physics dice verified under WebGL (SwiftShader): settle detection, upward-face reading, chips match the rendered faces.
- ✅ Canvas 2D dice fallback verified with WebGL disabled.
- ✅ Three full **120-turn / 30-round** games with random dice, cards, rent, taxes, lockouts and purchases; all ended correctly on the 30-round net-worth tiebreak.
- ✅ Targeted checks: 50% auto-mortgage, bankruptcy asset release, last-tycoon win, GO salary + 10% dividends, tax loophole consumption, $1,000,000 victory, AI buy threshold (> $20,000 reserve), AI lockout threshold (> $30,000 cash), save/load round-trip.
- ✅ **Pacing:** 0.5× step measured at ~421 ms vs ~124 ms at 2×.
- ✅ **Manual review:** review phase, Continue button, REVIEW badge, Continue advances to the AI seat; Auto mode advances automatically.
- ✅ **Inspector:** a real canvas click opens the correct tile card; inspector is blocked while dice/pawns are moving and during AI turns.
- ✅ **Text scaling:** 110% keeps one header row; 125%/140% icon-collapse keeps one row; log text grew from 11.5 px to 16.1 px at 140%.
- ✅ **Persistence:** review state survives save/load; settings (speed, turn flow, text size) survive reloads.
- ✅ Responsive lobby, settings, tile, rules, win and card modals; keyboard `R` / `Space` / `Esc`.

---

## Credits

- **Built end-to-end with [OpenCode](https://opencode.ai)** — an open-source AI coding agent.
- **Model: DeepSeek V4.1 Flash** via `opencode-go` (`deepseek-v4.1-flash`).
- Design, game engine, Canvas renderer, physics integration, audio synthesis, tile inspector, pacing system, copy, tests and documentation were produced in this single session.
- Libraries: [Three.js](https://threejs.org) r152, [Cannon.js](https://schteppe.github.io/cannon.js/) 0.6.2, [Google Fonts](https://fonts.google.com) (Outfit, Playfair Display).
- All game artwork is procedural (Canvas + emoji); no paid or third-party image assets were used.

---

*Snapshot captured 2026-11-01 12:00:59 PST. Machine-readable mirror: [build-state.json](build-state.json).*
