# Build State — Millionaire Race 2.5D

This file records the build telemetry for the project: wall-clock time, token consumption, model/agent attribution and validation. It is a snapshot taken at the end of the build session.

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
| Telemetry captured | **2026-11-01 11:11:06 PST** (`2026-11-01T11:11:06-08:00`) |
| Elapsed | **48 min 25 sec** |
| Delivered | 1 complete playable game, 3 core source files, docs, license and screenshots |

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

> Times are derived from the session record, screenshots and the telemetry capture point. The final documentation commit and final assistant message occurred slightly after the capture.

---

## Token consumption

Session totals reported by OpenCode at **2026-11-01 11:11:06 PST**:

| Token class | Count |
| --- | ---: |
| Input (uncached) | **407,174** |
| Output | **89,097** |
| Reasoning | **138,514** |
| Cache read | **30,218,112** |
| Cache write | **1,842** |
| **Grand total (all classes)** | **30,854,739** |

Derived views:

| View | Count |
| --- | ---: |
| Input + output | 496,271 |
| Input + output + reasoning | 634,785 |
| Cache traffic (read + write) | 30,219,954 |
| Provider-reported session cost at capture | **$0.00** |

### Reading these numbers

- **Cache read** dominates because the agent re-reads the growing conversation context on every turn; it is shown separately rather than hidden.
- **Reasoning** tokens are the model's internal reasoning budget, reported by the provider.
- The **grand total** is input + output + reasoning + cache read + cache write.
- Counts were captured **before** this file, the README, the commit and the final reply were written. The live session total will be marginally higher; the 30.8M cache-read figure is the stable, meaningful total.
- Cost is exactly as returned by the session store at capture time (0.0); any provider-side billing is outside this record.

---

## Delivery

| Item | Value |
| --- | --- |
| Core source lines | **4,689** across `index.html`, `style.css`, `script.js` |
| HTML | 263 lines |
| CSS | 1,207 lines |
| JavaScript | 3,219 lines |
| Screenshots | 3 (board, dice, lobby) |
| Dependencies | None to install; Three.js + Cannon.js + Google Fonts via CDN |
| Build step | None |
| License | MIT |

### Validation performed

- ✅ JavaScript syntax check with JavaScriptCore.
- ✅ Headless Chrome renders at 1920×1080, 1440×900 and 390×844, with no console errors.
- ✅ Real 3D physics dice verified under WebGL (SwiftShader): settle detection, upward-face reading, chips match the rendered faces.
- ✅ Canvas 2D dice fallback verified with WebGL disabled.
- ✅ Three full **120-turn / 30-round** games with random dice, cards, rent, taxes, lockouts and purchases; all ended correctly on the 30-round net-worth tiebreak.
- ✅ Targeted checks: 50% auto-mortgage, bankruptcy asset release, last-tycoon win, GO salary + 10% dividends, tax loophole consumption, $1,000,000 victory, AI buy threshold (> $20,000 reserve), AI lockout threshold (> $30,000 cash), save/load round-trip.
- ✅ Responsive lobby, rules, win and card modals; keyboard `R` / `Esc`.

---

## Credits

- **Built end-to-end with [OpenCode](https://opencode.ai)** — an open-source AI coding agent.
- **Model: DeepSeek V4.1 Flash** via `opencode-go` (`deepseek-v4.1-flash`).
- Design, game engine, Canvas renderer, physics integration, audio synthesis, copy, tests and documentation were produced in this single session.
- Libraries: [Three.js](https://threejs.org) r152, [Cannon.js](https://schteppe.github.io/cannon.js/) 0.6.2, [Google Fonts](https://fonts.google.com) (Outfit, Playfair Display).
- All game artwork is procedural (Canvas + emoji); no paid or third-party image assets were used.

---

*Snapshot captured 2026-11-01 11:11:06 PST. Machine-readable mirror: [build-state.json](build-state.json).*
