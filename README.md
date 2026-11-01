# Millionaire Race 2.5D

### Wealth & Asset Tycoon Studio

A complete, production-ready 2.5D wealth-building board game for the browser. Buy the skyline, collect rent, outplay AI tycoons, and be the first to a **$1,000,000** net worth.

![Millionaire Race 2.5D board](screenshot-board.jpg)

<p align="center">
  <img src="screenshot-dice.png" width="49%" alt="3D physics dice modal" />
  <img src="screenshot-lobby.png" width="49%" alt="Player setup lobby" />
</p>

---

## Play

No build step. No dependencies to install.

```bash
cd millionaire-race-2.5d
python3 -m http.server 8080
# open http://localhost:8080
```

You can also open `index.html` directly, but a local server is recommended so browser storage works consistently.

The board, economy, AI and persistence are fully offline-capable. The 3D dice use **Three.js + Cannon.js** from a CDN; if those scripts are blocked, the game automatically uses a Canvas 2D dice fallback. Google Fonts are progressive enhancement — the game falls back to system fonts.

---

## Highlights

- **2–4 player lobby** with editable names, red/blue/green/yellow color pickers and Human / AI Bot toggles.
- **Top-down 2.5D Canvas board** — extruded tiles, isometric property towers, ownership flags, asset-tier stars, live pawns with hop animation, glowing current-tile ring and an animated city skyline.
- **Real 3D physics dice** — two tumbling Cannon.js cubes inside a Three.js table, random forces and torque, pip textures, shadows, rail collisions, automatic rest detection and result reading from the upward face.
- **Complete economy** — salaries, stock dividends, rent, taxes, auto-mortgages, bankruptcy, eliminations and a live net-worth leaderboard.
- **Shuffled card deck** — bull runs, crypto crashes, real-estate booms and tax loopholes.
- **AI decision tree** — bots buy when reserves stay above $20,000 and pay the $10,000 audit-lockout exit fee when cash is above $30,000.
- **Win conditions** — instant victory at $1,000,000 net worth at the end of a turn; otherwise the highest net worth after 30 rounds.
- **Persistence** — autosave after every turn to `localStorage`, plus JSON export (`millionaire_race_save.json`) and import.
- **Synthesized audio** — Web Audio dice rumbles/impacts, coin chimes, pawn thuds, card shuffles, purchase arpeggios, bankruptcy stings and a win fanfare.
- **Responsive & accessible** — mobile layout, keyboard controls (`R` to roll, `Esc` to close dialogs), reduced-motion support, labelled dialogs and live logs.

---

## How to win

| Rule | Detail |
| --- | --- |
| **Instant victory** | First player to reach **$1,000,000 total net worth** at the end of a turn wins. |
| **Round-limit victory** | If nobody reaches $1M, the highest net worth after **30 rounds** wins. |
| **Net worth** | Cash + the buy value of every asset you own. |
| **Start** | $100,000 cash and $100,000 net worth per player. |
| **GO** | Passing or landing on GO pays **$20,000 salary + 10% dividends** on the buy value of owned stocks. |
| **Rent** | Landing on a rival's asset pays rent/yield to the owner. |
| **Mortgage** | If cash is short, assets auto-mortgage at **50%** of purchase value. |
| **Bankruptcy** | A player who cannot cover a debt and has no assets left is eliminated; their assets return to the bank. |
| **Lockout** | Tile 18 sends you to the Luxury Club and costs your next turn unless you pay the **$10,000** exit fee. |

### AI decision tree

- **Buy:** only if `cash − price > $20,000`.
- **Lockout:** pay the $10,000 fee immediately if `cash > $30,000`; otherwise lose the turn.

---

## Board map (24 tiles)

| # | Tile | Price | Rent / Effect |
| ---: | --- | ---: | --- |
| 0 | START / GO | — | +$20,000 salary + 10% stock dividends |
| 1 | Startup Stock A | $25,000 | $3,000 yield |
| 2 | Opportunity Chest | — | Draw a card |
| 3 | Condo Unit | $40,000 | $5,000 rent |
| 4 | Tax Audit | — | Pay 10% of liquid cash |
| 5 | Tech Stock B | $50,000 | $7,000 yield |
| 6 | LUXURY CLUB | — | Just visiting / safe zone |
| 7 | Suburban Villa | $75,000 | $10,000 rent |
| 8 | Market Chance | — | Draw a card |
| 9 | Retail Plaza | $100,000 | $14,000 rent |
| 10 | Stock Crash | — | Lose 15% of your most expensive asset's value |
| 11 | Solar Farm | $120,000 | $17,000 yield |
| 12 | FREE PARKING / BOUTIQUE HOTEL | — | +$5,000 bonus |
| 13 | Downtown Tower | $150,000 | $22,000 rent |
| 14 | Opportunity Chest | — | Draw a card |
| 15 | Biotech IPO | $180,000 | $28,000 yield |
| 16 | Government Fine | — | Pay $15,000 |
| 17 | Beach Resort | $220,000 | $35,000 rent |
| 18 | AUDIT LOCKOUT | — | Go to tile 6; lose next turn unless you pay $10,000 |
| 19 | AI Tech Portfolio | $260,000 | $42,000 yield |
| 20 | Market Chance | — | Draw a card |
| 21 | Supercar Fleet | $300,000 | $50,000 rent |
| 22 | Luxury Tax | — | Pay $25,000 |
| 23 | Millionaire Penthouse | $350,000 | $65,000 rent |

### Card deck

- **Bull Market Surge** — +$25,000 investment bonus.
- **Cryptocurrency Crash** — −$15,000 trading loss.
- **Real Estate Boom** — collect $5,000 from every rival.
- **Tax Loophole Found** — your next tax tile costs $0.

Each deck is Fisher–Yates shuffled and refilled when exhausted.

---

## Controls

| Action | How |
| --- | --- |
| Roll | Click **🎲 Roll Dice** or press **R** |
| Buy / Pass | Decision buttons appear in the dock |
| Lockout | **Pay $10,000** to play, or **Lose Turn** |
| Save / load | **💾 Save Match** / **📂 Load Match** in the header |
| New match | **🔄 New Game** |
| Sound | Speaker button |
| Close dialog | **Esc** |

Turns with no decision (rent, tax, cards, GO, parking) settle automatically so the game keeps moving.

---

## Tech

| Layer | Choice |
| --- | --- |
| Markup | Semantic HTML5 |
| Styling | Modern CSS3: custom properties, grid/flex, `backdrop-filter`, `color-mix`, responsive breakpoints, reduced-motion support |
| Logic | Vanilla ES6 JavaScript — no frameworks, no bundler |
| Board | HTML5 Canvas 2D at 1000×1000 logical resolution, DPR-aware, redrawn at 10 fps idle / 60 fps while animating |
| Dice | Three.js r152 + Cannon.js 0.6.2 (CDN) with a Canvas 2D fallback |
| Audio | Web Audio API oscillators, filtered noise buffers and gain envelopes |
| Persistence | `localStorage` + JSON Blob import/export |

### Project structure

```
millionaire-race-2.5d/
├── index.html            # App shell, lobby, dice/card/win/rules dialogs
├── style.css             # Luxury fintech / board-game visual system
├── script.js             # Game engine, Canvas renderer, dice physics, audio, AI
├── screenshot-board.jpg
├── screenshot-dice.png
├── screenshot-lobby.png
├── BUILD_STATE.md        # Build duration, token accounting and credits
├── build-state.json
├── LICENSE
└── README.md
```

### Try the demo

Append `?demo=1` to the URL to auto-start a four-player AI match. Add `&fast=1` to pre-populate a lived-in board with assets, cash and a mid-game round. These hooks are handy for screenshots and smoke tests.

---

## Validation performed

- JavaScript parsed with JavaScriptCore (`new Function(source)` syntax check).
- Headless Chrome render tests at 1920×1080, 1440×900 and 390×844.
- 3D dice verified under SwiftShader WebGL: physics settles, the top faces are read, and the result matches the dice chips.
- Canvas 2D dice fallback verified with WebGL disabled.
- Full **120-turn / 30-round** simulated match with random dice, cards, lockouts, purchases and rent — ended correctly on the 30-round net-worth tiebreak with no console errors.
- Targeted assertions for auto-mortgage, bankruptcy asset release, GO dividends, tax loophole, $1M victory, AI buy threshold and save/load round-trip.

---

## Build telemetry & credits

This entire project — design, code, copy, tests and screenshots — was created end-to-end by **[OpenCode](https://opencode.ai)** using **DeepSeek V4.1 Flash** (`opencode-go/deepseek-v4.1-flash`).

- **Wall-clock build time:** see [BUILD_STATE.md](BUILD_STATE.md)
- **Token accounting:** see [BUILD_STATE.md](BUILD_STATE.md) or [build-state.json](build-state.json)
- **Model / provider:** `opencode-go` · `deepseek-v4.1-flash`
- **Session:** `ses_e67a68f85ffe5oCsIETmyBfVZY`

Third-party assets: [Three.js](https://threejs.org), [Cannon.js](https://schteppe.github.io/cannon.js/), [Google Fonts](https://fonts.google.com) (Outfit, Playfair Display) and system emoji glyphs. No paid assets or image files were used for the game art — the board is drawn procedurally.

---

## License

MIT © 2026 Somphol Boonjing. See [LICENSE](LICENSE).
