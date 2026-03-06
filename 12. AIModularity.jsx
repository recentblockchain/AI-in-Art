import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN: Swiss Modernist Editorial × Organic Science Journal
   Palette: Cream parchment · Terracotta · Deep forest · Ink black · Slate
   Fonts: Playfair Display (display/serif) + Courier Prime (mono body)
   Vibe: A beautifully typeset science magazine — grids, white space, bold numbers
═══════════════════════════════════════════════════════════════════════ */

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap');

*,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream:   #f5f0e8;
  --cream2:  #ede6d6;
  --cream3:  #e0d8c8;
  --ink:     #1a1614;
  --ink2:    #2d2622;
  --terra:   #c2603a;
  --terra2:  #a8502e;
  --terra3:  #e8937a;
  --forest:  #2d5016;
  --forest2: #3d6b20;
  --slate:   #4a5568;
  --slate2:  #718096;
  --gold:    #b8963e;
  --gold2:   #d4b060;
  --sky:     #2c5f82;
  --sky2:    #3a7aa8;
  --border:  rgba(26,22,20,.12);
  --border2: rgba(194,96,58,.25);
  --shadow:  rgba(26,22,20,.08);
}

.root {
  font-family: 'Courier Prime', monospace;
  background: var(--cream);
  color: var(--ink);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── PAPER TEXTURE ── */
.root::before {
  content: '';
  position: fixed; inset: 0;
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 0;
}

/* ── RULE LINES ── */
.root::after {
  content: '';
  position: fixed; inset: 0;
  background-image: repeating-linear-gradient(
    0deg, transparent, transparent 47px,
    rgba(26,22,20,.04) 47px, rgba(26,22,20,.04) 48px
  );
  pointer-events: none; z-index: 0;
}

.z1 { position: relative; z-index: 1; }

/* ═══ MASTHEAD ════════════════════════════════════════════ */
.masthead {
  border-bottom: 3px solid var(--ink);
  padding: 0;
  position: sticky; top: 0; z-index: 100;
  background: var(--cream);
}
.mh-top {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 28px;
  border-bottom: 1px solid var(--border);
  gap: 16px;
}
.mh-logo {
  font-family: 'Playfair Display', serif;
  font-size: clamp(16px, 3vw, 24px);
  font-weight: 900;
  letter-spacing: -0.5px;
  white-space: nowrap;
}
.mh-logo em { font-style: italic; color: var(--terra); }
.mh-vol {
  font-size: 9px; letter-spacing: 3px; color: var(--slate2);
  text-transform: uppercase; font-weight: 700;
  white-space: nowrap;
}
.mh-nav {
  display: flex; gap: 2px;
  overflow-x: auto; padding: 8px 28px;
  scrollbar-width: none;
}
.mh-nav::-webkit-scrollbar { display: none; }
.nav-btn {
  background: transparent;
  border: 1px solid transparent;
  font-family: 'Courier Prime', monospace;
  font-size: 10px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--slate2);
  padding: 6px 13px; border-radius: 0;
  cursor: pointer; white-space: nowrap;
  transition: all .2s;
}
.nav-btn:hover { color: var(--ink); border-color: var(--border); }
.nav-btn.on {
  background: var(--terra); color: #fff;
  border-color: var(--terra);
}

/* ═══ HERO ════════════════════════════════════════════════ */
.hero {
  padding: 60px 28px 52px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
  max-width: 1080px; margin: 0 auto;
  border-bottom: 1px solid var(--border);
}
@media (max-width: 680px) { .hero { grid-template-columns: 1fr; gap: 28px; } }
.hero-issue {
  font-size: 9px; letter-spacing: 3px; color: var(--terra);
  font-weight: 700; text-transform: uppercase;
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.hero-issue::before {
  content: ''; width: 20px; height: 2px;
  background: var(--terra); flex-shrink: 0;
}
.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 5vw, 58px);
  font-weight: 900; line-height: 1.05;
  letter-spacing: -1px;
  margin-bottom: 20px;
}
.hero h1 em { font-style: italic; color: var(--terra); display: block; }
.hero-body {
  font-size: 13px; line-height: 1.9;
  color: var(--slate);
  border-left: 3px solid var(--terra);
  padding-left: 16px;
}
.hero-right { padding-top: 20px; }
.hero-stat-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); border: 1px solid var(--border);
  margin-bottom: 20px;
}
.hero-stat {
  background: var(--cream); padding: 18px 16px;
}
.hs-num {
  font-family: 'Playfair Display', serif;
  font-size: 36px; font-weight: 900;
  color: var(--terra); line-height: 1;
  margin-bottom: 4px;
}
.hs-lbl {
  font-size: 9px; letter-spacing: 2px;
  color: var(--slate2); text-transform: uppercase;
  font-weight: 700; line-height: 1.5;
}
.hero-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.htag {
  font-size: 9px; letter-spacing: 2px; font-weight: 700;
  text-transform: uppercase; padding: 5px 10px;
  border: 1px solid; border-radius: 0;
}
.htag-t { color: var(--terra); border-color: var(--terra2); background: rgba(194,96,58,.06); }
.htag-f { color: var(--forest); border-color: var(--forest); background: rgba(45,80,22,.05); }
.htag-s { color: var(--sky); border-color: var(--sky); background: rgba(44,95,130,.06); }
.htag-g { color: var(--gold); border-color: var(--gold); background: rgba(184,150,62,.07); }

/* ═══ PAGE WRAPPER ════════════════════════════════════════ */
.pg { max-width: 1080px; margin: 0 auto; padding: 52px 28px 100px; }

/* ═══ SECTION RULE ════════════════════════════════════════ */
.sec-rule {
  display: flex; align-items: baseline; gap: 16px;
  margin-bottom: 40px;
}
.sec-num {
  font-family: 'Playfair Display', serif;
  font-size: 80px; font-weight: 900;
  color: var(--cream3); line-height: 1;
  flex-shrink: 0; user-select: none;
}
.sec-head { flex: 1; }
.sec-kicker {
  font-size: 9px; letter-spacing: 3px; color: var(--terra);
  font-weight: 700; text-transform: uppercase;
  margin-bottom: 6px;
}
.sec-head h2 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(22px, 3.5vw, 36px);
  font-weight: 700; line-height: 1.1;
  letter-spacing: -0.5px;
}
.sec-head h2 i { font-style: italic; color: var(--terra); }
.sec-sub {
  font-size: 12px; color: var(--slate2); line-height: 1.8;
  margin-top: 8px; max-width: 560px;
}

/* ═══ CARD ════════════════════════════════════════════════ */
.card {
  background: white;
  border: 1px solid var(--border);
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: box-shadow .3s, transform .2s;
}
.card:hover {
  box-shadow: 0 6px 24px var(--shadow);
  transform: translateY(-2px);
}
.card-hd {
  font-family: 'Playfair Display', serif;
  font-size: 16px; font-weight: 700;
  margin-bottom: 12px;
  display: flex; align-items: center; gap: 10px;
}
.card p, .card li {
  font-size: 12px; color: var(--slate); line-height: 1.9;
}
.card ul { padding-left: 18px; }
.card li { margin-bottom: 6px; }

/* ═══ GRID ════════════════════════════════════════════════ */
.g2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.g3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.g4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; }
.mt12 { margin-top: 12px; } .mt16 { margin-top: 16px; }
.mt20 { margin-top: 20px; } .mt28 { margin-top: 28px; }

/* ═══ PULL QUOTE ══════════════════════════════════════════ */
.pullquote {
  border-left: 5px solid var(--terra);
  padding: 20px 24px; margin: 28px 0;
  background: rgba(194,96,58,.04);
}
.pq-text {
  font-family: 'Playfair Display', serif;
  font-size: clamp(18px, 2.5vw, 24px);
  font-style: italic; line-height: 1.5;
  color: var(--ink2); margin-bottom: 8px;
}
.pq-attr {
  font-size: 10px; letter-spacing: 2px;
  color: var(--slate2); text-transform: uppercase; font-weight: 700;
}

/* ═══ MODULE BLOCK ════════════════════════════════════════ */
.mod-block {
  border: 2px solid var(--border);
  background: white;
  padding: 20px;
  position: relative;
  transition: all .25s;
  cursor: default;
}
.mod-block::before {
  content: attr(data-label);
  position: absolute; top: -10px; left: 14px;
  background: var(--terra); color: white;
  font-size: 8px; letter-spacing: 2px;
  font-weight: 700; padding: 2px 8px;
  text-transform: uppercase;
}
.mod-block:hover {
  border-color: var(--terra);
  box-shadow: 4px 4px 0 var(--terra2);
  transform: translate(-2px, -2px);
}
.mb-icon { font-size: 32px; margin-bottom: 10px; }
.mb-title {
  font-family: 'Playfair Display', serif;
  font-size: 15px; font-weight: 700;
  margin-bottom: 6px;
}
.mb-sub { font-size: 11px; color: var(--slate2); line-height: 1.7; }
.mb-io {
  margin-top: 12px; padding-top: 12px;
  border-top: 1px dashed var(--border);
  display: flex; gap: 8px; font-size: 10px;
}
.mb-in { color: var(--sky); font-weight: 700; }
.mb-out { color: var(--forest); font-weight: 700; }

/* ═══ CONNECTOR ═══════════════════════════════════════════ */
.conn {
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 4px;
  color: var(--terra); font-size: 22px;
  padding: 4px 8px;
}
.conn-label {
  font-size: 8px; letter-spacing: 2px; color: var(--slate2);
  text-transform: uppercase; font-weight: 700; white-space: nowrap;
}

/* ═══ IO BOX ══════════════════════════════════════════════ */
.io-row {
  display: grid; grid-template-columns: 1fr auto 1fr;
  gap: 14px; align-items: center;
}
.io-panel {
  padding: 16px; border: 1px solid var(--border);
  background: white; min-height: 90px;
}
.io-lbl {
  font-size: 8px; letter-spacing: 2.5px; text-transform: uppercase;
  font-weight: 700; margin-bottom: 8px;
}
.io-lbl-in { color: var(--sky); }
.io-lbl-out { color: var(--forest); }
.io-val { font-size: 12px; line-height: 1.75; color: var(--ink2); }
.io-val.loading { color: var(--terra); animation: dot 1.2s infinite; }
@keyframes dot { 0%,100%{opacity:1} 50%{opacity:.2} }
.io-sep { text-align: center; font-size: 22px; color: var(--terra); }
textarea.tinput {
  width: 100%; background: transparent; border: none; outline: none;
  font-family: 'Courier Prime', monospace; font-size: 12px;
  color: var(--ink); resize: none; line-height: 1.75;
}

/* ═══ STEP CARD ═══════════════════════════════════════════ */
.step-wrap {
  display: grid; grid-template-columns: 64px 1fr;
  gap: 20px; margin-bottom: 28px;
  position: relative;
}
.step-wrap::after {
  content: '';
  position: absolute; left: 31px; top: 64px; bottom: -28px;
  width: 2px;
  background: repeating-linear-gradient(to bottom, var(--terra) 0, var(--terra) 6px, transparent 6px, transparent 12px);
}
.step-wrap:last-child::after { display: none; }
.step-n {
  width: 64px; height: 64px;
  border: 2px solid var(--terra);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-family: 'Playfair Display', serif;
  font-size: 28px; font-weight: 900; color: var(--terra);
  background: white; z-index: 1; position: relative;
}
.step-body { padding-top: 4px; }
.step-title {
  font-family: 'Playfair Display', serif;
  font-size: 17px; font-weight: 700;
  margin-bottom: 8px; line-height: 1.2;
}
.step-io {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  margin: 12px 0;
}
.step-box {
  padding: 12px; border: 1px solid var(--border); background: var(--cream);
}
.sb-lbl {
  font-size: 8px; letter-spacing: 2px; font-weight: 700;
  text-transform: uppercase; margin-bottom: 6px;
}
.sb-in { color: var(--sky); }
.sb-out { color: var(--forest2); }
.sb-val { font-size: 11px; line-height: 1.7; color: var(--ink2); }
.step-explain {
  font-size: 11px; color: var(--slate);
  line-height: 1.85; padding: 12px 16px;
  background: rgba(184,150,62,.07);
  border-left: 3px solid var(--gold);
  margin-top: 10px;
}

/* ═══ VISUAL DEMO CANVAS ══════════════════════════════════ */
.vis-canvas {
  background: var(--ink); border: 1px solid var(--ink2);
  border-radius: 0; padding: 28px;
  min-height: 180px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.vis-canvas::before {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    45deg, rgba(255,255,255,.015) 0, rgba(255,255,255,.015) 1px,
    transparent 1px, transparent 20px
  );
}
.vis-art {
  font-size: clamp(40px, 10vw, 80px);
  text-align: center; position: relative; z-index: 1;
  filter: drop-shadow(0 0 20px rgba(255,255,255,.3));
  animation: artPulse 3s ease infinite;
}
@keyframes artPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
.vis-label {
  position: absolute; bottom: 12px; right: 14px;
  font-size: 8px; letter-spacing: 2px; color: rgba(255,255,255,.3);
  text-transform: uppercase; font-weight: 700;
}
.vis-grid {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px;
  width: 100%;
}
.vis-cell {
  aspect-ratio: 1; border-radius: 1px;
  transition: background-color .5s ease;
}

/* ═══ MODULAR ANATOMY ═════════════════════════════════════ */
.anatomy-wrap {
  position: relative; padding: 28px;
  background: var(--ink2); color: white;
  overflow: hidden;
}
.anatomy-wrap::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 32px 32px;
}
.anodes {
  display: flex; align-items: center; gap: 0;
  position: relative; z-index: 1;
  overflow-x: auto; padding-bottom: 8px;
}
.anode {
  flex: 1; min-width: 110px;
  border: 1px solid rgba(255,255,255,.12);
  padding: 16px 12px; text-align: center;
  transition: all .3s;
  position: relative; overflow: hidden;
}
.anode::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,.03));
}
.anode.act {
  border-color: var(--terra3);
  background: rgba(194,96,58,.15);
  box-shadow: 0 0 20px rgba(194,96,58,.2);
}
.anode-icon { font-size: 24px; margin-bottom: 6px; display: block; }
.anode-name { font-size: 11px; font-weight: 700; color: white; margin-bottom: 3px; }
.anode-type { font-size: 9px; color: rgba(255,255,255,.4); letter-spacing: 1px; }
.anode-status {
  font-size: 8px; letter-spacing: 1.5px; font-weight: 700;
  margin-top: 6px; text-transform: uppercase;
}
.st-idle { color: rgba(255,255,255,.3); }
.st-run  { color: var(--terra3); animation: dot 1s infinite; }
.st-done { color: #86efac; }
.arr-conn {
  display: flex; align-items: center; justify-content: center;
  padding: 0 6px; color: var(--terra3); font-size: 18px; flex-shrink: 0;
  background: rgba(255,255,255,.02);
  border-top: 1px solid rgba(255,255,255,.06);
  border-bottom: 1px solid rgba(255,255,255,.06);
}

/* ═══ BUTTON ══════════════════════════════════════════════ */
.btn {
  background: var(--terra); color: white; border: none;
  font-family: 'Courier Prime', monospace;
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 11px 24px; cursor: pointer;
  transition: all .2s; display: inline-flex; align-items: center; gap: 8px;
}
.btn:hover { background: var(--terra2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(194,96,58,.3); }
.btn:active { transform: translateY(0); }
.btn:disabled { opacity: .4; cursor: not-allowed; transform: none; box-shadow: none; }
.btn-outline {
  background: transparent; color: var(--terra);
  border: 2px solid var(--terra);
  font-family: 'Courier Prime', monospace;
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; padding: 10px 22px; cursor: pointer;
  transition: all .2s;
}
.btn-outline:hover { background: var(--terra); color: white; }

/* ═══ BUILDER ═════════════════════════════════════════════ */
.slot {
  flex: 1; min-width: 120px;
  border: 2px dashed var(--border);
  padding: 18px 12px; text-align: center;
  cursor: pointer; transition: all .25s;
  background: white; position: relative;
}
.slot:hover { border-color: var(--terra); background: rgba(194,96,58,.03); }
.slot.filled { border-style: solid; border-color: var(--terra); background: rgba(194,96,58,.04); }
.slot.sel {
  border-color: var(--forest); background: rgba(45,80,22,.05);
  box-shadow: inset 0 0 0 1px var(--forest);
}
.slot-plus { font-size: 24px; color: var(--border); margin-bottom: 6px; }
.slot-icon { font-size: 28px; margin-bottom: 6px; }
.slot-nm { font-size: 11px; font-weight: 700; margin-bottom: 2px; }
.slot-tp { font-size: 9px; color: var(--slate2); letter-spacing: 1px; }

.picker {
  padding: 16px; background: var(--cream2);
  border: 1px solid var(--border);
  margin-top: 12px;
}
.picker-title {
  font-size: 9px; letter-spacing: 2px; font-weight: 700;
  color: var(--terra); text-transform: uppercase; margin-bottom: 10px;
}
.picker-grid { display: flex; flex-wrap: wrap; gap: 6px; }
.pick-btn {
  background: white; border: 1px solid var(--border);
  font-family: 'Courier Prime', monospace; font-size: 11px;
  padding: 7px 12px; cursor: pointer; transition: all .2s;
  display: flex; align-items: center; gap: 6px; color: var(--ink2);
}
.pick-btn:hover { border-color: var(--terra); color: var(--terra); }
.pick-btn.chosen { border-color: var(--terra); background: rgba(194,96,58,.06); color: var(--terra); font-weight: 700; }

/* ═══ PROGRESS ════════════════════════════════════════════ */
.pbar { height: 4px; background: var(--cream3); overflow: hidden; margin-top: 6px; }
.pfill { height: 100%; background: var(--terra); transition: width .7s ease; }

/* ═══ LOG TERMINAL ════════════════════════════════════════ */
.terminal {
  background: var(--ink); padding: 16px 20px;
  font-size: 11px; color: #a0b8a0;
  line-height: 2; max-height: 200px; overflow-y: auto;
  border: 1px solid rgba(255,255,255,.08);
}
.log-line { display: block; }
.log-line.ok { color: #86efac; }
.log-line.run { color: var(--terra3); }
.log-line.info { color: rgba(255,255,255,.5); }
.cursor { animation: cur .8s infinite; }
@keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} }

/* ═══ QUIZ ════════════════════════════════════════════════ */
.q-opt {
  border: 1px solid var(--border);
  padding: 13px 18px; cursor: pointer; background: white;
  font-size: 12px; transition: all .2s; margin-bottom: 8px;
  display: flex; align-items: center; gap: 12px; line-height: 1.6;
}
.q-opt:hover { border-color: var(--terra); background: rgba(194,96,58,.03); color: var(--terra); }
.q-opt.ok { background: rgba(45,80,22,.08); border-color: var(--forest); color: var(--forest); }
.q-opt.bad { background: rgba(194,96,58,.08); border-color: var(--terra); color: var(--terra2); }
.q-letter {
  width: 28px; height: 28px; flex-shrink: 0;
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; font-family: 'Playfair Display', serif;
}
.q-explain {
  padding: 16px; background: rgba(184,150,62,.08);
  border-left: 4px solid var(--gold);
  font-size: 12px; line-height: 1.85; color: var(--slate);
  margin-top: 12px;
}

/* ═══ CONCEPT ROW ═════════════════════════════════════════ */
.concept-row {
  display: flex; gap: 0;
  border: 1px solid var(--border); background: white;
  margin-bottom: 12px; overflow: hidden;
}
.cr-num {
  width: 64px; flex-shrink: 0;
  background: var(--terra); color: white;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 900;
}
.cr-body { padding: 16px 18px; flex: 1; }
.cr-title { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; margin-bottom: 5px; }
.cr-desc { font-size: 11px; color: var(--slate); line-height: 1.8; }

/* ═══ COMPARISON ══════════════════════════════════════════ */
.compare {
  display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
  background: var(--border); border: 1px solid var(--border);
  margin-top: 16px;
}
.comp-col { background: white; padding: 20px; }
.comp-hd {
  font-size: 9px; letter-spacing: 2px; font-weight: 700;
  text-transform: uppercase; margin-bottom: 12px; padding-bottom: 8px;
  border-bottom: 2px solid;
}
.comp-hd.bad { color: var(--slate2); border-color: var(--cream3); }
.comp-hd.good { color: var(--forest); border-color: var(--forest); }
.comp-item {
  display: flex; gap: 8px; margin-bottom: 8px;
  font-size: 11px; color: var(--slate); line-height: 1.7;
}
.ci-ico { flex-shrink: 0; }

/* ═══ TIMELINE ════════════════════════════════════════════ */
.tl { padding-left: 32px; position: relative; }
.tl::before {
  content: ''; position: absolute; left: 14px; top: 0; bottom: 0;
  width: 2px;
  background: repeating-linear-gradient(to bottom, var(--terra) 0, var(--terra) 8px, var(--cream3) 8px, var(--cream3) 16px);
}
.tl-item { position: relative; margin-bottom: 24px; }
.tl-dot {
  position: absolute; left: -22px; top: 4px;
  width: 16px; height: 16px;
  background: var(--terra); border: 3px solid var(--cream);
  box-shadow: 0 0 0 1px var(--terra);
}
.tl-yr { font-size: 9px; color: var(--terra); font-weight: 700; letter-spacing: 2px; margin-bottom: 3px; }
.tl-nm { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.tl-info { font-size: 11px; color: var(--slate2); line-height: 1.65; }

/* ═══ FADE ════════════════════════════════════════════════ */
.fade { animation: fadeUp .4s ease both; }
@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

/* ═══ DIVIDER ═════════════════════════════════════════════ */
.rule { height: 1px; background: var(--border); margin: 32px 0; }
.rule-thick { height: 2px; background: var(--ink); margin: 32px 0; }

/* ═══ FOOTER ══════════════════════════════════════════════ */
.footer {
  border-top: 3px solid var(--ink); padding: 28px;
  text-align: center;
  font-size: 10px; letter-spacing: 2px; color: var(--slate2);
  text-transform: uppercase;
}
.footer span { color: var(--terra); }

/* ═══ SCROLLBAR ═══════════════════════════════════════════ */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--cream2); }
::-webkit-scrollbar-thumb { background: var(--cream3); }
::-webkit-scrollbar-thumb:hover { background: var(--slate2); }

@media(max-width:560px){
  .step-io { grid-template-columns: 1fr; }
  .io-row { grid-template-columns: 1fr; }
  .io-sep { transform: rotate(90deg); }
  .compare { grid-template-columns: 1fr; }
}
`;

/* ═══════════════════════ DATA ══════════════════════════ */
const TOOLS = [
  { id:"gpt",   icon:"💬", name:"ChatGPT",      type:"TEXT",    out:"text",    col:"var(--sky)",    desc:"Generates scripts, prompts and descriptions" },
  { id:"dalle", icon:"🖼️", name:"DALL·E",        type:"IMAGE",   out:"image",   col:"var(--terra)",  desc:"Converts text into visual images" },
  { id:"mid",   icon:"🎨", name:"Midjourney",    type:"IMAGE",   out:"image",   col:"var(--terra)",  desc:"Creates artistic and cinematic images" },
  { id:"run",   icon:"🎬", name:"Runway ML",     type:"VIDEO",   out:"video",   col:"var(--forest)", desc:"Animates images into video clips" },
  { id:"suno",  icon:"🎵", name:"Suno AI",       type:"MUSIC",   out:"audio",   col:"var(--gold)",   desc:"Composes full songs from text prompts" },
  { id:"eleven",icon:"🎙️", name:"ElevenLabs",    type:"VOICE",   out:"audio",   col:"var(--terra)",  desc:"Creates realistic human-sounding voices" },
  { id:"stable",icon:"🌅", name:"Stable Diffusion",type:"IMAGE", out:"image",   col:"var(--terra)",  desc:"Open-source image generation engine" },
  { id:"canva", icon:"✏️", name:"Canva AI",      type:"DESIGN",  out:"graphic", col:"var(--sky)",    desc:"Designs posters, layouts and graphics" },
];

const MODULES_DATA = [
  { icon:"💬", label:"MODULE A", name:"Text AI",    role:"Prompt Writer",      in:"Your rough idea", out:"Precise, detailed prompt",  color:"var(--sky)",    desc:"Takes your vague concept and expands it into a richly detailed description that downstream AI tools can act on." },
  { icon:"🖼️", label:"MODULE B", name:"Image AI",   role:"Visual Creator",     in:"Detailed text prompt", out:"High-resolution image", color:"var(--terra)",  desc:"Converts the text prompt into pixels — generating a visual scene by predicting what each pixel should look like." },
  { icon:"🎬", label:"MODULE C", name:"Video AI",   role:"Motion Animator",    in:"Static image + motion text", out:"Animated video clip", color:"var(--forest)", desc:"Takes the still image as a starting frame and predicts how each element would move over time." },
  { icon:"🎵", label:"MODULE D", name:"Music AI",   role:"Composer",           in:"Style tags + lyrics", out:"Full song with vocals", color:"var(--gold)",   desc:"Generates melody, harmony, rhythm and vocals simultaneously from structural instructions." },
  { icon:"🎙️", label:"MODULE E", name:"Voice AI",   role:"Narrator",           in:"Script + voice profile", out:"Spoken audio file", color:"var(--slate)",  desc:"Synthesises a human-sounding voice to narrate scripts, add character dialogue or create podcasts." },
  { icon:"✏️", label:"MODULE F", name:"Design AI",  role:"Layout Assembler",   in:"Images + text + brand guide", out:"Finished graphic", color:"var(--sky)",  desc:"Arranges visual assets and copy into polished layouts for print, web or social media." },
];

const EXAMPLES = [
  {
    title: "Short Film Opening Shot",
    emoji: "🎬",
    color: "var(--terra)",
    chain: [
      { tool:"ChatGPT", icon:"💬", act:"Write scene description",
        inp:"Idea: 'A girl discovering magic in an abandoned library'",
        out:"Scene: 'Dawn light slants through cracked skylights. Dust motes drift above towering oak shelves. A girl of 12 — wide-eyed, satchel over shoulder — steps through a door that was not there yesterday. A single book floats from a high shelf and opens before her. Camera: slow push-in, 35mm, warm amber light.'" },
      { tool:"Midjourney", icon:"🎨", act:"Generate keyframe image",
        inp:"Scene description from Step 1 with style parameters: painterly, cinematic, 16:9",
        out:"1920×1080 image: golden library interior, floating book, wonder-struck girl, warm painted aesthetic" },
      { tool:"Runway ML", icon:"🎬", act:"Animate the keyframe",
        inp:"Keyframe image + motion guide: 'dust motes rising, pages slowly turning, subtle camera push-in'",
        out:"6-second HD video clip — the library scene comes alive with gentle motion" },
    ]
  },
  {
    title: "Music Video Production",
    emoji: "🎵",
    color: "var(--forest)",
    chain: [
      { tool:"ChatGPT", icon:"💬", act:"Write lyrics and visual concept",
        inp:"Brief: 'An upbeat song about chasing dreams at midnight'",
        out:"Song title, genre (synth-pop, 128 BPM), full lyrics with verse/chorus/bridge + 5 matching visual scene descriptions" },
      { tool:"Suno AI", icon:"🎵", act:"Compose the complete song",
        inp:"Lyrics + style tags: [synth-pop] [128 BPM] [driving bass] [female vocals] [hopeful]",
        out:"3-minute full song with vocals, melody, synth chords and percussion (MP3)" },
      { tool:"DALL·E 3", icon:"🖼️", act:"Generate visuals for each section",
        inp:"Scene descriptions from Step 1, colour palette: electric blue, magenta, midnight navy",
        out:"5 cinematic images corresponding to each song section — consistent colour and mood" },
      { tool:"Runway ML", icon:"🎬", act:"Assemble animated music video",
        inp:"5 images + song audio + transition instructions between sections",
        out:"Full 3-minute music video with animated visuals synchronised to the song" },
    ]
  },
  {
    title: "Social Media Campaign",
    emoji: "📱",
    color: "var(--sky)",
    chain: [
      { tool:"ChatGPT", icon:"💬", act:"Create brand strategy and copy",
        inp:"Brand brief: 'Organic tea brand targeting young adults, values: calm, sustainable, ritual'",
        out:"Brand voice, 6 Instagram captions, 4 Twitter posts, hashtag set, palette: sage green + warm ivory + clay" },
      { tool:"DALL·E 3", icon:"🖼️", act:"Generate product imagery",
        inp:"'Ceramic teacup on morning windowsill, sage green tones, warm soft light, editorial photography style, colour palette: sage, ivory, terracotta'",
        out:"6 lifestyle product images — all consistent with defined palette and editorial style" },
      { tool:"Canva AI", icon:"✏️", act:"Design the finished posts",
        inp:"6 images + captions + brand palette + post specs (1080×1080 square, 1080×1920 Stories)",
        out:"12 finished, ready-to-post social media graphics with typography, layout and branding applied" },
    ]
  },
];

const QUIZ = [
  { q:"What does 'modularity' mean in the context of AI systems?",
    opts:["Using one powerful AI for everything","Breaking a complex task into separate, specialised AI components that work together","Making AI tools more expensive","Storing AI in separate computers"],
    a:1, exp:"Modularity means dividing a task into distinct modules — each AI tool handles one job it does best. The modules connect to produce a result no single tool could achieve alone." },
  { q:"Why is passing information between modules important in an AI creative pipeline?",
    opts:["It slows the system down","It saves storage space","It ensures visual style, colour and mood decided early flow through every tool — creating consistency","It makes the images larger"],
    a:2, exp:"When Module A defines a colour palette or mood, passing that information to Module B and Module C ensures every output aligns. Consistency across a project comes from deliberate information flow between modules." },
  { q:"In an Image AI module, what does 'diffusion' mean?",
    opts:["Spreading AI to many computers","Starting with random noise and gradually refining it into a clear image guided by your prompt","Compressing an image to a smaller file size","Combining two images"],
    a:1, exp:"Diffusion models start with a completely random noisy image and progressively remove the noise over ~50 steps, guided by your text prompt — like slowly developing a photograph in a darkroom." },
  { q:"What is the correct order for a Text → Image → Video module chain?",
    opts:["Video AI → Image AI → Text AI","Image AI → Text AI → Video AI","Text AI refines the prompt → Image AI creates the keyframe → Video AI animates it","Video AI → Text AI → Image AI"],
    a:2, exp:"The correct flow is: Text AI produces a precise prompt, Image AI turns that prompt into a visual keyframe, and Video AI animates the keyframe into a moving clip. Each output becomes the next module's input." },
  { q:"What makes a single AI module DIFFERENT from a full modular pipeline?",
    opts:["A single module can do everything — pipelines are unnecessary","A pipeline costs more money","A single module has one specialisation; a pipeline chains multiple specialists to produce complex multi-format results","Single modules are newer technology"],
    a:2, exp:"A single Text AI can write but cannot create images. A single Image AI can generate pictures but cannot animate them. A pipeline connects these specialists — the output of one becomes the input of the next, producing results impossible with any single tool." },
];

/* ══════════════ MAIN COMPONENT ════════════════════════ */
export default function AIModularity() {
  const [tab, setTab]   = useState(0);

  // example walkthrough
  const [exIdx, setExIdx] = useState(0);
  const [exStep, setExStep] = useState(0);

  // module anatomy animation
  const [animStep, setAnimStep]  = useState(-1);
  const [animRunning, setAnimRunning] = useState(false);

  // builder
  const [slots, setSlots]         = useState([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [buildLog, setBuildLog]   = useState([]);
  const [buildRunning, setBuildRunning] = useState(false);
  const [buildStep, setBuildStep]  = useState(-1);

  // live demo
  const [demoInput, setDemoInput] = useState("A peaceful Japanese garden in autumn — golden maple leaves, stone path, mist rising from a koi pond at dawn");
  const [demoPhase, setDemoPhase] = useState(-1);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoOuts, setDemoOuts]   = useState(["","",""]);
  const [pixelArt, setPixelArt]   = useState([]);

  // viz canvas
  const [vizSeed, setVizSeed]   = useState(0);

  // quiz
  const [qi, setQi]     = useState(0);
  const [qsel, setQsel] = useState(null);
  const [qsc, setQsc]   = useState(0);
  const [qdone, setQdone] = useState(false);

  const TABS = [
    { icon:"📖", l:"Overview" },
    { icon:"🧩", l:"What is Modularity?" },
    { icon:"🤖", l:"AI Modules" },
    { icon:"⚙️", l:"How It Works" },
    { icon:"🎨", l:"Examples" },
    { icon:"🛠️", l:"Build a Pipeline" },
    { icon:"🚀", l:"Live Demo" },
    { icon:"🏆", l:"Quiz" },
  ];

  /* pixel art generator for visual demo */
  const genPixels = useCallback((seed) => {
    const palette = [
      "#c2603a","#a8502e","#e8937a",
      "#2d5016","#3d6b20","#86a05a",
      "#2c5f82","#3a7aa8","#6ba3c2",
      "#b8963e","#d4b060","#e8ccaa",
      "#1a1614","#4a5568","#f5f0e8",
    ];
    return Array.from({length:36}, (_,i) => {
      const v = Math.sin(seed * 1.7 + i * 0.9) * 0.5 + 0.5;
      return palette[Math.floor(v * palette.length)];
    });
  }, []);

  useEffect(() => { setPixelArt(genPixels(1)); }, [genPixels]);

  /* anatomy run */
  const runAnatomy = useCallback(() => {
    const nodes = MODULES_DATA.slice(0,3);
    setAnimRunning(true); setAnimStep(-1);
    nodes.forEach((_,i) => {
      setTimeout(() => setAnimStep(i), i * 1200);
    });
    setTimeout(() => { setAnimStep(nodes.length); setAnimRunning(false); }, nodes.length * 1200 + 400);
  }, []);

  /* builder run */
  const runBuilder = useCallback(() => {
    const filled = slots.filter(Boolean);
    if (filled.length < 2) return;
    setBuildRunning(true); setBuildLog([]); setBuildStep(-1);
    filled.forEach((t, i) => {
      setTimeout(() => {
        setBuildStep(i);
        setBuildLog(prev => [...prev,
          { type:"run", text:`[${String(i+1).padStart(2,"0")}] ▶ ${t.name} module executing — processing ${t.type.toLowerCase()} data...` }
        ]);
      }, i * 1500);
    });
    setTimeout(() => {
      setBuildStep(filled.length);
      setBuildLog(prev => [...prev,
        { type:"ok", text:`[OK] ✓ Pipeline complete — ${filled.length} modules executed.` },
        { type:"info", text:`     Final output format: ${filled[filled.length-1].out}` },
      ]);
      setBuildRunning(false);
    }, filled.length * 1500 + 500);
  }, [slots]);

  /* live demo run */
  const runDemo = useCallback(() => {
    if (!demoInput.trim()) return;
    setDemoRunning(true); setDemoPhase(-1); setDemoOuts(["","",""]);
    const words = demoInput.trim().split(/\s+/).slice(0,8);

    const outputs = [
      `Expanded prompt generated:\n\n"${demoInput}"\n\n→ Key visual tokens extracted:\n${words.map(w => `   • ${w}`).join('\n')}\n\n→ Style parameters appended:\n   • Photorealistic · Golden hour · Shallow depth of field\n   • Colour palette: warm amber, sage, mist grey\n   • Camera: 85mm, eye-level, slow pan suggested`,
      `Image generation initiated:\n\nInput tokens → UNet encoder → Latent space compression\nDiffusion loop: 50 denoising steps\nStep 01/50 ░░░░░░░░░░ 2%\nStep 25/50 █████░░░░░ 50%\nStep 50/50 ██████████ 100%\n\nDecoding latent vectors → 1024×1024 pixel array\n✓ Image rendered: autumn_garden_dawn.png`,
      `Video animation initiated:\n\nKeyframe loaded (1024×1024)\nMotion analysis: identifying animatable regions\n→ Mist layer: gentle upward drift\n→ Leaves: slow spiral fall\n→ Water surface: subtle ripple propagation\n→ Camera: 3-second slow push-in\n\nRendering 72 frames @ 24fps...\n✓ Video clip: autumn_garden_6sec.mp4`
    ];

    outputs.forEach((o, i) => {
      setTimeout(() => {
        setDemoPhase(i);
        setDemoOuts(prev => { const n=[...prev]; n[i]=o; return n; });
        if (i === 1) setPixelArt(genPixels(Math.random() * 50));
      }, i * 2600);
    });
    setTimeout(() => { setDemoRunning(false); setDemoPhase(3); }, outputs.length * 2600 + 300);
  }, [demoInput, genPixels]);

  const handleQ = (i) => {
    if (qsel !== null) return;
    setQsel(i);
    if (i === QUIZ[qi].a) setQsc(s => s+1);
  };
  const nextQ = () => {
    if (qi+1 >= QUIZ.length) { setQdone(true); return; }
    setQi(q => q+1); setQsel(null);
  };
  const resetQ = () => { setQi(0); setQsel(null); setQsc(0); setQdone(false); };

  const curEx = EXAMPLES[exIdx];

  return (
    <>
      <style>{S}</style>
      <div className="root z1">

        {/* ══ MASTHEAD ══ */}
        <header className="masthead z1">
          <div className="mh-top z1">
            <div className="mh-logo">The <em>Modular</em> AI Review</div>
            <div className="mh-vol">Special Issue · AI in Art, Media &amp; Design</div>
          </div>
          <nav className="mh-nav z1">
            {TABS.map((t,i) => (
              <button key={i} className={"nav-btn"+(tab===i?" on":"")} onClick={() => setTab(i)}>
                {t.icon} {t.l}
              </button>
            ))}
          </nav>
        </header>

        {/* ══ HERO ══ */}
        {tab === 0 && (
          <section className="hero z1">
            <div>
              <div className="hero-issue">Feature Article</div>
              <h1>
                What is<br/>
                <em>Modularity</em><br/>
                in AI?
              </h1>
              <div className="hero-body">
                One building block does one job. Connect enough building blocks and you can construct anything — a film, a song, an entire brand campaign. This is the power of modular AI in creative work.
              </div>
              <div className="hero-tags" style={{marginTop:"20px"}}>
                <span className="htag htag-t">Art</span>
                <span className="htag htag-f">Media</span>
                <span className="htag htag-s">Design</span>
                <span className="htag htag-g">AI Pipelines</span>
                <span className="htag htag-t">Creativity</span>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-stat-grid">
                {[
                  { n:"6+", l:"Specialised\nAI Modules" },
                  { n:"3×", l:"More Creative\nOutput" },
                  { n:"∞",  l:"Possible\nCombinations" },
                  { n:"1",  l:"Connected\nPipeline" },
                ].map((s,i) => (
                  <div key={i} className="hero-stat">
                    <div className="hs-num">{s.n}</div>
                    <div className="hs-lbl" style={{whiteSpace:"pre-line"}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{marginBottom:0}}>
                <div className="card-hd" style={{fontSize:"13px"}}>📋 What You Will Learn</div>
                {[
                  "What modularity means — with everyday analogies",
                  "How AI modules are specialised tools that work together",
                  "Step-by-step input → output examples with visuals",
                  "Three complete real-world pipeline walkthroughs",
                  "How to build your own AI module pipeline",
                  "A 5-question knowledge assessment",
                ].map((l,i) => (
                  <div key={i} style={{display:"flex",gap:"8px",marginBottom:"7px",fontSize:"12px",color:"var(--slate)"}}>
                    <span style={{color:"var(--terra)",fontWeight:"700",flexShrink:0}}>→</span>{l}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ CONTENT ══ */}
        <main className="pg z1">

          {/* ─── TAB 0: OVERVIEW ─── */}
          {tab===0 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">01</div>
                <div className="sec-head">
                  <div className="sec-kicker">Foundation Concept</div>
                  <h2>The Big Picture: <i>Modularity</i></h2>
                  <p className="sec-sub">Before we talk about AI, understand modularity itself — a concept that appears everywhere in engineering, biology and design.</p>
                </div>
              </div>

              <div className="pullquote">
                <div className="pq-text">"A module is a self-contained unit with a clear input, a defined job, and a predictable output — designed to connect with other modules."</div>
                <div className="pq-attr">Core Definition · Systems Design</div>
              </div>

              <div className="g3">
                {[
                  { icon:"🏗️", ex:"LEGO Bricks", title:"Physical Modularity", desc:"Each LEGO brick is a module — a standard shape that connects to any other brick. Alone, it's just a block. Connected, it becomes architecture." },
                  { icon:"🎵", ex:"Music Tracks", title:"Audio Modularity", desc:"A song has modules: drums, bass, melody, vocals. A producer can replace just the drums without touching anything else — because each module is independent." },
                  { icon:"💻", ex:"Web Apps", title:"Software Modularity", desc:"Apps are built from modules: a login module, a search module, a payment module. Update one without breaking the others." },
                ].map((c,i) => (
                  <div key={i} className="card" style={{paddingTop:"20px"}}>
                    <div style={{fontSize:"36px",marginBottom:"10px"}}>{c.icon}</div>
                    <div style={{fontSize:"9px",color:"var(--terra)",letterSpacing:"2px",fontWeight:"700",marginBottom:"6px"}}>{c.ex}</div>
                    <div className="card-hd" style={{fontSize:"14px"}}>{c.title}</div>
                    <p>{c.desc}</p>
                  </div>
                ))}
              </div>

              <div className="rule-thick" />

              <div className="sec-rule">
                <div className="sec-num">02</div>
                <div className="sec-head">
                  <div className="sec-kicker">The Key Properties</div>
                  <h2>Four Properties of Any <i>Module</i></h2>
                </div>
              </div>

              {[
                { n:"I", title:"Single Responsibility", desc:"Each module has ONE job. A well-designed module doesn't try to do everything — it specialises in one thing and does it exceptionally well. This is why DALL·E only makes images and doesn't try to write scripts too." },
                { n:"II", title:"Defined Interface", desc:"Every module has a clear input (what it accepts) and a clear output (what it produces). The Image AI accepts text and produces pixels. These contracts allow modules to connect without knowing each other's inner workings." },
                { n:"III", title:"Replaceability", desc:"Any module can be swapped for a different one performing the same role. If DALL·E is replaced by Midjourney, the rest of the pipeline still works — because both accept text and produce images." },
                { n:"IV", title:"Composability", desc:"Modules are designed to be combined. The output format of Module A must match the input format Module B accepts. This deliberate design is what makes the whole pipeline possible." },
              ].map((r,i) => (
                <div key={i} className="concept-row">
                  <div className="cr-num">{r.n}</div>
                  <div className="cr-body">
                    <div className="cr-title">{r.title}</div>
                    <div className="cr-desc">{r.desc}</div>
                  </div>
                </div>
              ))}

              <div className="rule" />

              <div className="card" style={{borderLeft:"4px solid var(--forest)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🆚</span> Non-Modular vs Modular: Why It Matters</div>
                <div className="compare">
                  <div className="comp-col">
                    <div className="comp-hd bad">✗ Non-Modular Approach</div>
                    {["One tool tries to do text, image and video — poorly","Changing one part breaks everything else","Limited to what one company builds","No specialisation — average results across the board"].map((t,i)=>(
                      <div key={i} className="comp-item"><span className="ci-ico" style={{color:"var(--terra)"}}>✕</span>{t}</div>
                    ))}
                  </div>
                  <div className="comp-col">
                    <div className="comp-hd good">✓ Modular Pipeline</div>
                    {["Each module is the best-in-class tool for its specific job","Swap one module without touching the others","Combine tools from different companies","Expert-level results at each stage"].map((t,i)=>(
                      <div key={i} className="comp-item"><span className="ci-ico" style={{color:"var(--forest)"}}>✓</span>{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 1: WHAT IS MODULARITY ─── */}
          {tab===1 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">03</div>
                <div className="sec-head">
                  <div className="sec-kicker">Deep Dive</div>
                  <h2>Modularity: <i>Explained Simply</i></h2>
                  <p className="sec-sub">Three everyday analogies that make modularity completely clear — before we apply it to AI.</p>
                </div>
              </div>

              {/* Analogy 1: Kitchen */}
              <div className="card" style={{borderTop:"4px solid var(--terra)"}}>
                <div style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:"20px",alignItems:"start"}}>
                  <div style={{
                    width:"80px",height:"80px",background:"var(--terra)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:"36px",flexShrink:0
                  }}>🍳</div>
                  <div>
                    <div style={{fontSize:"9px",color:"var(--terra)",letterSpacing:"2px",fontWeight:"700",marginBottom:"6px"}}>ANALOGY 01 · KITCHEN</div>
                    <div className="card-hd" style={{fontSize:"16px",marginBottom:"10px"}}>A Kitchen is a Modular System</div>
                    <p>Think of a professional kitchen. The chef doesn't cook everything in one pot — there are <strong>separate stations</strong>: a grill station, a prep station, a sauce station, a plating station. Each station is a module.</p>
                    <div className="mt12">
                      <div style={{display:"flex",gap:"0",overflow:"hidden",border:"1px solid var(--border)"}}>
                        {["🥕 Prep\n(cuts & portions)","🔥 Cook\n(heat & timing)","🥘 Sauce\n(flavour)","🍽️ Plate\n(presentation)"].map((s,i)=>(
                          <div key={i} style={{flex:1,padding:"12px 8px",textAlign:"center",borderRight:i<3?"1px solid var(--border)":undefined,background:i%2===0?"white":"var(--cream)"}}>
                            <div style={{fontSize:"11px",fontWeight:"700",whiteSpace:"pre-line",color:i===1||i===2?"var(--terra)":"var(--ink)"}}>{s}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="mt12">Each station <strong>accepts specific inputs</strong> (raw carrots → prep station), does its job, and <strong>passes outputs</strong> to the next station (portioned carrots → cook station). The whole kitchen is a pipeline of modules.</p>
                  </div>
                </div>
              </div>

              {/* Analogy 2: Film Crew */}
              <div className="card" style={{borderTop:"4px solid var(--forest)"}}>
                <div style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:"20px",alignItems:"start"}}>
                  <div style={{width:"80px",height:"80px",background:"var(--forest)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px",flexShrink:0}}>🎬</div>
                  <div>
                    <div style={{fontSize:"9px",color:"var(--forest)",letterSpacing:"2px",fontWeight:"700",marginBottom:"6px"}}>ANALOGY 02 · FILM CREW</div>
                    <div className="card-hd" style={{fontSize:"16px",marginBottom:"10px"}}>A Film Crew is a Modular Team</div>
                    <p>A film doesn't have one person doing everything. It has specialists: a <strong>scriptwriter</strong>, a <strong>director of photography</strong>, a <strong>sound designer</strong>, an <strong>editor</strong>. Each person is a module — a specialist who does one thing brilliantly.</p>
                    <div className="mt12 g4">
                      {[
                        {r:"Scriptwriter",in:"Story idea",out:"Written script",i:"✍️"},
                        {r:"Cinematographer",in:"Script",out:"Filmed footage",i:"📷"},
                        {r:"Sound Designer",in:"Footage",out:"Audio mix",i:"🎙️"},
                        {r:"Editor",in:"Footage + Audio",out:"Final film",i:"✂️"},
                      ].map((m,i)=>(
                        <div key={i} className="mod-block" data-label={`ROLE ${i+1}`} style={{paddingTop:"24px"}}>
                          <div className="mb-icon">{m.i}</div>
                          <div className="mb-title">{m.r}</div>
                          <div className="mb-io">
                            <span><span className="mb-in">IN: </span><span style={{color:"var(--slate2)",fontSize:"10px"}}>{m.in}</span></span>
                          </div>
                          <div className="mb-io" style={{marginTop:"4px"}}>
                            <span><span className="mb-out">OUT: </span><span style={{color:"var(--slate2)",fontSize:"10px"}}>{m.out}</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analogy 3: Human Body */}
              <div className="card" style={{borderTop:"4px solid var(--sky)"}}>
                <div style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:"20px",alignItems:"start"}}>
                  <div style={{width:"80px",height:"80px",background:"var(--sky)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px",flexShrink:0}}>🫀</div>
                  <div>
                    <div style={{fontSize:"9px",color:"var(--sky)",letterSpacing:"2px",fontWeight:"700",marginBottom:"6px"}}>ANALOGY 03 · HUMAN BODY</div>
                    <div className="card-hd" style={{fontSize:"16px",marginBottom:"10px"}}>The Human Body is Nature's Modular System</div>
                    <p>Your brain doesn't digest food. Your stomach doesn't filter blood. Your lungs don't send nerve signals. Each organ is a <strong>specialised module</strong> — and they communicate through shared systems (blood, nerves) the same way AI modules communicate through shared data formats.</p>
                    <div className="mt12" style={{padding:"16px",background:"var(--cream2)",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:"11px",color:"var(--slate)",lineHeight:"1.9"}}>
                        <strong style={{color:"var(--sky)"}}>Brain module:</strong> Receives sensory data → processes → sends commands<br/>
                        <strong style={{color:"var(--terra)"}}>Heart module:</strong> Receives deoxygenated blood → pumps → delivers oxygenated blood<br/>
                        <strong style={{color:"var(--forest)"}}>Lung module:</strong> Receives CO₂-rich blood → exchanges gases → returns O₂-rich blood<br/>
                        <strong style={{color:"var(--gold)"}}>Each module</strong> has a clear input, defined job, and predictable output.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pullquote">
                <div className="pq-text">"The pattern is always the same: specialist units, clear handoffs, composable results. AI modularity is just this same ancient pattern — applied to creative tasks."</div>
                <div className="pq-attr">Systems Thinking Principle</div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: AI MODULES ─── */}
          {tab===2 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">04</div>
                <div className="sec-head">
                  <div className="sec-kicker">The Building Blocks</div>
                  <h2>Meet the AI <i>Modules</i></h2>
                  <p className="sec-sub">Six specialised AI modules used in art, media and design — each with a defined input, a single job, and a specific output.</p>
                </div>
              </div>

              <div className="g2 mt20">
                {MODULES_DATA.map((m,i) => (
                  <div key={i} className="card" style={{borderTop:`3px solid ${m.color}`,paddingTop:"20px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:"14px"}}>
                      <div style={{
                        width:"52px",height:"52px",background:m.color,flexShrink:0,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px"
                      }}>{m.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"8px",letterSpacing:"2px",color:m.color,fontWeight:"700",marginBottom:"3px"}}>{m.label} · {m.role}</div>
                        <div className="card-hd" style={{marginBottom:"8px"}}>{m.name}</div>
                        <p style={{marginBottom:"12px"}}>{m.desc}</p>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                          <div style={{padding:"8px",background:"rgba(44,95,130,.06)",border:"1px solid rgba(44,95,130,.15)"}}>
                            <div style={{fontSize:"8px",letterSpacing:"1.5px",color:"var(--sky)",fontWeight:"700",marginBottom:"4px"}}>ACCEPTS</div>
                            <div style={{fontSize:"11px",color:"var(--ink2)"}}>{m.in}</div>
                          </div>
                          <div style={{padding:"8px",background:"rgba(45,80,22,.06)",border:"1px solid rgba(45,80,22,.15)"}}>
                            <div style={{fontSize:"8px",letterSpacing:"1.5px",color:"var(--forest)",fontWeight:"700",marginBottom:"4px"}}>PRODUCES</div>
                            <div style={{fontSize:"11px",color:"var(--ink2)"}}>{m.out}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rule" />

              <div className="card mt20">
                <div className="card-hd">🔌 Module Compatibility: What Connects to What</div>
                <p style={{marginBottom:"16px"}}>For two modules to connect, the <strong>output format</strong> of Module A must match the <strong>input format</strong> expected by Module B.</p>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px",minWidth:"480px"}}>
                    <thead>
                      <tr style={{background:"var(--cream2)"}}>
                        {["Module","Accepts","Produces","Can Feed Into"].map(h=>(
                          <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:"9px",letterSpacing:"2px",color:"var(--terra)",fontWeight:"700",textTransform:"uppercase",borderBottom:"2px solid var(--ink)"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Text AI (ChatGPT)","Your rough idea","Detailed text prompt","Image AI · Music AI · Voice AI · Design AI"],
                        ["Image AI (DALL·E)","Text description","PNG / JPG image","Video AI · Design AI"],
                        ["Image AI (Midjourney)","Text + style params","High-res image","Video AI · Design AI"],
                        ["Video AI (Runway)","Image + motion text","MP4 video","Editing tools"],
                        ["Music AI (Suno)","Lyrics + style tags","Full audio song","Video AI · Editing tools"],
                        ["Voice AI (ElevenLabs)","Text script","WAV voiceover","Video AI · Editing tools"],
                      ].map((r,i)=>(
                        <tr key={i} style={{borderBottom:"1px solid var(--border)",background:i%2===0?"white":"var(--cream)"}}>
                          {r.map((cell,j)=>(
                            <td key={j} style={{padding:"9px 14px",color:j===0?"var(--ink)":j===1?"var(--sky)":j===2?"var(--forest)":"var(--slate2)",lineHeight:1.5}}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live anatomy visualiser */}
              <div className="card mt20">
                <div className="card-hd">⚡ Live Module Anatomy — Watch the Pipeline Run</div>
                <p style={{marginBottom:"16px"}}>Click the button to see a 3-module Text → Image → Video pipeline execute in real time.</p>

                <div className="anatomy-wrap">
                  <div className="anodes">
                    {MODULES_DATA.slice(0,3).map((m,i) => (
                      <>
                        <div key={i} className={`anode${animStep===i?" act":""}`}>
                          <span className="anode-icon">{m.icon}</span>
                          <div className="anode-name">{m.name}</div>
                          <div className="anode-type">{m.role}</div>
                          <div className={`anode-status ${animStep<i?"st-idle":animStep===i?"st-run":"st-done"}`}>
                            {animStep<i?"○ Standby":animStep===i?"● Running":"✓ Complete"}
                          </div>
                        </div>
                        {i<2 && (
                          <div key={`a${i}`} className="arr-conn" style={{color:animStep>i?"#86efac":"rgba(255,255,255,.2)"}}>›</div>
                        )}
                      </>
                    ))}
                  </div>
                  {animStep>=3 && (
                    <div style={{marginTop:"14px",padding:"12px",background:"rgba(134,239,172,.08)",border:"1px solid rgba(134,239,172,.2)",position:"relative",zIndex:1}}>
                      <div style={{fontSize:"10px",color:"#86efac",fontWeight:"700",letterSpacing:"1px"}}>✓ PIPELINE COMPLETE · Text → Image → Video produced</div>
                    </div>
                  )}
                </div>

                <div style={{marginTop:"14px",display:"flex",gap:"10px"}}>
                  <button className="btn" onClick={runAnatomy} disabled={animRunning}>
                    {animRunning ? "⏳ Running..." : "▶ Run Pipeline Animation"}
                  </button>
                  <button className="btn-outline" onClick={() => setAnimStep(-1)}>Reset</button>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: HOW IT WORKS ─── */}
          {tab===3 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">05</div>
                <div className="sec-head">
                  <div className="sec-kicker">Technical Detail</div>
                  <h2>How Each Module <i>Works Inside</i></h2>
                  <p className="sec-sub">A look at the internal mechanics of the three most common AI modules — what actually happens between input and output.</p>
                </div>
              </div>

              {/* Text AI internals */}
              <div className="card" style={{borderLeft:"4px solid var(--sky)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>💬</span> Inside Text AI (Large Language Model)</div>
                <div className="step-io">
                  <div className="step-box">
                    <div className="sb-lbl sb-in">Input</div>
                    <div className="sb-val">Your rough idea: "a robot in a forest"</div>
                  </div>
                  <div className="step-box">
                    <div className="sb-lbl sb-out">Output</div>
                    <div className="sb-val">Expanded prompt with style, lighting, camera, mood</div>
                  </div>
                </div>
                <p style={{marginBottom:"12px"}}>A Large Language Model (LLM) was trained on billions of web pages, books and articles. It learned the statistical patterns of language — which words appear together, which descriptions lead to which kinds of imagery.</p>
                <div style={{padding:"14px",background:"var(--cream2)",border:"1px dashed var(--border)"}}>
                  <div style={{fontSize:"10px",color:"var(--terra)",letterSpacing:"2px",fontWeight:"700",marginBottom:"8px"}}>WHAT HAPPENS STEP BY STEP</div>
                  {["Your text is split into tokens (small word-pieces)", "Each token is converted into a list of 768 numbers called an embedding", "The model processes these numbers through 96+ layers of neural network calculations", "Each layer adds more contextual understanding", "The final layer predicts the most likely next tokens — building the response word by word"].map((s,i)=>(
                    <div key={i} style={{display:"flex",gap:"10px",marginBottom:"6px",fontSize:"11px",color:"var(--slate)"}}>
                      <span style={{color:"var(--sky)",fontWeight:"700",flexShrink:0}}>{i+1}.</span>{s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Image AI internals */}
              <div className="card mt16" style={{borderLeft:"4px solid var(--terra)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🖼️</span> Inside Image AI (Diffusion Model)</div>
                <div className="step-io">
                  <div className="step-box">
                    <div className="sb-lbl sb-in">Input</div>
                    <div className="sb-val">Detailed text description from Text AI module</div>
                  </div>
                  <div className="step-box">
                    <div className="sb-lbl sb-out">Output</div>
                    <div className="sb-val">1024×1024 pixel PNG image matching the description</div>
                  </div>
                </div>
                <p style={{marginBottom:"12px"}}>Image AI uses a technique called <strong>diffusion</strong>. The idea is counterintuitive but powerful: instead of drawing an image from a blank canvas, the AI starts with complete visual chaos and gradually removes the noise until a coherent image emerges.</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"8px",margin:"16px 0"}}>
                  {["📺 Pure\nNoise","▒ Rough\nBlobs","░ Fuzzy\nShapes","🌫️ Soft\nForms","🔵 Clear\nElements","🖼️ Finished\nImage"].map((s,i)=>(
                    <div key={i} style={{textAlign:"center",padding:"10px 4px",background:i===5?"rgba(45,80,22,.08)":"var(--cream2)",border:`1px solid ${i===5?"var(--forest)":"var(--border)"}`,transition:"all .3s"}}>
                      <div style={{fontSize:"18px",marginBottom:"4px",whiteSpace:"pre-line"}}>{s}</div>
                      <div style={{fontSize:"8px",color:"var(--slate2)",fontWeight:"700"}}>{`Step ${Math.round(i*(50/5)+1)}/50`}</div>
                    </div>
                  ))}
                </div>
                <div className="step-explain">
                  <strong style={{color:"var(--gold)"}}>The darkroom analogy:</strong> Imagine a photographic darkroom where a print starts completely black and slowly the image emerges as the developer works. Diffusion AI works the same way — the image is already "in there", and the model's job is to reveal it by removing the noise guided by your text prompt.
                </div>
              </div>

              {/* Video AI internals */}
              <div className="card mt16" style={{borderLeft:"4px solid var(--forest)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🎬</span> Inside Video AI (Temporal Diffusion)</div>
                <div className="step-io">
                  <div className="step-box">
                    <div className="sb-lbl sb-in">Input</div>
                    <div className="sb-val">Static keyframe image + motion description text</div>
                  </div>
                  <div className="step-box">
                    <div className="sb-lbl sb-out">Output</div>
                    <div className="sb-val">24fps video clip (typically 4–8 seconds, MP4)</div>
                  </div>
                </div>
                <p style={{marginBottom:"12px"}}>Video AI extends the diffusion concept across time. The still image is <strong>Frame 0</strong>. The model then predicts Frames 1, 2, 3… through to Frame 96 (for a 4-second 24fps clip) — each slightly different from the last, creating the illusion of motion.</p>
                <div style={{display:"flex",gap:"8px",alignItems:"center",overflowX:"auto",padding:"12px",background:"var(--cream2)",border:"1px solid var(--border)"}}>
                  {["🖼️ Frame 0\n(your image)","→","🎞️ Frame 12","→","🎞️ Frame 24","→","🎞️ Frame 48","→","🎞️ Frame 96\n(4 seconds)"].map((f,i)=>(
                    <div key={i} style={{
                      textAlign:"center",fontSize:"11px",fontWeight:i===0||i===8?"700":"400",
                      color:i===0?"var(--terra)":i===8?"var(--forest)":i%2!==0?"var(--cream3)":"var(--slate)",
                      flexShrink:0,whiteSpace:"pre-line",lineHeight:"1.4"
                    }}>{f}</div>
                  ))}
                </div>
                <div className="step-explain" style={{marginTop:"12px"}}>
                  <strong style={{color:"var(--gold)"}}>Motion guidance:</strong> Text like "leaves gently falling" tells the model which pixel regions should change between frames and in what direction. "Camera push-in" instructs every element to grow slightly larger each frame, simulating a zoom.
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 4: EXAMPLES ─── */}
          {tab===4 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">06</div>
                <div className="sec-head">
                  <div className="sec-kicker">Case Studies</div>
                  <h2>Three Complete <i>Pipeline Examples</i></h2>
                  <p className="sec-sub">Step-by-step walkthroughs — every input, every output, every decision explained.</p>
                </div>
              </div>

              {/* example selector */}
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"24px"}}>
                {EXAMPLES.map((e,i) => (
                  <button key={i}
                    onClick={() => { setExIdx(i); setExStep(0); }}
                    style={{
                      padding:"10px 18px",border:`2px solid ${exIdx===i?e.color:"var(--border)"}`,
                      background: exIdx===i?e.color:"white",
                      color: exIdx===i?"white":"var(--slate)",
                      fontFamily:"'Courier Prime',monospace",fontSize:"11px",fontWeight:"700",
                      cursor:"pointer",transition:"all .2s",letterSpacing:".5px",
                      display:"flex",alignItems:"center",gap:"8px",
                    }}>
                    {e.emoji} {e.title}
                  </button>
                ))}
              </div>

              {/* example visualiser */}
              <div className="card" style={{borderTop:`3px solid ${curEx.color}`}}>
                <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"20px"}}>
                  <span style={{fontSize:"40px"}}>{curEx.emoji}</span>
                  <div>
                    <div style={{fontSize:"9px",letterSpacing:"2px",color:curEx.color,fontWeight:"700",marginBottom:"4px"}}>PIPELINE CASE STUDY</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:"700"}}>{curEx.title}</div>
                    <div style={{fontSize:"11px",color:"var(--slate2)",marginTop:"2px"}}>{curEx.chain.length} modules · {curEx.chain.map(c=>c.tool).join(" → ")}</div>
                  </div>
                </div>

                {/* module strip */}
                <div style={{display:"flex",overflow:"hidden",border:"1px solid var(--border)",marginBottom:"20px"}}>
                  {curEx.chain.map((c,i) => (
                    <div key={i}
                      onClick={() => setExStep(i)}
                      style={{
                        flex:1,padding:"12px 10px",textAlign:"center",cursor:"pointer",
                        background: exStep===i?curEx.color:"white",
                        color: exStep===i?"white":"var(--slate)",
                        borderRight: i<curEx.chain.length-1?"1px solid var(--border)":undefined,
                        transition:"all .2s",
                      }}>
                      <div style={{fontSize:"20px",marginBottom:"4px"}}>{c.icon}</div>
                      <div style={{fontSize:"10px",fontWeight:"700"}}>{c.tool}</div>
                      <div style={{fontSize:"9px",opacity:.7,marginTop:"2px"}}>Step {i+1}</div>
                    </div>
                  ))}
                </div>

                {/* current step */}
                {(() => {
                  const s = curEx.chain[exStep];
                  return (
                    <div className="fade" key={`${exIdx}-${exStep}`}>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:"20px",fontWeight:"700",marginBottom:"16px",color:curEx.color}}>
                        Step {exStep+1}: {s.act}
                      </div>

                      <div className="io-row">
                        <div className="io-panel io-in">
                          <div className="io-lbl io-lbl-in">▶ Input</div>
                          <div className="io-val" style={{whiteSpace:"pre-line",fontSize:"11px"}}>{s.inp}</div>
                        </div>
                        <div className="io-sep">⚡</div>
                        <div className="io-panel io-out">
                          <div className="io-lbl io-lbl-out">◀ Output</div>
                          <div className="io-val" style={{whiteSpace:"pre-line",fontSize:"11px"}}>{s.out}</div>
                        </div>
                      </div>

                      {/* visual representation */}
                      <div className="vis-canvas mt16">
                        {exStep===0 && (
                          <div className="vis-art">
                            💬✍️📝
                            <div style={{fontSize:"14px",color:"rgba(255,255,255,.5)",marginTop:"12px",fontFamily:"'Courier Prime',monospace"}}>TEXT MODULE PROCESSING</div>
                          </div>
                        )}
                        {(exStep===1 || exStep===2) && (
                          <div style={{width:"100%"}}>
                            <div className="vis-grid">
                              {(pixelArt.length ? pixelArt : genPixels(1)).map((c,i) => (
                                <div key={i} className="vis-cell" style={{background:c}} />
                              ))}
                            </div>
                          </div>
                        )}
                        {exStep===3 && (
                          <div className="vis-art">
                            🎵🎬🎙️
                          </div>
                        )}
                        <div className="vis-label">{s.tool} · {s.act}</div>
                      </div>

                      <div className="step-explain mt16">
                        <strong style={{color:"var(--gold)"}}>What this step does:</strong> The {s.tool} module receives the output from the previous step as its input. Every specific word or attribute in that input directly influences this module's output — which is then passed to the next module as their input.
                      </div>

                      <div style={{display:"flex",gap:"10px",marginTop:"16px"}}>
                        <button className="btn-outline" onClick={() => setExStep(Math.max(0,exStep-1))} disabled={exStep===0}>← Previous</button>
                        <button className="btn" onClick={() => setExStep(Math.min(curEx.chain.length-1,exStep+1))} disabled={exStep===curEx.chain.length-1}>Next Step →</button>
                      </div>

                      <div style={{marginTop:"12px"}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"10px",color:"var(--slate2)",marginBottom:"4px"}}>
                          <span>Progress</span><span>Step {exStep+1} of {curEx.chain.length}</span>
                        </div>
                        <div className="pbar">
                          <div className="pfill" style={{width:`${((exStep+1)/curEx.chain.length)*100}%`,background:curEx.color}} />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* all steps overview */}
              <div className="card mt20">
                <div className="card-hd">📋 All Steps at a Glance — {curEx.title}</div>
                <div className="stepper mt16">
                  {curEx.chain.map((s,i) => (
                    <div key={i} className="step-wrap" style={{cursor:"pointer"}} onClick={() => setExStep(i)}>
                      <div className="step-n" style={{borderColor:exStep===i?curEx.color:"var(--border)",color:exStep===i?curEx.color:"var(--border)"}}>{i+1}</div>
                      <div className="step-body">
                        <div className="step-title">{s.act}</div>
                        <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"8px"}}>
                          <span style={{fontSize:"20px"}}>{s.icon}</span>
                          <span style={{fontSize:"11px",fontWeight:"700",color:"var(--slate2)"}}>{s.tool}</span>
                        </div>
                        <div className="step-io">
                          <div className="step-box">
                            <div className="sb-lbl sb-in">INPUT</div>
                            <div className="sb-val" style={{fontSize:"10px"}}>{s.inp.slice(0,90)}{s.inp.length>90?"…":""}</div>
                          </div>
                          <div className="step-box">
                            <div className="sb-lbl sb-out">OUTPUT</div>
                            <div className="sb-val" style={{fontSize:"10px"}}>{s.out.slice(0,90)}{s.out.length>90?"…":""}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 5: BUILD A PIPELINE ─── */}
          {tab===5 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">07</div>
                <div className="sec-head">
                  <div className="sec-kicker">Interactive Activity</div>
                  <h2>Build Your Own <i>Module Pipeline</i></h2>
                  <p className="sec-sub">Select up to three AI modules and connect them into a pipeline. Click a slot, pick a tool, then run the chain.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-hd">🛠️ Your Pipeline</div>
                <div style={{display:"flex",alignItems:"stretch",gap:"8px",marginBottom:"16px",overflowX:"auto",paddingBottom:"6px"}}>
                  {slots.map((s,i) => (
                    <>
                      <div key={i}
                        className={`slot${s?" filled":""}${activeSlot===i?" sel":""}`}
                        onClick={() => setActiveSlot(activeSlot===i ? null : i)}>
                        {s ? (
                          <>
                            <div className="slot-icon">{s.icon}</div>
                            <div className="slot-nm" style={{color:"var(--terra)"}}>{s.name}</div>
                            <div className="slot-tp">{s.type} MODULE</div>
                            <div style={{fontSize:"9px",color:"var(--forest)",fontWeight:"700",marginTop:"6px"}}>OUT → {s.out}</div>
                          </>
                        ) : (
                          <>
                            <div className="slot-plus">+</div>
                            <div className="slot-nm" style={{color:"var(--border)"}}>Slot {i+1}</div>
                            <div className="slot-tp">tap to assign</div>
                          </>
                        )}
                      </div>
                      {i<2 && (
                        <div style={{display:"flex",alignItems:"center",color:slots[i]&&slots[i+1]?"var(--terra)":"var(--cream3)",fontSize:"22px",flexShrink:0,transition:"color .3s"}}>›</div>
                      )}
                    </>
                  ))}
                </div>

                {activeSlot !== null && (
                  <div className="picker">
                    <div className="picker-title">↓ Select Module for Slot {activeSlot+1}</div>
                    <div className="picker-grid">
                      {TOOLS.map(t => (
                        <button key={t.id}
                          className={`pick-btn${slots[activeSlot]?.id===t.id?" chosen":""}`}
                          onClick={() => {
                            const ns=[...slots]; ns[activeSlot]=t; setSlots(ns); setActiveSlot(null);
                          }}>
                          {t.icon} {t.name}
                        </button>
                      ))}
                      {slots[activeSlot] && (
                        <button className="pick-btn" style={{color:"var(--terra)",borderColor:"rgba(194,96,58,.3)"}}
                          onClick={() => { const ns=[...slots]; ns[activeSlot]=null; setSlots(ns); setActiveSlot(null); }}>
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div style={{marginTop:"16px",display:"flex",gap:"10px",flexWrap:"wrap"}}>
                  {slots.filter(Boolean).length >= 2 ? (
                    <button className="btn" onClick={runBuilder} disabled={buildRunning}>
                      {buildRunning ? "⏳ Executing..." : "▶ Execute Pipeline"}
                    </button>
                  ) : (
                    <div style={{fontSize:"11px",color:"var(--slate2)",paddingTop:"8px"}}>Assign at least 2 modules to execute the pipeline.</div>
                  )}
                  {slots.some(Boolean) && (
                    <button className="btn-outline" onClick={() => { setSlots([null,null,null]); setBuildLog([]); setBuildStep(-1); setActiveSlot(null); }}>
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Execution log */}
              {buildLog.length > 0 && (
                <div className="card mt16 fade">
                  <div className="card-hd" style={{color:"var(--forest)"}}>⚡ Pipeline Execution Log</div>
                  <div className="terminal">
                    {buildLog.map((l,i) => (
                      <span key={i} className={`log-line ${l.type}`}>{l.type==="ok"?"":l.type==="run"?"":"> "}{l.text}</span>
                    ))}
                    {buildRunning && <span className="log-line run">$ <span className="cursor">█</span></span>}
                  </div>
                </div>
              )}

              {/* Validation feedback */}
              {buildLog.length > 0 && !buildRunning && (() => {
                const filled = slots.filter(Boolean);
                const types = filled.map(t=>t.out);
                let warnings = [];
                if (types[0]==="image" && types[1]==="image") warnings.push("⚠ Two image modules in sequence — consider using a Text AI first to create a precise prompt for the Image AI.");
                if (types[0]==="video" && types[1]) warnings.push("⚠ Video AI works best as the final module — it doesn't typically output to other AI tools.");
                return (
                  <div className="card mt12 fade" style={{borderLeft:`4px solid ${warnings.length?"var(--gold)":"var(--forest)"}`}}>
                    <div className="card-hd">{warnings.length ? "⚠ Pipeline Review" : "✓ Pipeline Design Looks Good"}</div>
                    {warnings.length ? (
                      warnings.map((w,i) => <p key={i} style={{marginBottom:"6px"}}>{w}</p>)
                    ) : (
                      <p>Your module sequence follows correct data flow principles. Each module's output format is compatible with the next module's expected input.</p>
                    )}
                  </div>
                );
              })()}

              {/* Module reference */}
              <div className="card mt20">
                <div className="card-hd">📋 Quick Module Reference</div>
                <div className="g3 mt12">
                  {TOOLS.map(t => (
                    <div key={t.id} style={{padding:"14px",background:t.id===slots.find(s=>s?.id===t.id)?.id?"rgba(194,96,58,.06)":"var(--cream)",border:`1px solid ${t.id===slots.find(s=>s?.id===t.id)?.id?"var(--terra)":"var(--border)"}`,transition:"all .2s"}}>
                      <div style={{display:"flex",gap:"10px",marginBottom:"8px"}}>
                        <span style={{fontSize:"22px"}}>{t.icon}</span>
                        <div>
                          <div style={{fontSize:"12px",fontWeight:"700",color:t.col}}>{t.name}</div>
                          <div style={{fontSize:"9px",color:"var(--slate2)",letterSpacing:"1px"}}>{t.type} · OUT: {t.out}</div>
                        </div>
                      </div>
                      <div style={{fontSize:"10px",color:"var(--slate)",lineHeight:"1.7"}}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 6: LIVE DEMO ─── */}
          {tab===6 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">08</div>
                <div className="sec-head">
                  <div className="sec-kicker">Simulation</div>
                  <h2>Live <i>Pipeline Simulation</i></h2>
                  <p className="sec-sub">Enter any creative idea and watch it pass through a 3-module Text → Image → Video pipeline — with detailed output at each stage.</p>
                </div>
              </div>

              {/* 3-module status strip */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 40px 1fr 40px 1fr",gap:"4px",marginBottom:"20px",alignItems:"stretch"}}>
                {[
                  {icon:"💬",name:"Text AI",tool:"ChatGPT",k:0},
                  null,
                  {icon:"🖼️",name:"Image AI",tool:"DALL·E",k:1},
                  null,
                  {icon:"🎬",name:"Video AI",tool:"Runway ML",k:2},
                ].map((n,i) => n===null ? (
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"center",color:demoPhase>=Math.floor(i/2)?"var(--terra)":"var(--cream3)",fontSize:"22px",transition:"color .4s"}}>›</div>
                ) : (
                  <div key={i} style={{
                    padding:"16px",textAlign:"center",
                    background: demoPhase===n.k?"rgba(194,96,58,.06)":demoPhase>n.k?"rgba(45,80,22,.06)":"white",
                    border:`2px solid ${demoPhase===n.k?"var(--terra)":demoPhase>n.k?"var(--forest)":"var(--border)"}`,
                    transition:"all .4s",
                  }}>
                    <div style={{fontSize:"28px",marginBottom:"6px"}}>{n.icon}</div>
                    <div style={{fontSize:"12px",fontWeight:"700"}}>{n.name}</div>
                    <div style={{fontSize:"9px",color:"var(--slate2)",marginBottom:"6px"}}>{n.tool}</div>
                    <div style={{fontSize:"9px",fontWeight:"700",letterSpacing:"1px",color:demoPhase===n.k?"var(--terra)":demoPhase>n.k?"var(--forest)":"var(--slate2)"}}>
                      {demoPhase<n.k?"○ STANDBY":demoPhase===n.k?"● RUNNING":"✓ DONE"}
                    </div>
                  </div>
                ))}
              </div>

              {/* input */}
              <div className="card" style={{borderTop:"3px solid var(--terra)"}}>
                <div className="card-hd">✍️ Your Creative Idea</div>
                <div className="io-panel io-in" style={{marginBottom:"14px"}}>
                  <div className="io-lbl io-lbl-in">▶ Enter Your Idea</div>
                  <textarea className="tinput" rows={3}
                    value={demoInput}
                    onChange={e => setDemoInput(e.target.value)}
                    placeholder="Describe any scene, mood, or concept you want to visualise..."
                  />
                </div>
                <button className="btn" onClick={runDemo} disabled={demoRunning || !demoInput.trim()}>
                  {demoRunning ? "⏳ Pipeline Running..." : "▶ Run Full Pipeline"}
                </button>
              </div>

              {/* output stages */}
              {demoOuts.some(Boolean) && (
                <div className="mt20" style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                  {[
                    {label:"Module 1 Output — Text AI",icon:"💬",col:"var(--sky)",k:0},
                    {label:"Module 2 Output — Image AI",icon:"🖼️",col:"var(--terra)",k:1},
                    {label:"Module 3 Output — Video AI",icon:"🎬",col:"var(--forest)",k:2},
                  ].map(p => demoOuts[p.k] && (
                    <div key={p.k} className="card fade" style={{borderLeft:`4px solid ${p.col}`}}>
                      <div className="card-hd" style={{color:p.col}}>
                        <span style={{fontSize:"20px"}}>{p.icon}</span>
                        {p.label}
                        {demoPhase>p.k && <span style={{color:"var(--forest)",fontSize:"10px",marginLeft:"auto",fontWeight:"700"}}>✓ Complete</span>}
                      </div>
                      {p.k===1 && demoPhase>=1 && (
                        <div className="vis-canvas" style={{marginBottom:"14px",minHeight:"130px"}}>
                          <div style={{width:"100%"}}>
                            <div className="vis-grid">
                              {pixelArt.map((c,i) => (
                                <div key={i} className="vis-cell" style={{background:c}} />
                              ))}
                            </div>
                          </div>
                          <div className="vis-label">Simulated image output</div>
                        </div>
                      )}
                      <div style={{
                        fontFamily:"'Courier Prime',monospace",fontSize:"11px",
                        background:"var(--cream)",padding:"14px",
                        border:"1px solid var(--border)",whiteSpace:"pre-wrap",lineHeight:"1.8",
                        color:"var(--ink2)"
                      }}>
                        {demoOuts[p.k]}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {demoPhase>=3 && (
                <div className="card mt16 fade" style={{background:"rgba(45,80,22,.06)",borderColor:"var(--forest)",textAlign:"center",padding:"36px 20px"}}>
                  <div style={{fontSize:"44px",marginBottom:"12px"}}>🎬</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"28px",fontWeight:"700",color:"var(--forest)",marginBottom:"10px"}}>Pipeline Complete</div>
                  <div style={{fontSize:"12px",color:"var(--slate)",lineHeight:"1.9",maxWidth:"480px",margin:"0 auto"}}>
                    Your idea passed through <strong>3 specialised modules</strong>:<br/>
                    Text AI expanded it → Image AI visualised it → Video AI animated it.<br/>
                    One sentence became a moving image.
                  </div>
                  <div style={{marginTop:"20px",display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
                    <button className="btn" onClick={() => { setDemoPhase(-1); setDemoOuts(["","",""]); }}>↺ Try Again</button>
                    <button className="btn-outline" onClick={() => setTab(5)}>Build Your Own →</button>
                  </div>
                </div>
              )}

              <div className="card mt20">
                <div className="card-hd">🗝️ Prompt Writing Tips for Better Module Outputs</div>
                <div className="g2 mt12">
                  {[
                    {tip:"Name a visual style",ex:'"watercolour", "35mm film", "ink illustration", "oil painting"'},
                    {tip:"Describe the lighting",ex:'"golden hour", "dramatic shadows", "flat overcast light", "neon backlit"'},
                    {tip:"Use camera language",ex:'"wide establishing shot", "close-up", "bird\'s-eye view", "slow push-in"'},
                    {tip:"Define the mood",ex:'"melancholy", "triumphant and epic", "quiet and intimate", "eerie"'},
                    {tip:"Specify a colour palette",ex:'"warm ambers, ivory and sage", "monochrome with red accents"'},
                    {tip:"Add motion hints (for video)",ex:'"leaves drifting", "waves slowly rolling", "slow camera arc"'},
                  ].map((t,i) => (
                    <div key={i} style={{padding:"14px",background:"var(--cream2)",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:"11px",fontWeight:"700",color:"var(--terra)",marginBottom:"5px"}}>+ {t.tip}</div>
                      <div style={{fontSize:"10px",color:"var(--slate2)",fontStyle:"italic",lineHeight:"1.6"}}>{t.ex}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 7: QUIZ ─── */}
          {tab===7 && (
            <div className="fade">
              <div className="sec-rule">
                <div className="sec-num">09</div>
                <div className="sec-head">
                  <div className="sec-kicker">Assessment</div>
                  <h2>Knowledge <i>Assessment</i></h2>
                  <p className="sec-sub">Five questions covering AI modularity, module design principles and pipeline mechanics.</p>
                </div>
              </div>

              {!qdone ? (
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                    <span className="htag htag-s">Question {qi+1} of {QUIZ.length}</span>
                    <span className="htag htag-f">Score: {qsc}/{qi+(qsel!==null?1:0)}</span>
                  </div>
                  <div className="pbar" style={{marginBottom:"24px"}}>
                    <div className="pfill" style={{width:`${(qi/QUIZ.length)*100}%`}} />
                  </div>

                  <div className="card" style={{borderTop:"3px solid var(--terra)"}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"18px",fontWeight:"700",lineHeight:"1.5",marginBottom:"22px",color:"var(--ink)"}}>
                      {QUIZ[qi].q}
                    </div>
                    {QUIZ[qi].opts.map((o,i) => (
                      <div key={i}
                        className={`q-opt${qsel!==null?(i===QUIZ[qi].a?" ok":i===qsel?" bad":""):""}`}
                        onClick={() => handleQ(i)}>
                        <div className="q-letter">{["A","B","C","D"][i]}</div>
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>

                  {qsel !== null && (
                    <div className="card fade" style={{marginTop:"12px"}}>
                      <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                        <span style={{fontSize:"24px"}}>{qsel===QUIZ[qi].a?"🎯":"📖"}</span>
                        <div>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"16px",fontWeight:"700",marginBottom:"8px",color:qsel===QUIZ[qi].a?"var(--forest)":"var(--terra)"}}>
                            {qsel===QUIZ[qi].a?"Correct." : "Not quite — here is the explanation:"}
                          </div>
                          <div className="q-explain">{QUIZ[qi].exp}</div>
                        </div>
                      </div>
                      <button className="btn mt16" onClick={nextQ}>
                        {qi+1<QUIZ.length ? "Next Question →" : "View Final Score →"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="fade">
                  <div className="card" style={{textAlign:"center",padding:"44px 24px",borderTop:"4px solid var(--terra)"}}>
                    <div style={{fontSize:"56px",marginBottom:"14px"}}>
                      {qsc===5?"🏆":qsc>=4?"🎯":qsc>=3?"📖":"✍️"}
                    </div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:"48px",fontWeight:"900",color:"var(--terra)",lineHeight:1,marginBottom:"8px"}}>
                      {qsc} / 5
                    </div>
                    <div style={{fontSize:"13px",color:"var(--slate)",lineHeight:"1.8",marginBottom:"24px",maxWidth:"440px",margin:"0 auto 24px"}}>
                      {qsc===5?"Perfect result — you have a complete understanding of AI modularity.":
                       qsc>=4?"Excellent — you understand the core principles. One concept to revisit.":
                       qsc>=3?"Good foundation. Review the How It Works and AI Modules sections.":
                       "Revisit the lesson, particularly the Examples and Module sections, then retry."}
                    </div>
                    <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
                      <button className="btn" onClick={resetQ}>↺ Retry</button>
                      <button className="btn-outline" onClick={() => setTab(0)}>← Review Lesson</button>
                      <button className="btn-outline" onClick={() => setTab(4)}>View Examples</button>
                    </div>
                  </div>

                  <div className="card mt20">
                    <div className="card-hd">📋 Core Takeaways</div>
                    {[
                      "Modularity means dividing a complex task into specialised, independent units that each do one job well",
                      "Every AI module has a defined input format and a defined output format — this is what makes connection possible",
                      "Image AI uses diffusion: starting from random noise, progressively refined by your text prompt over 50 steps",
                      "The output of each module becomes the input of the next — this information flow is the essence of a pipeline",
                      "Defining style, colour, and mood in the first module ensures visual consistency throughout the entire chain",
                      "Any module can be swapped for another performing the same role — this replaceability is the power of modularity",
                    ].map((p,i) => (
                      <div key={i} style={{display:"flex",gap:"10px",marginBottom:"10px",fontSize:"12px",color:"var(--slate)",lineHeight:"1.7"}}>
                        <span style={{color:"var(--terra)",fontWeight:"700",flexShrink:0}}>→</span>{p}
                      </div>
                    ))}
                  </div>

                  <div className="card mt16">
                    <div className="card-hd">🗺️ AI Modularity in the Real World</div>
                    <div className="tl mt12">
                      {[
                        {yr:"Film Studio",nm:"Pixar / Industrial Light & Magic",info:"Uses modular AI pipelines for procedural animation, lighting simulation and crowd generation — each module handles one visual system."},
                        {yr:"Music Label",nm:"AI-Assisted Record Production",info:"Separate modules for stem separation, mastering, vocal pitch correction and lyric generation — combined into a single production workflow."},
                        {yr:"Advertising",nm:"Global Campaign Creation",info:"Text AI generates copy, Image AI produces visuals, Design AI assembles final ads in multiple languages and formats — simultaneously."},
                        {yr:"Game Development",nm:"Procedural World Generation",info:"Terrain modules, texture modules, NPC behaviour modules, dialogue modules — all independently developed and assembled into a living game world."},
                        {yr:"Social Media",nm:"Content Automation",info:"Script → Voice → Image → Video → Caption pipeline allows one person to produce a week of content in an afternoon."},
                      ].map((t,i) => (
                        <div key={i} className="tl-item">
                          <div className="tl-dot" style={{background:["var(--terra)","var(--forest)","var(--sky)","var(--gold)","var(--terra)"][i]}} />
                          <div className="tl-yr">{t.yr}</div>
                          <div className="tl-nm">{t.nm}</div>
                          <div className="tl-info">{t.info}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>

        <footer className="footer z1">
          The Modular AI Review · AI in Art, Media &amp; Design<br/>
          <span>One module. One job. Connected, they build anything.</span>
        </footer>

      </div>
    </>
  );
}
