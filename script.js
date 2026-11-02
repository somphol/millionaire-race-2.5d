'use strict';

/* ═══════════════════════════════════════════════════════════════════════
   MILLIONAIRE RACE 2.5D — Wealth & Asset Tycoon Studio
   Vanilla ES6 · HTML5 Canvas 2.5D board · Three.js + Cannon.js dice
   ════════════════════════════════════════════════════════════════════ */

/* ═══════════════ 1 · CONSTANTS & CONTENT ═══════════════ */

const SAVE_KEY = 'millionaire_race_save_v1';
const SETTINGS_KEY = 'millionaire_race_settings_v1';
const SAVE_VERSION = 1;

const START_CASH = 100000;
const TARGET_NET_WORTH = 1000000;
const MAX_ROUNDS = 30;
const GO_SALARY = 20000;
const GO_DIVIDEND_RATE = 0.10;
const LOCKOUT_FEE = 10000;
const MORTGAGE_RATE = 0.5;
const TILE_COUNT = 24;

const COLOR_KEYS = ['red', 'blue', 'green', 'yellow'];

const PLAYER_COLORS = {
  red:    { label: 'Red',    hex: '#f05555', deep: '#7d1616', glow: 'rgba(240,85,85,.5)' },
  blue:   { label: 'Blue',   hex: '#3f8cff', deep: '#123a7a', glow: 'rgba(63,140,255,.5)' },
  green:  { label: 'Green',  hex: '#35c97e', deep: '#0c5a35', glow: 'rgba(53,201,126,.5)' },
  yellow: { label: 'Yellow', hex: '#f2c53d', deep: '#82620a', glow: 'rgba(242,197,61,.5)' }
};

const TILE_DEFS = [
  { id: 0,  type: 'go',      name: 'START / GO',                  icon: '🏁', themeNote: '+$20K + DIVIDENDS' },
  { id: 1,  type: 'asset',   assetType: 'stock',    name: 'Startup Stock A',        icon: '🚀', price: 25000,  rent: 3000 },
  { id: 2,  type: 'chest',   name: 'Opportunity Chest',           icon: '🎁', themeNote: 'DRAW A CARD' },
  { id: 3,  type: 'asset',   assetType: 'property', name: 'Condo Unit',             icon: '🏢', price: 40000,  rent: 5000 },
  { id: 4,  type: 'tax',     taxMode: 'audit',      name: 'Tax Audit',              icon: '🧾', themeNote: 'PAY 10% CASH' },
  { id: 5,  type: 'asset',   assetType: 'stock',    name: 'Tech Stock B',           icon: '💻', price: 50000,  rent: 7000 },
  { id: 6,  type: 'visit',   name: 'LUXURY CLUB',                 icon: '🥂', themeNote: 'SAFE · VISITING' },
  { id: 7,  type: 'asset',   assetType: 'property', name: 'Suburban Villa',         icon: '🏡', price: 75000,  rent: 10000 },
  { id: 8,  type: 'chance',  name: 'Market Chance',               icon: '🃏', themeNote: 'DRAW A CARD' },
  { id: 9,  type: 'asset',   assetType: 'property', name: 'Retail Plaza',           icon: '🏬', price: 100000, rent: 14000 },
  { id: 10, type: 'crash',   name: 'Stock Crash',                 icon: '📉', themeNote: '-15% TOP ASSET' },
  { id: 11, type: 'asset',   assetType: 'property', name: 'Solar Farm',             icon: '☀️', price: 120000, rent: 17000 },
  { id: 12, type: 'parking', name: 'FREE PARKING / BOUTIQUE HOTEL', icon: '🅿️', themeNote: '+$5,000 BONUS' },
  { id: 13, type: 'asset',   assetType: 'property', name: 'Downtown Tower',         icon: '🗼', price: 150000, rent: 22000 },
  { id: 14, type: 'chest',   name: 'Opportunity Chest',           icon: '🎁', themeNote: 'DRAW A CARD' },
  { id: 15, type: 'asset',   assetType: 'stock',    name: 'Biotech IPO',            icon: '🧬', price: 180000, rent: 28000 },
  { id: 16, type: 'tax',     taxMode: 'fixed',      name: 'Government Fine',        icon: '⚖️', fixed: 15000, themeNote: 'PAY $15K' },
  { id: 17, type: 'asset',   assetType: 'property', name: 'Beach Resort',           icon: '🏖️', price: 220000, rent: 35000 },
  { id: 18, type: 'lockout', name: 'AUDIT LOCKOUT',               icon: '🔒', themeNote: '→ LUXURY CLUB' },
  { id: 19, type: 'asset',   assetType: 'stock',    name: 'AI Tech Portfolio',      icon: '🤖', price: 260000, rent: 42000 },
  { id: 20, type: 'chance',  name: 'Market Chance',               icon: '🃏', themeNote: 'DRAW A CARD' },
  { id: 21, type: 'asset',   assetType: 'property', name: 'Supercar Fleet',         icon: '🏎️', price: 300000, rent: 50000 },
  { id: 22, type: 'tax',     taxMode: 'fixed',      name: 'Luxury Tax',             icon: '💎', fixed: 25000, themeNote: 'PAY $25K' },
  { id: 23, type: 'asset',   assetType: 'property', name: 'Millionaire Penthouse',  icon: '🏙️', price: 350000, rent: 65000 }
];

const CARD_DEFS = [
  {
    id: 'bull',
    title: 'Bull Market Surge',
    icon: '📈',
    text: 'Momentum tears through the exchanges. Your investment accounts surge on heavy volume.',
    effect: '+$25,000',
    tone: 'good'
  },
  {
    id: 'crypto',
    title: 'Cryptocurrency Crash',
    icon: '🪙',
    text: 'Leverage unwinds overnight. Your trading accounts take a brutal mark-to-market hit.',
    effect: '−$15,000',
    tone: 'bad'
  },
  {
    id: 'boom',
    title: 'Real Estate Boom',
    icon: '🏘️',
    text: 'Demand explodes across the city. Every rival pays you a slice of the boom.',
    effect: '+$5,000 FROM EACH RIVAL',
    tone: 'good'
  },
  {
    id: 'loophole',
    title: 'Tax Loophole Found',
    icon: '🧾',
    text: 'Your accountants discover a perfectly legal deduction. Your next tax bill is waived.',
    effect: 'NEXT TAX = $0',
    tone: 'neutral'
  }
];

const TILE_THEMES = {
  go:      { topLight: '#1d5c3c', top: '#0e3523', edge: '#071d13', accent: '#f2c53d', note: '#ffe08a' },
  asset:   { topLight: '#223a5a', top: '#132540', edge: '#0a1424', accent: '#6ea8ff', note: '#a8c4ff' },
  stock:   { topLight: '#164b4a', top: '#0c2e31', edge: '#061a1d', accent: '#38d6c4', note: '#8ef0e6' },
  chest:   { topLight: '#3b2a5e', top: '#251a3d', edge: '#140c25', accent: '#b088ff', note: '#d6c3ff' },
  chance:  { topLight: '#4a3118', top: '#2f1f10', edge: '#1b1108', accent: '#ffb347', note: '#ffd29a' },
  tax:     { topLight: '#4a1f24', top: '#2f1418', edge: '#1a090c', accent: '#ff7a7a', note: '#ffb3b3' },
  crash:   { topLight: '#4c1629', top: '#2f0d19', edge: '#1a060e', accent: '#ff5d8f', note: '#ffa4bf' },
  parking: { topLight: '#1a4a35', top: '#0e2d20', edge: '#061a12', accent: '#6fe3a1', note: '#aef3cb' },
  visit:   { topLight: '#363b4a', top: '#222531', edge: '#12141b', accent: '#d7b56d', note: '#e6d3a6' },
  lockout: { topLight: '#43233a', top: '#291523', edge: '#170a13', accent: '#ff8a5c', note: '#ffb99e' }
};

/* ═══════════════ 2 · SMALL UTILITIES ═══════════════ */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const TAU = Math.PI * 2;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const randDie = () => 1 + Math.floor(Math.random() * 6);

function fmt(n) {
  const v = Math.round(Number(n) || 0);
  return '$' + v.toLocaleString('en-US');
}

function fmtCompact(n) {
  const v = Math.round(Number(n) || 0);
  if (Math.abs(v) >= 1000000) return '$' + (v / 1000000).toFixed(v % 1000000 ? 1 : 0) + 'M';
  if (Math.abs(v) >= 1000) return '$' + Math.round(v / 1000) + 'K';
  return '$' + v;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function shade(hex, percent) {
  const n = parseInt(hex.slice(1), 16);
  const target = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const r = Math.round((target - ((n >> 16) & 255)) * p + ((n >> 16) & 255));
  const g = Math.round((target - ((n >> 8) & 255)) * p + ((n >> 8) & 255));
  const b = Math.round((target - (n & 255)) * p + (n & 255));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function timeLabel(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (_) { return ''; }
}

function assetTier(tile) {
  if (!tile || !tile.price) return 0;
  if (tile.price >= 250000) return 4;
  if (tile.price >= 150000) return 3;
  if (tile.price >= 75000) return 2;
  return 1;
}

function tileTheme(tile) {
  if (tile.type === 'asset') return tile.assetType === 'stock' ? TILE_THEMES.stock : TILE_THEMES.asset;
  return TILE_THEMES[tile.type] || TILE_THEMES.asset;
}

/* ═══════════════ 3 · AUDIO ENGINE (Web Audio synthesis) ═══════════════ */

const Sound = {
  ctx: null,
  master: null,

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.34;
      this.master.connect(this.ctx.destination);
    } catch (_) {
      this.ctx = null;
    }
  },

  get ok() { return settings.sound && !!this.ctx; },

  tone(freq, dur, type = 'sine', gain = 0.15, delay = 0, slideTo = null) {
    if (!this.ok) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, freq), t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.04);
  },

  noise(dur = 0.2, gain = 0.1, freq = 1000, delay = 0, q = 1) {
    if (!this.ok) return;
    const t0 = this.ctx.currentTime + delay;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.7);
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.value = gain;
    src.connect(filter).connect(g).connect(this.master);
    src.start(t0);
  },

  click() { this.tone(420, 0.045, 'square', 0.035); },
  start() {
    [392, 523, 659, 784].forEach((f, i) => this.tone(f, 0.4, 'triangle', 0.09, i * 0.09));
    this.noise(0.4, 0.03, 2400, 0.05);
  },
  diceShake() {
    this.noise(0.55, 0.11, 900, 0, 0.7);
    for (let i = 0; i < 5; i++) this.tone(180 + Math.random() * 220, 0.05, 'square', 0.02, i * 0.09 + Math.random() * 0.04);
  },
  diceHit() {
    this.tone(95, 0.14, 'sine', 0.14, 0, 60);
    this.noise(0.09, 0.12, 300);
  },
  step() {
    this.tone(165, 0.065, 'sine', 0.055, 0, 95);
    this.noise(0.04, 0.035, 420);
  },
  coin() {
    [880, 1174, 1568].forEach((f, i) => this.tone(f, 0.22, 'triangle', 0.075, i * 0.055));
    this.noise(0.12, 0.02, 3000, 0.02);
  },
  buy() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.28, 'triangle', 0.075, i * 0.075));
  },
  card() {
    this.noise(0.32, 0.09, 1700, 0, 0.8);
    this.noise(0.22, 0.06, 760, 0.11, 0.9);
  },
  mortgage() {
    this.tone(130, 0.28, 'sawtooth', 0.05, 0, 70);
  },
  bad() {
    this.tone(220, 0.32, 'sawtooth', 0.06, 0, 110);
  },
  bankrupt() {
    [330, 262, 196, 131].forEach((f, i) => this.tone(f, 0.4, 'sawtooth', 0.055, i * 0.14));
    this.noise(0.5, 0.05, 300, 0.1);
  },
  win() {
    const notes = [523, 659, 784, 1046, 1318, 1568];
    notes.forEach((f, i) => this.tone(f, 0.6, 'triangle', 0.09, i * 0.11));
    [523, 659, 784].forEach((f) => this.tone(f, 1.4, 'sine', 0.05, 0.7));
    this.noise(0.7, 0.025, 3200, 0.65);
  }
};

/* ═══════════════ 4 · GLOBAL STATE ═══════════════ */

let state = null;

let settings = {
  sound: true,
  lobbyCount: 4,
  lobby: null,
  speed: 1,
  autoAdvance: false,
  fontScale: 1.1,
  stepMs: 200,
  maxRounds: MAX_ROUNDS
};

const lobbyConfig = [
  { name: 'You',  color: 'red',    type: 'human' },
  { name: 'Ava',  color: 'blue',   type: 'ai' },
  { name: 'Kai',  color: 'green',  type: 'ai' },
  { name: 'Zoe',  color: 'yellow', type: 'ai' }
];

const ui = {
  epoch: 0,
  anim: null,
  endTimer: null,
  diceResolve: null,
  diceFinish: null,
  diceCleanup: null,
  diceTicker: null,
  autoRollTimer: null,
  endTimerKind: null,
  pendingCard: null,
  lastDraw: 0,
  dirty: true,
  audioReady: false,
  hoverTile: -1
};

/* ═══════════════ 5 · GAME STATE HELPERS ═══════════════ */

function currentPlayer() {
  if (!state) return null;
  return state.players[state.current] || null;
}

function activePlayers() {
  if (!state) return [];
  return state.players.filter((p) => !p.bankrupt);
}

function ownedTiles(player) {
  if (!state || !player) return [];
  return state.tiles.filter((t) => t.ownerId === player.id);
}

function netWorth(player) {
  if (!player) return 0;
  return player.cash + ownedTiles(player).reduce((sum, t) => sum + (t.price || 0), 0);
}

function playerColor(player) {
  return (player && PLAYER_COLORS[player.color]) || PLAYER_COLORS.red;
}

function addLog(text, kind = 'info') {
  if (!state) return;
  state.log.push({ t: Date.now(), text, kind, round: state.round });
  if (state.log.length > 250) state.log.splice(0, state.log.length - 250);
  renderLog();
}

function createState(configs, maxRounds = MAX_ROUNDS) {
  return {
    version: SAVE_VERSION,
    createdAt: Date.now(),
    startedAt: Date.now(),
    players: configs.map((cfg, i) => ({
      id: i,
      name: (cfg.name || `Player ${i + 1}`).trim().slice(0, 16) || `Player ${i + 1}`,
      color: cfg.color,
      isAI: cfg.type === 'ai',
      cash: START_CASH,
      position: 0,
      bankrupt: false,
      lockout: false,
      taxShield: false
    })),
    tiles: TILE_DEFS.map((t) => ({ ...t, ownerId: null, mortgaged: false })),
    decks: {
      chest: shuffle(CARD_DEFS.map((c) => c.id)),
      chance: shuffle(CARD_DEFS.map((c) => c.id))
    },
    current: 0,
    round: 1,
    maxRounds: clamp(Math.round(Number(maxRounds) || MAX_ROUNDS), 5, 99),
    turn: 0,
    phase: 'awaitRoll',
    dice: [0, 0],
    log: [],
    winnerId: null,
    endReason: '',
    endedAt: null,
    pendingBuy: null
  };
}

function normalizeState(raw) {
  if (!validateSave(raw)) return null;
  const players = raw.players.slice(0, 4).map((p, i) => ({
    id: i,
    name: String(p.name || `Player ${i + 1}`).slice(0, 16) || `Player ${i + 1}`,
    color: COLOR_KEYS.includes(p.color) ? p.color : COLOR_KEYS[i % 4],
    isAI: !!p.isAI,
    cash: Math.max(0, Number(p.cash) || 0),
    position: clamp(Math.round(Number(p.position) || 0), 0, TILE_COUNT - 1),
    bankrupt: !!p.bankrupt,
    lockout: !!p.lockout,
    taxShield: !!p.taxShield
  }));

  const used = new Set();
  players.forEach((p, i) => {
    if (used.has(p.color)) p.color = COLOR_KEYS.find((c) => !used.has(c)) || COLOR_KEYS[i % 4];
    used.add(p.color);
  });

  const tiles = TILE_DEFS.map((def, i) => {
    const saved = (raw.tiles || []).find((t) => Number(t.id) === i) || {};
    const ownerId = saved.ownerId != null && players[saved.ownerId] && !players[saved.ownerId].bankrupt
      ? saved.ownerId
      : null;
    return { ...def, ownerId, mortgaged: ownerId != null && !!saved.mortgaged };
  });

  let decks = {
    chest: Array.isArray(raw.decks && raw.decks.chest) ? raw.decks.chest.filter((id) => CARD_DEFS.some((c) => c.id === id)) : [],
    chance: Array.isArray(raw.decks && raw.decks.chance) ? raw.decks.chance.filter((id) => CARD_DEFS.some((c) => c.id === id)) : []
  };

  const maxRounds = clamp(Math.round(Number(raw.maxRounds) || MAX_ROUNDS), 5, 99);
  const logs = Array.isArray(raw.log) ? raw.log.slice(-200).map((e) => ({
    t: Number(e.t) || Date.now(),
    text: String(e.text || ''),
    kind: ['good', 'bad', 'warn', 'special', 'info'].includes(e.kind) ? e.kind : 'info',
    round: clamp(Number(e.round) || Number(raw.round) || 1, 1, maxRounds + 1)
  })) : [];

  const playersCount = players.length;
  const current = clamp(Math.round(Number(raw.current) || 0), 0, playersCount - 1);
  const phase = raw.phase === 'ended' ? 'ended' : raw.phase === 'review' ? 'review' : 'awaitRoll';

  return {
    version: SAVE_VERSION,
    createdAt: Number(raw.createdAt) || Date.now(),
    startedAt: Number(raw.startedAt) || Date.now(),
    players,
    tiles,
    decks,
    current,
    round: clamp(Math.round(Number(raw.round) || 1), 1, maxRounds + 1),
    maxRounds,
    turn: Math.max(0, Math.round(Number(raw.turn) || 0)),
    phase,
    dice: Array.isArray(raw.dice) && raw.dice.length === 2 ? raw.dice.map((n) => clamp(Math.round(Number(n) || 0), 0, 6)) : [0, 0],
    log: logs,
    winnerId: raw.winnerId != null && players[raw.winnerId] ? raw.winnerId : null,
    endReason: String(raw.endReason || ''),
    endedAt: raw.endedAt || null,
    pendingBuy: null
  };
}

function validateSave(raw) {
  return !!raw
    && typeof raw === 'object'
    && Array.isArray(raw.players)
    && raw.players.length >= 2
    && raw.players.length <= 4
    && Array.isArray(raw.tiles)
    && raw.tiles.length === TILE_COUNT;
}

/* ═══════════════ 6 · MONEY, MORTGAGES & ELIMINATION ═══════════════ */

function raiseFunds(player, needed) {
  let guard = 0;
  while (player.cash < needed && guard++ < 20) {
    const candidates = ownedTiles(player).filter((t) => !t.mortgaged);
    if (!candidates.length) break;
    candidates.sort((a, b) => a.price - b.price);
    const tile = candidates[0];
    const amount = Math.floor(tile.price * MORTGAGE_RATE);
    tile.mortgaged = true;
    player.cash += amount;
    addLog(`${player.name} auto-mortgaged ${tile.name} for ${fmt(amount)} (50% of value).`, 'warn');
    toast(`${player.name} mortgaged ${tile.name}`, 'warn');
    Sound.mortgage();
  }
}

function payBank(player, amount, reason) {
  if (!state || !player || amount <= 0 || player.bankrupt) return 0;
  raiseFunds(player, amount);
  const paid = Math.min(player.cash, amount);
  player.cash -= paid;
  if (paid < amount) {
    eliminate(player, `could not cover ${fmt(amount - paid)} of the ${reason}`);
  }
  updateUI();
  return paid;
}

function transfer(from, to, amount, reason) {
  if (!state || !from || !to || from === to || amount <= 0 || from.bankrupt) return 0;
  raiseFunds(from, amount);
  const paid = Math.min(from.cash, amount);
  from.cash -= paid;
  to.cash += paid;
  if (paid < amount) {
    eliminate(from, `could not cover ${fmt(amount - paid)} of ${reason}`);
  }
  updateUI();
  return paid;
}

function eliminate(player, reason) {
  if (!state || player.bankrupt) return;
  player.bankrupt = true;
  player.cash = 0;
  player.lockout = false;
  const released = ownedTiles(player);
  released.forEach((t) => { t.ownerId = null; t.mortgaged = false; });
  addLog(`💀 ${player.name} is eliminated — ${reason}. ${released.length ? 'Their assets returned to the bank.' : ''}`, 'bad');
  toast(`${player.name} is bankrupt`, 'bad');
  Sound.bankrupt();
  updateUI();

  const remaining = activePlayers();
  if (remaining.length === 1) {
    endGame(remaining[0].id, `${remaining[0].name} is the last tycoon standing after a bankruptcy.`);
  } else if (remaining.length === 0) {
    endGame(null, 'The entire market collapsed. No tycoons survived.');
  }
}

function collectGo(player) {
  const stocks = ownedTiles(player).filter((t) => t.assetType === 'stock');
  const stockValue = stocks.reduce((sum, t) => sum + t.price, 0);
  const dividend = Math.round(stockValue * GO_DIVIDEND_RATE);
  const total = GO_SALARY + dividend;
  player.cash += total;
  addLog(`${player.name} collected ${fmt(GO_SALARY)} salary${dividend ? ` + ${fmt(dividend)} stock dividends` : ''} at GO.`, 'good');
  toast(`GO: +${fmt(total)}`, 'good');
  Sound.coin();
  updateUI();
}

/* ═══════════════ 7 · TURN ENGINE ═══════════════ */

function startGame(configs, maxRounds = settings.maxRounds || MAX_ROUNDS) {
  clearTimeout(ui.endTimer);
  clearTimeout(ui.autoRollTimer);
  ui.autoRollTimer = null;
  ui.endTimerKind = null;
  clearInterval(ui.diceTicker);
  ui.diceTicker = null;
  stopDiceVisuals();
  ui.epoch += 1;
  ui.pendingCard = null;
  ui.anim = null;
  state = createState(configs, maxRounds);
  closeAllModals();
  addLog(`🏁 Match started — ${state.players.length} tycoons, ${fmt(START_CASH)} each. First to ${fmt(TARGET_NET_WORTH)} net worth wins.`, 'special');
  addLog(`Round 1 · ${state.players[0].name}'s turn.`, 'info');
  updateUI();
  saveLocal();
  saveSettings();
  Sound.start();
  beginTurn();
}

function scheduleAutoRoll(epoch, delay) {
  clearTimeout(ui.autoRollTimer);
  ui.autoRollTimer = setTimeout(() => {
    ui.autoRollTimer = null;
    if (epoch !== ui.epoch || !state || state.phase !== 'awaitRoll') return;
    const player = currentPlayer();
    if (!player || player.bankrupt) return;
    if (!player.isAI && !settings.autoAdvance) return;
    if (document.querySelector('.modal-overlay.show')) {
      scheduleAutoRoll(epoch, 400);
      return;
    }
    rollDiceForCurrent();
  }, Math.max(80, delay));
}

function beginTurn() {
  if (!state || state.phase === 'ended') return;
  const epoch = ui.epoch;
  const player = currentPlayer();
  if (!player) return;
  if (player.bankrupt) { finishTurn(); return; }

  if (player.lockout) {
    state.phase = 'lockout';
    updateUI();
    if (player.isAI) {
      setTimeout(() => {
        if (epoch !== ui.epoch || !state || state.phase !== 'lockout') return;
        if (player.cash > 30000) payLockoutFee(player);
        else skipLockedTurn(player);
      }, paced(950));
    }
    return;
  }

  state.phase = 'awaitRoll';
  updateUI();

  if (player.isAI || settings.autoAdvance) {
    scheduleAutoRoll(epoch, paced(1000));
  }
}

function payLockoutFee(player) {
  if (!state || player.bankrupt) return;
  const paid = payBank(player, LOCKOUT_FEE, 'audit lockout exit fee');
  if (player.bankrupt) { finishTurn(); return; }
  player.lockout = false;
  addLog(`${player.name} paid ${fmt(paid)} to exit the audit lockout and will play normally.`, 'warn');
  toast(`${player.name} paid ${fmt(LOCKOUT_FEE)} lockout exit fee`, 'warn');
  Sound.coin();
  state.phase = 'awaitRoll';
  updateUI();
  if (player.isAI || settings.autoAdvance) {
    scheduleAutoRoll(ui.epoch, player.isAI ? paced(750) : 300);
  }
}

function skipLockedTurn(player) {
  if (!state || player.bankrupt) return;
  player.lockout = false;
  addLog(`${player.name} loses this turn to the audit lockout.`, 'bad');
  toast(`${player.name} lost a turn`, 'bad');
  endTurnSoon(420);
}

async function rollDiceForCurrent() {
  if (!state || state.phase !== 'awaitRoll') return;
  clearTimeout(ui.autoRollTimer);
  ui.autoRollTimer = null;
  const epoch = ui.epoch;
  const player = currentPlayer();
  if (!player) return;

  state.phase = 'rolling';
  updateUI();
  Sound.diceShake();

  const [d1, d2] = await openDiceModal(player);
  if (epoch !== ui.epoch || !state || state.phase === 'ended') return;

  state.dice = [d1, d2];
  const total = d1 + d2;
  addLog(`${player.name} rolled a total of ${total}.`, 'info');
  state.phase = 'moving';
  updateUI();

  await movePlayerBy(player, total, epoch);
  if (epoch !== ui.epoch || !state || state.phase === 'ended') return;

  resolveTile(player);
}

async function movePlayerBy(player, steps, epoch) {
  for (let i = 0; i < steps; i++) {
    if (epoch !== ui.epoch || !state || state.phase === 'ended') return;
    const from = player.position;
    const to = (from + 1) % TILE_COUNT;
    await animatePawnStep(player, from, to);
    if (epoch !== ui.epoch || !state) return;
    player.position = to;
    Sound.step();
    if (to === 0) {
      collectGo(player);
      await wait(paced(260));
    }
  }
}

function animatePawnStep(player, fromPos, toPos) {
  return new Promise((resolve) => {
    const from = tileCenter(fromPos);
    const to = tileCenter(toPos);
    const dur = Math.max(60, Math.round(settings.stepMs || 200));
    ui.anim = { playerId: player.id, from, to, fromPos, toPos, start: performance.now(), dur };
    setTimeout(() => {
      ui.anim = null;
      resolve();
    }, dur + 20);
  });
}

function resolveTile(player) {
  if (!state || state.phase === 'ended') return;
  const tile = state.tiles[player.position];
  state.phase = 'resolving';
  addLog(`${player.name} landed on ${tile.name}.`, 'info');
  updateUI();

  switch (tile.type) {
    case 'asset':
      resolveAsset(player, tile);
      return;
    case 'chest':
    case 'chance':
      drawCard(player, tile.type);
      return;
    case 'tax':
      payTaxTile(player, tile);
      break;
    case 'crash':
      resolveStockCrash(player);
      break;
    case 'lockout':
      resolveLockout(player);
      return;
    case 'parking':
      player.cash += 5000;
      addLog(`${player.name} rests at the Boutique Hotel and collects a ${fmt(5000)} bonus.`, 'good');
      toast(`Free Parking bonus: +${fmt(5000)}`, 'good');
      Sound.coin();
      break;
    case 'visit':
      addLog(`${player.name} enjoys the Luxury Club — safe zone.`, 'info');
      break;
    case 'go':
      // GO salary already collected during movement.
      break;
    default:
      break;
  }

  if (!state || state.phase === 'ended') return;
  endTurnSoon(850);
}

function resolveAsset(player, tile) {
  if (tile.ownerId === null) {
    if (player.isAI) {
      if (player.cash < tile.price) {
        addLog(`${player.name} cannot afford ${tile.name}: price ${fmt(tile.price)}, cash ${fmt(player.cash)}.`, 'warn');
        endTurnSoon(850);
        return;
      }
      if (player.cash - tile.price > 20000) {
        buyAsset(player, tile);
        endTurnSoon(900);
      } else {
        addLog(`${player.name} passes on ${tile.name} to keep cash reserves above $20,000.`, 'info');
        endTurnSoon(850);
      }
      return;
    }
    state.phase = 'decision';
    state.pendingBuy = tile.id;
    updateUI();
    if (player.cash < tile.price) {
      const shortfall = tile.price - player.cash;
      const assets = ownedTiles(player).length;
      const worthNote = assets > 0
        ? `Net worth ${fmt(netWorth(player))} includes ${assets} asset${assets === 1 ? '' : 's'} and cannot be spent on a purchase.`
        : `Net worth is ${fmt(netWorth(player))} in cash.`;
      addLog(`${player.name} cannot afford ${tile.name}: price ${fmt(tile.price)}, liquid cash ${fmt(player.cash)} — short ${fmt(shortfall)}. ${worthNote}`, 'warn');
      toast(`Need ${fmt(shortfall)} more cash — only liquid cash can buy assets.`, 'warn');
    }
    return;
  }

  if (tile.ownerId === player.id) {
    addLog(`${player.name} visits their own ${tile.name}.`, 'info');
    endTurnSoon(750);
    return;
  }

  const owner = state.players[tile.ownerId];
  const kind = tile.assetType === 'stock' ? 'stock yield' : 'rent';
  const paid = transfer(player, owner, tile.rent, `${kind} on ${tile.name}`);
  if (paid > 0) {
    addLog(`${player.name} paid ${fmt(paid)} ${kind} to ${owner.name} for ${tile.name}.`, 'bad');
    toast(`${player.name} → ${owner.name}: ${fmt(paid)}`, 'bad');
    Sound.coin();
  }
  if (!state || state.phase === 'ended') return;
  endTurnSoon(950);
}

function buyAsset(player, tile) {
  if (!state || !player || !tile || tile.ownerId !== null || player.cash < tile.price) return false;
  player.cash -= tile.price;
  tile.ownerId = player.id;
  tile.mortgaged = false;
  addLog(`${player.name} bought ${tile.name} for ${fmt(tile.price)}.`, 'good');
  toast(`Bought ${tile.name} for ${fmt(tile.price)}`, 'good');
  Sound.buy();
  updateUI();
  return true;
}

function payTaxTile(player, tile) {
  if (player.taxShield) {
    player.taxShield = false;
    addLog(`${player.name}'s tax loophole shielded them from ${tile.name}.`, 'special');
    toast('Tax loophole absorbed the bill', 'special');
    return;
  }
  let amount = 0;
  if (tile.taxMode === 'audit') amount = Math.max(0, Math.round(player.cash * 0.10));
  else amount = tile.fixed || 0;
  if (amount <= 0) {
    addLog(`${player.name} had no liquid cash for ${tile.name}.`, 'info');
    return;
  }
  const paid = payBank(player, amount, tile.name);
  addLog(`${player.name} paid ${fmt(paid)} to ${tile.name}.`, 'bad');
  toast(`${tile.name}: −${fmt(paid)}`, 'bad');
  Sound.bad();
}

function resolveStockCrash(player) {
  const owned = ownedTiles(player);
  if (!owned.length) {
    addLog(`${player.name} rode out the stock crash with no assets exposed.`, 'info');
    return;
  }
  const priciest = owned.reduce((a, b) => (b.price > a.price ? b : a));
  const loss = Math.round(priciest.price * 0.15);
  const paid = payBank(player, loss, 'stock market crash');
  addLog(`${priciest.name} crashed — ${player.name} lost ${fmt(paid)} (15% of ${fmt(priciest.price)}).`, 'bad');
  toast(`${priciest.name} crashed: −${fmt(paid)}`, 'bad');
  Sound.bad();
}

function resolveLockout(player) {
  const fromPos = player.position;
  player.position = 6;
  player.lockout = true;
  addLog(`${player.name} was caught in an audit lockout and moved to the Luxury Club.`, 'bad');
  toast('Audit Lockout — sent to Luxury Club', 'bad');
  Sound.bad();

  const from = tileCenter(fromPos);
  const to = tileCenter(6);
  const dur = Math.max(260, Math.round(560 / (settings.speed || 1)));
  ui.anim = { playerId: player.id, from, to, fromPos, toPos: 6, start: performance.now(), dur };
  updateUI();
  setTimeout(() => {
    ui.anim = null;
    if (state && state.phase !== 'ended') endTurnSoon(380);
  }, dur + 120);
}

/* ═══════════════ 8 · CARDS ═══════════════ */

function drawCard(player, kind) {
  if (!state) return;
  const key = kind === 'chance' ? 'chance' : 'chest';
  if (!Array.isArray(state.decks[key]) || state.decks[key].length === 0) {
    state.decks[key] = shuffle(CARD_DEFS.map((c) => c.id));
  }
  const cardId = state.decks[key].pop();
  const card = CARD_DEFS.find((c) => c.id === cardId) || CARD_DEFS[0];
  const deckLabel = key === 'chance' ? 'Market Chance' : 'Opportunity Chest';

  ui.pendingCard = { card, player, kind: key };
  state.phase = 'card';
  addLog(`${player.name} drew from the ${deckLabel}: ${card.title}.`, 'special');
  updateUI();
  showCardModal(card, key, player);
  Sound.card();

  if (player.isAI) {
    const epoch = ui.epoch;
    setTimeout(() => {
      if (epoch !== ui.epoch || !state || !ui.pendingCard) return;
      resolvePendingCard();
    }, paced(1850));
  }
}

function showCardModal(card, kind, player) {
  const modal = $('#cardModal');
  modal.dataset.kind = kind;
  $('#cardDeckLabel').textContent = kind === 'chance' ? 'Market Chance' : 'Opportunity Chest';
  $('#cardIcon').textContent = card.icon;
  $('#cardTitle').textContent = card.title;
  $('#cardText').textContent = card.text;
  const effectEl = $('#cardEffect');
  effectEl.textContent = card.effect;
  effectEl.className = 'card-effect' + (card.tone === 'bad' ? ' bad' : card.tone === 'neutral' ? ' neutral' : '');
  $('#cardContinueBtn').hidden = player.isAI;
  $('#cardContinueBtn').textContent = card.tone === 'bad' ? 'Absorb the Loss' : 'Collect & Continue';
  openModal('cardModal');
}

function resolvePendingCard() {
  const pending = ui.pendingCard;
  if (!pending) return;
  ui.pendingCard = null;
  closeModal('cardModal');
  applyCard(pending.card, pending.player);
  if (!state || state.phase === 'ended') return;
  endTurnSoon(650);
}

function applyCard(card, player) {
  if (!state || !player) return;
  switch (card.id) {
    case 'bull': {
      player.cash += 25000;
      addLog(`${player.name} gained ${fmt(25000)} from the bull market surge.`, 'good');
      toast(`${player.name}: +${fmt(25000)}`, 'good');
      Sound.coin();
      break;
    }
    case 'crypto': {
      const paid = payBank(player, 15000, 'cryptocurrency crash');
      addLog(`${player.name} lost ${fmt(paid)} in the crypto crash.`, 'bad');
      toast(`Crypto crash: −${fmt(paid)}`, 'bad');
      Sound.bad();
      break;
    }
    case 'boom': {
      const rivals = activePlayers().filter((p) => p.id !== player.id);
      rivals.forEach((rival) => {
        if (!state || rival.bankrupt) return;
        const paid = transfer(rival, player, 5000, 'real estate boom');
        addLog(`${rival.name} paid ${fmt(paid)} boom rent to ${player.name}.`, 'info');
      });
      if (state) {
        toast(`${player.name} collected boom rent from ${rivals.length} rival${rivals.length === 1 ? '' : 's'}`, 'good');
        Sound.coin();
      }
      break;
    }
    case 'loophole': {
      player.taxShield = true;
      addLog(`${player.name} found a tax loophole — next tax bill will be $0.`, 'special');
      toast('Tax loophole armed', 'special');
      break;
    }
    default:
      break;
  }
  updateUI();
}

/* ═══════════════ 9 · TURN COMPLETION ═══════════════ */

function endTurnSoon(delay = 800) {
  if (!state || state.phase === 'ended') return;
  const player = currentPlayer();
  const manualPause = !settings.autoAdvance && player && !player.isAI && !player.bankrupt;

  state.phase = 'resolving';
  updateUI();
  clearTimeout(ui.endTimer);
  const epoch = ui.epoch;

  if (manualPause) {
    const reviewDelay = Math.max(120, Math.min(900, paced(delay)));
    ui.endTimerKind = 'review';
    ui.endTimer = setTimeout(() => {
      if (epoch !== ui.epoch || !state || state.phase === 'ended') return;
      ui.endTimerKind = null;
      state.phase = 'review';
      updateUI();
      saveLocal();
    }, reviewDelay);
    return;
  }

  ui.endTimerKind = 'finish';
  ui.endTimer = setTimeout(() => {
    if (epoch !== ui.epoch || !state || state.phase === 'ended') return;
    ui.endTimerKind = null;
    finishTurn();
  }, paced(delay));
}

function continueTurn() {
  if (!state || state.phase !== 'review') return;
  Sound.click();
  finishTurn();
}

function finishTurn() {
  if (!state || state.phase === 'ended') return;
  clearTimeout(ui.endTimer);
  ui.endTimerKind = null;

  const achievers = activePlayers().filter((p) => netWorth(p) >= TARGET_NET_WORTH);
  if (achievers.length) {
    achievers.sort((a, b) => netWorth(b) - netWorth(a));
    const champion = achievers[0];
    endGame(champion.id, `${champion.name} reached ${fmt(netWorth(champion))} in total net worth.`);
    return;
  }

  state.turn += 1;
  const active = activePlayers();
  if (active.length <= 1) {
    endGame(active[0] ? active[0].id : null, 'Only one tycoon remained solvent.');
    return;
  }

  const previous = state.current;
  let next = previous;
  let guard = 0;
  do {
    next = (next + 1) % state.players.length;
    guard++;
  } while (state.players[next].bankrupt && guard < 10);

  if (next <= previous) state.round += 1;
  state.current = next;

  if (state.round > state.maxRounds) {
    endGameByNetWorth();
    return;
  }

  state.phase = 'awaitRoll';
  saveLocal();
  updateUI();
  addLog(`— Round ${state.round} · ${state.players[next].name}'s turn —`, 'info');
  beginTurn();
}

function endGameByNetWorth() {
  if (!state) return;
  const ranked = activePlayers().slice().sort((a, b) => {
    const diff = netWorth(b) - netWorth(a);
    if (diff) return diff;
    if (b.cash !== a.cash) return b.cash - a.cash;
    return a.id - b.id;
  });
  if (!ranked.length) {
    endGame(null, `${state.maxRounds} rounds passed with no solvent tycoons.`);
    return;
  }
  endGame(ranked[0].id, `${state.maxRounds} rounds complete — ${ranked[0].name} takes the crown with ${fmt(netWorth(ranked[0]))} in net worth.`);
}

function endGame(winnerId, reason) {
  if (!state || state.phase === 'ended') return;
  clearTimeout(ui.endTimer);
  clearInterval(ui.diceTicker);
  ui.diceTicker = null;
  stopDiceVisuals();
  state.phase = 'ended';
  state.winnerId = winnerId;
  state.endReason = reason;
  state.endedAt = Date.now();
  ui.pendingCard = null;
  closeModal('cardModal');
  closeModal('diceModal');
  saveLocal();
  updateUI();
  renderWinModal();
  openModal('winModal');
  buildConfetti();
  if (winnerId != null) Sound.win();
  else Sound.bankrupt();
}

/* ═══════════════ 10 · SAVE / LOAD / EXPORT ═══════════════ */

function saveLocal() {
  if (!state) return;
  try {
    const snapshot = JSON.parse(JSON.stringify(state));
    snapshot.pendingBuy = null;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ savedAt: Date.now(), state: snapshot }));
    refreshSaveHint();
  } catch (err) {
    console.warn('Autosave failed:', err);
  }
}

function hasLocalSave() {
  try { return !!localStorage.getItem(SAVE_KEY); } catch (_) { return false; }
}

function loadLocal() {
  let raw;
  try {
    const stored = localStorage.getItem(SAVE_KEY);
    if (!stored) { toast('No saved match found', 'warn'); return false; }
    const parsed = JSON.parse(stored);
    raw = parsed.state || parsed;
  } catch (err) {
    toast('Saved match is corrupted', 'bad');
    return false;
  }
  if (!validateSave(raw)) { toast('Saved match is invalid', 'bad'); return false; }
  loadState(raw, 'browser storage');
  return true;
}

function loadState(raw, sourceLabel) {
  const wasEnded = raw.phase === 'ended';
  const normalized = normalizeState(raw);
  if (!normalized) { toast('Invalid match file', 'bad'); return; }

  clearTimeout(ui.endTimer);
  clearTimeout(ui.autoRollTimer);
  ui.autoRollTimer = null;
  ui.endTimerKind = null;
  clearInterval(ui.diceTicker);
  ui.diceTicker = null;
  stopDiceVisuals();
  ui.epoch += 1;
  ui.anim = null;
  ui.pendingCard = null;
  closeAllModals();
  closeModal('winModal');
  state = normalized;

  if (wasEnded) {
    state.phase = 'ended';
    updateUI();
    renderWinModal();
    openModal('winModal');
    buildConfetti();
    saveLocal();
    return;
  }

  if (state.phase === 'review') {
    addLog('📂 Turn restored at the review step — continue when ready.', 'special');
    updateUI();
    saveLocal();
    toast('Review restored — continue when ready', 'good');
    if (settings.autoAdvance) {
      setTimeout(() => {
        if (state && state.phase === 'review') finishTurn();
      }, 350);
    }
    return;
  }

  // If the active seat was eliminated, move to the next solvent player.
  if (!state.players[state.current] || state.players[state.current].bankrupt) {
    const idx = state.players.findIndex((p) => !p.bankrupt);
    if (idx >= 0) state.current = idx;
  }

  addLog(`📂 Match restored${sourceLabel ? ' from ' + sourceLabel : ''}.`, 'special');
  updateUI();
  saveLocal();
  beginTurn();
  toast('Match restored', 'good');
}

function exportSave() {
  if (!state) { toast('Start a match before saving', 'warn'); return; }
  const payload = {
    game: 'Millionaire Race 2.5D',
    studio: 'Wealth & Asset Tycoon Studio',
    version: SAVE_VERSION,
    exportedAt: new Date().toISOString(),
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'millionaire_race_save.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  toast('Match exported as millionaire_race_save.json', 'good');
  Sound.click();
}

function importFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const raw = parsed.state || parsed;
      if (!validateSave(raw)) {
        toast('That file is not a valid Millionaire Race match', 'bad');
        return;
      }
      if (state && state.phase !== 'ended') {
        if (!window.confirm('Load this match and replace the current game?')) return;
      }
      loadState(raw, 'imported file');
    } catch (_) {
      toast('Could not parse that JSON file', 'bad');
    }
  };
  reader.onerror = () => toast('Could not read that file', 'bad');
  reader.readAsText(file);
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      sound: settings.sound,
      lobbyCount: ui.lobbyCount,
      speed: settings.speed,
      autoAdvance: settings.autoAdvance,
      fontScale: settings.fontScale,
      stepMs: settings.stepMs,
      maxRounds: settings.maxRounds,
      lobby: lobbyConfig.map((c) => ({ ...c }))
    }));
  } catch (_) { /* ignore */ }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.sound === 'boolean') settings.sound = parsed.sound;
    if ([2, 3, 4].includes(parsed.lobbyCount)) ui.lobbyCount = parsed.lobbyCount;
    if (SPEED_LEVELS.includes(parsed.speed)) settings.speed = parsed.speed;
    if (typeof parsed.autoAdvance === 'boolean') settings.autoAdvance = parsed.autoAdvance;
    if (FONT_LEVELS.includes(parsed.fontScale)) settings.fontScale = parsed.fontScale;
    if (typeof parsed.maxRounds === 'number') settings.maxRounds = clamp(Math.round(parsed.maxRounds), 5, 99);
    if (typeof parsed.stepMs === 'number') {
      settings.stepMs = clamp(Math.round(parsed.stepMs / 20) * 20, 80, 1200);
    } else if (typeof parsed.speed === 'number') {
      settings.stepMs = clamp(Math.round(200 / parsed.speed), 80, 1200);
    }
    if (Array.isArray(parsed.lobby) && parsed.lobby.length === 4) {
      parsed.lobby.forEach((cfg, i) => {
        if (!cfg) return;
        if (typeof cfg.name === 'string') lobbyConfig[i].name = cfg.name.slice(0, 16);
        if (COLOR_KEYS.includes(cfg.color)) lobbyConfig[i].color = cfg.color;
        if (cfg.type === 'human' || cfg.type === 'ai') lobbyConfig[i].type = cfg.type;
      });
      ensureUniqueLobbyColors();
    }
  } catch (_) { /* ignore */ }
}

/* ═══════════════ 11 · LOBBY ═══════════════ */

ui.lobbyCount = 4;

function buildLobby() {
  const wrap = $('#lobbyPlayers');
  if (!wrap) return;
  wrap.innerHTML = lobbyConfig.map((cfg, i) => `
    <div class="lobby-player" data-player="${i}" style="--pc:${PLAYER_COLORS[cfg.color].hex}">
      <div class="lp-index">${i + 1}</div>
      <div class="lp-main">
        <input class="lp-name" data-field="name" maxlength="16" autocomplete="off" spellcheck="false"
               aria-label="Player ${i + 1} name" placeholder="Player ${i + 1}" />
        <div class="lp-colors" role="group" aria-label="Player ${i + 1} color">
          ${COLOR_KEYS.map((k) => `<button type="button" class="swatch" data-color="${k}" style="--c:${PLAYER_COLORS[k].hex}" title="${PLAYER_COLORS[k].label}" aria-label="${PLAYER_COLORS[k].label} color"></button>`).join('')}
        </div>
      </div>
      <div class="lp-type" role="group" aria-label="Player ${i + 1} type">
        <button type="button" data-type="human">${i === 0 ? 'Human' : 'Human'}</button>
        <button type="button" data-type="ai">AI Bot</button>
      </div>
    </div>
  `).join('');

  $$('.lobby-player', wrap).forEach((row) => {
    const index = Number(row.dataset.player);
    const input = $('.lp-name', row);
    input.value = lobbyConfig[index].name;
    input.addEventListener('input', () => {
      lobbyConfig[index].name = input.value.slice(0, 16);
      saveSettings();
    });

    $$('.swatch', row).forEach((swatch) => {
      swatch.addEventListener('click', () => {
        if (swatch.classList.contains('taken')) return;
        pickLobbyColor(index, swatch.dataset.color);
        Sound.init();
        Sound.click();
      });
    });

    $$('.lp-type button', row).forEach((btn) => {
      btn.addEventListener('click', () => {
        lobbyConfig[index].type = btn.dataset.type;
        syncLobby();
        saveSettings();
        Sound.init();
        Sound.click();
      });
    });
  });

  $$('#countPicker button').forEach((btn) => {
    btn.addEventListener('click', () => {
      ui.lobbyCount = Number(btn.dataset.count);
      if (ui.lobbyCount > 2) {
        // ensure the newly revealed rows have usable colours
        ensureUniqueLobbyColors();
      }
      syncLobby();
      saveSettings();
      Sound.click();
    });
  });

  const roundsInput = $('#roundsInput');
  const applyRounds = (value) => {
    settings.maxRounds = clamp(Math.round(Number(value) || MAX_ROUNDS), 5, 99);
    if (roundsInput) roundsInput.value = String(settings.maxRounds);
    saveSettings();
  };
  if (roundsInput) {
    roundsInput.addEventListener('input', () => {
      settings.maxRounds = clamp(Math.round(Number(roundsInput.value) || MAX_ROUNDS), 5, 99);
      saveSettings();
    });
    roundsInput.addEventListener('change', () => applyRounds(roundsInput.value));
  }
  $('#roundsDown') && $('#roundsDown').addEventListener('click', () => {
    applyRounds(settings.maxRounds - 5);
    Sound.click();
  });
  $('#roundsUp') && $('#roundsUp').addEventListener('click', () => {
    applyRounds(settings.maxRounds + 5);
    Sound.click();
  });

  syncLobby();
}

function pickLobbyColor(index, color) {
  const visible = lobbyConfig.slice(0, ui.lobbyCount);
  const holderIndex = lobbyConfig.findIndex((c, i) => i < ui.lobbyCount && i !== index && c.color === color);
  if (holderIndex >= 0) {
    lobbyConfig[holderIndex].color = lobbyConfig[index].color;
  }
  lobbyConfig[index].color = color;
  ensureUniqueLobbyColors();
  syncLobby();
  saveSettings();
}

function ensureUniqueLobbyColors() {
  const used = new Set();
  lobbyConfig.forEach((cfg, i) => {
    if (used.has(cfg.color) || !COLOR_KEYS.includes(cfg.color)) {
      const pick = COLOR_KEYS.find((c) => !used.has(c)) || COLOR_KEYS[i % 4];
      cfg.color = pick;
    }
    used.add(cfg.color);
  });
}

function syncLobby() {
  if (typeof ui.lobbyCount !== 'number') ui.lobbyCount = 4;
  $$('#countPicker button').forEach((btn) => {
    btn.classList.toggle('active', Number(btn.dataset.count) === ui.lobbyCount);
  });
  $$('.lobby-player').forEach((row) => {
    const i = Number(row.dataset.player);
    const cfg = lobbyConfig[i];
    row.hidden = i >= ui.lobbyCount;
    if (row.hidden) return;
    row.style.setProperty('--pc', PLAYER_COLORS[cfg.color].hex);
    const input = $('.lp-name', row);
    if (document.activeElement !== input) input.value = cfg.name;
    $$('.swatch', row).forEach((sw) => {
      const takenByOther = lobbyConfig.some((c, j) => j < ui.lobbyCount && j !== i && c.color === sw.dataset.color);
      sw.classList.toggle('active', cfg.color === sw.dataset.color);
      sw.classList.toggle('taken', takenByOther);
    });
    $$('.lp-type button', row).forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.type === cfg.type);
    });
  });
  const roundsInput = $('#roundsInput');
  if (roundsInput && document.activeElement !== roundsInput) roundsInput.value = String(settings.maxRounds);
  refreshSaveHint();
}

function refreshSaveHint() {
  const has = hasLocalSave();
  const continueBtn = $('#continueBtn');
  const hint = $('#saveHint');
  if (continueBtn) continueBtn.hidden = !has;
  if (hint) hint.hidden = !has;
}

function updateSoundButton() {
  const btn = $('#soundBtn');
  if (!btn) return;
  btn.textContent = settings.sound ? '🔊' : '🔇';
  btn.setAttribute('aria-pressed', String(settings.sound));
  btn.title = settings.sound ? 'Mute sound' : 'Enable sound';
}

function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement);
}

function updateFullscreenButton() {
  const btn = $('#fullscreenBtn');
  if (!btn) return;
  const active = isFullscreen();
  btn.textContent = active ? '⤡' : '⤢';
  btn.setAttribute('aria-pressed', String(active));
  btn.title = active ? 'Exit fullscreen (F)' : 'Fullscreen (F)';
  btn.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
}

async function toggleFullscreen() {
  try {
    if (isFullscreen()) {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    } else {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else { toast('Fullscreen is not supported in this browser', 'warn'); return; }
    }
  } catch (_) {
    toast('Fullscreen was blocked by the browser', 'warn');
  }
  updateFullscreenButton();
  setTimeout(() => { try { resizeBoard(); } catch (_) { /* ignore */ } }, 150);
}

/* ───────────── Speed, turn pacing & text size ───────────── */

const FONT_LEVELS = [1, 1.1, 1.25, 1.4];
const SPEED_LEVELS = [0.5, 0.75, 1, 1.5, 2, 3];

function paced(ms) {
  return Math.max(35, Math.round(ms / (settings.speed || 1)));
}

function updateFontLabels() {
  const label = `${Math.round(settings.fontScale * 100)}%`;
  const a = $('#fontLabel');
  const b = $('#fontLabel2');
  if (a) a.textContent = label;
  if (b) b.textContent = label;
}

function updateStepUI() {
  const range = $('#stepRange');
  const out = $('#stepValue');
  if (range) {
    range.value = String(settings.stepMs);
    const fill = ((settings.stepMs - 80) / (1200 - 80)) * 100;
    range.style.setProperty('--fill', `${clamp(fill, 0, 100).toFixed(1)}%`);
  }
  if (out) out.textContent = `${settings.stepMs} ms`;
}

function applyFontScale() {
  if (!FONT_LEVELS.includes(settings.fontScale)) settings.fontScale = 1;
  document.documentElement.style.fontSize = (16 * settings.fontScale).toFixed(2) + 'px';
  document.documentElement.dataset.font = String(Math.round(settings.fontScale * 100));
  updateFontLabels();
  setTimeout(() => { try { resizeBoard(); } catch (_) { /* ignore */ } }, 120);
}

function cycleFont(direction) {
  let index = FONT_LEVELS.findIndex((v) => Math.abs(v - settings.fontScale) < 0.01);
  if (index < 0) index = 0;
  const next = clamp(index + direction, 0, FONT_LEVELS.length - 1);
  if (next === index) {
    toast(direction > 0 ? 'Maximum text size reached' : 'Minimum text size reached', 'info');
    return;
  }
  settings.fontScale = FONT_LEVELS[next];
  applyFontScale();
  saveSettings();
  Sound.click();
  toast(`Text size ${Math.round(settings.fontScale * 100)}%`, 'info');
}

function applyPaceUI() {
  const speed = settings.speed;
  $$('#speedPicker button').forEach((btn) => {
    btn.classList.toggle('active', Math.abs(Number(btn.dataset.speed) - speed) < 0.001);
  });
  $$('#turnModePicker button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.mode === (settings.autoAdvance ? 'auto' : 'manual'));
  });
  const chip = $('#paceChip');
  if (chip) chip.textContent = `${speed}× · ${settings.autoAdvance ? 'Auto' : 'Manual'}`;
}

function setSpeed(value) {
  const speed = Number(value);
  if (!SPEED_LEVELS.includes(speed)) return;
  settings.speed = speed;
  applyPaceUI();
  saveSettings();
  Sound.click();
  toast(`Table speed ${speed}×`, 'info');
}

function setTurnMode(mode) {
  const wasAuto = settings.autoAdvance;
  settings.autoAdvance = mode === 'auto';
  applyPaceUI();
  saveSettings();
  Sound.click();
  toast(settings.autoAdvance
    ? 'Turn flow: Auto — the dice roll for you'
    : 'Turn flow: Manual — roll and continue yourself', 'info');

  if (!state || state.phase === 'ended') return;
  const player = currentPlayer();

  if (settings.autoAdvance && !wasAuto) {
    // Switching to Auto mid-review should resume immediately.
    if (state.phase === 'review') {
      closeModal('settingsModal');
      setTimeout(() => {
        if (state && state.phase === 'review') finishTurn();
      }, 180);
    } else if (state.phase === 'awaitRoll' && player && !player.isAI) {
      closeModal('settingsModal');
      scheduleAutoRoll(ui.epoch, 250);
    } else if (state.phase === 'resolving' && ui.endTimerKind === 'review') {
      clearTimeout(ui.endTimer);
      ui.endTimer = null;
      ui.endTimerKind = null;
      closeModal('settingsModal');
      setTimeout(() => {
        if (state && state.phase === 'resolving') finishTurn();
      }, 180);
    } else {
      updateUI();
    }
  } else if (!settings.autoAdvance) {
    // Switching back to Manual cancels a pending human auto-roll.
    if (player && !player.isAI) {
      clearTimeout(ui.autoRollTimer);
      ui.autoRollTimer = null;
    }
    if (state.phase === 'resolving' && ui.endTimerKind === 'finish' && player && !player.isAI) {
      clearTimeout(ui.endTimer);
      ui.endTimer = null;
      ui.endTimerKind = null;
      state.phase = 'review';
      updateUI();
      saveLocal();
    } else {
      updateUI();
    }
  } else {
    updateUI();
  }
}

function openSettings() {
  if (state && !canInspectBoard()) {
    toast('Finish the current action, then open settings.', 'warn');
    return;
  }
  applyPaceUI();
  updateFontLabels();
  updateStepUI();
  openModal('settingsModal');
  Sound.click();
}

/* ═══════════════ 12 · UI RENDERING ═══════════════ */

function updateUI() {
  const roundLabel = $('#roundLabel');
  const turnLabel = $('#turnLabel');
  const dockName = $('#dockName');
  const dockHint = $('#dockHint');
  const dockDot = $('#dockDot');
  const rollBtn = $('#rollBtn');
  const buyBtn = $('#buyBtn');
  const passBtn = $('#passBtn');
  const lockoutPayBtn = $('#lockoutPayBtn');
  const lockoutSkipBtn = $('#lockoutSkipBtn');
  const continueTurnBtn = $('#continueTurnBtn');
  const againBtn = $('#againBtn');

  [rollBtn, buyBtn, passBtn, lockoutPayBtn, lockoutSkipBtn, continueTurnBtn, againBtn].forEach((b) => { if (b) b.hidden = true; });

  if (!state) {
    if (roundLabel) roundLabel.textContent = `— / ${settings.maxRounds}`;
    if (turnLabel) turnLabel.textContent = '—';
    if (dockName) dockName.textContent = 'Waiting for players';
    if (dockHint) dockHint.textContent = 'Configure your tycoons and start a match.';
    if (dockDot) { dockDot.style.background = '#7686a0'; dockDot.style.boxShadow = 'none'; }
    renderLeaderboard();
    renderLog();
    requestRender();
    return;
  }

  const player = state.phase === 'ended' && state.winnerId != null
    ? state.players[state.winnerId]
    : currentPlayer();
  const color = playerColor(player);
  const isHuman = !!player && !player.isAI && !player.bankrupt;

  if (canvas) {
    canvas.setAttribute('aria-label', `Millionaire Race game board. Round ${Math.min(state.round, state.maxRounds)} of ${state.maxRounds}. ${player ? player.name + ' to play.' : ''} Net worth target one million dollars.`);
  }

  if (roundLabel) roundLabel.textContent = `${Math.min(state.round, state.maxRounds)} / ${state.maxRounds}`;
  if (turnLabel) turnLabel.textContent = `${state.current + 1} / ${state.players.length}`;

  if (dockName) dockName.textContent = player ? player.name : '—';
  if (dockDot) {
    dockDot.style.background = player ? color.hex : '#7686a0';
    dockDot.style.boxShadow = player ? `0 0 10px ${color.glow}` : 'none';
  }

  let hint = '';
  if (state.phase === 'ended') {
    const winner = state.winnerId != null ? state.players[state.winnerId] : null;
    hint = winner ? `${winner.name} wins with ${fmt(netWorth(winner))} net worth.` : 'The match is over.';
    if (againBtn) againBtn.hidden = false;
  } else if (state.phase === 'awaitRoll') {
    if (isHuman) {
      if (settings.autoAdvance) {
        hint = 'Auto mode — rolling the dice for you…';
      } else {
        hint = player.lockout ? 'Audit lockout — decide whether to pay the exit fee.' : 'Your move — roll the dice.';
        if (rollBtn) rollBtn.hidden = false;
      }
    } else {
      hint = `${player.name} is strategizing…`;
    }
  } else if (state.phase === 'rolling') {
    hint = 'The dice are tumbling…';
  } else if (state.phase === 'moving') {
    hint = 'Advancing around the board…';
  } else if (state.phase === 'decision') {
    const tile = state.pendingBuy != null ? state.tiles[state.pendingBuy] : null;
    if (tile && isHuman) {
      const shortfall = Math.max(0, tile.price - player.cash);
      if (shortfall > 0) {
        hint = `Can't buy — need ${fmt(shortfall)} more cash. Cash ${fmt(player.cash)} / price ${fmt(tile.price)}. Only liquid cash can buy assets.`;
      } else {
        hint = `Buy ${tile.name} for ${fmt(tile.price)}? Cash after purchase: ${fmt(player.cash - tile.price)}.`;
      }
      if (buyBtn) {
        buyBtn.hidden = false;
        buyBtn.textContent = `Buy · ${fmt(tile.price)}`;
        buyBtn.disabled = shortfall > 0;
        buyBtn.title = shortfall > 0
          ? `Need ${fmt(shortfall)} more cash — only cash can buy assets`
          : `Buy for ${fmt(tile.price)}`;
      }
      if (passBtn) {
        passBtn.hidden = false;
        passBtn.textContent = shortfall > 0 ? 'Pass (cash short)' : 'Pass';
      }
    } else {
      hint = 'Settling the purchase…';
    }
  } else if (state.phase === 'card') {
    hint = 'A market card is being resolved…';
  } else if (state.phase === 'lockout') {
    if (isHuman) {
      hint = `Audit Lockout — pay ${fmt(LOCKOUT_FEE)} to play this turn, or lose the turn.`;
      if (lockoutPayBtn) lockoutPayBtn.hidden = false;
      if (lockoutSkipBtn) lockoutSkipBtn.hidden = false;
    } else {
      hint = `${player.name} is deciding on the lockout fee…`;
    }
  } else if (state.phase === 'resolving') {
    hint = 'Settling accounts…';
  } else if (state.phase === 'review') {
    hint = player && !player.isAI
      ? 'Turn complete — click a tile for details, then continue.'
      : `${player.name} finished their turn — continue when ready.`;
    if (continueTurnBtn) continueTurnBtn.hidden = false;
  }

  if (dockHint) dockHint.textContent = hint;
  renderLeaderboard();
  renderLog();
  requestRender();
}

function renderLeaderboard() {
  const wrap = $('#leaderboard');
  if (!wrap) return;
  if (!state) {
    wrap.innerHTML = '<p class="empty-note">Players will appear here.</p>';
    return;
  }
  const ranked = state.players.slice().sort((a, b) => {
    if (a.bankrupt !== b.bankrupt) return a.bankrupt ? 1 : -1;
    return netWorth(b) - netWorth(a);
  });

  wrap.innerHTML = ranked.map((p) => {
    const worth = netWorth(p);
    const pct = clamp((worth / TARGET_NET_WORTH) * 100, 0, 100);
    const color = PLAYER_COLORS[p.color];
    const assets = ownedTiles(p).length;
    const isReview = state.phase === 'review' && p.id === state.current;
    const isTurn = state.phase !== 'ended' && !isReview && currentPlayer() && p.id === state.current;
    return `
      <div class="lb-row ${isTurn ? 'is-turn' : ''} ${isReview ? 'is-review' : ''} ${p.bankrupt ? 'bankrupt' : ''}">
        <span class="lb-color" style="--pc:${color.hex}"></span>
        <div class="lb-main">
          <div class="lb-name">
            ${escapeHtml(p.name)}
            <span class="tag ${p.isAI ? 'ai' : ''}">${p.bankrupt ? 'OUT' : p.isAI ? 'AI' : 'YOU'}</span>
          </div>
          <div class="lb-sub">
            <span>Cash ${fmt(p.cash)}</span>
            <span>${assets} asset${assets === 1 ? '' : 's'}</span>
          </div>
        </div>
        <div class="lb-value">
          <strong style="color:${p.bankrupt ? '#7686a0' : color.hex}">${fmt(worth)}</strong>
          <span>${p.bankrupt ? 'eliminated' : Math.round((worth / TARGET_NET_WORTH) * 100) + '% of goal'}</span>
        </div>
        <div class="lb-bar"><i style="width:${pct}%;--pc:${color.hex}"></i></div>
      </div>
    `;
  }).join('');
}

function renderLog() {
  const wrap = $('#log');
  const roundEl = $('#ledgerRound');
  const displayRound = state ? (state.phase === 'ended' ? Math.min(state.round, state.maxRounds) : state.round) : 1;
  if (roundEl) roundEl.textContent = `R${displayRound}`;
  if (!wrap) return;
  if (!state) {
    wrap.innerHTML = '<p class="empty-note">The financial chronicle begins…</p>';
    return;
  }
  const entries = state.log
    .filter((e) => (typeof e.round === 'number' ? e.round : displayRound) === displayRound)
    .slice(-80);
  if (!entries.length) {
    wrap.innerHTML = '<p class="empty-note">No entries in this round yet.</p>';
    return;
  }
  wrap.innerHTML = entries.map((e) => `
    <div class="log-entry ${e.kind || 'info'}"><span class="t">${timeLabel(e.t)}</span>${escapeHtml(e.text)}</div>
  `).join('');
  wrap.scrollTop = wrap.scrollHeight;
}

const TOAST_ICONS = { good: '✅', bad: '⚠️', warn: '💰', special: '🃏', info: 'ℹ️' };

function toast(message, kind = 'info') {
  const stack = $('#toasts');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `<span class="ti">${TOAST_ICONS[kind] || 'ℹ️'}</span><span>${escapeHtml(message)}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  }, 3100);
  while (stack.children.length > 4) stack.firstElementChild.remove();
}

function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('show');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('show');
}

function closeAllModals() {
  ['lobby', 'diceModal', 'cardModal', 'winModal', 'rulesModal', 'settingsModal', 'tileModal'].forEach(closeModal);
}

/* ═══════════════ 13 · BOARD GEOMETRY ═══════════════ */

const BOARD_SIZE = 1000;
const BOARD_PAD = 26;
const CELL = (BOARD_SIZE - BOARD_PAD * 2) / 7;
const EXTRUDE = 9;

function tileCoord(index) {
  if (index <= 6) return { c: 6 - index, r: 6 };
  if (index <= 12) return { c: 0, r: 6 - (index - 6) };
  if (index <= 18) return { c: index - 12, r: 0 };
  return { c: 6, r: index - 18 };
}

function tileRect(index, inset = 0) {
  const { c, r } = tileCoord(index);
  return {
    x: BOARD_PAD + c * CELL + inset,
    y: BOARD_PAD + r * CELL + inset,
    w: CELL - inset * 2,
    h: CELL - inset * 2
  };
}

function tileCenter(index) {
  const r = tileRect(index);
  return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
}

function centerRect() {
  return {
    x: BOARD_PAD + CELL,
    y: BOARD_PAD + CELL,
    w: CELL * 5,
    h: CELL * 5
  };
}

/* ═══════════════ 14 · CANVAS RENDERER ═══════════════ */

const canvas = $('#board');
const ctx = canvas.getContext('2d');
let boardCssSize = 0;

function resizeBoard() {
  if (!canvas) return;
  const frame = $('#boardFrame') || canvas.parentElement;
  const rect = frame.getBoundingClientRect();
  let size = Math.floor(Math.min(rect.width || 640, rect.height || rect.width || 640));
  size = Math.max(300, size);
  if (size === boardCssSize && canvas.width > 0) {
    ctx.setTransform(canvas.width / BOARD_SIZE, 0, 0, canvas.height / BOARD_SIZE, 0, 0);
    return;
  }
  boardCssSize = size;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.setTransform((size * dpr) / BOARD_SIZE, 0, 0, (size * dpr) / BOARD_SIZE, 0, 0);
  requestRender();
}

function requestRender() {
  ui.dirty = true;
}

function loop(now) {
  const interval = ui.anim ? 16 : 100;
  if (now - ui.lastDraw > interval) {
    drawBoard(now);
    ui.lastDraw = now;
    ui.dirty = false;
  }
  requestAnimationFrame(loop);
}

function roundRectPath(x, y, w, h, r) {
  const rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function setFont(size, weight = 600, family = 'Outfit') {
  const fam = family === 'serif'
    ? '"Playfair Display", Georgia, serif'
    : family === 'emoji'
      ? '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'
      : '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.font = `${weight} ${size}px ${fam}`;
}

function setLetterSpacing(px) {
  try { ctx.letterSpacing = px + 'px'; } catch (_) { /* not supported */ }
}

function wrapLines(text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    if (!line || ctx.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawFitText(text, x, y, maxWidth, maxLines, startSize, weight, color, lineHeightRatio = 1.1) {
  let size = startSize;
  let lines = [];
  while (size > 6.4) {
    setFont(size, weight);
    lines = wrapLines(text, maxWidth);
    if (lines.length <= maxLines) break;
    size -= 0.4;
  }
  const lh = size * lineHeightRatio;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lh));
  return { size, lines: lines.length };
}

function truncateText(text, maxWidth) {
  let out = String(text);
  if (ctx.measureText(out).width <= maxWidth) return out;
  while (out.length > 1 && ctx.measureText(out + '…').width > maxWidth) {
    out = out.slice(0, -1);
  }
  return out + '…';
}

function drawBoard(now) {
  if (!ctx) return;
  ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

  // ── felt background
  const bg = ctx.createRadialGradient(500, 430, 60, 500, 520, 760);
  bg.addColorStop(0, '#13202d');
  bg.addColorStop(0.5, '#0a131c');
  bg.addColorStop(1, '#05090d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

  const halo = ctx.createRadialGradient(500, 150, 20, 500, 150, 620);
  halo.addColorStop(0, 'rgba(242,197,61,0.07)');
  halo.addColorStop(1, 'rgba(242,197,61,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);

  // ── subtle grid
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.024)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 7; i++) {
    const p = BOARD_PAD + i * CELL;
    ctx.beginPath();
    ctx.moveTo(BOARD_PAD, p);
    ctx.lineTo(BOARD_SIZE - BOARD_PAD, p);
    ctx.moveTo(p, BOARD_PAD);
    ctx.lineTo(p, BOARD_SIZE - BOARD_PAD);
    ctx.stroke();
  }
  ctx.restore();

  // ── outer frame
  ctx.save();
  roundRectPath(10, 10, BOARD_SIZE - 20, BOARD_SIZE - 20, 32);
  ctx.strokeStyle = 'rgba(242,197,61,0.22)';
  ctx.lineWidth = 1.4;
  ctx.stroke();
  roundRectPath(18, 18, BOARD_SIZE - 36, BOARD_SIZE - 36, 26);
  ctx.strokeStyle = 'rgba(255,255,255,0.045)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  drawCornerOrnaments();

  drawCenter(now);

  const raised = [];
  for (let i = 0; i < TILE_COUNT; i++) {
    if (tileLift(i) > 0) raised.push(i);
    else drawTile(i, now);
  }
  raised.forEach((i) => drawTile(i, now));
  drawPawns(now);
}

function drawCornerOrnaments() {
  ctx.save();
  ctx.strokeStyle = 'rgba(242,197,61,0.38)';
  ctx.lineWidth = 1.6;
  const m = 22;
  const len = 26;
  const corners = [
    [m, m, 1, 1],
    [BOARD_SIZE - m, m, -1, 1],
    [m, BOARD_SIZE - m, 1, -1],
    [BOARD_SIZE - m, BOARD_SIZE - m, -1, -1]
  ];
  corners.forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x + sx * len, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * len);
    ctx.stroke();
  });
  ctx.restore();
}

function drawCenter(now) {
  const c = centerRect();
  const inner = { x: c.x + 17, y: c.y + 17, w: c.w - 34, h: c.h - 34 };
  const cx = inner.x + inner.w / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 14;
  roundRectPath(inner.x, inner.y, inner.w, inner.h, 24);
  const panel = ctx.createLinearGradient(inner.x, inner.y, inner.x, inner.y + inner.h);
  panel.addColorStop(0, '#101b27');
  panel.addColorStop(0.55, '#0a121b');
  panel.addColorStop(1, '#060c11');
  ctx.fillStyle = panel;
  ctx.fill();
  ctx.restore();

  roundRectPath(inner.x, inner.y, inner.w, inner.h, 24);
  ctx.strokeStyle = 'rgba(242,197,61,0.17)';
  ctx.lineWidth = 1.2;
  ctx.stroke();
  roundRectPath(inner.x + 5, inner.y + 5, inner.w - 10, inner.h - 10, 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // header eyebrow
  setFont(8.5, 700);
  setLetterSpacing(3.4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(242,197,61,0.7)';
  ctx.fillText('EST. 2026 · TYCOON EDITION', cx, inner.y + 34);
  setLetterSpacing(0);

  // title
  const titleGrad = ctx.createLinearGradient(cx - 220, inner.y + 62, cx + 220, inner.y + 112);
  titleGrad.addColorStop(0, '#fff9e6');
  titleGrad.addColorStop(0.48, '#f6d165');
  titleGrad.addColorStop(1, '#b8871a');
  ctx.save();
  ctx.shadowColor = 'rgba(242,197,61,0.25)';
  ctx.shadowBlur = 24;
  setFont(41, 700, 'serif');
  ctx.fillStyle = titleGrad;
  ctx.fillText('MILLIONAIRE RACE', cx, inner.y + 82);
  ctx.restore();

  setFont(9, 600);
  setLetterSpacing(4.4);
  ctx.fillStyle = '#7d8ca4';
  ctx.fillText('WEALTH & ASSET TYCOON', cx, inner.y + 112);
  setLetterSpacing(0);

  // divider
  ctx.beginPath();
  ctx.moveTo(cx - 110, inner.y + 134);
  ctx.lineTo(cx + 110, inner.y + 134);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = 'rgba(242,197,61,0.65)';
  ctx.save();
  ctx.translate(cx, inner.y + 134);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-3, -3, 6, 6);
  ctx.restore();

  const player = state
    ? (state.phase === 'ended' && state.winnerId != null ? state.players[state.winnerId] : currentPlayer())
    : null;
  const color = playerColor(player);
  const worth = player ? netWorth(player) : 0;

  // target
  setFont(8.5, 700);
  setLetterSpacing(3.2);
  ctx.fillStyle = '#6f7f96';
  ctx.fillText('VICTORY TARGET', cx, inner.y + 160);
  setLetterSpacing(0);
  setFont(29, 700, 'serif');
  const targetGrad = ctx.createLinearGradient(cx - 120, inner.y + 180, cx + 120, inner.y + 205);
  targetGrad.addColorStop(0, '#ffe08a');
  targetGrad.addColorStop(1, '#d8a51c');
  ctx.fillStyle = targetGrad;
  ctx.fillText('$1,000,000', cx, inner.y + 188);

  // turn card
  const cardX = inner.x + 54;
  const cardY = inner.y + 218;
  const cardW = inner.w - 108;
  const cardH = 96;
  roundRectPath(cardX, cardY, cardW, cardH, 15);
  ctx.fillStyle = 'rgba(255,255,255,0.032)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.075)';
  ctx.lineWidth = 1;
  ctx.stroke();

  if (player) {
    ctx.save();
    roundRectPath(cardX, cardY, 4, cardH, 2);
    ctx.fillStyle = color.hex;
    ctx.shadowColor = color.hex;
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.restore();

    setFont(8, 700);
    setLetterSpacing(2.4);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#71819a';
    ctx.fillText(state.phase === 'ended' ? 'MATCH COMPLETE' : 'NOW PLAYING', cardX + 22, cardY + 22);
    setLetterSpacing(0);

    ctx.beginPath();
    ctx.arc(cardX + 30, cardY + 50, 5.5, 0, TAU);
    ctx.fillStyle = color.hex;
    ctx.shadowColor = color.hex;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    setFont(20, 700);
    ctx.fillStyle = '#f2f6fb';
    const maxName = cardW - 190;
    ctx.fillText(truncateText(player.name, maxName), cardX + 45, cardY + 50);

    setFont(9.5, 600);
    ctx.fillStyle = '#7d8ca4';
    const assets = ownedTiles(player).length;
    ctx.fillText(`${player.isAI ? 'AI BOT' : 'HUMAN'} · CASH ${fmt(player.cash)} · ${assets} ASSET${assets === 1 ? '' : 'S'}`, cardX + 22, cardY + 74);

    ctx.textAlign = 'right';
    setFont(8, 700);
    setLetterSpacing(2);
    ctx.fillStyle = '#71819a';
    ctx.fillText('NET WORTH', cardX + cardW - 20, cardY + 34);
    setLetterSpacing(0);
    setFont(18, 700);
    ctx.fillStyle = player.bankrupt ? '#7686a0' : color.hex;
    ctx.fillText(fmt(worth), cardX + cardW - 20, cardY + 58);
    setFont(9, 600);
    ctx.fillStyle = '#66758c';
    ctx.fillText(`${Math.round((worth / TARGET_NET_WORTH) * 100)}% OF GOAL`, cardX + cardW - 20, cardY + 78);
  } else {
    ctx.textAlign = 'center';
    setFont(9, 700);
    setLetterSpacing(2.6);
    ctx.fillStyle = '#71819a';
    ctx.fillText('AWAITING TYCOONS', cx, cardY + 34);
    setLetterSpacing(0);
    setFont(22, 700, 'serif');
    ctx.fillStyle = '#8b9ab0';
    ctx.fillText('Configure your players', cx, cardY + 62);
    setFont(9, 500);
    ctx.fillStyle = '#5e6d84';
    ctx.fillText(`2–4 tycoons · humans vs AI rivals · ${settings.maxRounds} rounds`, cx, cardY + 82);
  }

  // dice
  const diceY = inner.y + 340;
  setFont(8, 700);
  setLetterSpacing(2.6);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#64738a';
  const hasRoll = state && state.dice && (state.dice[0] || state.dice[1]);
  ctx.fillText(hasRoll ? 'LAST ROLL' : 'DICE', cx, diceY - 16);
  setLetterSpacing(0);

  const totalChip = 58;
  const total = hasRoll ? state.dice[0] + state.dice[1] : '–';
  drawDieChip(cx - totalChip / 2, diceY, totalChip, total, true);

  // progress
  const barX = inner.x + 78;
  const barW = inner.w - 156;
  const barY = inner.y + 421;
  setFont(8, 700);
  setLetterSpacing(1.8);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64738a';
  ctx.fillText('NET WORTH PROGRESS', barX, barY - 12);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#8494aa';
  ctx.fillText(`${fmt(worth)} / ${fmt(TARGET_NET_WORTH)}`, barX + barW, barY - 12);
  setLetterSpacing(0);

  roundRectPath(barX, barY, barW, 7, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.07)';
  ctx.fill();
  const pct = clamp(worth / TARGET_NET_WORTH, 0, 1);
  if (pct > 0) {
    const fg = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    fg.addColorStop(0, player.bankrupt ? '#455066' : color.deep);
    fg.addColorStop(1, player.bankrupt ? '#7686a0' : color.hex);
    roundRectPath(barX, barY, Math.max(4, barW * pct), 7, 4);
    ctx.fillStyle = fg;
    ctx.shadowColor = player.bankrupt ? 'transparent' : color.hex;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // skyline
  drawSkyline(inner.x + 24, inner.y + 470, inner.w - 48, 110, now);

  // footer
  setFont(8, 700);
  setLetterSpacing(3);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(140,158,182,0.5)';
  const maxRounds = state ? state.maxRounds : settings.maxRounds;
  ctx.fillText(`24 TILES · ${maxRounds} ROUNDS · ONE MILLION`, cx, inner.y + inner.h - 20);
  setLetterSpacing(0);
}

function drawDieChip(x, y, size, value, gold) {
  roundRectPath(x, y, size, size, 10);
  const g = ctx.createLinearGradient(x, y, x, y + size);
  if (gold) {
    g.addColorStop(0, '#ffe08a');
    g.addColorStop(1, '#d8a51c');
    ctx.fillStyle = g;
    ctx.shadowColor = 'rgba(242,197,61,0.28)';
  } else {
    g.addColorStop(0, '#fdf8ea');
    g.addColorStop(1, '#e4d6b4');
    ctx.fillStyle = g;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
  }
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 3;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  setFont(gold ? 21 : 19, 800);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = gold ? '#241a02' : '#272012';
  ctx.fillText(String(value), x + size / 2, y + size / 2 + 1);
}

function drawSkyline(x, y, w, h, now) {
  const n = 19;
  const gap = w / n;
  const grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, 'rgba(22,46,54,0.55)');
  grad.addColorStop(1, 'rgba(6,13,17,0.9)');

  ctx.save();
  for (let i = 0; i < n; i++) {
    const seed = Math.abs(Math.sin(i * 12.9898 + 4.1414));
    const seed2 = Math.abs(Math.sin(i * 4.1414 + 1.337));
    const bh = h * (0.28 + 0.62 * seed);
    const bw = gap * (0.55 + seed2 * 0.3);
    const bx = x + i * gap + (gap - bw) / 2;
    const by = y + h - bh;
    ctx.fillStyle = grad;
    ctx.fillRect(bx, by, bw, bh);
    if (i % 6 === 0) {
      ctx.fillRect(bx + bw * 0.47, by - 10 - seed2 * 8, 1.4, 10 + seed2 * 8);
    }
    // windows
    const rows = Math.max(1, Math.floor(bh / 12));
    for (let r = 1; r < rows; r++) {
      for (let col = 0; col < 2; col++) {
        const wx = bx + bw * (0.26 + col * 0.36);
        const wy = by + r * 11;
        const twinkle = Math.sin(now / 900 + i * 1.7 + r + col) > -0.2;
        ctx.fillStyle = twinkle ? 'rgba(242,197,61,0.28)' : 'rgba(242,197,61,0.08)';
        ctx.fillRect(wx, wy, 2, 2.2);
      }
    }
  }
  ctx.restore();

  const base = ctx.createLinearGradient(x, 0, x + w, 0);
  base.addColorStop(0, 'rgba(242,197,61,0)');
  base.addColorStop(0.5, 'rgba(242,197,61,0.28)');
  base.addColorStop(1, 'rgba(242,197,61,0)');
  ctx.fillStyle = base;
  ctx.fillRect(x, y + h, w, 1);
}

/* ───────────── 14a · Tile rendering ───────────── */

function drawTile(index, now) {
  const tile = state ? state.tiles[index] : { ...TILE_DEFS[index], ownerId: null, mortgaged: false };
  const theme = tileTheme(tile);
  const { x, y, w, h } = tileRect(index, 3);
  const lift = tileLift(index);
  const ty = y - lift;
  const owner = state && tile.ownerId != null ? state.players[tile.ownerId] : null;
  const ownerColor = owner ? PLAYER_COLORS[owner.color] : null;
  const cx = x + w / 2;

  // extruded drop face — a taller side when a player is standing here
  ctx.save();
  ctx.shadowColor = lift ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = lift ? 26 : 16;
  ctx.shadowOffsetY = lift ? 14 : 8;
  roundRectPath(x + 1, ty + EXTRUDE, w - 2, h - 2 + lift, 9);
  ctx.fillStyle = lift ? shade(theme.edge, -10) : theme.edge;
  ctx.fill();
  ctx.restore();

  // top face
  roundRectPath(x, ty, w, h, 9);
  const face = ctx.createLinearGradient(x, ty, x, ty + h);
  face.addColorStop(0, theme.topLight);
  face.addColorStop(1, theme.top);
  ctx.fillStyle = face;
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.stroke();

  if (owner) {
    ctx.save();
    roundRectPath(x, ty, w, h, 9);
    ctx.strokeStyle = ownerColor.hex;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = ownerColor.hex;
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  }

  // occupant rim: the raised tile glows in the player's colour
  if (lift) {
    const occupants = playersOnTile(index);
    const rim = occupants.length === 1 ? PLAYER_COLORS[occupants[0].color].hex : '#f2c53d';
    ctx.save();
    roundRectPath(x, ty, w, h, 9);
    ctx.strokeStyle = rim;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1.7;
    ctx.shadowColor = rim;
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  roundRectPath(x, ty, w, h, 9);
  ctx.clip();

  // accent bar
  const accent = ctx.createLinearGradient(x, ty, x + w, ty);
  accent.addColorStop(0, theme.accent);
  accent.addColorStop(0.7, hexToRgba(theme.accent, 0.35));
  accent.addColorStop(1, 'rgba(255,255,255,0.05)');
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.9;
  ctx.fillRect(x, ty, w, 3);
  ctx.globalAlpha = 1;

  // top-left highlight
  const glint = ctx.createRadialGradient(x + 18, ty + 16, 2, x + 18, ty + 16, 70);
  glint.addColorStop(0, 'rgba(255,255,255,0.06)');
  glint.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glint;
  ctx.fillRect(x, ty, w, h);

  const tier = assetTier(tile);
  const isOwnedAsset = tile.type === 'asset' && owner;

  // emblem / building
  if (isOwnedAsset) {
    drawIsoTower(cx, ty + 68, 26 + tier * 3, 10 + tier * 4.5, ownerColor.hex);
  } else {
    ctx.save();
    setFont(25, 400, 'emoji');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.96;
    ctx.fillText(tile.icon, cx, ty + 37);
    ctx.restore();
  }

  // name
  const fontBoost = 1 + (settings.fontScale - 1) * 0.55;
  const nameY = isOwnedAsset ? ty + 80 : ty + 57;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.45)';
  ctx.shadowBlur = 3;
  drawFitText(
    tile.name.toUpperCase(),
    cx,
    nameY,
    w - 16,
    isOwnedAsset ? 2 : 3,
    (tile.name.length > 18 ? 9.5 : 11) * fontBoost,
    700,
    '#eef3fb',
    1.08
  );
  ctx.restore();

  // price / rent / note
  const bottomY = ty + h - 14;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (tile.type === 'asset') {
    if (owner) {
      setFont(10 * fontBoost, 700);
      ctx.fillStyle = ownerColor.hex;
      ctx.fillText(`RENT ${fmtCompact(tile.rent)}`, cx, bottomY);
    } else {
      setFont(11 * fontBoost, 800);
      ctx.fillStyle = '#f2c53d';
      ctx.fillText(fmtCompact(tile.price), cx, bottomY);
    }
  } else {
    drawFitText(tile.themeNote || '', cx, bottomY, w - 20, 1, 8.8 * fontBoost, 700, theme.note || '#a4b1c4', 1);
  }

  // owner flag + tier stars
  if (owner) {
    drawFlag(x + w - 11, ty + 10, ownerColor.hex);
    setFont(7.5, 700);
    ctx.textAlign = 'right';
    ctx.fillStyle = ownerColor.hex;
    ctx.globalAlpha = 0.9;
    ctx.fillText('★'.repeat(tier), x + w - 7, ty + 36);
    ctx.globalAlpha = 1;
    // owner band
    ctx.fillStyle = ownerColor.hex;
    ctx.fillRect(x, ty + h - 3, w, 3);
  }

  // mortgage treatment
  if (owner && tile.mortgaged) {
    ctx.save();
    roundRectPath(x, ty, w, h, 9);
    ctx.clip();
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.4;
    for (let d = -h; d < w; d += 10) {
      ctx.beginPath();
      ctx.moveTo(x + d, ty);
      ctx.lineTo(x + d + h, ty + h);
      ctx.stroke();
    }
    ctx.restore();
    setFont(9, 400, 'emoji');
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('🔒', x + 7, ty + 7);
  }

  ctx.restore();

  // occupant badges on raised tiles — quick "who is here" markers
  if (lift) {
    const occupants = playersOnTile(index);
    occupants.forEach((p, i) => {
      const bx = x + 15 + i * 17;
      const by = ty + 15;
      const pc = PLAYER_COLORS[p.color];
      ctx.save();
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, TAU);
      ctx.fillStyle = pc.hex;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = p.color === 'yellow' ? '#2a1e02' : '#ffffff';
      ctx.font = '700 8px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.name.trim().charAt(0).toUpperCase(), bx, by + 0.5);
      ctx.restore();
    });
  }

  // current-tile pulse ring
  if (state && state.phase !== 'ended' && playerAtTile(index)) {
    const active = currentPlayer();
    if (active && !active.bankrupt && active.position === index) {
      const pc = PLAYER_COLORS[active.color];
      const pulse = 0.5 + 0.5 * Math.sin(now / 380);
      ctx.save();
      roundRectPath(x - 1.5, ty - 1.5, w + 3, h + 3, 11);
      ctx.strokeStyle = pc.hex;
      ctx.globalAlpha = 0.35 + pulse * 0.4;
      ctx.lineWidth = 2;
      ctx.shadowColor = pc.hex;
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.restore();
    }
  }

  // hover outline for tile inspection
  if (state && ui.hoverTile === index && canInspectBoard()) {
    ctx.save();
    roundRectPath(x - 1, ty - 1, w + 2, h + 2, 10);
    ctx.strokeStyle = 'rgba(255,255,255,0.42)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();
  }
}

function playerAtTile(index) {
  if (!state) return false;
  return state.players.some((p) => !p.bankrupt && p.position === index);
}

const TILE_LIFT = 12;

function playersOnTile(index) {
  if (!state) return [];
  return state.players.filter((p) => !p.bankrupt && p.position === index);
}

function tileLift(index) {
  if (!state) return 0;
  if (state.players.some((p) => !p.bankrupt && p.position === index)) return TILE_LIFT;
  if (ui.anim && ui.anim.toPos === index) return TILE_LIFT;
  return 0;
}

function drawFlag(x, y, color) {
  ctx.save();
  ctx.strokeStyle = 'rgba(230,238,247,0.65)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 1);
  ctx.lineTo(x - 11, y + 5.5);
  ctx.lineTo(x, y + 10);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

function drawIsoTower(cx, baseY, width, height, color) {
  const half = width / 2;
  const qtr = half * 0.5;
  const topY = baseY - height;

  const A = { x: cx, y: baseY };
  const B = { x: cx + half, y: baseY - qtr };
  const C = { x: cx, y: baseY - qtr * 2 };
  const D = { x: cx - half, y: baseY - qtr };
  const A2 = { x: A.x, y: A.y - height };
  const B2 = { x: B.x, y: B.y - height };
  const C2 = { x: C.x, y: C.y - height };
  const D2 = { x: D.x, y: D.y - height };

  // shadow
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(cx, baseY + 2, half + 3, qtr + 2, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // left face
  ctx.beginPath();
  ctx.moveTo(D.x, D.y);
  ctx.lineTo(A.x, A.y);
  ctx.lineTo(A2.x, A2.y);
  ctx.lineTo(D2.x, D2.y);
  ctx.closePath();
  ctx.fillStyle = shade(color, -42);
  ctx.fill();

  // right face
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(B2.x, B2.y);
  ctx.lineTo(A2.x, A2.y);
  ctx.closePath();
  ctx.fillStyle = shade(color, -18);
  ctx.fill();

  // roof
  ctx.beginPath();
  ctx.moveTo(A2.x, A2.y);
  ctx.lineTo(B2.x, B2.y);
  ctx.lineTo(C2.x, C2.y);
  ctx.lineTo(D2.x, D2.y);
  ctx.closePath();
  const roof = ctx.createLinearGradient(cx - half, topY, cx + half, topY);
  roof.addColorStop(0, shade(color, 30));
  roof.addColorStop(1, shade(color, -4));
  ctx.fillStyle = roof;
  ctx.fill();

  // roof highlight
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // windows
  ctx.fillStyle = 'rgba(255,240,190,0.5)';
  const floors = Math.max(1, Math.round(height / 7));
  for (let f = 1; f <= floors; f++) {
    const wy = baseY - (f / (floors + 1)) * height;
    ctx.fillRect(cx - half * 0.55, wy, 2, 2);
    ctx.fillRect(cx + half * 0.2, wy, 2, 2);
  }
}

/* ───────────── 14b · Pawns ───────────── */

function drawPawns(now) {
  if (!state) return;

  const groups = new Map();
  state.players.forEach((p) => {
    if (p.bankrupt) return;
    if (ui.anim && ui.anim.playerId === p.id) return;
    if (!groups.has(p.position)) groups.set(p.position, []);
    groups.get(p.position).push(p);
  });

  groups.forEach((players, pos) => {
    const { x, y, w, h } = tileRect(pos, 3);
    const cx = x + w / 2;
    const baseY = y + h - 26 - tileLift(pos);
    const offsets = players.length === 1
      ? [[0, 0]]
      : players.length === 2
        ? [[-9, 0], [9, 0]]
        : players.length === 3
          ? [[-9, -5], [9, -5], [0, 5]]
          : [[-9, -5], [9, -5], [-9, 5], [9, 5]];
    players.forEach((p, i) => {
      const [ox, oy] = offsets[i] || [0, 0];
      drawPawn(cx + ox, baseY + oy, PLAYER_COLORS[p.color], p.name, 0.66);
    });
  });

  if (ui.anim) {
    const player = state.players[ui.anim.playerId];
    if (!player) return;
    const t = clamp((now - ui.anim.start) / ui.anim.dur, 0, 1);
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const px = lerp(ui.anim.from.x, ui.anim.to.x, e);
    const fromLift = ui.anim.fromPos != null ? tileLift(ui.anim.fromPos) : 0;
    const toLift = ui.anim.toPos != null ? tileLift(ui.anim.toPos) : 0;
    const lift = lerp(fromLift, toLift, e);
    const py = lerp(ui.anim.from.y, ui.anim.to.y, e) + 38 - lift;
    const hop = Math.sin(Math.PI * t) * 13;
    drawPawn(px, py - hop, PLAYER_COLORS[player.color], player.name, 0.72 + Math.sin(Math.PI * t) * 0.08);
  }
}

function drawPawn(x, baseY, colorObj, name, scale = 0.8) {
  ctx.save();
  ctx.translate(x, baseY);
  ctx.scale(scale, scale);

  // shadow
  const shadow = ctx.createRadialGradient(0, 0, 1, 0, 0, 12);
  shadow.addColorStop(0, 'rgba(0,0,0,0.55)');
  shadow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 5, 0, 0, TAU);
  ctx.fill();

  // soft halo so tokens read over similar-coloured buildings
  const halo = ctx.createRadialGradient(0, -14, 2, 0, -14, 19);
  halo.addColorStop(0, 'rgba(255,255,255,0.2)');
  halo.addColorStop(0.55, 'rgba(255,255,255,0.07)');
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, -14, 19, 0, TAU);
  ctx.fill();

  // body
  const bodyGrad = ctx.createLinearGradient(-9, 0, 9, 0);
  bodyGrad.addColorStop(0, colorObj.deep);
  bodyGrad.addColorStop(0.35, colorObj.hex);
  bodyGrad.addColorStop(0.72, shade(colorObj.hex, 22));
  bodyGrad.addColorStop(1, colorObj.deep);
  ctx.beginPath();
  roundRectPath(-8, -21, 16, 21, 6);
  ctx.fillStyle = bodyGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // top lip
  ctx.beginPath();
  ctx.ellipse(0, -21, 8, 3, 0, 0, TAU);
  ctx.fillStyle = shade(colorObj.hex, 28);
  ctx.fill();

  // head
  const headGrad = ctx.createRadialGradient(-2, -29, 1, 0, -26, 9);
  headGrad.addColorStop(0, shade(colorObj.hex, 50));
  headGrad.addColorStop(0.6, colorObj.hex);
  headGrad.addColorStop(1, colorObj.deep);
  ctx.beginPath();
  ctx.arc(0, -27, 6.3, 0, TAU);
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 0.6;
  ctx.stroke();

  // collar
  ctx.beginPath();
  ctx.ellipse(0, -21, 4.6, 1.8, 0, 0, TAU);
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.fill();

  // initial
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  ctx.font = '700 9px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillText(initial, 0, -10.5);

  ctx.restore();
}

/* ═══════════════ 15 · TILE INSPECTOR ═══════════════ */

const TILE_DESCRIPTIONS = {
  go: 'Passing or landing on GO pays the $20,000 salary plus 10% dividends on the buy value of every stock asset you own.',
  asset: 'A revenue-generating asset. Buy it while unowned; land here after a rival buys it and you pay rent or yield to the owner.',
  chest: 'Draw from the shuffled Opportunity Chest. Cards can deliver bull-market bonuses, crypto losses, real-estate booms or a tax loophole.',
  chance: 'Draw from the shuffled Market Chance deck. Market swings can pay you or cost you before your next roll.',
  tax: 'Taxes are paid from liquid cash. If cash is short, assets auto-mortgage at 50% of their buy value. A tax-loophole card waives the next tax tile.',
  crash: 'A market correction. You lose 15% of the buy value of your most expensive asset, paid from cash.',
  visit: 'The Luxury Club is a safe zone. Nothing happens when you land here — it is also where the Audit Lockout sends you.',
  parking: 'Rest at the Boutique Hotel and collect a $5,000 bonus from the bank.',
  lockout: 'The audit lockout sends you directly to the Luxury Club (tile 6). Your next turn is lost unless you pay the $10,000 exit fee.'
};

function tileTypeLabel(tile) {
  switch (tile.type) {
    case 'go': return 'Corner · Salary';
    case 'asset': return tile.assetType === 'stock' ? 'Stock asset' : 'Property asset';
    case 'chest': return 'Opportunity Chest';
    case 'chance': return 'Market Chance';
    case 'tax': return 'Tax tile';
    case 'crash': return 'Market event';
    case 'visit': return 'Safe zone';
    case 'parking': return 'Corner · Bonus';
    case 'lockout': return 'Penalty tile';
    default: return 'Board tile';
  }
}

function tileIndexAt(clientX, clientY) {
  if (!canvas) return -1;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return -1;
  const x = (clientX - rect.left) * (BOARD_SIZE / rect.width);
  const y = (clientY - rect.top) * (BOARD_SIZE / rect.height);
  // Raised tiles are drawn above their cell and overlap the tile above.
  for (let i = 0; i < TILE_COUNT; i++) {
    const lift = tileLift(i);
    if (lift <= 0) continue;
    const r = tileRect(i);
    if (x >= r.x && x <= r.x + r.w && y >= r.y - lift && y <= r.y + r.h) return i;
  }
  for (let i = 0; i < TILE_COUNT; i++) {
    const r = tileRect(i);
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return -1;
}

function canInspectBoard() {
  if (!state) return false;
  if (['rolling', 'moving', 'card', 'resolving'].includes(state.phase)) return false;
  const player = currentPlayer();
  if ((state.phase === 'awaitRoll' || state.phase === 'lockout') && player && player.isAI) return false;
  return true;
}

function openTileDetails(index) {
  if (!state) return;
  const tile = state.tiles[index];
  if (!tile) return;
  const owner = tile.ownerId != null ? state.players[tile.ownerId] : null;
  const ownerColor = owner ? PLAYER_COLORS[owner.color] : null;
  const theme = tileTheme(tile);
  const tier = assetTier(tile);
  const viewer = currentPlayer();
  const vHuman = !!viewer && !viewer.isAI;
  const subj = vHuman ? 'you' : (viewer ? viewer.name : 'the player');
  const subjCap = vHuman ? 'You' : subj;
  const poss = vHuman ? 'Your' : (viewer ? `${viewer.name}'s` : "the player's");
  const facts = [];
  const notes = [];
  const standing = state.players.filter((p) => !p.bankrupt && p.position === index);

  $('#tileIcon').textContent = tile.icon;
  $('#tileIcon').style.setProperty('--tc', ownerColor ? ownerColor.hex : theme.accent);
  $('#tileType').textContent = tileTypeLabel(tile);
  $('#tileTitle').textContent = tile.name;

  const ownerEl = $('#tileOwner');
  if (tile.type === 'asset') {
    ownerEl.hidden = false;
    if (owner) {
      ownerEl.innerHTML = `
        <span class="owner-chip" style="--pc:${ownerColor.hex}">${escapeHtml(owner.name)}</span>
        <span class="owner-meta">${owner.isAI ? 'AI rival' : 'Human'} · ${fmt(netWorth(owner))} net worth</span>
      `;
    } else {
      ownerEl.innerHTML = '<span class="owner-chip unowned">Unowned — available for purchase</span>';
    }
  } else {
    ownerEl.hidden = true;
    ownerEl.innerHTML = '';
  }

  if (tile.type === 'asset') {
    const kind = tile.assetType === 'stock' ? 'Stock' : 'Property';
    $('#tileDesc').textContent = `${kind} asset. Buy it while unowned; landing here while a rival owns it pays ${fmt(tile.rent)} ${tile.assetType === 'stock' ? 'yield' : 'rent'} to the owner.`;
    facts.push(['Buy value', fmt(tile.price), '']);
    facts.push([tile.assetType === 'stock' ? 'Yield / landing' : 'Rent / landing', fmt(tile.rent), 'good']);
    facts.push(['Asset class', kind, '']);
    facts.push(['Tier', '★'.repeat(tier) + ` (${tier}/4)`, '']);
    facts.push(['Status', tile.mortgaged ? 'Mortgaged' : owner ? 'Active' : 'Unowned', tile.mortgaged ? 'warn' : '']);
    facts.push(['Owner', owner ? owner.name : 'Bank', '']);

    if (!owner) {
      notes.push(`Available for ${fmt(tile.price)} when you land here.`);
      if (viewer) {
        notes.push(viewer.cash >= tile.price
          ? `${poss} cash covers it — ${subj} would have ${fmt(viewer.cash - tile.price)} left.`
          : `${subjCap} would need ${fmt(tile.price - viewer.cash)} more cash.`);
        if (viewer.cash < tile.price) {
          const owned = ownedTiles(viewer).length;
          notes.push(owned > 0
            ? `${poss} net worth ${fmt(netWorth(viewer))} includes ${owned} asset${owned === 1 ? '' : 's'} and cannot be spent on this purchase.`
            : 'Only liquid cash can buy assets.');
        }
      }
    } else if (viewer && owner.id === viewer.id) {
      notes.push(vHuman
        ? `You own this asset. It contributes ${fmt(tile.price)} to your net worth.`
        : `${viewer.name} owns this asset. It contributes ${fmt(tile.price)} to their net worth.`);
    } else {
      notes.push(`Landing here costs ${fmt(tile.rent)} ${tile.assetType === 'stock' ? 'yield' : 'rent'} to ${owner.name}.`);
    }
    if (tile.mortgaged) notes.push('Mortgaged at 50% of buy value — it still counts toward net worth and rent.');
  } else {
    $('#tileDesc').textContent = TILE_DESCRIPTIONS[tile.type] || 'A board tile.';
    switch (tile.type) {
      case 'go':
        facts.push(['Salary', fmt(GO_SALARY), 'good']);
        facts.push(['Stock dividend', '10% of stock value', 'good']);
        facts.push(['Applies', 'Pass or land', '']);
        facts.push(['Tile', 'Corner · 0', '']);
        notes.push('Collect this every time you pass or land on GO.');
        break;
      case 'chest':
      case 'chance':
        facts.push(['Deck', tile.type === 'chest' ? 'Opportunity Chest' : 'Market Chance', '']);
        facts.push(['Cards', String(CARD_DEFS.length), '']);
        facts.push(['Draw', '1 card', '']);
        facts.push(['Refill', 'When exhausted', '']);
        notes.push('The deck is shuffled with Fisher–Yates and refilled when exhausted.');
        break;
      case 'tax':
        if (tile.taxMode === 'audit') {
          facts.push(['Tax rate', '10% of cash', 'warn']);
          facts.push(['Paid from', 'Liquid cash', '']);
          facts.push(['Next tax', 'Loophole waives', 'good']);
          facts.push(['Type', 'Audit', '']);
        } else {
          facts.push(['Fixed payment', fmt(tile.fixed), 'warn']);
          facts.push(['Paid from', 'Liquid cash', '']);
          facts.push(['Next tax', 'Loophole waives', 'good']);
          facts.push(['Type', 'Fine', '']);
        }
        if (viewer) notes.push(`If ${subj} landed here now, the bill would be ${fmt(tile.taxMode === 'audit' ? Math.round(viewer.cash * 0.10) : tile.fixed)}.`);
        break;
      case 'crash':
        facts.push(['Loss', '15% of value', 'warn']);
        facts.push(['Based on', 'Most expensive asset', '']);
        facts.push(['Paid from', 'Cash', '']);
        facts.push(['Applies', 'Every landing', '']);
        if (viewer) {
          const owned = ownedTiles(viewer);
          if (owned.length) {
            const priciest = owned.reduce((a, b) => (b.price > a.price ? b : a));
            notes.push(`If ${subj} landed now, ${priciest.name} would lose ${fmt(Math.round(priciest.price * 0.15))} in cash value.`);
          } else {
            notes.push(`${subjCap} ${vHuman ? 'have' : 'has'} no assets exposed to a crash.`);
          }
        }
        break;
      case 'visit':
        facts.push(['Effect', 'No action', 'good']);
        facts.push(['Tile', 'Safe zone', '']);
        facts.push(['Lockout exit', 'Tile 6', '']);
        facts.push(['Rent', 'None', 'good']);
        notes.push('A safe corner — use it to catch your breath.');
        break;
      case 'parking':
        facts.push(['Bonus', fmt(5000), 'good']);
        facts.push(['Applies', 'Every landing', '']);
        facts.push(['Tile', 'Corner · 12', '']);
        facts.push(['Rent', 'None', 'good']);
        notes.push('Collect the bonus automatically when you land here.');
        break;
      case 'lockout':
        facts.push(['Destination', 'Luxury Club (6)', 'warn']);
        facts.push(['Next turn', 'Lost unless paid', 'warn']);
        facts.push(['Exit fee', fmt(LOCKOUT_FEE), '']);
        facts.push(['Paid at', 'Start of next turn', '']);
        notes.push('Pay the $10,000 exit fee at the start of your next turn to play normally, or lose that turn.');
        break;
      default:
        break;
    }
  }

  if (standing.length) {
    const names = standing.map((p) => p.name).join(', ');
    notes.unshift(`Currently standing here: ${names}.`);
  }

  $('#tileFacts').innerHTML = facts.map(([label, value, tone]) => `
    <div class="tile-fact">
      <span>${escapeHtml(label)}</span>
      <strong class="${tone || ''}">${escapeHtml(value)}</strong>
    </div>
  `).join('');

  const noteEl = $('#tileNote');
  if (notes.length) {
    noteEl.hidden = false;
    noteEl.textContent = notes.join(' ');
  } else {
    noteEl.hidden = true;
    noteEl.textContent = '';
  }

  openModal('tileModal');
  Sound.click();
}



function stopDiceVisuals() {
  clearInterval(ui.diceTicker);
  ui.diceTicker = null;
  if (typeof ui.diceCleanup === 'function') {
    try { ui.diceCleanup(); } catch (_) { /* ignore */ }
  }
  ui.diceCleanup = null;
  ui.diceFinish = null;
  if (ui.diceResolve) {
    const resolve = ui.diceResolve;
    ui.diceResolve = null;
    resolve([randDie(), randDie()]);
  }
  closeModal('diceModal');
}

let webglSupport = null;

function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const test = document.createElement('canvas');
    const gl = window.WebGLRenderingContext && (test.getContext('webgl') || test.getContext('experimental-webgl'));
    webglSupport = !!gl;
    if (gl) {
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }
  } catch (_) {
    webglSupport = false;
  }
  return webglSupport;
}

function positionDiceModal() {
  const overlay = document.getElementById('diceModal');
  const modal = document.querySelector('#diceModal .dice-modal');
  const frame = document.getElementById('boardFrame');
  if (!overlay || !overlay.classList.contains('show') || !modal || !frame) return;
  const rect = frame.getBoundingClientRect();
  if (window.innerWidth <= 720) {
    modal.style.width = '';
  } else {
    const panelWidth = Math.min(470, Math.max(320, rect.width * 0.64));
    modal.style.width = `${Math.round(panelWidth)}px`;
  }
  const width = modal.offsetWidth || 470;
  const height = modal.offsetHeight || 320;
  const halfW = width / 2;
  const halfH = height / 2;
  const maxLeft = Math.max(halfW + 10, window.innerWidth - halfW - 10);
  const maxTop = Math.max(halfH + 10, window.innerHeight - halfH - 10);
  let left;
  let top;
  if (window.innerWidth <= 720) {
    // On phones keep the board fully visible and drop the tray near the bottom.
    left = window.innerWidth / 2;
    top = window.innerHeight - halfH - 14;
  } else {
    left = rect.left + rect.width / 2;
    top = rect.top + rect.height / 2;
  }
  left = clamp(left, halfW + 10, maxLeft);
  top = clamp(top, halfH + 10, maxTop);
  modal.style.setProperty('--dice-left', `${left}px`);
  modal.style.setProperty('--dice-top', `${top}px`);
}

function openDiceModal(player) {
  return new Promise((resolve) => {
    ui.diceResolve = resolve;
    const title = $('#diceTitle');
    if (title) title.textContent = `Rolling for ${player.name}`;
    setDiceChips(0, 0);
    const caption = $('#diceCaption');
    if (caption) caption.textContent = 'Two dice. Twelve steps. One fortune.';

    const stage = $('#diceStage');
    if (!stage) { resolve([randDie(), randDie()]); return; }
    stage.innerHTML = '<div class="dice-loading"><span class="spinner"></span><p>Loading 3D physics…</p></div>';
    openModal('diceModal');
    positionDiceModal();
    requestAnimationFrame(positionDiceModal);
    setTimeout(positionDiceModal, 60);

    ui.diceTicker = setInterval(() => {
      if (!ui.diceResolve) return;
      setDiceChips(randDie(), randDie());
    }, 110);

    let settled = false;
    const finish = (d1, d2, skipped) => {
      if (settled) return;
      settled = true;
      clearInterval(ui.diceTicker);
      ui.diceTicker = null;
      setDiceChips(d1, d2, true);
      Sound.diceHit();
      const resultDelay = skipped ? 260 : 760;
      setTimeout(() => {
        if (typeof ui.diceCleanup === 'function') {
          try { ui.diceCleanup(); } catch (_) { /* ignore */ }
        }
        ui.diceCleanup = null;
        closeModal('diceModal');
        const r = ui.diceResolve;
        ui.diceResolve = null;
        ui.diceFinish = null;
        if (r) r([d1, d2]);
      }, resultDelay);
    };
    ui.diceFinish = () => finish(randDie(), randDie(), true);

    setTimeout(() => {
      if (window.THREE && window.CANNON && hasWebGL()) {
        try {
          runThreeDice(stage, finish);
        } catch (err) {
          console.warn('3D dice failed, using fallback:', err);
          stage.innerHTML = '';
          runFallbackDice(stage, finish);
        }
      } else {
        stage.innerHTML = '';
        runFallbackDice(stage, finish);
      }
    }, 90);
  });
}

function setDiceChips(d1, d2, reveal = false) {
  const total = $('#dieTotal');
  const caption = $('#diceCaption');
  const sum = d1 && d2 ? d1 + d2 : 0;
  if (total) total.textContent = sum ? sum : '–';
  if (reveal && caption && sum) caption.textContent = `Total ${sum} — move ${sum} steps.`;
  else if (caption) caption.textContent = 'Two dice. Twelve steps. One fortune.';
}

function pipTexture(value) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');

  g.fillStyle = '#efe3c6';
  g.fillRect(0, 0, 256, 256);
  const bg = g.createRadialGradient(110, 90, 20, 128, 128, 200);
  bg.addColorStop(0, '#fffdf4');
  bg.addColorStop(0.7, '#f1e6cc');
  bg.addColorStop(1, '#dbc9a2');
  g.fillStyle = bg;
  g.fillRect(0, 0, 256, 256);

  // edge bevel
  g.strokeStyle = 'rgba(120,96,52,0.35)';
  g.lineWidth = 8;
  g.strokeRect(4, 4, 248, 248);

  const P = {
    tl: [78, 78], tr: [178, 78], ml: [78, 128], mr: [178, 128],
    bl: [78, 178], br: [178, 178], c: [128, 128]
  };
  const layouts = {
    1: ['c'],
    2: ['tl', 'br'],
    3: ['tl', 'c', 'br'],
    4: ['tl', 'tr', 'bl', 'br'],
    5: ['tl', 'tr', 'c', 'bl', 'br'],
    6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br']
  };

  (layouts[value] || []).forEach((key) => {
    const [x, y] = P[key];
    const pip = g.createRadialGradient(x - 7, y - 7, 2, x, y, 25);
    pip.addColorStop(0, '#4d402a');
    pip.addColorStop(0.5, '#211c12');
    pip.addColorStop(1, '#0e0b07');
    g.fillStyle = pip;
    g.beginPath();
    g.arc(x, y, 21, 0, TAU);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.12)';
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(x, y, 22, Math.PI * 0.9, Math.PI * 1.8);
    g.stroke();
  });

  return new THREE.CanvasTexture(c);
}

function readTopFace(body) {
  const axes = [
    { v: new CANNON.Vec3(0, 1, 0), value: 2 },
    { v: new CANNON.Vec3(0, -1, 0), value: 5 },
    { v: new CANNON.Vec3(1, 0, 0), value: 1 },
    { v: new CANNON.Vec3(-1, 0, 0), value: 6 },
    { v: new CANNON.Vec3(0, 0, 1), value: 3 },
    { v: new CANNON.Vec3(0, 0, -1), value: 4 }
  ];
  let best = 1;
  let bestY = -Infinity;
  axes.forEach((axis) => {
    const world = body.quaternion.vmult(axis.v);
    if (world.y > bestY) {
      bestY = world.y;
      best = axis.value;
    }
  });
  return best;
}

function runThreeDice(stage, finish) {
  const width = stage.clientWidth || 620;
  const height = stage.clientHeight || 300;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  stage.innerHTML = '';
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07110d, 16, 34);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 7.9, 7.7);
  camera.lookAt(0, 0.35, 0);

  const hemi = new THREE.HemisphereLight(0xfff3d4, 0x081713, 0.72);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff2d2, 1.75);
  key.position.set(-4.5, 11, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.camera.left = -8;
  key.shadow.camera.right = 8;
  key.shadow.camera.top = 8;
  key.shadow.camera.bottom = -8;
  key.shadow.bias = -0.0005;
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x6f9fff, 0.85);
  rim.position.set(7, 6, -7);
  scene.add(rim);

  const goldLight = new THREE.PointLight(0xf2c53d, 20, 14, 2);
  goldLight.position.set(0, 4.5, 2.5);
  scene.add(goldLight);

  // table
  const tableMat = new THREE.MeshStandardMaterial({ color: 0x0a1a13, roughness: 0.74, metalness: 0.18 });
  const table = new THREE.Mesh(new THREE.CircleGeometry(7.2, 72), tableMat);
  table.rotation.x = -Math.PI / 2;
  table.position.y = -0.02;
  table.receiveShadow = true;
  scene.add(table);

  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xe8bd45, metalness: 0.85, roughness: 0.24, emissive: 0x3d2a00, emissiveIntensity: 0.7
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.9, 0.04, 12, 120), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);

  const rimRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.6, 0.05, 10, 120),
    new THREE.MeshStandardMaterial({ color: 0x24463c, metalness: 0.4, roughness: 0.5 })
  );
  rimRing.rotation.x = -Math.PI / 2;
  rimRing.position.y = 0.005;
  scene.add(rimRing);

  // rails
  const railMat = new THREE.MeshStandardMaterial({ color: 0x123026, roughness: 0.5, metalness: 0.35 });
  const railMeshes = [];
  const rails = [
    { pos: [0, 0.32, 4.5], size: [9, 0.64, 0.34] },
    { pos: [0, 0.32, -4.5], size: [9, 0.64, 0.34] },
    { pos: [4.5, 0.32, 0], size: [0.34, 0.64, 9] },
    { pos: [-4.5, 0.32, 0], size: [0.34, 0.64, 9] }
  ];
  rails.forEach((r) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...r.size), railMat);
    mesh.position.set(...r.pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    railMeshes.push(mesh);
  });

  // physics
  const world = new CANNON.World();
  world.gravity.set(0, -29, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 16;
  world.allowSleep = true;

  const groundMat = new CANNON.Material('felt');
  const diceMat = new CANNON.Material('dice');
  world.addContactMaterial(new CANNON.ContactMaterial(diceMat, groundMat, {
    friction: 0.42,
    restitution: 0.16
  }));
  world.addContactMaterial(new CANNON.ContactMaterial(diceMat, diceMat, {
    friction: 0.3,
    restitution: 0.2
  }));

  const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: groundMat });
  ground.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  world.addBody(ground);

  const railsPhysics = [
    { pos: [0, 0.3, 4.5], hx: 4.6, hy: 0.5, hz: 0.2 },
    { pos: [0, 0.3, -4.5], hx: 4.6, hy: 0.5, hz: 0.2 },
    { pos: [4.5, 0.3, 0], hx: 0.2, hy: 0.5, hz: 4.6 },
    { pos: [-4.5, 0.3, 0], hx: 0.2, hy: 0.5, hz: 4.6 }
  ];
  railsPhysics.forEach((r) => {
    const body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(r.hx, r.hy, r.hz)) });
    body.position.set(...r.pos);
    world.addBody(body);
  });

  const size = 1.42;
  const geometry = new THREE.BoxGeometry(size, size, size);
  const faceValues = [1, 6, 2, 5, 3, 4]; // +x,-x,+y,-y,+z,-z
  const textures = faceValues.map((v) => pipTexture(v));
  const materials = textures.map((tex) => new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.34,
    metalness: 0.06,
    envMapIntensity: 0.7
  }));

  const dice = [];
  for (let i = 0; i < 2; i++) {
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)),
      material: diceMat,
      linearDamping: 0.06,
      angularDamping: 0.065
    });
    body.allowSleep = true;
    body.sleepSpeedLimit = 0.18;
    body.sleepTimeLimit = 0.4;
    body.position.set(i === 0 ? -2.0 : 2.0, 6.6 + Math.random() * 1.4, (Math.random() - 0.5) * 1.4);
    body.quaternion.setFromEuler(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    body.velocity.set(
      (i === 0 ? 1 : -1) * (1.4 + Math.random() * 2.6),
      -1.5 + Math.random() * 2.5,
      (Math.random() - 0.5) * 3.2
    );
    body.angularVelocity.set(
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 22
    );
    world.addBody(body);
    dice.push({ mesh, body });
  }

  let raf = 0;
  let stopped = false;
  let lastTime = performance.now();
  const startTime = performance.now();
  let stillFrames = 0;

  const onResize = debounce(() => {
    if (stopped) return;
    const w = stage.clientWidth || width;
    const h = stage.clientHeight || height;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }, 120);
  window.addEventListener('resize', onResize);

  function cleanup() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', onResize);
    try {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      table.geometry.dispose();
      tableMat.dispose();
      ring.geometry.dispose();
      ringMat.dispose();
      rimRing.geometry.dispose();
      rimRing.material.dispose();
      railMeshes.forEach((m) => m.geometry.dispose());
      railMat.dispose();
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
    } catch (_) { /* ignore */ }
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    stage.innerHTML = '';
  }
  ui.diceCleanup = cleanup;

  function frame(now) {
    if (stopped) return;
    const dt = Math.min(1 / 30, (now - lastTime) / 1000) || 1 / 60;
    lastTime = now;

    world.step(1 / 60, dt, 4);

    let allStill = true;
    dice.forEach((d) => {
      d.mesh.position.copy(d.body.position);
      d.mesh.quaternion.copy(d.body.quaternion);
      const sleeping = d.body.sleepState === CANNON.Body.SLEEPING;
      const slow = d.body.velocity.length() < 0.13 && d.body.angularVelocity.length() < 0.13;
      if (!sleeping && !slow) allStill = false;
    });

    renderer.render(scene, camera);

    if (allStill && now - startTime > 650) stillFrames++;
    else stillFrames = 0;

    const elapsed = now - startTime;
    if (stillFrames > 15 || elapsed > 6000) {
      const vals = dice.map((d) => readTopFace(d.body));
      // A die that somehow lands on an edge gets nudged into a valid face.
      const d1 = clamp(vals[0] || 1, 1, 6);
      const d2 = clamp(vals[1] || 1, 1, 6);
      finish(d1, d2, false);
      return;
    }

    raf = requestAnimationFrame(frame);
  }

  raf = requestAnimationFrame(frame);
}

function runFallbackDice(stage, finish) {
  const width = stage.clientWidth || 620;
  const height = stage.clientHeight || 300;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvas2 = document.createElement('canvas');
  canvas2.width = width * dpr;
  canvas2.height = height * dpr;
  canvas2.style.width = width + 'px';
  canvas2.style.height = height + 'px';
  stage.innerHTML = '';
  stage.appendChild(canvas2);
  const g = canvas2.getContext('2d');
  g.setTransform(dpr, 0, 0, dpr, 0, 0);

  const final = [randDie(), randDie()];
  const shown = [1, 1];
  let raf = 0;
  let stopped = false;
  const start = performance.now();

  function cleanup() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    stage.innerHTML = '';
  }
  ui.diceCleanup = cleanup;

  function drawFace(x, y, size, value, angle) {
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    const r = size * 0.17;
    const grad = g.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#fffdf4');
    grad.addColorStop(1, '#ddcba6');
    g.fillStyle = grad;
    g.shadowColor = 'rgba(0,0,0,0.55)';
    g.shadowBlur = 18;
    g.shadowOffsetY = 8;
    roundRect2(g, -size / 2, -size / 2, size, size, r);
    g.fill();
    g.shadowBlur = 0;
    g.shadowOffsetY = 0;
    g.strokeStyle = 'rgba(120,96,52,0.35)';
    g.lineWidth = 2;
    g.stroke();

    const layouts = {
      1: [[0, 0]],
      2: [[-1, -1], [1, 1]],
      3: [[-1, -1], [0, 0], [1, 1]],
      4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
      5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
      6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
    };
    const spread = size * 0.25;
    (layouts[value] || []).forEach(([px, py]) => {
      g.beginPath();
      g.arc(px * spread, py * spread, size * 0.078, 0, TAU);
      g.fillStyle = '#19140d';
      g.fill();
    });
    g.restore();
  }

  function frame(now) {
    if (stopped) return;
    const t = now - start;
    g.clearRect(0, 0, width, height);

    const bg = g.createRadialGradient(width / 2, height * 0.2, 10, width / 2, height * 0.5, width * 0.7);
    bg.addColorStop(0, 'rgba(242,197,61,0.08)');
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bg;
    g.fillRect(0, 0, width, height);

    if (t < 1300) {
      shown[0] = randDie();
      shown[1] = randDie();
    } else {
      shown[0] = final[0];
      shown[1] = final[1];
    }

    const settle = clamp((t - 1100) / 500, 0, 1);
    const ease = 1 - Math.pow(1 - settle, 3);
    const dieSize = Math.min(92, Math.max(50, Math.round(height * 0.4)));
    const spread = dieSize * 0.86;
    const midY = height / 2 + 4;
    const wobble = Math.sin(t / 90) * 0.14 * (1 - ease);
    drawFace(width / 2 - spread, midY, dieSize, shown[0], wobble);
    drawFace(width / 2 + spread, midY, dieSize, shown[1], -wobble);

    if (t < 1850) {
      raf = requestAnimationFrame(frame);
    } else {
      finish(final[0], final[1], false);
    }
  }

  raf = requestAnimationFrame(frame);
}

function roundRect2(g, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y);
  g.arcTo(x + w, y, x + w, y + h, rr);
  g.arcTo(x + w, y + h, x, y + h, rr);
  g.arcTo(x, y + h, x, y, rr);
  g.arcTo(x, y, x + w, y, rr);
  g.closePath();
}

/* ═══════════════ 16 · WIN MODAL & CONFETTI ═══════════════ */

function renderWinModal() {
  if (!state) return;
  const winner = state.winnerId != null ? state.players[state.winnerId] : null;
  const eyebrow = $('#winEyebrow');
  const title = $('#winTitle');
  const reason = $('#winReason');
  const stats = $('#winStats');

  if (winner) {
    if (eyebrow) eyebrow.textContent = 'Victory';
    if (title) title.textContent = winner.name;
    if (reason) reason.textContent = state.endReason || `${winner.name} conquered the board.`;
  } else {
    if (eyebrow) eyebrow.textContent = 'Market Collapse';
    if (title) title.textContent = 'No Survivors';
    if (reason) reason.textContent = state.endReason || 'Every tycoon went bankrupt.';
  }

  if (stats) {
    const ranked = state.players.slice().sort((a, b) => {
      if (a.bankrupt !== b.bankrupt) return a.bankrupt ? 1 : -1;
      return netWorth(b) - netWorth(a);
    });
    stats.innerHTML = ranked.map((p) => {
      const color = PLAYER_COLORS[p.color];
      const worth = netWorth(p);
      return `
        <div class="win-stat-row ${winner && p.id === winner.id ? 'winner' : ''}">
          <span class="wc" style="--pc:${color.hex}"></span>
          <b>${escapeHtml(p.name)}${p.bankrupt ? ' · eliminated' : ''}</b>
          <span>${p.bankrupt ? 'OUT' : fmt(worth)}</span>
        </div>
      `;
    }).join('');
  }
}

function buildConfetti() {
  const wrap = $('#confetti');
  if (!wrap) return;
  wrap.innerHTML = '';
  const colors = ['#f2c53d', '#ffe08a', '#3f8cff', '#35c97e', '#ff6b6b', '#b088ff', '#ffffff'];
  for (let i = 0; i < 46; i++) {
    const piece = document.createElement('i');
    piece.style.setProperty('--x', Math.random() * 100 + '%');
    piece.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
    piece.style.setProperty('--d', (1.5 + Math.random() * 1.7) + 's');
    piece.style.setProperty('--delay', (Math.random() * 0.5) + 's');
    piece.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    piece.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
    wrap.appendChild(piece);
  }
}

/* ═══════════════ 17 · EVENT WIRING ═══════════════ */

function bindEvents() {
  // Lobby
  $('#startBtn') && $('#startBtn').addEventListener('click', () => {
    Sound.init();
    Sound.click();
    const configs = lobbyConfig.slice(0, ui.lobbyCount).map((cfg, i) => ({
      name: (cfg.name || `Player ${i + 1}`).trim().slice(0, 16),
      color: cfg.color,
      type: cfg.type
    }));
    if (!configs.length) return;
    startGame(configs, settings.maxRounds);
  });

  $('#continueBtn') && $('#continueBtn').addEventListener('click', () => {
    Sound.init();
    Sound.click();
    loadLocal();
  });

  // Header actions
  $('#soundBtn') && $('#soundBtn').addEventListener('click', () => {
    settings.sound = !settings.sound;
    if (settings.sound) {
      Sound.init();
      Sound.click();
    }
    updateSoundButton();
    saveSettings();
    toast(settings.sound ? 'Sound on' : 'Sound muted', 'info');
  });

  // Text size controls (header + settings modal)
  $('#fontDown') && $('#fontDown').addEventListener('click', () => cycleFont(-1));
  $('#fontUp') && $('#fontUp').addEventListener('click', () => cycleFont(1));
  $('#fontDown2') && $('#fontDown2').addEventListener('click', () => cycleFont(-1));
  $('#fontUp2') && $('#fontUp2').addEventListener('click', () => cycleFont(1));

  // Settings modal
  $('#settingsBtn') && $('#settingsBtn').addEventListener('click', openSettings);
  $('#paceChip') && $('#paceChip').addEventListener('click', openSettings);
  $('#settingsCloseBtn') && $('#settingsCloseBtn').addEventListener('click', () => closeModal('settingsModal'));
  $('#settingsDoneBtn') && $('#settingsDoneBtn').addEventListener('click', () => closeModal('settingsModal'));
  $('#settingsRulesBtn') && $('#settingsRulesBtn').addEventListener('click', () => {
    closeModal('settingsModal');
    openModal('rulesModal');
  });
  $$('#speedPicker button').forEach((btn) => {
    btn.addEventListener('click', () => setSpeed(btn.dataset.speed));
  });
  $$('#turnModePicker button').forEach((btn) => {
    btn.addEventListener('click', () => setTurnMode(btn.dataset.mode));
  });
  const stepRange = $('#stepRange');
  if (stepRange) {
    stepRange.addEventListener('input', () => {
      settings.stepMs = clamp(Math.round(Number(stepRange.value) / 20) * 20, 80, 1200);
      updateStepUI();
    });
    stepRange.addEventListener('change', () => {
      saveSettings();
      Sound.click();
      toast(`Pawn step ${settings.stepMs} ms`, 'info');
    });
  }
  $('#settingsModal') && $('#settingsModal').addEventListener('click', (e) => {
    if (e.target && e.target.id === 'settingsModal') closeModal('settingsModal');
  });

  // Tile detail modal
  $('#tileCloseBtn') && $('#tileCloseBtn').addEventListener('click', () => closeModal('tileModal'));
  $('#tileDoneBtn') && $('#tileDoneBtn').addEventListener('click', () => closeModal('tileModal'));
  $('#tileModal') && $('#tileModal').addEventListener('click', (e) => {
    if (e.target && e.target.id === 'tileModal') closeModal('tileModal');
  });

  $('#fullscreenBtn') && $('#fullscreenBtn').addEventListener('click', () => {
    Sound.init();
    Sound.click();
    toggleFullscreen();
  });
  const syncFullscreen = () => {
    updateFullscreenButton();
    setTimeout(() => { try { resizeBoard(); } catch (_) { /* ignore */ } }, 150);
  };
  document.addEventListener('fullscreenchange', syncFullscreen);
  document.addEventListener('webkitfullscreenchange', syncFullscreen);

  $('#saveBtn') && $('#saveBtn').addEventListener('click', exportSave);
  $('#loadBtn') && $('#loadBtn').addEventListener('click', () => {
    const input = $('#fileInput');
    if (input) input.click();
  });

  $('#fileInput') && $('#fileInput').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    importFile(file);
    e.target.value = '';
  });

  $('#newGameBtn') && $('#newGameBtn').addEventListener('click', () => {
    Sound.init();
    Sound.click();
    requestNewGame();
  });

  $('#againBtn') && $('#againBtn').addEventListener('click', () => {
    Sound.init();
    Sound.click();
    showLobbyForNewMatch();
  });

  // Dock
  $('#rollBtn') && $('#rollBtn').addEventListener('click', () => {
    Sound.init();
    Sound.click();
    if (state && state.phase === 'awaitRoll') rollDiceForCurrent();
  });

  $('#buyBtn') && $('#buyBtn').addEventListener('click', () => {
    if (!state || state.phase !== 'decision') return;
    const player = currentPlayer();
    const tile = state.pendingBuy != null ? state.tiles[state.pendingBuy] : null;
    if (!player || !tile) return;
    if (player.cash < tile.price) {
      toast(`Need ${fmt(tile.price - player.cash)} more cash — only cash can buy assets`, 'bad');
      return;
    }
    state.pendingBuy = null;
    buyAsset(player, tile);
    endTurnSoon(700);
  });

  $('#passBtn') && $('#passBtn').addEventListener('click', () => {
    if (!state || state.phase !== 'decision') return;
    const tile = state.pendingBuy != null ? state.tiles[state.pendingBuy] : null;
    const player = currentPlayer();
    if (player && tile) addLog(`${player.name} passed on ${tile.name}.`, 'info');
    state.pendingBuy = null;
    endTurnSoon(550);
  });

  $('#lockoutPayBtn') && $('#lockoutPayBtn').addEventListener('click', () => {
    if (!state || state.phase !== 'lockout') return;
    const player = currentPlayer();
    if (!player || player.isAI) return;
    payLockoutFee(player);
  });

  $('#lockoutSkipBtn') && $('#lockoutSkipBtn').addEventListener('click', () => {
    if (!state || state.phase !== 'lockout') return;
    const player = currentPlayer();
    if (!player || player.isAI) return;
    skipLockedTurn(player);
  });

  $('#continueTurnBtn') && $('#continueTurnBtn').addEventListener('click', continueTurn);

  // Dice skip
  $('#diceSkipBtn') && $('#diceSkipBtn').addEventListener('click', () => {
    Sound.init();
    if (typeof ui.diceFinish === 'function') ui.diceFinish();
  });

  // Card continue
  $('#cardContinueBtn') && $('#cardContinueBtn').addEventListener('click', () => {
    if (ui.pendingCard) resolvePendingCard();
  });

  // Rules
  $('#rulesBtn') && $('#rulesBtn').addEventListener('click', () => {
    if (state && !canInspectBoard()) {
      toast('Finish the current action, then open the rules.', 'warn');
      return;
    }
    Sound.init();
    Sound.click();
    openModal('rulesModal');
  });
  $('#rulesCloseBtn') && $('#rulesCloseBtn').addEventListener('click', () => closeModal('rulesModal'));

  // Win modal
  $('#winAgainBtn') && $('#winAgainBtn').addEventListener('click', () => {
    Sound.click();
    showLobbyForNewMatch();
  });
  $('#winCloseBtn') && $('#winCloseBtn').addEventListener('click', () => closeModal('winModal'));

  // Log
  $('#clearLogBtn') && $('#clearLogBtn').addEventListener('click', () => {
    if (state) state.log = [];
    renderLog();
    toast('Ledger cleared', 'info');
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($('#settingsModal') && $('#settingsModal').classList.contains('show')) { closeModal('settingsModal'); return; }
      if ($('#tileModal') && $('#tileModal').classList.contains('show')) { closeModal('tileModal'); return; }
      if ($('#rulesModal') && $('#rulesModal').classList.contains('show')) { closeModal('rulesModal'); return; }
      if ($('#winModal') && $('#winModal').classList.contains('show')) { closeModal('winModal'); return; }
      if ($('#lobby') && $('#lobby').classList.contains('show') && state) { closeModal('lobby'); return; }
    }

    const modalOpen = !!document.querySelector('.modal-overlay.show');
    if ((e.key === 'r' || e.key === 'R') && state && state.phase === 'awaitRoll' && !modalOpen) {
      const player = currentPlayer();
      if (player && !player.isAI) {
        Sound.init();
        rollDiceForCurrent();
      }
    }

    if ((e.key === ' ' || e.key === 'Enter') && state && state.phase === 'review' && !modalOpen) {
      const tag = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
      if (!['input', 'textarea', 'select', 'button'].includes(tag)) {
        e.preventDefault();
        Sound.init();
        continueTurn();
      }
    }

    if ((e.key === 'f' || e.key === 'F') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const tag = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
      if (!['input', 'textarea', 'select'].includes(tag)) {
        e.preventDefault();
        toggleFullscreen();
      }
    }
  });

  // Unlock audio on first interaction
  document.addEventListener('pointerdown', () => {
    if (!ui.audioReady) {
      ui.audioReady = true;
      Sound.init();
    }
  }, { passive: true });

  // Auto-save before leaving
  window.addEventListener('beforeunload', () => {
    if (state) saveLocal();
  });

  // Tile inspection (click / tap + hover highlight)
  if (canvas) {
    canvas.addEventListener('click', (e) => {
      if (!state) return;
      const index = tileIndexAt(e.clientX, e.clientY);
      if (index < 0) return;
      if (!canInspectBoard()) {
        toast('Finish the current move first, then click a tile to inspect it.', 'warn');
        return;
      }
      openTileDetails(index);
    });

    canvas.addEventListener('mousemove', (e) => {
      const index = tileIndexAt(e.clientX, e.clientY);
      if (index !== ui.hoverTile) {
        ui.hoverTile = index;
        requestRender();
      }
      canvas.style.cursor = index >= 0 && canInspectBoard() ? 'pointer' : 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      if (ui.hoverTile !== -1) {
        ui.hoverTile = -1;
        requestRender();
      }
      canvas.style.cursor = 'default';
    });
  }

  // Responsive canvas
  window.addEventListener('resize', debounce(resizeBoard, 120));
  window.addEventListener('resize', debounce(positionDiceModal, 100));
  if ('ResizeObserver' in window) {
    try {
      new ResizeObserver(debounce(resizeBoard, 100)).observe($('#boardFrame'));
    } catch (_) { /* ignore */ }
  }

  // Clicking outside rules closes it
  $('#rulesModal') && $('#rulesModal').addEventListener('click', (e) => {
    if (e.target && e.target.id === 'rulesModal') closeModal('rulesModal');
  });
}

function requestNewGame() {
  if (state && state.phase !== 'ended') {
    const ok = window.confirm('Start a new match? The current game will be discarded (the browser autosave may be overwritten).');
    if (!ok) return;
  }
  showLobbyForNewMatch();
}

function showLobbyForNewMatch() {
  clearTimeout(ui.endTimer);
  closeModal('winModal');
  closeModal('cardModal');
  syncLobby();
  openModal('lobby');
  refreshSaveHint();
}

/* ═══════════════ 18 · DEMO / BOOT ═══════════════ */

function init() {
  loadSettings();
  if (![2, 3, 4].includes(ui.lobbyCount)) ui.lobbyCount = 4;
  if (!SPEED_LEVELS.includes(settings.speed)) settings.speed = 1;
  if (!FONT_LEVELS.includes(settings.fontScale)) settings.fontScale = 1;
  ensureUniqueLobbyColors();
  buildLobby();
  bindEvents();
  updateSoundButton();
  updateFullscreenButton();
  applyFontScale();
  applyPaceUI();
  updateStepUI();
  refreshSaveHint();
  resizeBoard();
  updateUI();
  requestAnimationFrame(loop);
  setTimeout(resizeBoard, 150);
  setTimeout(resizeBoard, 600);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { requestRender(); resizeBoard(); }).catch(() => {});
  }

  // Debug / demo hooks (useful for screenshots and automated verification).
  window.MillionaireRace = {
    get state() { return state; },
    start: startGame,
    load: loadState,
    save: saveLocal,
    roll: rollDiceForCurrent,
    netWorth
  };

  const params = new URLSearchParams(window.location.search);
  if (params.has('clean')) document.documentElement.classList.add('clean-shot');
  if (params.has('demo')) {
    setTimeout(() => {
      const demo = [
        { name: 'You', color: 'red', type: 'ai' },
        { name: 'Ava', color: 'blue', type: 'ai' },
        { name: 'Kai', color: 'green', type: 'ai' },
        { name: 'Zoe', color: 'yellow', type: 'ai' }
      ];
      startGame(demo);
      if (params.has('fast')) {
        // simulate a few purchases so the board looks lived-in
        const s = state;
        s.players.forEach((p, i) => { p.cash = 180000 - i * 12000; });
        [1, 3, 5, 7, 9, 11, 13].forEach((tileId, i) => {
          s.tiles[tileId].ownerId = (i % 4);
          s.tiles[tileId].mortgaged = i === 5;
        });
        s.players[1].position = 9;
        s.players[2].position = 13;
        s.players[3].position = 21;
        s.players[0].position = 5;
        s.round = 4;
        updateUI();
      }
    }, 350);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
