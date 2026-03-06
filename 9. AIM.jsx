import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN: Bauhaus Art Studio × Living Gallery Notebook
   Palette: Deep Plum · Chalk White · Electric Lime · Warm Coral · Gold Leaf
   Fonts: Fraunces (optical-size serif display) + Fragment Mono (body/code)
   Vibe: An artist's sketchbook comes alive — hand-crafted, geometric, bold
═══════════════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Fragment+Mono:ital@0;1&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --plum:   #1e0f2e;
  --plum2:  #2d1845;
  --plum3:  #3d235a;
  --chalk:  #f7f3ec;
  --chalk2: #ede8df;
  --chalk3: #ddd7cc;
  --lime:   #c8ff3e;
  --lime2:  #a8e820;
  --coral:  #ff6b4a;
  --coral2: #e85535;
  --gold:   #f5c842;
  --gold2:  #d4a820;
  --rose:   #e8407a;
  --sky:    #4ab8e8;
  --ink:    #0d0818;
  --muted:  #a090c0;
  --border: rgba(247,243,236,.1);
  --border2:rgba(200,255,62,.2);
  --bcard:  rgba(247,243,236,.06);
}

html{scroll-behavior:smooth}

.root{
  font-family:'Fragment Mono',monospace;
  background:var(--plum);
  color:var(--chalk);
  min-height:100vh;
  overflow-x:hidden;
  position:relative;
}

/* ── geometric tile background ── */
.root::before{
  content:'';
  position:fixed;inset:0;
  background-image:
    linear-gradient(45deg,rgba(200,255,62,.018) 25%,transparent 25%),
    linear-gradient(-45deg,rgba(200,255,62,.018) 25%,transparent 25%),
    linear-gradient(45deg,transparent 75%,rgba(200,255,62,.018) 75%),
    linear-gradient(-45deg,transparent 75%,rgba(200,255,62,.018) 75%);
  background-size:60px 60px;
  background-position:0 0,0 30px,30px -30px,-30px 0;
  pointer-events:none;z-index:0;
}

.layer{position:relative;z-index:1}

/* ═══ HEADER BAND ═════════════════════════════════════════ */
.header-band{
  background:var(--lime);
  display:flex;align-items:center;gap:0;
  overflow:hidden;
}
.hb-block{
  padding:7px 18px;
  font-size:9px;letter-spacing:3px;font-weight:700;
  text-transform:uppercase;white-space:nowrap;
  border-right:2px solid rgba(0,0,0,.1);
}
.hb-black{background:var(--ink);color:var(--lime)}
.hb-lime{background:var(--lime);color:var(--ink)}
.hb-coral{background:var(--coral);color:white;border-color:rgba(255,255,255,.2)}
.hb-scroll{
  overflow:hidden;flex:1;
  background:var(--lime);color:var(--ink);
  padding:7px 0;
  font-size:9px;letter-spacing:2px;font-weight:700;
}
.hb-track{
  display:inline-flex;gap:48px;
  animation:marquee 25s linear infinite;
  white-space:nowrap;
}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* ═══ MASTHEAD ════════════════════════════════════════════ */
.mast{
  padding:28px 28px 0;
  position:sticky;top:0;z-index:100;
  background:var(--plum);
  border-bottom:2px solid var(--lime);
}
.mast-top{
  display:flex;align-items:center;justify-content:space-between;
  padding-bottom:14px;gap:16px;
}
.logo{
  display:flex;align-items:baseline;gap:10px;
}
.logo-main{
  font-family:'Fraunces',serif;
  font-size:clamp(18px,3vw,26px);
  font-weight:900;
  letter-spacing:-1px;
  color:var(--chalk);
}
.logo-main em{font-style:italic;color:var(--lime)}
.logo-sub{
  font-size:9px;letter-spacing:3px;color:var(--muted);
  text-transform:uppercase;font-weight:700;
}
.mast-pills{display:flex;gap:6px;flex-wrap:wrap}
.mpill{
  font-size:8px;letter-spacing:2px;font-weight:700;
  padding:4px 9px;border:1px solid;text-transform:uppercase;
  border-radius:0;
}
.nav-strip{
  display:flex;gap:0;overflow-x:auto;
  scrollbar-width:none;border-top:1px solid var(--border);
}
.nav-strip::-webkit-scrollbar{display:none}
.nbtn{
  background:transparent;border:none;border-right:1px solid var(--border);
  color:var(--muted);
  font-family:'Fragment Mono',monospace;
  font-size:10px;font-weight:700;letter-spacing:.5px;
  padding:10px 14px;cursor:pointer;white-space:nowrap;
  transition:all .2s;display:flex;align-items:center;gap:6px;
}
.nbtn:hover{color:var(--chalk);background:var(--bcard)}
.nbtn.on{
  background:var(--lime);color:var(--ink);
  font-weight:700;
}

/* ═══ HERO ════════════════════════════════════════════════ */
.hero{
  display:grid;grid-template-columns:1.1fr 1fr;gap:0;
  max-width:1100px;margin:0 auto;
  border-bottom:2px solid var(--border);
}
@media(max-width:700px){.hero{grid-template-columns:1fr}}
.hero-left{
  padding:60px 40px 52px 28px;
  border-right:1px solid var(--border);
}
.hero-kicker{
  display:inline-flex;align-items:center;gap:8px;
  font-size:9px;letter-spacing:3px;color:var(--lime);
  font-weight:700;text-transform:uppercase;margin-bottom:20px;
}
.hero-kicker::before{content:'';width:24px;height:2px;background:var(--lime)}
.hero h1{
  font-family:'Fraunces',serif;
  font-size:clamp(36px,5.5vw,68px);
  font-weight:900;line-height:.95;
  letter-spacing:-2px;margin-bottom:24px;
}
.hero h1 .l1{display:block;color:var(--chalk)}
.hero h1 .l2{display:block;color:var(--lime);font-style:italic}
.hero h1 .l3{display:block;color:var(--coral)}
.hero-body{
  font-size:12px;line-height:1.9;color:var(--muted);
  max-width:420px;margin-bottom:24px;
}
.hero-body strong{color:var(--chalk)}
.tag-row{display:flex;flex-wrap:wrap;gap:6px}
.tag{
  font-size:9px;letter-spacing:1.5px;font-weight:700;
  padding:5px 11px;border:1px solid;text-transform:uppercase;
  border-radius:0;
}
.tg-l{color:var(--lime);border-color:rgba(200,255,62,.4);background:rgba(200,255,62,.07)}
.tg-c{color:var(--coral);border-color:rgba(255,107,74,.4);background:rgba(255,107,74,.07)}
.tg-g{color:var(--gold);border-color:rgba(245,200,66,.4);background:rgba(245,200,66,.07)}
.tg-s{color:var(--sky);border-color:rgba(74,184,232,.4);background:rgba(74,184,232,.07)}

.hero-right{
  padding:48px 28px 48px 32px;
  display:flex;flex-direction:column;gap:0;
}
.mosaic-preview{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:3px;flex:1;margin-bottom:16px;
  border:1px solid var(--border);
  background:var(--border);
}
.mp-cell{
  aspect-ratio:1;transition:all .5s ease;cursor:pointer;
}
.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.stat-box{
  background:var(--bcard);border:1px solid var(--border);
  padding:14px 12px;text-align:center;
}
.sb-n{
  font-family:'Fraunces',serif;
  font-size:28px;font-weight:900;color:var(--lime);
  line-height:1;margin-bottom:4px;
}
.sb-l{font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;line-height:1.4}

/* ═══ PAGE ════════════════════════════════════════════════ */
.pg{max-width:1100px;margin:0 auto;padding:52px 28px 100px}

/* ═══ SECTION HEADER ══════════════════════════════════════ */
.sh{margin-bottom:36px;display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:baseline}
.sh-n{
  font-family:'Fraunces',serif;font-size:72px;font-weight:900;
  color:rgba(200,255,62,.12);line-height:1;user-select:none;
  letter-spacing:-3px;
}
.sh-txt{}
.sh-eye{
  font-size:9px;letter-spacing:3px;color:var(--lime);
  font-weight:700;text-transform:uppercase;margin-bottom:8px;
  display:flex;align-items:center;gap:8px;
}
.sh-eye::before{content:'';width:16px;height:2px;background:var(--lime);flex-shrink:0}
.sh h2{
  font-family:'Fraunces',serif;
  font-size:clamp(22px,3.5vw,40px);
  font-weight:700;line-height:1.05;letter-spacing:-1px;
}
.sh h2 em{font-style:italic;color:var(--lime)}
.sh p{font-size:12px;color:var(--muted);line-height:1.85;margin-top:8px;max-width:580px}

/* ═══ CARD ════════════════════════════════════════════════ */
.card{
  background:var(--bcard);
  border:1px solid var(--border);
  padding:24px;margin-bottom:18px;
  position:relative;overflow:hidden;
  transition:border-color .3s,transform .2s;
}
.card::after{
  content:'';
  position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--lime),transparent);
  opacity:0;transition:opacity .3s;
}
.card:hover{border-color:rgba(200,255,62,.25);transform:translateY(-2px)}
.card:hover::after{opacity:1}
.card-hd{
  font-family:'Fraunces',serif;
  font-size:16px;font-weight:700;
  margin-bottom:12px;
  display:flex;align-items:center;gap:10px;
}
.card p,.card li{font-size:12px;color:var(--muted);line-height:1.9}
.card strong{color:var(--chalk)}
.card ul{padding-left:18px}
.card li{margin-bottom:6px}

/* ═══ GRID ════════════════════════════════════════════════ */
.g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.g4{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}
.mt8{margin-top:8px}.mt12{margin-top:12px}.mt16{margin-top:16px}
.mt20{margin-top:20px}.mt24{margin-top:24px}.mt28{margin-top:28px}

/* ═══ ART CANVAS ══════════════════════════════════════════ */
.art-canvas{
  background:var(--ink);
  border:1px solid rgba(255,255,255,.08);
  position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
}
.art-canvas::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse at 20% 80%,rgba(200,255,62,.06) 0%,transparent 50%),
    radial-gradient(ellipse at 80% 20%,rgba(255,107,74,.06) 0%,transparent 50%);
}

/* ═══ MOSAIC GRID ═════════════════════════════════════════ */
.mosaic{
  display:grid;gap:3px;
  background:rgba(255,255,255,.04);
  border:1px solid var(--border);
}
.mcell{
  aspect-ratio:1;
  transition:all .4s ease;
  cursor:pointer;
  position:relative;overflow:hidden;
}
.mcell:hover{transform:scale(1.08);z-index:2;border-radius:0}
.mcell::after{
  content:'';position:absolute;inset:0;
  background:rgba(255,255,255,0);
  transition:background .2s;
}
.mcell:hover::after{background:rgba(255,255,255,.08)}

/* ═══ MODULE BLOCK ════════════════════════════════════════ */
.mod{
  border:2px solid var(--border);
  background:var(--bcard);
  padding:20px;cursor:default;
  transition:all .25s;
  position:relative;
}
.mod::before{
  content:attr(data-n);
  position:absolute;top:-12px;left:16px;
  background:var(--lime);color:var(--ink);
  font-size:8px;letter-spacing:2px;font-weight:700;
  padding:2px 8px;text-transform:uppercase;
}
.mod:hover{border-color:var(--lime);box-shadow:4px 4px 0 rgba(200,255,62,.2)}
.mod-ico{font-size:32px;margin-bottom:10px}
.mod-name{
  font-family:'Fraunces',serif;font-size:15px;font-weight:700;
  margin-bottom:5px;color:var(--chalk);
}
.mod-role{font-size:10px;color:var(--muted);margin-bottom:10px;letter-spacing:.5px}
.mod-io{
  padding-top:10px;border-top:1px dashed var(--border);
  display:flex;flex-direction:column;gap:5px;
}
.mio-row{font-size:10px;display:flex;gap:6px}
.mio-in{color:var(--sky);font-weight:700}
.mio-out{color:var(--lime);font-weight:700}

/* ═══ IO STRIP ════════════════════════════════════════════ */
.io-strip{
  display:grid;grid-template-columns:1fr 44px 1fr;
  gap:10px;align-items:center;
}
.io-box{
  background:var(--bcard);border:1px solid var(--border);
  padding:16px;min-height:88px;
}
.io-lbl{font-size:8px;letter-spacing:2.5px;font-weight:700;text-transform:uppercase;margin-bottom:8px}
.io-in .io-lbl{color:var(--sky)}
.io-out .io-lbl{color:var(--lime)}
.io-val{font-size:11px;line-height:1.8;color:var(--chalk)}
.io-val.pulse{color:var(--coral);animation:pulse 1s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
.io-mid{text-align:center;font-size:22px;color:var(--coral)}
textarea.ta{
  width:100%;background:transparent;border:none;outline:none;
  color:var(--chalk);font-family:'Fragment Mono',monospace;
  font-size:11px;resize:none;line-height:1.8;
}

/* ═══ STEP ════════════════════════════════════════════════ */
.step-wrap{
  display:grid;grid-template-columns:56px 1fr;gap:16px;
  margin-bottom:28px;position:relative;
}
.step-wrap::after{
  content:'';position:absolute;left:27px;top:56px;bottom:-28px;
  width:2px;background:repeating-linear-gradient(
    to bottom,var(--lime) 0,var(--lime) 5px,transparent 5px,transparent 10px
  );
}
.step-wrap:last-child::after{display:none}
.step-n{
  width:56px;height:56px;border:2px solid var(--lime);
  display:flex;align-items:center;justify-content:center;
  font-family:'Fraunces',serif;font-size:24px;font-weight:900;
  color:var(--lime);flex-shrink:0;background:var(--bcard);
  position:relative;z-index:1;
}
.step-body{}
.step-title{
  font-family:'Fraunces',serif;font-size:18px;font-weight:700;
  color:var(--chalk);margin-bottom:8px;
}
.step-io2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:10px 0}
.sbox{padding:12px;border:1px solid var(--border);background:var(--bcard)}
.sbox-l{font-size:8px;letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-bottom:6px}
.sbl-in{color:var(--sky)}.sbl-out{color:var(--lime)}
.sbox-v{font-size:11px;color:var(--chalk);line-height:1.7}
.step-note{
  font-size:11px;color:var(--muted);line-height:1.85;
  padding:12px 14px;
  background:rgba(245,200,66,.06);border-left:3px solid var(--gold);
  margin-top:8px;
}

/* ═══ VISUAL PANEL ════════════════════════════════════════ */
.visual-panel{
  background:var(--ink);border:1px solid rgba(255,255,255,.08);
  padding:24px;min-height:200px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.vp-title{
  font-size:9px;letter-spacing:2px;color:rgba(255,255,255,.2);
  text-transform:uppercase;font-weight:700;
  position:absolute;top:12px;left:14px;
}
.vp-label{
  font-size:9px;letter-spacing:2px;color:rgba(255,255,255,.15);
  text-transform:uppercase;font-weight:700;
  position:absolute;bottom:12px;right:14px;
}

/* ═══ BUTTON ══════════════════════════════════════════════ */
.btn{
  background:var(--lime);color:var(--ink);border:none;
  font-family:'Fragment Mono',monospace;
  font-size:11px;font-weight:700;letter-spacing:1px;
  text-transform:uppercase;
  padding:11px 22px;cursor:pointer;
  transition:all .2s;display:inline-flex;align-items:center;gap:8px;
}
.btn:hover{background:var(--lime2);transform:translateY(-2px);box-shadow:0 6px 20px rgba(200,255,62,.25)}
.btn:active{transform:translateY(0)}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
.btn-ghost{
  background:transparent;border:2px solid var(--border);color:var(--chalk);
  font-family:'Fragment Mono',monospace;font-size:11px;font-weight:700;
  letter-spacing:1px;text-transform:uppercase;
  padding:10px 20px;cursor:pointer;transition:all .2s;
}
.btn-ghost:hover{border-color:var(--lime);color:var(--lime)}

/* ═══ PROGRESS ════════════════════════════════════════════ */
.pbar{height:3px;background:rgba(255,255,255,.07);overflow:hidden;margin-top:8px}
.pfill{height:100%;background:var(--lime);transition:width .6s ease}

/* ═══ PULLQUOTE ═══════════════════════════════════════════ */
.pq{
  padding:28px 32px;margin:28px 0;
  border-left:5px solid var(--lime);
  background:rgba(200,255,62,.04);
}
.pq-t{
  font-family:'Fraunces',serif;
  font-size:clamp(18px,2.5vw,24px);
  font-style:italic;line-height:1.45;
  color:var(--chalk);margin-bottom:8px;
}
.pq-a{font-size:9px;letter-spacing:2px;color:var(--muted);text-transform:uppercase;font-weight:700}

/* ═══ ART HISTORY STRIP ═══════════════════════════════════ */
.art-strip{
  display:flex;gap:0;overflow-x:auto;
  border:1px solid var(--border);
  scrollbar-width:none;margin:20px 0;
}
.art-strip::-webkit-scrollbar{display:none}
.art-era{
  flex:0 0 180px;padding:20px 16px;
  border-right:1px solid var(--border);
  transition:background .2s;cursor:default;
}
.art-era:hover{background:var(--bcard)}
.ae-yr{font-size:9px;letter-spacing:2px;color:var(--coral);font-weight:700;margin-bottom:6px}
.ae-nm{font-family:'Fraunces',serif;font-size:14px;font-weight:700;color:var(--chalk);margin-bottom:6px}
.ae-desc{font-size:10px;color:var(--muted);line-height:1.65}
.ae-art{font-size:32px;margin-bottom:8px}

/* ═══ QUIZ ════════════════════════════════════════════════ */
.qopt{
  border:1px solid var(--border);background:var(--bcard);
  padding:12px 16px;cursor:pointer;
  font-size:12px;transition:all .2s;margin-bottom:8px;
  display:flex;align-items:center;gap:12px;line-height:1.6;
  color:var(--chalk);
}
.qopt:hover{border-color:var(--lime);background:rgba(200,255,62,.05);color:var(--lime)}
.qopt.ok{background:rgba(200,255,62,.09);border-color:var(--lime);color:var(--lime)}
.qopt.bad{background:rgba(255,107,74,.09);border-color:var(--coral);color:var(--coral)}
.ql{
  width:28px;height:28px;flex-shrink:0;
  border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;font-family:'Fraunces',serif;
}
.q-exp{
  padding:14px 16px;
  background:rgba(245,200,66,.07);border-left:4px solid var(--gold);
  font-size:12px;color:var(--muted);line-height:1.9;margin-top:10px;
}
.q-exp strong{color:var(--chalk)}

/* ═══ TERM CARD ═══════════════════════════════════════════ */
.term{
  border:1px solid var(--border);background:var(--bcard);
  padding:18px;transition:all .25s;
}
.term:hover{border-color:rgba(200,255,62,.3);transform:translateY(-3px)}
.term-w{
  font-family:'Fraunces',serif;font-size:22px;font-weight:900;
  letter-spacing:-1px;margin-bottom:6px;
}
.term-d{font-size:11px;color:var(--muted);line-height:1.75}

/* ═══ COMPARISON ══════════════════════════════════════════ */
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--border);margin:16px 0}
@media(max-width:560px){.cmp{grid-template-columns:1fr}}
.cmp-col{background:var(--plum2);padding:20px}
.cmp-hd{font-size:9px;letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-bottom:14px;padding-bottom:8px;border-bottom:2px solid}
.cmp-item{display:flex;gap:8px;margin-bottom:8px;font-size:11px;color:var(--muted);line-height:1.7}

/* ═══ BUILDER ═════════════════════════════════════════════ */
.bslot{
  flex:1;min-width:130px;border:2px dashed var(--border);
  padding:18px 12px;text-align:center;cursor:pointer;
  transition:all .25s;background:var(--bcard);
}
.bslot:hover{border-color:var(--lime);background:rgba(200,255,62,.04)}
.bslot.filled{border-style:solid;border-color:var(--coral)}
.bslot.active{border-color:var(--lime);box-shadow:0 0 0 2px rgba(200,255,62,.2)}
.bs-ico{font-size:28px;margin-bottom:6px}
.bs-nm{font-size:11px;font-weight:700;color:var(--chalk);margin-bottom:2px}
.bs-tp{font-size:9px;color:var(--muted);letter-spacing:1px}

.picker{background:var(--plum2);border:1px solid var(--border);padding:14px;margin-top:10px}
.pk-t{font-size:9px;letter-spacing:2px;color:var(--lime);font-weight:700;text-transform:uppercase;margin-bottom:10px}
.pick-grid{display:flex;flex-wrap:wrap;gap:6px}
.pb{
  background:var(--bcard);border:1px solid var(--border);
  font-family:'Fragment Mono',monospace;font-size:11px;
  color:var(--chalk);padding:8px 12px;cursor:pointer;transition:all .2s;
  display:flex;align-items:center;gap:6px;
}
.pb:hover{border-color:var(--coral);color:var(--coral)}
.pb.sel{border-color:var(--coral);background:rgba(255,107,74,.08);color:var(--coral);font-weight:700}

/* ═══ LOG ═════════════════════════════════════════════════ */
.log{
  background:var(--ink);padding:14px 18px;
  font-size:11px;color:#80b090;line-height:2;
  max-height:190px;overflow-y:auto;
  border:1px solid rgba(255,255,255,.06);
}
.ll{display:block}
.ll.ok{color:var(--lime)}.ll.run{color:var(--coral)}.ll.info{color:rgba(255,255,255,.35)}
.cur{animation:blink .8s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

/* ═══ PIPELINE CHAIN ══════════════════════════════════════ */
.chain-row{display:flex;gap:0;overflow-x:auto;padding-bottom:6px}
.cnode{
  flex:1;min-width:130px;border:1px solid var(--border);
  padding:16px 12px;text-align:center;transition:all .3s;
  background:var(--bcard);position:relative;overflow:hidden;
}
.cnode.lit{
  border-color:var(--lime);background:rgba(200,255,62,.08);
  box-shadow:0 0 20px rgba(200,255,62,.1);
}
.cnode-num{font-size:8px;letter-spacing:2px;color:var(--muted);font-weight:700;margin-bottom:6px}
.cnode.lit .cnode-num{color:var(--lime)}
.cnode-ico{font-size:24px;margin-bottom:6px;display:block}
.cnode-nm{font-size:11px;font-weight:700;margin-bottom:3px}
.cnode-type{font-size:9px;color:var(--muted);letter-spacing:.5px}
.carr{
  display:flex;align-items:center;justify-content:center;
  padding:0 5px;color:var(--coral);font-size:18px;flex-shrink:0;
  background:rgba(255,255,255,.02);
  border-top:1px solid var(--border);border-bottom:1px solid var(--border);
}
.carr.lit{color:var(--lime);animation:blink2 1s infinite}
@keyframes blink2{0%,100%{opacity:1}50%{opacity:.3}}

/* ═══ ART DEMO CANVAS ═════════════════════════════════════ */
.ademo{
  display:grid;grid-template-columns:repeat(8,1fr);gap:2px;
  background:rgba(255,255,255,.04);border:1px solid var(--border);padding:3px;
}
.ademo-cell{aspect-ratio:1;transition:all .35s ease;cursor:pointer;position:relative}
.ademo-cell:hover{transform:scale(1.15);z-index:2}

/* ═══ MODULE ANATOMY ANIM ═════════════════════════════════ */
.anat{background:var(--ink);border:1px solid rgba(255,255,255,.08);padding:24px;overflow:hidden}
.anat-nodes{display:flex;align-items:stretch;gap:0;overflow-x:auto;padding-bottom:4px}
.anat-n{
  flex:1;min-width:120px;border:1px solid rgba(255,255,255,.1);
  padding:16px 12px;text-align:center;transition:all .35s;
}
.anat-n.active{border-color:var(--lime);background:rgba(200,255,62,.1);box-shadow:0 0 24px rgba(200,255,62,.12)}
.an-ico{font-size:26px;margin-bottom:6px;display:block}
.an-nm{font-size:11px;font-weight:700;color:white;margin-bottom:3px}
.an-tp{font-size:9px;color:rgba(255,255,255,.35);letter-spacing:1px;margin-bottom:6px}
.an-st{font-size:9px;letter-spacing:1.5px;font-weight:700;text-transform:uppercase}
.ast-idle{color:rgba(255,255,255,.25)}
.ast-run{color:var(--coral);animation:pulse 1s infinite}
.ast-done{color:var(--lime)}
.an-arr{
  display:flex;align-items:center;justify-content:center;
  padding:0 6px;color:rgba(255,255,255,.15);font-size:18px;flex-shrink:0;
  border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);
  transition:color .3s;
}
.an-arr.lit{color:var(--lime)}

/* ═══ LAYER DEMO ══════════════════════════════════════════ */
.layer-stack{position:relative;height:180px}
.layer-item{
  position:absolute;width:100%;
  border:1px dashed rgba(255,255,255,.15);
  display:flex;align-items:center;justify-content:center;
  font-size:32px;
  transition:all .5s ease;
}

/* ═══ FADE ════════════════════════════════════════════════ */
.fade{animation:fadeUp .4s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* ═══ DIVIDER ═════════════════════════════════════════════ */
.rule{height:1px;background:var(--border);margin:28px 0}
.rule-lime{height:2px;background:linear-gradient(90deg,var(--lime),transparent);margin:28px 0}

/* ═══ SCROLLBAR ═══════════════════════════════════════════ */
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--plum)}
::-webkit-scrollbar-thumb{background:var(--plum3)}

/* ═══ FOOTER ══════════════════════════════════════════════ */
.footer{
  border-top:2px solid var(--lime);
  padding:28px;text-align:center;
  font-size:9px;letter-spacing:2px;color:var(--muted);
  text-transform:uppercase;position:relative;z-index:1;
}
.footer span{color:var(--lime)}

/* ═══ RESPONSIVE ══════════════════════════════════════════ */
@media(max-width:560px){
  .io-strip{grid-template-columns:1fr}
  .io-mid{transform:rotate(90deg);margin:4px 0}
  .step-io2{grid-template-columns:1fr}
  .hero-left{padding:40px 20px 32px}
  .hero-right{padding:24px 20px}
  .pg{padding:36px 16px 80px}
}
`;

/* ══════════════════ DATA ════════════════════════════════ */
const PALETTE_ART = [
  "#c8ff3e","#ff6b4a","#f5c842","#4ab8e8","#e8407a",
  "#1e0f2e","#a8e820","#e85535","#d4a820","#2d7ab8",
  "#f7f3ec","#3d235a","#c8ff3e","#ff6b4a","#4ab8e8","#f5c842",
];

const MOSAIC_COLORS = [
  "#c8ff3e","#ff6b4a","#f5c842","#4ab8e8","#e8407a","#1e0f2e","#a8e820","#e85535",
  "#d4a820","#2d7ab8","#f7f3ec","#3d235a","#c8ff3e","#ff6b4a","#4ab8e8","#f5c842",
  "#e8407a","#1e0f2e","#a8e820","#e85535","#d4a820","#2d7ab8","#f7f3ec","#3d235a",
];

const ART_MODULES = [
  { icon:"🎨", n:"Colour Module",     role:"Hue · Saturation · Value",       in:"Base image",      out:"Colour-graded image",   col:"var(--coral)", desc:"Controls the entire emotional tone of an artwork. Swap the colour palette and the mood transforms completely — from warm joy to cool isolation." },
  { icon:"📐", n:"Composition Module",role:"Balance · Rhythm · Hierarchy",   in:"Scene elements",  out:"Arranged layout",       col:"var(--lime)",  desc:"Decides where each visual element sits. The rule of thirds, the golden ratio, symmetry — all are interchangeable compositional modules." },
  { icon:"✏️", n:"Line Module",        role:"Shape · Contour · Texture",      in:"Subject forms",   out:"Defined shapes",        col:"var(--gold)",  desc:"Lines create edges, movement and emotion. Soft curves suggest calm; jagged diagonals suggest tension. Any line style can be applied to any form." },
  { icon:"💡", n:"Light Module",       role:"Direction · Intensity · Shadow",  in:"Scene geometry",  out:"Lit 3D scene",          col:"var(--sky)",   desc:"Light is mood made visible. Side-lit for drama; top-lit for heroism; back-lit for mystery. Lighting direction is a swappable module." },
  { icon:"🖼️", n:"Style Module",       role:"Medium · Movement · Period",     in:"Raw content",     out:"Stylised artwork",      col:"var(--rose)",  desc:"Applies an entire visual language — Impressionist brushwork, Bauhaus geometry, manga line art, watercolour wash. One module, infinite styles." },
  { icon:"🔤", n:"Text & Symbol Module",role:"Typography · Icons · Language",  in:"Written content", out:"Visual typography",     col:"var(--lime)",  desc:"In collage, posters, and graphic design, text is a visual module. Font, scale, placement and colour all contribute to the visual system." },
];

const AI_ART_MODULES = [
  { icon:"💬", n:"Text AI",         role:"Prompt Engineer",  in:"Your idea",            out:"Precise visual prompt",     col:"var(--sky)"   },
  { icon:"🎨", n:"Style Transfer AI",role:"Style Applier",   in:"Image + style image",  out:"Stylised artwork",          col:"var(--rose)"  },
  { icon:"🖼️", n:"Image Gen AI",    role:"Visual Creator",   in:"Text prompt",          out:"Generated image",           col:"var(--coral)" },
  { icon:"✂️", n:"Inpainting AI",   role:"Element Replacer", in:"Image + mask + text",  out:"Edited image",              col:"var(--gold)"  },
  { icon:"🌈", n:"Colour AI",       role:"Palette Manager",  in:"Image + palette",      out:"Recoloured artwork",        col:"var(--lime)"  },
  { icon:"🔲", n:"Upscaling AI",    role:"Resolution Boost", in:"Low-res image",        out:"4× high-res image",         col:"var(--sky)"   },
  { icon:"🎬", n:"Animation AI",    role:"Motion Creator",   in:"Still image + prompt", out:"Animated video clip",       col:"var(--coral)" },
  { icon:"🧩", n:"Compositing AI",  role:"Scene Assembler",  in:"Multiple assets",      out:"Unified composition",       col:"var(--gold)"  },
];

const EXAMPLES_DATA = [
  {
    id:"poster",
    title:"Concert Poster Creation",
    emoji:"🎭",
    col:"var(--coral)",
    scene:"Creating a concert poster for a jazz event in New Orleans",
    chain:[
      {
        tool:"ChatGPT",icon:"💬",type:"Text AI",col:"var(--sky)",
        act:"Write the Visual Brief",
        inp:"'Design a jazz concert poster for New Orleans, 1950s feel, trumpet player'",
        out:"Detailed brief: 'Art Deco poster style. Deep indigo night sky. Silhouette of trumpet player, golden rim light from stage spots. Hand-lettered title font. Warm amber & cobalt palette. Bokeh lights in background. Suggested layout: full bleed vertical, title top-left, performer centre, venue details bottom strip.'",
        vis:"📝→🎯",
        explain:"ChatGPT acts as an art director — translating a rough idea into a precise visual specification. Every detail it generates becomes an instruction for the next module."
      },
      {
        tool:"DALL·E 3",icon:"🖼️",type:"Image Gen AI",col:"var(--coral)",
        act:"Generate the Base Image",
        inp:"Visual brief from Step 1 — Art Deco, indigo sky, trumpet silhouette, amber & cobalt, bokeh lights",
        out:"1024×1024 base poster image: moody jazz performer, accurate Art Deco framing, correct colour palette, open areas for text overlay",
        vis:"🎨",
        explain:"DALL·E reads each design element from the brief as a visual instruction. The open areas were specifically requested so text can be layered in the next module without covering the art."
      },
      {
        tool:"Style Transfer AI",icon:"🎨",type:"Style Module",col:"var(--rose)",
        act:"Apply 1950s Print Style",
        inp:"Generated image + reference: 'Lithograph print texture, halftone dots, slight colour separation, aged paper grain'",
        out:"Image now has visible print grain, halftone dot screen in shadows, slight ink bleed — looks authentically vintage",
        vis:"🌀",
        explain:"The style transfer module is swappable — running this same image through a 'neon pop art' style would produce a completely different aesthetic. The base content is the same; only the style module changes."
      },
      {
        tool:"Canva AI",icon:"✏️",type:"Text Module",col:"var(--lime)",
        act:"Add Typography & Layout",
        inp:"Styled image + event text: 'MIDNIGHT SESSIONS · New Orleans Jazz House · December 14 · Doors 8pm · $25'",
        out:"Finished poster: hand-lettered feel fonts, correct colour hierarchy, venue info in bottom strip, all text integrated with the visual",
        vis:"🖼️✅",
        explain:"The text module adds the final layer — converting raw words into visual typography that harmonises with the image. The font, weight, and colour choices were guided by the Art Deco brief from Step 1."
      },
    ]
  },
  {
    id:"portrait",
    title:"Portrait in Three Styles",
    emoji:"🖼️",
    col:"var(--lime)",
    scene:"Demonstrating how style is a swappable module — same portrait, three entirely different artworks",
    chain:[
      {
        tool:"ChatGPT",icon:"💬",type:"Text AI",col:"var(--sky)",
        act:"Define the Subject Module",
        inp:"'Create a portrait description I can use to generate the same person across different art styles'",
        out:"Subject spec: 'Portrait of a young woman, late 20s, dark curly hair, warm brown eyes, slight smile, three-quarter view, neutral expression, soft ambient lighting, facing slightly left — no style, no background, subject only.'",
        vis:"👤",
        explain:"The subject description is kept style-neutral deliberately. By removing style from the subject module, we make the style itself freely swappable in the next step."
      },
      {
        tool:"DALL·E 3",icon:"🖼️",type:"Image Gen AI",col:"var(--coral)",
        act:"Generate — Oil Painting Style",
        inp:"Subject spec + style: 'Rembrandt oil portrait, chiaroscuro lighting, dark warm background, visible brushwork, museum quality'",
        out:"Portrait rendered as a 17th-century Dutch master oil painting — rich shadow, impasto texture, warm glazed tones",
        vis:"🖼️",
        explain:"Now the style module (Rembrandt) is applied to the neutral subject. The subject stays exactly the same; only the style module changes between steps."
      },
      {
        tool:"DALL·E 3",icon:"🖼️",type:"Image Gen AI",col:"var(--coral)",
        act:"Same Subject — Manga Style",
        inp:"Same subject spec + DIFFERENT style: 'Manga illustration, clean ink lines, screen tone shading, expressive eyes, Studio Trigger aesthetic'",
        out:"Same portrait now rendered as manga — crisp ink outlines, minimal background, large expressive eyes, completely different emotional register",
        vis:"🖼️",
        explain:"Identical subject module, completely different style module. This is the core principle of modularity in art — isolating variables so you can change one thing at a time and observe the effect."
      },
      {
        tool:"DALL·E 3",icon:"🖼️",type:"Image Gen AI",col:"var(--coral)",
        act:"Same Subject — Watercolour Style",
        inp:"Same subject spec + DIFFERENT style: 'Loose watercolour wash, soft edges, wet-on-wet technique, muted pastel tones, impressionistic'",
        out:"Same portrait — now soft, painterly, emotionally gentle, with colour bleeding beyond the edges in authentic watercolour style",
        vis:"🖼️",
        explain:"Three artworks. One subject. Three swapped style modules. This is exactly how professional artists work — they develop a style vocabulary and apply different modules to the same subject to explore variation."
      },
    ]
  },
  {
    id:"landscape",
    title:"Modular Landscape Composition",
    emoji:"🌄",
    col:"var(--gold)",
    scene:"Building a complex landscape by generating and combining separate visual modules",
    chain:[
      {
        tool:"ChatGPT",icon:"💬",type:"Text AI",col:"var(--sky)",
        act:"Write a Module Breakdown Brief",
        inp:"'Plan a sci-fi landscape as separate layers I can generate individually and combine'",
        out:"Layer plan:\n• Background: gas giant planet + twin moons + starfield\n• Midground: alien mesa formations, purple haze\n• Foreground: bioluminescent plants, wet ground reflection\n• Atmosphere: volumetric clouds, light rays from offscreen star\n• Character: astronaut silhouette, small, right of centre",
        vis:"📋",
        explain:"Breaking the scene into separate named layers is the compositional module plan. Each layer can be generated independently and is replaceable — swap the moons for rings, or the foreground plants for snow, without regenerating the whole scene."
      },
      {
        tool:"DALL·E 3",icon:"🖼️",type:"Image Gen AI",col:"var(--coral)",
        act:"Generate Each Layer Separately",
        inp:"Five separate prompts — one per layer — each with transparent/masked backgrounds where needed",
        out:"5 individual image assets:\n🌌 Starfield + gas giant (background)\n🏜️ Mesa formations (midground)\n🌿 Bioluminescent plants (foreground)\n☁️ Volumetric atmosphere layer\n🧑‍🚀 Astronaut silhouette (subject)",
        vis:"🗂️",
        explain:"Each asset is a module — independently generated, independently revisable. Don't like the gas giant? Regenerate only that layer. The other four modules remain untouched."
      },
      {
        tool:"Compositing AI",icon:"🧩",type:"Compositing Module",col:"var(--gold)",
        act:"Stack and Blend the Layers",
        inp:"5 image assets + blend instructions: depth-based atmospheric haze between layers, light source direction consistent from upper-left, foreground shadow cast matching atmosphere",
        out:"Unified landscape image — all layers composited with consistent lighting, atmospheric perspective, and colour harmony",
        vis:"🖼️✨",
        explain:"The compositing module assembles the layers while respecting physical rules — light direction, atmospheric distance, colour temperature. The result looks like one coherent scene even though it was built from five independent modules."
      },
      {
        tool:"Colour AI",icon:"🌈",type:"Colour Module",col:"var(--lime)",
        act:"Apply a Unified Colour Grade",
        inp:"Composited image + colour palette: 'Cinematic sci-fi teal-orange contrast, deep shadow saturation, highlights shifted warm amber'",
        out:"Final artwork: colour-graded to cinematic quality — cooler shadows, warmer highlights, strong teal-orange complementary contrast, film grain overlay",
        vis:"🎨",
        explain:"The colour module is applied last — like a photographer's darkroom edit. Because it sits in its own module, you can apply completely different colour grades to the same composite to generate multiple finished versions from a single composition."
      },
    ]
  },
];

const QUIZ_DATA = [
  {
    q:"What does it mean for an element of art to be 'modular'?",
    opts:["It is made from a computer","It can be changed independently without affecting every other element of the artwork","It must be drawn by hand","It requires expensive software to create"],
    a:1, exp:"A modular element is one that can be modified, replaced, or experimented with independently. Changing the colour module of a painting — for example — shouldn't require redrawing the composition."
  },
  {
    q:"In the Style Transfer example, the subject description was deliberately kept style-neutral. Why?",
    opts:["To save time","To confuse the AI","So the style module could be freely swapped without changing the subject — isolating the variable being tested","Because AI cannot read style descriptions"],
    a:2, exp:"By separating subject from style — two independent modules — you can change one without touching the other. This is the fundamental logic of modularity: isolate variables, change one at a time, observe results."
  },
  {
    q:"In the Modular Landscape, why were the 5 layers generated as separate images rather than one prompt?",
    opts:["It is faster to do five separate prompts","Each layer becomes an independent module — any single layer can be replaced without regenerating the entire scene","AI cannot generate complex scenes in one image","Separate files are smaller"],
    a:1, exp:"Separating layers into modules means you can iterate on any individual element. Dislike the gas giant? Replace that module alone. The other four layers remain. This is non-destructive, modular creative workflow."
  },
  {
    q:"Which of these best describes what a 'Style Module' does in art?",
    opts:["It writes the art's title","It applies a complete visual language — medium, brushwork, colour approach, cultural period — to a piece of content","It decides the canvas size","It generates the subject matter"],
    a:1, exp:"A style module carries an entire visual identity: Impressionist dabs, Bauhaus geometry, manga linework. Applying a different style module to the same content produces a completely different artwork — same content, different visual language."
  },
  {
    q:"How does modular thinking help an artist use AI tools more effectively?",
    opts:["It makes the AI tools run faster","It means you never need to re-generate anything","By breaking a creative project into independent components, you can test, iterate and replace individual parts without starting over — making AI a precise creative tool rather than a random one","AI tools work better with short prompts"],
    a:2, exp:"Modular thinking turns AI from a single-shot generator into a structured creative workflow. You design the modules, define the handoffs between them, and iterate on individual components — exactly how professional visual artists and directors structure complex projects."
  },
];

const VOCAB = [
  {w:"Module",col:"var(--lime)",   d:"A self-contained creative unit with a defined input, a single job, and a specific output. Can be swapped or replaced independently."},
  {w:"Layer",col:"var(--coral)",  d:"In digital and traditional art, a visual plane that sits above or below others. Each layer is a module — independently editable."},
  {w:"Style Transfer",col:"var(--rose)",  d:"An AI technique that applies the visual characteristics of one image (brushwork, colour, texture) to another image's content."},
  {w:"Composition",col:"var(--gold)",  d:"The arrangement of visual elements within an artwork. A compositional module determines balance, rhythm and visual hierarchy."},
  {w:"Inpainting",col:"var(--sky)",  d:"An AI technique for editing a specific masked region of an image while leaving surrounding pixels untouched — modular editing."},
  {w:"Iteration",col:"var(--lime)",  d:"The process of testing variations by changing one module at a time. Central to both scientific experimentation and artistic practice."},
  {w:"Pipeline",col:"var(--coral)",  d:"A chain of modules connected so each output becomes the next input. The complete creative workflow from concept to finished artwork."},
  {w:"Prompt",col:"var(--gold)",  d:"The text instruction that controls an AI module. In a modular workflow, prompts are designed to match specific module inputs precisely."},
];

function makeMosaicColors(seed) {
  const cols = MOSAIC_COLORS;
  return Array.from({length:16}, (_, i) => {
    const v = (Math.sin(seed * 2.1 + i * 0.8) * 0.5 + 0.5);
    return cols[Math.floor(v * cols.length)];
  });
}

function makeArtGrid(seed, style) {
  const palettes = {
    impressionist:["#7bb8d4","#c9e8f0","#e8c87a","#d4a855","#8fb87a","#c9d4b0","#e8e0d0","#b8c8d0"],
    bauhaus:["#e63b2e","#2962a6","#f5c800","#1a1a1a","#ffffff","#e63b2e","#2962a6","#f5c800"],
    neon:["#ff00ff","#00ffff","#ff6600","#00ff66","#6600ff","#ffff00","#ff0066","#0066ff"],
    autumn:["#c8601a","#e89028","#6b3010","#d4b060","#8c4820","#f0c878","#4a2808","#e07830"],
  };
  const p = palettes[style] || palettes.bauhaus;
  return Array.from({length:64}, (_,i) => {
    const v = (Math.sin(seed + i * 0.6) * 0.5 + 0.5);
    return p[Math.floor(v * p.length)];
  });
}

/* ══════════════════ COMPONENT ════════════════════════════ */
export default function ModularityInArt() {
  const [tab, setTab]         = useState(0);

  // Hero mosaic
  const [heroColors, setHeroColors] = useState(() => makeMosaicColors(1));
  const [heroSeed, setHeroSeed]     = useState(1);

  // art demo grid
  const [gridStyle, setGridStyle] = useState("bauhaus");
  const [gridSeed, setGridSeed]   = useState(1);
  const [artGrid, setArtGrid]     = useState(() => makeArtGrid(1,"bauhaus"));

  // anatomy animation
  const [anatStep, setAnatStep]     = useState(-1);
  const [anatRunning, setAnatRunning] = useState(false);

  // examples
  const [exIdx, setExIdx]   = useState(0);
  const [exStep, setExStep] = useState(0);

  // pipeline chain active step
  const [pipeStep, setPipeStep] = useState(-1);
  const [pipeRunning, setPipeRunning] = useState(false);

  // layer demo
  const [layers, setLayers]     = useState([0,1,2,3]);
  const [layerVis, setLayerVis] = useState([true,true,true,true]);

  // builder
  const [slots, setSlots]     = useState([null,null,null]);
  const [activeSlot, setActiveSlot] = useState(null);
  const [buildLog, setBuildLog] = useState([]);
  const [buildRunning, setBuildRunning] = useState(false);
  const [buildStep, setBuildStep] = useState(-1);

  // demo
  const [demoIn, setDemoIn]     = useState("A solitary lighthouse on a rocky cliff at dusk, waves crashing, golden-hour sky");
  const [demoPhase, setDemoPhase] = useState(-1);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoOuts, setDemoOuts] = useState(["","","",""]);
  const [demoGrid, setDemoGrid] = useState([]);

  // quiz
  const [qi, setQi]   = useState(0);
  const [qsel,setQsel]= useState(null);
  const [qsc, setQsc] = useState(0);
  const [qdone,setQdone]= useState(false);

  // Shuffle hero mosaic periodically
  useEffect(() => {
    const id = setInterval(() => {
      setHeroSeed(s => { const ns = s + 0.5; setHeroColors(makeMosaicColors(ns)); return ns; });
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const changeGridStyle = useCallback((style) => {
    setGridStyle(style);
    const s = Math.random() * 50;
    setGridSeed(s);
    setArtGrid(makeArtGrid(s, style));
  }, []);

  const shuffleGrid = useCallback(() => {
    const s = Math.random() * 50;
    setGridSeed(s);
    setArtGrid(makeArtGrid(s, gridStyle));
  }, [gridStyle]);

  const runAnat = useCallback(() => {
    setAnatRunning(true); setAnatStep(-1);
    AI_ART_MODULES.slice(0,4).forEach((_,i) => {
      setTimeout(() => setAnatStep(i), i * 1100);
    });
    setTimeout(() => { setAnatStep(4); setAnatRunning(false); }, 4 * 1100 + 300);
  }, []);

  const runPipe = useCallback(() => {
    const ex = EXAMPLES_DATA[exIdx];
    setPipeRunning(true); setPipeStep(-1);
    ex.chain.forEach((_,i) => {
      setTimeout(() => setPipeStep(i), i * 1400);
    });
    setTimeout(() => { setPipeStep(ex.chain.length); setPipeRunning(false); }, ex.chain.length * 1400 + 400);
  }, [exIdx]);

  const runBuilder = useCallback(() => {
    const filled = slots.filter(Boolean);
    if (filled.length < 2) return;
    setBuildRunning(true); setBuildLog([]); setBuildStep(-1);
    filled.forEach((t,i) => {
      setTimeout(() => {
        setBuildStep(i);
        setBuildLog(prev => [...prev, {type:"run", text:`[${String(i+1).padStart(2,"0")}] ▶ ${t.n} module activated — processing ${t.role.toLowerCase()}...`}]);
      }, i * 1500);
    });
    setTimeout(() => {
      setBuildStep(filled.length);
      setBuildLog(prev => [...prev,
        {type:"ok",   text:`[OK] ✓ Art pipeline complete — ${filled.length} modules executed.`},
        {type:"info", text:`     Output format: ${filled[filled.length-1]?.out || "artwork"}`},
      ]);
      setBuildRunning(false);
    }, filled.length * 1500 + 500);
  }, [slots]);

  const runDemo = useCallback(() => {
    if (!demoIn.trim()) return;
    setDemoRunning(true); setDemoPhase(-1); setDemoOuts(["","","",""]);
    const words = demoIn.trim().split(/\s+/).slice(0,10);
    const outs = [
      `Art direction brief generated:\n\n"${demoIn}"\n\nExtracted visual modules:\n→ Subject: ${words.slice(0,3).join(", ")}\n→ Light: dusk · golden-hour · warm horizontal\n→ Mood: solitary · dramatic · elemental\n→ Palette: deep amber, slate blue, white foam, charcoal rock\n→ Composition: vertical emphasis, foreground texture, open sky above horizon\n→ Style recommendation: painterly, impressionistic edges, cinematic grain`,
      `Image module generated:\n\n→ Diffusion model: 50-step denoising\n→ Resolution: 1024×1024px\n→ Colour accuracy: palette match 94%\n→ Composition score: rule-of-thirds alignment confirmed\n→ Lighting: directional warm source confirmed upper-right\n\n✓ Base image rendered: lighthouse_dusk_base.png\n\nNotes: Strong silhouette value. Sky module has strong visual weight — consider lighter foreground to balance.`,
      `Style module applied:\n\n→ Style: Painterly impressionist + cinematic grade\n→ Technique: Simulated impasto brush texture overlaid\n→ Colour grade: teal shadow / amber highlight split\n→ Grain: 12% film grain, 0.8px radius\n→ Vignette: 35% edge darkening\n\n✓ Styled image: lighthouse_dusk_styled.png\n\nStyle module is replaceable — run same base through 'manga linework' or 'watercolour wash' module for instant variation.`,
      `Composition refinement applied:\n\n→ Crop adjusted: 16:9 cinematic ratio\n→ Horizon line: lowered to 35% from bottom\n→ Light rays: added volumetric streaks from upper right\n→ Foreground: wave foam brightened for leading line\n→ Final sharpening: 0.6 radius unsharp mask\n\n✓ Final artwork complete: lighthouse_dusk_final.png\n✓ All 4 modules executed successfully\n✓ Artwork ready for export`
    ];
    outs.forEach((o,i) => {
      setTimeout(() => {
        setDemoPhase(i);
        setDemoOuts(prev => { const n=[...prev]; n[i]=o; return n; });
        if (i===1) setDemoGrid(makeArtGrid(Math.random()*50, "impressionist"));
      }, i * 2500);
    });
    setTimeout(() => { setDemoRunning(false); setDemoPhase(4); }, outs.length * 2500 + 300);
  }, [demoIn]);

  const handleQ = (i) => {
    if (qsel !== null) return;
    setQsel(i);
    if (i === QUIZ_DATA[qi].a) setQsc(s => s+1);
  };
  const nextQ = () => {
    if (qi+1 >= QUIZ_DATA.length) { setQdone(true); return; }
    setQi(q => q+1); setQsel(null);
  };
  const resetQ = () => { setQi(0); setQsel(null); setQsc(0); setQdone(false); };

  const TABS = [
    {icon:"🏛️",l:"Overview"},
    {icon:"🧩",l:"What is Modularity in Art?"},
    {icon:"🤖",l:"AI as Art Modules"},
    {icon:"🔬",l:"How It Works"},
    {icon:"🎨",l:"Step-by-Step Examples"},
    {icon:"🛠️",l:"Build Your Pipeline"},
    {icon:"🚀",l:"Live Studio"},
    {icon:"📚",l:"Glossary"},
    {icon:"🏆",l:"Assessment"},
  ];

  const curEx = EXAMPLES_DATA[exIdx];
  const LAYER_ITEMS = [
    {icon:"🏔️",label:"Background", col:"rgba(44,60,80,.8)",  height:"80%"},
    {icon:"🌲",label:"Midground",  col:"rgba(44,80,44,.7)",  height:"60%"},
    {icon:"🌸",label:"Foreground", col:"rgba(80,40,60,.6)",  height:"40%"},
    {icon:"👤",label:"Subject",    col:"rgba(80,60,20,.6)",  height:"20%"},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="root layer">

        {/* ══ HEADER BAND ══ */}
        <div className="header-band layer">
          <div className="hb-block hb-black">AI + ART</div>
          <div className="hb-block hb-coral">STUDIO SESSION</div>
          <div className="hb-scroll">
            <div className="hb-track">
              {Array(2).fill(["MODULARITY IN ART","AI CREATIVE TOOLS","COMPOSITION","COLOUR THEORY","STYLE TRANSFER","LAYER SYSTEMS","PIPELINE DESIGN","ITERATION","ART MODULES"]).flat().map((t,i)=>(
                <span key={i}>◆ {t} </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ MASTHEAD ══ */}
        <header className="mast layer">
          <div className="mast-top">
            <div className="logo">
              <div className="logo-main">Art<em>×</em>AI <em>Modularity</em></div>
            </div>
            <div className="logo-sub">Creative Systems · Visual Design · Artificial Intelligence</div>
            <div className="mast-pills">
              <span className="mpill tg-l" style={{border:"1px solid rgba(200,255,62,.4)"}}>Art</span>
              <span className="mpill tg-c" style={{border:"1px solid rgba(255,107,74,.4)"}}>AI</span>
              <span className="mpill tg-g" style={{border:"1px solid rgba(245,200,66,.4)"}}>Design</span>
            </div>
          </div>
          <nav className="nav-strip">
            {TABS.map((t,i)=>(
              <button key={i} className={"nbtn"+(tab===i?" on":"")} onClick={()=>setTab(i)}>
                <span>{t.icon}</span>{t.l}
              </button>
            ))}
          </nav>
        </header>

        {/* ══ HERO ══ */}
        {tab===0 && (
          <section className="hero layer">
            <div className="hero-left">
              <div className="hero-kicker">In-Class Studio</div>
              <h1>
                <span className="l1">Modularity</span>
                <span className="l2">in Art</span>
                <span className="l3">&amp; AI</span>
              </h1>
              <p className="hero-body">
                Great artworks are not created in a single gesture — they are assembled from <strong>independent creative decisions</strong> that can each be examined, changed, and recombined.
                This is modularity. And AI makes it <strong>more powerful than ever</strong>.
              </p>
              <div className="tag-row">
                {["Colour","Composition","Style","Light","Layer","Texture","Form"].map((t,i)=>(
                  <span key={i} className={["tg-l","tg-c","tg-g","tg-s","tg-l","tg-c","tg-g"][i]+" tag"}>{t}</span>
                ))}
              </div>
            </div>
            <div className="hero-right">
              <div
                className="mosaic-preview"
                style={{gridTemplateColumns:"repeat(4,1fr)",gap:"3px"}}
                title="Click to regenerate"
                onClick={() => { const s = heroSeed + 1; setHeroSeed(s); setHeroColors(makeMosaicColors(s)); }}
              >
                {heroColors.map((c,i) => (
                  <div key={i} className="mp-cell" style={{background:c}} />
                ))}
              </div>
              <div className="stat-row">
                <div className="stat-box"><div className="sb-n">6</div><div className="sb-l">Art\nModules</div></div>
                <div className="stat-box"><div className="sb-n">8</div><div className="sb-l">AI\nModules</div></div>
                <div className="stat-box"><div className="sb-n">∞</div><div className="sb-l">Creative\nCombinations</div></div>
              </div>
              <div style={{marginTop:"10px",fontSize:"9px",color:"var(--muted)",letterSpacing:"1px",textAlign:"center"}}>
                ↑ Click the mosaic — each cell is a colour module
              </div>
            </div>
          </section>
        )}

        {/* ══ PAGE CONTENT ══ */}
        <div className="pg layer">

          {/* ─── TAB 0: OVERVIEW ─── */}
          {tab===0 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">01</div>
                <div className="sh-txt">
                  <div className="sh-eye">Feature Overview</div>
                  <h2>What You Will <em>Explore</em></h2>
                  <p>A complete studio session covering modularity in art, how AI fits into that system, and how to use both together as a professional creative tool.</p>
                </div>
              </div>

              <div className="g2">
                {[
                  {icon:"🧩",t:"What is Modularity in Art?",d:"Colour, light, composition, style — each is a separate creative decision. Learn to see artworks as systems of independent modules.",col:"var(--lime)"},
                  {icon:"🤖",t:"AI as Creative Modules",d:"Each AI tool is a specialised module. DALL·E generates images. Style Transfer applies visual language. Together they form a creative pipeline.",col:"var(--coral)"},
                  {icon:"🔬",t:"How It All Works",d:"Inside each module: how diffusion models generate images, how style transfer extracts and applies visual DNA, how compositing assembles layers.",col:"var(--gold)"},
                  {icon:"🎨",t:"Three Complete Examples",d:"A concert poster, a portrait in three styles, and a modular sci-fi landscape — each shown step-by-step with exact inputs and outputs.",col:"var(--sky)"},
                  {icon:"🛠️",t:"Build Your Pipeline",d:"Select and connect art modules to design your own creative pipeline. Run it and watch the execution log.",col:"var(--rose)"},
                  {icon:"🏆",t:"Knowledge Assessment",d:"Five questions testing your understanding of modularity, AI tools, style transfer, and layer-based creative thinking.",col:"var(--lime)"},
                ].map((c,i)=>(
                  <div key={i} className="card">
                    <div style={{fontSize:"32px",marginBottom:"10px"}}>{c.icon}</div>
                    <div className="card-hd" style={{color:c.col,fontSize:"14px"}}>{c.t}</div>
                    <p>{c.d}</p>
                  </div>
                ))}
              </div>

              <div className="pq">
                <div className="pq-t">"Art is not made in one move — it is assembled from decisions. Modularity is the practice of making those decisions independently, so each one can be reconsidered, improved, or swapped."</div>
                <div className="pq-a">Systems Thinking in Creative Practice</div>
              </div>

              <div className="sh mt24">
                <div className="sh-n">02</div>
                <div className="sh-txt">
                  <div className="sh-eye">Historical Context</div>
                  <h2>Modular Thinking Has Always Been in <em>Art</em></h2>
                  <p>Long before AI, artists structured their practice around interchangeable creative decisions.</p>
                </div>
              </div>

              <div className="art-strip">
                {[
                  {yr:"~3000 BC",ico:"🏺",nm:"Ancient Mosaic",desc:"Thousands of individual tesserae — each a colour module — assembled into unified portraits and scenes."},
                  {yr:"1440s",   ico:"🖼️",nm:"Oil Glazing",    desc:"Van Eyck built paintings in sequential transparent layers — each layer an independent light or colour module."},
                  {yr:"1890s",   ico:"🎨",nm:"Pointillism",    desc:"Seurat's technique: individual colour dots as modules. Seen close up, chaos. Stepped back, the eye mixes them into unified tone."},
                  {yr:"1919",    ico:"📐",nm:"Bauhaus",         desc:"The Bauhaus school taught design as a system of modules: form, colour, material. Each element teachable and recombineable."},
                  {yr:"1960s",   ico:"🔲",nm:"Modular Sculpture",desc:"Donald Judd's 'stacks' — identical industrial units arranged in sequences. Any unit could be added, removed or reordered."},
                  {yr:"1970s",   ico:"🖱️",nm:"Digital Layers",  desc:"Photoshop's invention of the digital layer stack made artistic modularity universal — any layer could be edited without touching others."},
                  {yr:"2010s",   ico:"🤖",nm:"AI Style Transfer",desc:"Deep learning allowed style to become an independently applicable module — separate from content for the first time algorithmically."},
                  {yr:"Now",     ico:"⚡",nm:"AI Pipelines",    desc:"Complete modular creative pipelines: text → image → style → colour → animation. Each step independent, replaceable, iterable."},
                ].map((e,i)=>(
                  <div key={i} className="art-era">
                    <div className="ae-art">{e.ico}</div>
                    <div className="ae-yr">{e.yr}</div>
                    <div className="ae-nm">{e.nm}</div>
                    <div className="ae-desc">{e.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TAB 1: WHAT IS MODULARITY IN ART ─── */}
          {tab===1 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">03</div>
                <div className="sh-txt">
                  <div className="sh-eye">Core Concept</div>
                  <h2>Modularity in Art: <em>Explained</em></h2>
                  <p>Every artwork — from a simple sketch to a feature film — is built from separate creative decisions. Understanding them as modules is the key to systematic creative thinking.</p>
                </div>
              </div>

              {/* LEGO analogy */}
              <div className="card" style={{borderTop:"2px solid var(--lime)",marginBottom:"20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"76px 1fr",gap:"20px",alignItems:"start"}}>
                  <div style={{width:"76px",height:"76px",background:"var(--lime)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"36px",flexShrink:0}}>🧱</div>
                  <div>
                    <div style={{fontSize:"9px",color:"var(--lime)",letterSpacing:"3px",fontWeight:"700",marginBottom:"6px"}}>THE CORE ANALOGY</div>
                    <div className="card-hd" style={{color:"var(--chalk)",fontSize:"17px"}}>An Artwork is a System of Modules</div>
                    <p>Think of a LEGO structure. Each brick is independent — it connects to others but can be removed and replaced without the whole collapsing. Now think of a painting: the <strong style={{color:"var(--lime)"}}>colour</strong> can change without altering the <strong style={{color:"var(--coral)"}}>composition</strong>. The <strong style={{color:"var(--gold)"}}>style</strong> can shift without changing the <strong style={{color:"var(--sky)"}}>subject</strong>. Each element is a module.</p>
                  </div>
                </div>
              </div>

              {/* 6 Art Modules */}
              <div style={{fontSize:"9px",color:"var(--lime)",letterSpacing:"3px",fontWeight:"700",marginBottom:"14px",display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{width:"16px",height:"2px",background:"var(--lime)",display:"inline-block"}}></span>
                THE SIX FUNDAMENTAL ART MODULES
              </div>
              <div className="g2">
                {ART_MODULES.map((m,i)=>(
                  <div key={i} className="mod" data-n={`MODULE ${String.fromCharCode(65+i)}`} style={{paddingTop:"24px"}}>
                    <div className="mod-ico">{m.icon}</div>
                    <div className="mod-name" style={{color:m.col}}>{m.n}</div>
                    <div className="mod-role">{m.role}</div>
                    <p style={{fontSize:"11px",color:"var(--muted)",lineHeight:"1.8",marginBottom:"10px"}}>{m.desc}</p>
                    <div className="mod-io">
                      <div className="mio-row"><span className="mio-in">IN</span><span style={{color:"var(--muted)",fontSize:"10px"}}>{m.in}</span></div>
                      <div className="mio-row"><span className="mio-out">OUT</span><span style={{color:"var(--muted)",fontSize:"10px"}}>{m.out}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Layer Demo */}
              <div className="card mt24">
                <div className="card-hd">🖼️ Layer Modularity — Toggle Each Layer On/Off</div>
                <p style={{marginBottom:"16px"}}>Click each layer button to show or hide it. In real artwork software (Photoshop, Procreate), each layer is an independent module — you can add, remove, and reorder them without affecting others.</p>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"16px"}}>
                  {LAYER_ITEMS.map((l,i)=>(
                    <button
                      key={i}
                      onClick={()=>setLayerVis(prev=>{const n=[...prev];n[i]=!n[i];return n})}
                      style={{
                        padding:"8px 14px",border:"1px solid",cursor:"pointer",
                        fontFamily:"'Fragment Mono',monospace",fontSize:"11px",fontWeight:"700",
                        transition:"all .2s",
                        background:layerVis[i]?"var(--bcard)":"transparent",
                        borderColor:layerVis[i]?l.col:"var(--border)",
                        color:layerVis[i]?l.col:"var(--muted)",
                      }}>
                      {l.icon} {l.label} {layerVis[i]?"●":"○"}
                    </button>
                  ))}
                </div>
                <div className="art-canvas" style={{height:"200px"}}>
                  {LAYER_ITEMS.map((l,i)=>(
                    layerVis[i] && (
                      <div key={i} style={{
                        position:"absolute",
                        bottom:0,left:0,right:0,
                        height:l.height,
                        background:l.col,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:"32px",
                        transition:"all .4s ease",
                        border:"1px dashed rgba(255,255,255,.1)",
                      }}>
                        {l.icon}
                      </div>
                    )
                  ))}
                  <div className="vp-label">{layerVis.filter(Boolean).length} of {LAYER_ITEMS.length} layers active</div>
                </div>
              </div>

              {/* Interactive art module grid */}
              <div className="card mt20">
                <div className="card-hd">🎨 Style Module Demonstrator — Same Grid, Different Styles</div>
                <p style={{marginBottom:"14px"}}>Click any style below to apply it to the pixel grid. The <strong style={{color:"var(--chalk)"}}>structure</strong> stays the same — only the <strong style={{color:"var(--lime)"}}>colour/style module</strong> changes. This is exactly how AI style transfer works.</p>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"14px"}}>
                  {[
                    {id:"bauhaus",  label:"Bauhaus",       ico:"📐"},
                    {id:"impressionist",label:"Impressionist",ico:"🎨"},
                    {id:"neon",     label:"Neon Pop",      ico:"💡"},
                    {id:"autumn",   label:"Autumn Tones",  ico:"🍂"},
                  ].map(s=>(
                    <button key={s.id}
                      onClick={()=>changeGridStyle(s.id)}
                      style={{
                        padding:"8px 14px",border:"1px solid",cursor:"pointer",
                        fontFamily:"'Fragment Mono',monospace",fontSize:"11px",fontWeight:"700",
                        transition:"all .2s",
                        background:gridStyle===s.id?"var(--lime)":"transparent",
                        borderColor:gridStyle===s.id?"var(--lime)":"var(--border)",
                        color:gridStyle===s.id?"var(--ink)":"var(--muted)",
                      }}>
                      {s.ico} {s.label}
                    </button>
                  ))}
                  <button onClick={shuffleGrid} style={{padding:"8px 14px",border:"1px solid var(--border)",cursor:"pointer",fontFamily:"'Fragment Mono',monospace",fontSize:"11px",color:"var(--muted)"}}>
                    ↺ Shuffle
                  </button>
                </div>
                <div className="ademo">
                  {artGrid.map((c,i)=>(
                    <div key={i} className="ademo-cell" style={{background:c}} />
                  ))}
                </div>
                <div style={{marginTop:"8px",fontSize:"9px",color:"var(--muted)",letterSpacing:"1px"}}>
                  Active style module: <span style={{color:"var(--lime)",fontWeight:"700"}}>{gridStyle.toUpperCase()}</span>
                </div>
              </div>

              {/* Comparison */}
              <div className="card mt20">
                <div className="card-hd">⚖️ Traditional Art Thinking vs Modular Art Thinking</div>
                <div className="cmp">
                  <div className="cmp-col">
                    <div className="cmp-hd" style={{color:"var(--muted)",borderColor:"var(--plum3)"}}>Traditional "fixed" approach</div>
                    {[
                      "The artwork is a single unified thing — changing one element means reworking everything connected to it",
                      "Difficult to test variations without starting a new artwork from scratch",
                      "Style, colour, and composition decisions are deeply intertwined",
                      "Iteration is slow — every change has wide ripple effects",
                    ].map((t,i)=>(
                      <div key={i} className="cmp-item"><span style={{color:"var(--coral)",flexShrink:0}}>✕</span>{t}</div>
                    ))}
                  </div>
                  <div className="cmp-col">
                    <div className="cmp-hd" style={{color:"var(--lime)",borderColor:"var(--lime)"}}>Modular art approach</div>
                    {[
                      "Each creative decision is isolated — colour can change without touching composition or style",
                      "Testing variations is fast: swap one module, keep all others constant",
                      "Style, colour and composition are separate modules with defined handoff points",
                      "Iteration is rapid — change only the module you want to explore",
                    ].map((t,i)=>(
                      <div key={i} className="cmp-item"><span style={{color:"var(--lime)",flexShrink:0}}>✓</span>{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 2: AI AS ART MODULES ─── */}
          {tab===2 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">04</div>
                <div className="sh-txt">
                  <div className="sh-eye">AI Integration</div>
                  <h2>AI Tools as <em>Art Modules</em></h2>
                  <p>Every AI creative tool is a specialised module with a defined input, a single job, and a specific output. Here is the complete vocabulary of AI art modules.</p>
                </div>
              </div>

              <div className="g2 mt16">
                {AI_ART_MODULES.map((m,i)=>(
                  <div key={i} className="card" style={{borderLeft:`3px solid ${m.col}`}}>
                    <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                      <div style={{width:"48px",height:"48px",background:`${m.col}22`,border:`1px solid ${m.col}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>{m.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"8px",color:m.col,letterSpacing:"2px",fontWeight:"700",marginBottom:"3px"}}>AI MODULE</div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:"15px",fontWeight:"700",color:"var(--chalk)",marginBottom:"2px"}}>{m.n}</div>
                        <div style={{fontSize:"9px",color:"var(--muted)",marginBottom:"8px",letterSpacing:".5px"}}>{m.role}</div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}>
                          <div style={{padding:"8px",background:"rgba(74,184,232,.07)",border:"1px solid rgba(74,184,232,.15)"}}>
                            <div style={{fontSize:"8px",letterSpacing:"1.5px",color:"var(--sky)",fontWeight:"700",marginBottom:"4px"}}>ACCEPTS</div>
                            <div style={{fontSize:"10px",color:"var(--chalk)",lineHeight:"1.5"}}>{m.in}</div>
                          </div>
                          <div style={{padding:"8px",background:"rgba(200,255,62,.06)",border:"1px solid rgba(200,255,62,.15)"}}>
                            <div style={{fontSize:"8px",letterSpacing:"1.5px",color:"var(--lime)",fontWeight:"700",marginBottom:"4px"}}>PRODUCES</div>
                            <div style={{fontSize:"10px",color:"var(--chalk)",lineHeight:"1.5"}}>{m.out}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* compatibility table */}
              <div className="card mt20">
                <div className="card-hd">🔌 Module Compatibility Matrix</div>
                <p style={{marginBottom:"14px"}}>For two AI modules to connect, the output type of Module A must match the accepted input of Module B.</p>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:"11px",minWidth:"480px"}}>
                    <thead>
                      <tr style={{background:"rgba(255,255,255,.04)"}}>
                        {["Module","Accepts","Produces","Connects Into"].map(h=>(
                          <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:"8px",letterSpacing:"2px",color:"var(--lime)",fontWeight:"700",textTransform:"uppercase",borderBottom:`2px solid var(--lime)`}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Text AI (ChatGPT)","Your idea (text)","Art direction brief","Image Gen · Style · Music · Voice"],
                        ["Image Gen AI","Text description","PNG/JPG image","Style Transfer · Inpainting · Colour · Video"],
                        ["Style Transfer AI","Image + style reference","Stylised image","Colour Grade · Upscale · Compositing"],
                        ["Inpainting AI","Image + mask + prompt","Partially edited image","Colour · Upscale · Compositing"],
                        ["Colour AI","Image + palette spec","Recoloured image","Upscaling · Final export"],
                        ["Animation AI","Still image + motion text","MP4 video clip","Video editing tools"],
                        ["Compositing AI","Multiple image assets","Unified composition","Colour Grade · Final output"],
                        ["Upscaling AI","Low-res image","4× resolution image","Final export"],
                      ].map((r,i)=>(
                        <tr key={i} style={{borderBottom:"1px solid var(--border)",background:i%2===0?"transparent":"rgba(255,255,255,.02)"}}>
                          {r.map((cell,j)=>(
                            <td key={j} style={{padding:"9px 14px",color:j===0?"var(--chalk)":j===1?"var(--sky)":j===2?"var(--lime)":"var(--muted)",lineHeight:1.5,fontSize:"11px"}}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* anatomy animation */}
              <div className="card mt20">
                <div className="card-hd">⚡ AI Module Chain — Watch the Pipeline Run</div>
                <p style={{marginBottom:"16px"}}>Click below to watch a 4-module creative pipeline execute — Text AI → Image Gen → Style Transfer → Colour Module.</p>
                <div className="anat">
                  <div className="anat-nodes">
                    {AI_ART_MODULES.slice(0,4).map((m,i)=>(
                      <>
                        <div key={i} className={`anat-n${anatStep===i?" active":""}`}>
                          <span className="an-ico">{m.icon}</span>
                          <div className="an-nm">{m.n}</div>
                          <div className="an-tp">{m.role}</div>
                          <div className={`an-st ${anatStep<i?"ast-idle":anatStep===i?"ast-run":"ast-done"}`}>
                            {anatStep<i?"○ Standby":anatStep===i?"● Active":"✓ Done"}
                          </div>
                        </div>
                        {i<3 && <div key={`a${i}`} className={`an-arr${anatStep>i?" lit":""}`}>›</div>}
                      </>
                    ))}
                  </div>
                  {anatStep>=4 && (
                    <div style={{marginTop:"14px",padding:"10px 14px",background:"rgba(200,255,62,.07)",border:"1px solid rgba(200,255,62,.2)"}}>
                      <span style={{fontSize:"10px",color:"var(--lime)",fontWeight:"700",letterSpacing:"1px"}}>✓ PIPELINE COMPLETE — 4 AI art modules executed</span>
                    </div>
                  )}
                </div>
                <div style={{display:"flex",gap:"10px",marginTop:"14px"}}>
                  <button className="btn" onClick={runAnat} disabled={anatRunning}>{anatRunning?"⏳ Running...":"▶ Run Pipeline"}</button>
                  <button className="btn-ghost" onClick={()=>setAnatStep(-1)}>Reset</button>
                </div>
              </div>

              {/* Style transfer explainer */}
              <div className="card mt20" style={{borderTop:"2px solid var(--rose)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🎨</span> Style Transfer: The Most Iconic AI Art Module</div>
                <p style={{marginBottom:"14px"}}>Style transfer is the AI technique that made style into a truly swappable module for the first time. It works by <strong style={{color:"var(--chalk)"}}>separating content from style</strong> using a neural network.</p>
                <div className="g3">
                  {[
                    {n:"1. Content Image",d:"The photograph or artwork you want to transform — the subject, shapes and spatial relationships you want to preserve.",ico:"📷",col:"var(--sky)"},
                    {n:"2. Style Image",d:"A reference artwork whose visual language you want to apply — Van Gogh's swirling brushstrokes, Hokusai's clean ink lines, Kandinsky's geometric forms.",ico:"🖼️",col:"var(--rose)"},
                    {n:"3. Neural Analysis",d:"A convolutional neural network extracts 'feature maps' from both images — one capturing content structure, one capturing style texture at multiple scales.",ico:"🧠",col:"var(--gold)"},
                    {n:"4. Optimisation",d:"A third image is iteratively refined until it matches the content features of Image 1 AND the style features of Image 2 simultaneously.",ico:"🔄",col:"var(--lime)"},
                    {n:"5. Style Output",d:"The result: your content, but expressed in the visual language of the style image. The same content can now be generated in infinite styles.",ico:"✨",col:"var(--coral)"},
                    {n:"Replace the Module",d:"Swap in a different style image and the entire visual language of the output changes — same content module, new style module.",ico:"🔀",col:"var(--sky)"},
                  ].map((s,i)=>(
                    <div key={i} style={{padding:"14px",background:"var(--bcard)",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:"22px",marginBottom:"6px"}}>{s.ico}</div>
                      <div style={{fontSize:"11px",fontWeight:"700",color:s.col,marginBottom:"5px",letterSpacing:".5px"}}>{s.n}</div>
                      <div style={{fontSize:"10px",color:"var(--muted)",lineHeight:"1.7"}}>{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: HOW IT WORKS ─── */}
          {tab===3 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">05</div>
                <div className="sh-txt">
                  <div className="sh-eye">Inside the Modules</div>
                  <h2>How Each Art AI Module <em>Works Internally</em></h2>
                  <p>A look inside the three most important AI art modules — what actually happens between the input arriving and the output leaving.</p>
                </div>
              </div>

              {/* Image Gen internals */}
              <div className="card" style={{borderLeft:"3px solid var(--coral)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🖼️</span> Image Generation Module: Diffusion</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",margin:"14px 0"}}>
                  <div style={{padding:"12px",background:"rgba(74,184,232,.07)",border:"1px solid rgba(74,184,232,.15)"}}>
                    <div style={{fontSize:"8px",color:"var(--sky)",letterSpacing:"2px",fontWeight:"700",marginBottom:"6px"}}>INPUT</div>
                    <div style={{fontSize:"11px",color:"var(--chalk)"}}>Text description: "lighthouse on rocky cliff at dusk, oil painting style, warm golden sky"</div>
                  </div>
                  <div style={{padding:"12px",background:"rgba(200,255,62,.06)",border:"1px solid rgba(200,255,62,.15)"}}>
                    <div style={{fontSize:"8px",color:"var(--lime)",letterSpacing:"2px",fontWeight:"700",marginBottom:"6px"}}>OUTPUT</div>
                    <div style={{fontSize:"11px",color:"var(--chalk)"}}>1024×1024 pixel image matching the description with high visual accuracy</div>
                  </div>
                </div>
                <p style={{marginBottom:"12px"}}>The diffusion model works by <strong style={{color:"var(--chalk)"}}>starting with complete visual chaos</strong> (random static) and progressively removing that noise over approximately 50 steps, guided at every step by your text description.</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:"6px",margin:"14px 0"}}>
                  {[
                    {l:"Pure Noise",ico:"📺",n:"Step 1"},
                    {l:"Rough Blobs",ico:"▒",n:"Step 10"},
                    {l:"Fuzzy Shapes",ico:"🌫️",n:"Step 20"},
                    {l:"Rough Scene",ico:"🌄",n:"Step 35"},
                    {l:"Clear Scene",ico:"🏔️",n:"Step 45"},
                    {l:"Final Image",ico:"🖼️",n:"Step 50"},
                  ].map((s,i)=>(
                    <div key={i} style={{padding:"10px 6px",textAlign:"center",background:i===5?"rgba(200,255,62,.08)":"var(--bcard)",border:`1px solid ${i===5?"var(--lime)":"var(--border)"}`,transition:"all .3s"}}>
                      <div style={{fontSize:"20px",marginBottom:"4px"}}>{s.ico}</div>
                      <div style={{fontSize:"9px",color:i===5?"var(--lime)":"var(--muted)",lineHeight:"1.4"}}>{s.l}</div>
                      <div style={{fontSize:"8px",color:"rgba(255,255,255,.2)",marginTop:"2px"}}>{s.n}</div>
                    </div>
                  ))}
                </div>
                <div className="step-note">
                  <strong style={{color:"var(--gold)"}}>The darkroom analogy:</strong> Imagine a photographic print being developed in chemical solution — starting dark, then slowly the image emerges as the chemistry works. Diffusion AI works the same way in reverse: start with maximum noise, slowly develop clarity. Your prompt is the guide for what the developing image should become.
                </div>
              </div>

              {/* Style Transfer internals */}
              <div className="card mt16" style={{borderLeft:"3px solid var(--rose)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🎨</span> Style Transfer Module: Feature Extraction</div>
                <p style={{marginBottom:"12px"}}>Style transfer uses two neural networks simultaneously — one to understand <strong style={{color:"var(--sky)"}}>what something is</strong> (content) and one to understand <strong style={{color:"var(--rose)"}}>how it looks</strong> (style).</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr auto 1fr",gap:"8px",alignItems:"center",margin:"14px 0"}}>
                  {[
                    {l:"Content Image",d:"Your photo or artwork",ico:"📷",col:"var(--sky)"},
                    {l:"+",d:"",ico:"",col:"",divider:true},
                    {l:"Style Image",d:"A reference artwork",ico:"🖼️",col:"var(--rose)"},
                    {l:"→",d:"",ico:"",col:"",divider:true},
                    {l:"Output",d:"Content + Style merged",ico:"✨",col:"var(--lime)"},
                  ].map((s,i)=> s.divider ? (
                    <div key={i} style={{textAlign:"center",fontSize:"22px",color:"var(--muted)",flexShrink:0}}>{s.l}</div>
                  ) : (
                    <div key={i} style={{padding:"14px",background:"var(--bcard)",border:`1px solid ${s.col}44`,textAlign:"center"}}>
                      <div style={{fontSize:"24px",marginBottom:"6px"}}>{s.ico}</div>
                      <div style={{fontSize:"11px",fontWeight:"700",color:s.col,marginBottom:"4px"}}>{s.l}</div>
                      <div style={{fontSize:"10px",color:"var(--muted)"}}>{s.d}</div>
                    </div>
                  ))}
                </div>
                <div style={{fontFamily:"'Fragment Mono',monospace",fontSize:"11px",color:"var(--muted)",lineHeight:"1.9",padding:"14px",background:"var(--bcard)",border:"1px solid var(--border)"}}>
                  <span style={{color:"var(--sky)",fontWeight:"700"}}>Step 1: </span>CNN extracts CONTENT features from your image — edges, shapes, spatial layout<br/>
                  <span style={{color:"var(--rose)",fontWeight:"700"}}>Step 2: </span>CNN extracts STYLE features from the reference — texture, brushwork, colour relationships<br/>
                  <span style={{color:"var(--gold)",fontWeight:"700"}}>Step 3: </span>A third image is generated and optimised until it satisfies both feature sets simultaneously<br/>
                  <span style={{color:"var(--lime)",fontWeight:"700"}}>Result:  </span>Your content, expressed in the visual language of the reference artwork
                </div>
              </div>

              {/* Colour Module internals */}
              <div className="card mt16" style={{borderLeft:"3px solid var(--lime)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🌈</span> Colour Module: Palette Grading</div>
                <p style={{marginBottom:"12px"}}>The colour module is the most emotionally powerful swappable element in any artwork. It works by <strong style={{color:"var(--chalk)"}}>remapping pixel values</strong> to match a target palette while preserving luminance relationships.</p>
                <div className="g4" style={{margin:"14px 0"}}>
                  {[
                    {p:"Warm Nostalgia",c:["#f5c842","#e88a38","#c85820","#6b2800"],mood:"Comfortable, familiar, analogue"},
                    {p:"Cool Isolation",c:["#2c5f82","#4ab8e8","#c8e8f8","#0c1e2e"],mood:"Distance, solitude, technology"},
                    {p:"Dramatic Tension",c:["#c8ff3e","#ff3e3e","#1a0000","#ff8800"],mood:"Danger, energy, conflict"},
                    {p:"Serene Nature",c:["#4a8060","#a8c890","#e8f0d8","#2d5040"],mood:"Peace, growth, organic"},
                  ].map((p,i)=>(
                    <div key={i} style={{padding:"14px",background:"var(--bcard)",border:"1px solid var(--border)"}}>
                      <div style={{display:"flex",gap:"2px",marginBottom:"8px"}}>
                        {p.c.map((c,j)=><div key={j} style={{flex:1,height:"24px",background:c,borderRadius:"1px"}}/>)}
                      </div>
                      <div style={{fontSize:"10px",fontWeight:"700",color:"var(--chalk)",marginBottom:"3px"}}>{p.p}</div>
                      <div style={{fontSize:"9px",color:"var(--muted)",lineHeight:"1.5"}}>{p.mood}</div>
                    </div>
                  ))}
                </div>
                <div className="step-note">
                  Each palette above is a separate <strong style={{color:"var(--gold)"}}>colour module</strong>. Apply any of them to the same base image and the emotional message of the artwork completely changes — without altering the composition, subject, or style. This is modularity in its purest creative form.
                </div>
              </div>

              {/* Compositing internals */}
              <div className="card mt16" style={{borderLeft:"3px solid var(--gold)"}}>
                <div className="card-hd"><span style={{fontSize:"22px"}}>🧩</span> Compositing Module: Layer Assembly</div>
                <p style={{marginBottom:"12px"}}>Compositing is the module that assembles independent visual assets into a unified scene. It handles <strong style={{color:"var(--chalk)"}}>blending modes, atmospheric perspective, and consistent lighting</strong> across all layers.</p>
                <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
                  {[
                    {n:"Layer 5: Atmosphere",ico:"☁️",col:"var(--sky)",   z:5,blend:"Screen blending — brightens without covering"},
                    {n:"Layer 4: Subject",   ico:"👤",col:"var(--coral)",  z:4,blend:"Normal — sits above all environment layers"},
                    {n:"Layer 3: Midground", ico:"🌲",col:"var(--lime)",   z:3,blend:"Multiply — darkens with atmospheric depth"},
                    {n:"Layer 2: Background",ico:"🌄",col:"var(--gold)",   z:2,blend:"Normal — the horizon and sky foundation"},
                    {n:"Layer 1: Colour Grade",ico:"🌈",col:"var(--rose)", z:1,blend:"Colour — shifts global palette without structure"},
                  ].map((l,i)=>(
                    <div key={i} style={{display:"flex",gap:"12px",alignItems:"center",padding:"10px 12px",background:"var(--bcard)",border:`1px solid ${l.col}33`,borderLeft:`3px solid ${l.col}`}}>
                      <span style={{fontSize:"20px",flexShrink:0}}>{l.ico}</span>
                      <div style={{flex:1}}>
                        <div style={{fontSize:"11px",fontWeight:"700",color:l.col}}>{l.n}</div>
                        <div style={{fontSize:"10px",color:"var(--muted)"}}>{l.blend}</div>
                      </div>
                      <div style={{fontSize:"9px",color:"var(--muted)",letterSpacing:"1px"}}>Z:{l.z}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 4: STEP-BY-STEP EXAMPLES ─── */}
          {tab===4 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">06</div>
                <div className="sh-txt">
                  <div className="sh-eye">Case Studies</div>
                  <h2>Three Complete <em>Modular Examples</em></h2>
                  <p>Full step-by-step walkthroughs — every module, every input, every output, every creative decision explained.</p>
                </div>
              </div>

              {/* example selector */}
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"24px"}}>
                {EXAMPLES_DATA.map((e,i)=>(
                  <button key={i}
                    onClick={()=>{setExIdx(i);setExStep(0);setPipeStep(-1)}}
                    style={{
                      padding:"10px 18px",border:`2px solid ${exIdx===i?e.col:"var(--border)"}`,
                      background:exIdx===i?e.col:"transparent",
                      color:exIdx===i?exIdx===1?"var(--ink)":"white":"var(--muted)",
                      fontFamily:"'Fragment Mono',monospace",fontSize:"11px",fontWeight:"700",
                      cursor:"pointer",transition:"all .2s",letterSpacing:".5px",
                      display:"flex",alignItems:"center",gap:"8px",
                    }}>
                    {e.emoji} {e.title}
                  </button>
                ))}
              </div>

              {/* chain viz */}
              <div className="card" style={{borderTop:`2px solid ${curEx.col}`,marginBottom:"20px"}}>
                <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"16px"}}>
                  <span style={{fontSize:"36px"}}>{curEx.emoji}</span>
                  <div>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:"22px",fontWeight:"900",color:"var(--chalk)",letterSpacing:"-1px"}}>{curEx.title}</div>
                    <div style={{fontSize:"11px",color:"var(--muted)",marginTop:"3px"}}>{curEx.scene}</div>
                  </div>
                </div>
                <div className="chain-row">
                  {curEx.chain.map((c,i)=>(
                    <>
                      <div key={i} className={`cnode${pipeStep>=i?" lit":""}`}>
                        <div className="cnode-num">MODULE {i+1}</div>
                        <span className="cnode-ico">{c.icon}</span>
                        <div className="cnode-nm" style={{color:pipeStep>=i?c.col:"var(--chalk)"}}>{c.tool}</div>
                        <div className="cnode-type">{c.type}</div>
                      </div>
                      {i<curEx.chain.length-1&&<div className={`carr${pipeStep>i?" lit":""}`}>›</div>}
                    </>
                  ))}
                </div>
                <div style={{display:"flex",gap:"10px",marginTop:"14px"}}>
                  <button className="btn" onClick={runPipe} disabled={pipeRunning}>{pipeRunning?"⏳ Running...":"▶ Animate Chain"}</button>
                  <button className="btn-ghost" onClick={()=>setPipeStep(-1)}>Reset</button>
                </div>
              </div>

              {/* step selector */}
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"16px"}}>
                {curEx.chain.map((s,i)=>(
                  <button key={i}
                    onClick={()=>setExStep(i)}
                    style={{
                      padding:"8px 14px",border:"1px solid",cursor:"pointer",
                      fontFamily:"'Fragment Mono',monospace",fontSize:"11px",fontWeight:"700",
                      transition:"all .2s",
                      background:exStep===i?curEx.col:"transparent",
                      borderColor:exStep===i?curEx.col:"var(--border)",
                      color:exStep===i?"white":"var(--muted)",
                    }}>
                    Step {i+1}
                  </button>
                ))}
              </div>

              {/* current step detail */}
              {(()=>{
                const s = curEx.chain[exStep];
                return (
                  <div className="card fade" key={`${exIdx}-${exStep}`} style={{borderLeft:`3px solid ${s.col}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
                      <div style={{width:"48px",height:"48px",background:`${s.col}22`,border:`1px solid ${s.col}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",flexShrink:0}}>{s.icon}</div>
                      <div>
                        <div style={{fontSize:"8px",color:s.col,letterSpacing:"2px",fontWeight:"700",marginBottom:"2px"}}>STEP {exStep+1} · {s.tool} · {s.type}</div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:"20px",fontWeight:"700",color:"var(--chalk)"}}>{s.act}</div>
                      </div>
                    </div>

                    <div className="io-strip">
                      <div className="io-box io-in">
                        <div className="io-lbl">▶ Input</div>
                        <div className="io-val" style={{fontSize:"11px",whiteSpace:"pre-line"}}>{s.inp}</div>
                      </div>
                      <div className="io-mid">⚡</div>
                      <div className="io-box io-out">
                        <div className="io-lbl">◀ Output</div>
                        <div className="io-val" style={{fontSize:"11px",whiteSpace:"pre-line"}}>{s.out}</div>
                      </div>
                    </div>

                    {/* visual demonstration */}
                    <div className="visual-panel mt16" style={{minHeight:"150px"}}>
                      <div className="vp-title">{s.tool} · Processing</div>
                      {(exStep===0) && (
                        <div style={{fontSize:"32px",color:"rgba(255,255,255,.5)",textAlign:"center"}}>
                          💬 → 📋 → 🎯
                          <div style={{fontSize:"12px",color:"rgba(255,255,255,.3)",marginTop:"8px",fontFamily:"'Fragment Mono',monospace"}}>Art direction module active</div>
                        </div>
                      )}
                      {(exStep===1||exStep===2) && (
                        <div style={{width:"100%",padding:"4px"}}>
                          <div className="ademo" style={{gridTemplateColumns:"repeat(8,1fr)"}}>
                            {artGrid.map((c,i)=>(
                              <div key={i} className="ademo-cell" style={{background:c}}/>
                            ))}
                          </div>
                          <div style={{fontSize:"9px",color:"rgba(255,255,255,.2)",marginTop:"8px",textAlign:"right",letterSpacing:"1px"}}>Simulated visual output</div>
                        </div>
                      )}
                      {(exStep===3) && (
                        <div style={{fontSize:"32px",color:"rgba(255,255,255,.4)",textAlign:"center"}}>
                          🖼️ ✅ 🎭
                          <div style={{fontSize:"12px",color:"rgba(255,255,255,.3)",marginTop:"8px",fontFamily:"'Fragment Mono',monospace"}}>Final artwork assembled</div>
                        </div>
                      )}
                      <div className="vp-label">{s.vis}</div>
                    </div>

                    <div className="step-note mt16">
                      <strong style={{color:"var(--gold)"}}>Why this module: </strong>{s.explain}
                    </div>

                    <div style={{display:"flex",gap:"10px",marginTop:"16px"}}>
                      <button className="btn-ghost" onClick={()=>setExStep(Math.max(0,exStep-1))} disabled={exStep===0}>← Previous</button>
                      <button className="btn" onClick={()=>setExStep(Math.min(curEx.chain.length-1,exStep+1))} disabled={exStep===curEx.chain.length-1}>Next Step →</button>
                    </div>

                    <div style={{marginTop:"12px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:"9px",color:"var(--muted)",marginBottom:"4px"}}>
                        <span>Progress through example</span><span>{exStep+1}/{curEx.chain.length}</span>
                      </div>
                      <div className="pbar"><div className="pfill" style={{width:`${((exStep+1)/curEx.chain.length)*100}%`,background:curEx.col}}/></div>
                    </div>
                  </div>
                );
              })()}

              {/* full overview */}
              <div className="card mt20">
                <div className="card-hd">📋 All Steps — {curEx.title}</div>
                <div style={{marginTop:"16px"}}>
                  {curEx.chain.map((s,i)=>(
                    <div key={i} className="step-wrap" style={{cursor:"pointer"}} onClick={()=>setExStep(i)}>
                      <div className="step-n" style={{borderColor:exStep===i?curEx.col:"rgba(255,255,255,.15)",color:exStep===i?curEx.col:"rgba(255,255,255,.2)"}}>{i+1}</div>
                      <div className="step-body">
                        <div className="step-title">{s.act}</div>
                        <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"8px"}}>
                          <span style={{fontSize:"18px"}}>{s.icon}</span>
                          <span style={{fontSize:"10px",fontWeight:"700",color:"var(--muted)"}}>{s.tool} · {s.type}</span>
                        </div>
                        <div className="step-io2">
                          <div className="sbox">
                            <div className="sbox-l sbl-in">IN</div>
                            <div className="sbox-v" style={{fontSize:"10px"}}>{s.inp.slice(0,100)}{s.inp.length>100?"…":""}</div>
                          </div>
                          <div className="sbox">
                            <div className="sbox-l sbl-out">OUT</div>
                            <div className="sbox-v" style={{fontSize:"10px"}}>{s.out.slice(0,100)}{s.out.length>100?"…":""}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 5: BUILD PIPELINE ─── */}
          {tab===5 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">07</div>
                <div className="sh-txt">
                  <div className="sh-eye">Interactive Builder</div>
                  <h2>Assemble Your <em>Art Pipeline</em></h2>
                  <p>Select up to three AI art modules and connect them into a creative pipeline. Click a slot, pick a module, then execute.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-hd">🛠️ Your Art Pipeline</div>
                <div style={{display:"flex",alignItems:"stretch",gap:"8px",marginBottom:"16px",overflowX:"auto",paddingBottom:"6px"}}>
                  {slots.map((s,i)=>(
                    <>
                      <div key={i}
                        className={`bslot${s?" filled":""}${activeSlot===i?" active":""}`}
                        onClick={()=>setActiveSlot(activeSlot===i?null:i)}>
                        {s ? (
                          <>
                            <div className="bs-ico">{s.icon}</div>
                            <div className="bs-nm" style={{color:s.col}}>{s.n}</div>
                            <div className="bs-tp">{s.role}</div>
                            <div style={{fontSize:"8px",color:"var(--lime)",marginTop:"6px",letterSpacing:"1px",fontWeight:"700"}}>→ {s.out}</div>
                          </>
                        ):(
                          <>
                            <div className="bs-ico" style={{color:"var(--border)",fontSize:"24px"}}>+</div>
                            <div className="bs-nm" style={{color:"var(--muted)"}}>Slot {i+1}</div>
                            <div className="bs-tp">tap to assign</div>
                          </>
                        )}
                      </div>
                      {i<2&&<div style={{display:"flex",alignItems:"center",color:slots[i]&&slots[i+1]?"var(--coral)":"rgba(255,255,255,.1)",fontSize:"22px",flexShrink:0,transition:"color .3s"}}>›</div>}
                    </>
                  ))}
                </div>

                {activeSlot!==null&&(
                  <div className="picker">
                    <div className="pk-t">↓ Select Module for Slot {activeSlot+1}</div>
                    <div className="pick-grid">
                      {AI_ART_MODULES.map(m=>(
                        <button key={m.n}
                          className={`pb${slots[activeSlot]?.n===m.n?" sel":""}`}
                          onClick={()=>{const ns=[...slots];ns[activeSlot]=m;setSlots(ns);setActiveSlot(null)}}>
                          {m.icon} {m.n}
                        </button>
                      ))}
                      {slots[activeSlot]&&(
                        <button className="pb" style={{color:"var(--coral)",borderColor:"rgba(255,107,74,.3)"}}
                          onClick={()=>{const ns=[...slots];ns[activeSlot]=null;setSlots(ns);setActiveSlot(null)}}>
                          ✕ Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div style={{marginTop:"16px",display:"flex",gap:"10px",flexWrap:"wrap"}}>
                  {slots.filter(Boolean).length>=2?(
                    <button className="btn" onClick={runBuilder} disabled={buildRunning}>{buildRunning?"⏳ Executing...":"▶ Execute Pipeline"}</button>
                  ):(
                    <div style={{fontSize:"11px",color:"var(--muted)",paddingTop:"8px"}}>Assign at least 2 modules to execute.</div>
                  )}
                  {slots.some(Boolean)&&(
                    <button className="btn-ghost" onClick={()=>{setSlots([null,null,null]);setBuildLog([]);setBuildStep(-1);setActiveSlot(null)}}>Clear All</button>
                  )}
                </div>
              </div>

              {buildLog.length>0&&(
                <div className="card mt16 fade">
                  <div className="card-hd" style={{color:"var(--lime)"}}>⚡ Pipeline Execution Log</div>
                  <div className="log">
                    {buildLog.map((l,i)=>(
                      <span key={i} className={`ll ${l.type}`}>{l.type==="ok"?"":`> `}{l.text}</span>
                    ))}
                    {buildRunning&&<span className="ll run">$ <span className="cur">█</span></span>}
                  </div>
                </div>
              )}

              {buildLog.length>0&&!buildRunning&&(()=>{
                const filled=slots.filter(Boolean);
                const issues=[];
                if(filled[0]?.out==="image"&&filled[1]?.out==="image") issues.push("⚠ Two image-output modules in sequence — consider starting with a Text AI module to generate the precise prompt first.");
                if(filled[0]?.n?.includes("Anim")) issues.push("⚠ Animation AI works best as the final module — it produces video output that downstream modules generally cannot process.");
                return (
                  <div className="card mt12 fade" style={{borderLeft:`3px solid ${issues.length?"var(--gold)":"var(--lime)"}`}}>
                    <div className="card-hd">{issues.length?"⚠ Pipeline Design Feedback":"✓ Pipeline Design Valid"}</div>
                    {issues.length?issues.map((w,i)=><p key={i} style={{marginBottom:"6px"}}>{w}</p>):(
                      <p>Your module sequence follows correct data flow principles. Each module's output format is compatible with the next module's expected input.</p>
                    )}
                  </div>
                );
              })()}

              <div className="card mt20">
                <div className="card-hd">📋 Module Reference</div>
                <div className="g2 mt12">
                  {AI_ART_MODULES.map(m=>(
                    <div key={m.n} style={{padding:"14px",background:"var(--bcard)",border:"1px solid var(--border)",display:"flex",gap:"10px"}}>
                      <div style={{fontSize:"22px",flexShrink:0}}>{m.icon}</div>
                      <div>
                        <div style={{fontSize:"12px",fontWeight:"700",color:m.col,marginBottom:"2px"}}>{m.n}</div>
                        <div style={{fontSize:"9px",color:"var(--muted)",letterSpacing:".5px",marginBottom:"5px"}}>{m.role} · OUT: {m.out}</div>
                        <div style={{fontSize:"10px",color:m.col.replace("var(--","rgba(").replace(")",",.5)")||"var(--muted)"}}>IN: {m.in}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 6: LIVE STUDIO ─── */}
          {tab===6 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">08</div>
                <div className="sh-txt">
                  <div className="sh-eye">Simulation</div>
                  <h2>Live Art <em>Studio Simulation</em></h2>
                  <p>Describe any scene or artwork concept and watch it pass through a 4-module art pipeline — with detailed creative output at every stage.</p>
                </div>
              </div>

              {/* status strip */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr 36px 1fr 36px 1fr",gap:"4px",marginBottom:"20px",alignItems:"stretch"}}>
                {[
                  {icon:"💬",n:"Text AI",t:"Art Direction",k:0},
                  null,
                  {icon:"🖼️",n:"Image Gen",t:"DALL·E",k:1},
                  null,
                  {icon:"🎨",n:"Style Module",t:"Style Transfer",k:2},
                  null,
                  {icon:"🌈",n:"Colour Module",t:"Colour Grade",k:3},
                ].map((n,i)=> n===null?(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"center",color:demoPhase>=Math.floor(i/2)?"var(--coral)":"rgba(255,255,255,.1)",fontSize:"20px",transition:"color .4s"}}>›</div>
                ):(
                  <div key={i} style={{
                    padding:"14px 8px",textAlign:"center",
                    background:demoPhase===n.k?"rgba(255,107,74,.08)":demoPhase>n.k?"rgba(200,255,62,.06)":"var(--bcard)",
                    border:`2px solid ${demoPhase===n.k?"var(--coral)":demoPhase>n.k?"var(--lime)":"var(--border)"}`,
                    transition:"all .4s",
                  }}>
                    <div style={{fontSize:"24px",marginBottom:"5px"}}>{n.icon}</div>
                    <div style={{fontSize:"11px",fontWeight:"700",marginBottom:"2px"}}>{n.n}</div>
                    <div style={{fontSize:"9px",color:"var(--muted)",marginBottom:"5px"}}>{n.t}</div>
                    <div style={{fontSize:"8px",fontWeight:"700",letterSpacing:"1.5px",color:demoPhase===n.k?"var(--coral)":demoPhase>n.k?"var(--lime)":"rgba(255,255,255,.2)"}}>
                      {demoPhase<n.k?"○ STANDBY":demoPhase===n.k?"● RUNNING":"✓ DONE"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{borderTop:"2px solid var(--coral)"}}>
                <div className="card-hd">✍️ Your Artwork Idea</div>
                <div className="io-box io-in" style={{marginBottom:"14px"}}>
                  <div className="io-lbl">▶ Describe Your Scene</div>
                  <textarea className="ta" rows={3}
                    value={demoIn}
                    onChange={e=>setDemoIn(e.target.value)}
                    placeholder="Describe any scene, mood, or artwork you want to create..."/>
                </div>
                <button className="btn" onClick={runDemo} disabled={demoRunning||!demoIn.trim()}>
                  {demoRunning?"⏳ Pipeline Running...":"▶ Run Full Pipeline"}
                </button>
              </div>

              {demoOuts.some(Boolean)&&(
                <div className="mt20" style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                  {[
                    {label:"Module 1 Output — Art Direction Brief",icon:"💬",col:"var(--sky)",k:0},
                    {label:"Module 2 Output — Generated Image",icon:"🖼️",col:"var(--coral)",k:1},
                    {label:"Module 3 Output — Style Applied",icon:"🎨",col:"var(--rose)",k:2},
                    {label:"Module 4 Output — Colour Graded",icon:"🌈",col:"var(--lime)",k:3},
                  ].map(p=>demoOuts[p.k]&&(
                    <div key={p.k} className="card fade" style={{borderLeft:`3px solid ${p.col}`}}>
                      <div className="card-hd" style={{color:p.col}}>
                        <span style={{fontSize:"20px"}}>{p.icon}</span>
                        {p.label}
                        {demoPhase>p.k&&<span style={{color:"var(--lime)",fontSize:"9px",marginLeft:"auto",fontWeight:"700",letterSpacing:"1px"}}>✓ DONE</span>}
                      </div>
                      {p.k===1&&demoPhase>=1&&(
                        <div className="visual-panel" style={{minHeight:"120px",marginBottom:"12px"}}>
                          <div style={{width:"100%",padding:"4px"}}>
                            <div className="ademo" style={{gridTemplateColumns:"repeat(8,1fr)"}}>
                              {(demoGrid.length?demoGrid:artGrid).map((c,i)=>(
                                <div key={i} className="ademo-cell" style={{background:c}}/>
                              ))}
                            </div>
                          </div>
                          <div className="vp-label">Simulated image output</div>
                        </div>
                      )}
                      <div style={{fontFamily:"'Fragment Mono',monospace",fontSize:"11px",background:"var(--bcard)",padding:"14px",border:"1px solid var(--border)",whiteSpace:"pre-wrap",lineHeight:"1.85",color:"var(--chalk)"}}>
                        {demoOuts[p.k]}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {demoPhase>=4&&(
                <div className="card mt16 fade" style={{background:"rgba(200,255,62,.05)",borderColor:"var(--lime)",textAlign:"center",padding:"36px 20px"}}>
                  <div style={{fontSize:"40px",marginBottom:"10px"}}>🎨</div>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:"30px",fontWeight:"900",color:"var(--lime)",letterSpacing:"-1px",marginBottom:"8px"}}>Artwork Complete</div>
                  <div style={{fontSize:"12px",color:"var(--muted)",lineHeight:"1.9",maxWidth:"480px",margin:"0 auto"}}>
                    Your idea passed through <strong style={{color:"var(--chalk)"}}>4 independent AI art modules</strong> —
                    each one contributing a single specialised creative decision.<br/>
                    One sentence became a fully styled, colour-graded artwork.
                  </div>
                  <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap",marginTop:"20px"}}>
                    <button className="btn" onClick={()=>{setDemoPhase(-1);setDemoOuts(["","","",""])}}>↺ New Artwork</button>
                    <button className="btn-ghost" onClick={()=>setTab(5)}>Build Your Own →</button>
                  </div>
                </div>
              )}

              <div className="card mt20">
                <div className="card-hd">🗝️ Prompting Tips for Art Modules</div>
                <div className="g2 mt12">
                  {[
                    {tip:"Name an art medium",ex:'"oil painting", "watercolour wash", "pencil sketch", "digital painting"'},
                    {tip:"Specify the art movement",ex:'"Impressionist", "Bauhaus", "Art Nouveau", "Pop Art", "Ukiyo-e"'},
                    {tip:"Describe the light source",ex:'"golden-hour sidelight", "dramatic chiaroscuro", "flat studio light", "firelight"'},
                    {tip:"Name the palette explicitly",ex:'"warm amber and burnt sienna", "cool blues and greys", "complementary teal and orange"'},
                    {tip:"Describe composition intent",ex:'"rule of thirds", "symmetrical", "diagonal leading line", "frame within a frame"'},
                    {tip:"Specify a named artist style",ex:'"in the style of Edward Hopper", "Rembrandt lighting", "Warhol colour blocking"'},
                  ].map((t,i)=>(
                    <div key={i} style={{padding:"14px",background:"var(--bcard)",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:"11px",fontWeight:"700",color:"var(--coral)",marginBottom:"5px"}}>+ {t.tip}</div>
                      <div style={{fontSize:"10px",color:"var(--muted)",fontStyle:"italic",lineHeight:"1.6"}}>{t.ex}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 7: GLOSSARY ─── */}
          {tab===7 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">09</div>
                <div className="sh-txt">
                  <div className="sh-eye">Reference</div>
                  <h2>Key Terms &amp; <em>Vocabulary</em></h2>
                  <p>The essential vocabulary of modular art and AI creative systems. Every term is worth knowing before working with these tools professionally.</p>
                </div>
              </div>

              <div className="g2">
                {VOCAB.map((v,i)=>(
                  <div key={i} className="term">
                    <div className="term-w" style={{color:v.col}}>{v.w}</div>
                    <div className="term-d">{v.d}</div>
                  </div>
                ))}
              </div>

              <div className="card mt24">
                <div className="card-hd">🎨 Art Module Vocabulary in Context</div>
                <div style={{display:"flex",flexDirection:"column",gap:"10px",marginTop:"12px"}}>
                  {[
                    {scenario:"You generate a city street scene in DALL·E, then run it through a 'Van Gogh' style reference in a style transfer tool.",answer:"You applied a Style Module to a generated Content Image"},
                    {scenario:"You change the colour palette of a finished artwork from warm sunset tones to cool moonlight tones using a colour grading tool.",answer:"You swapped the Colour Module while keeping all other modules constant"},
                    {scenario:"You generate the background, midground, and subject character as three separate images, then combine them in Photoshop.",answer:"You built a Modular Layer Stack and used Compositing to assemble it"},
                    {scenario:"You run the same lighthouse photograph through watercolour style, then oil paint style, then ink sketch style — comparing all three outputs.",answer:"You performed modular Iteration — isolating the style variable, changing one module at a time"},
                  ].map((q,i)=>(
                    <div key={i} style={{border:"1px solid var(--border)",background:"var(--bcard)",overflow:"hidden"}}>
                      <div style={{padding:"14px",borderBottom:"1px solid var(--border)",fontSize:"12px",color:"var(--chalk)",lineHeight:"1.65"}}>{q.scenario}</div>
                      <div style={{padding:"12px 14px",background:"rgba(200,255,62,.06)",display:"flex",gap:"8px",alignItems:"flex-start"}}>
                        <span style={{color:"var(--lime)",fontWeight:"700",flexShrink:0,fontSize:"12px"}}>→</span>
                        <span style={{fontSize:"11px",color:"var(--lime)",fontWeight:"700"}}>{q.answer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card mt16">
                <div className="card-hd">📚 Explore Further</div>
                <div className="g3 mt12">
                  {[
                    {ico:"🖼️",t:"Adobe Firefly",d:"Free tier — Style Reference and Colour Module tools built into Creative Cloud"},
                    {ico:"🎨",t:"Stable Diffusion",d:"Open-source image generation — full access to every module including inpainting and style prompting"},
                    {ico:"🔄",t:"Style Transfer (Neural)",d:"Many free web implementations — upload content + style images and see the technique live"},
                    {ico:"🌈",t:"Adobe Lightroom AI",d:"Professional colour module tools — masking, colour grade, tone curve adjustments"},
                    {ico:"🧩",t:"Canva AI",d:"Free tier — prompt-to-image, background removal, and composition assembly modules"},
                    {ico:"🎬",t:"Runway ML",d:"Free tier — animation module: turn any image into a short video clip with motion guidance"},
                  ].map((t,i)=>(
                    <div key={i} style={{padding:"14px",background:"var(--bcard)",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:"24px",marginBottom:"7px"}}>{t.ico}</div>
                      <div style={{fontSize:"12px",fontWeight:"700",color:"var(--lime)",marginBottom:"4px"}}>{t.t}</div>
                      <div style={{fontSize:"10px",color:"var(--muted)",lineHeight:"1.65"}}>{t.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 8: ASSESSMENT ─── */}
          {tab===8 && (
            <div className="fade">
              <div className="sh">
                <div className="sh-n">10</div>
                <div className="sh-txt">
                  <div className="sh-eye">Assessment</div>
                  <h2>Knowledge <em>Assessment</em></h2>
                  <p>Five questions covering modularity in art, AI creative modules, style transfer, and modular creative thinking.</p>
                </div>
              </div>

              {!qdone?(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                    <span className="tag tg-s">Question {qi+1} of {QUIZ_DATA.length}</span>
                    <span className="tag tg-l">Score: {qsc}/{qi+(qsel!==null?1:0)}</span>
                  </div>
                  <div className="pbar" style={{marginBottom:"28px",height:"4px"}}>
                    <div className="pfill" style={{width:`${(qi/QUIZ_DATA.length)*100}%`}}/>
                  </div>

                  <div className="card" style={{borderTop:"2px solid var(--lime)"}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:"19px",fontWeight:"700",lineHeight:"1.5",marginBottom:"22px",color:"var(--chalk)"}}>
                      {QUIZ_DATA[qi].q}
                    </div>
                    {QUIZ_DATA[qi].opts.map((o,i)=>(
                      <div key={i}
                        className={`qopt${qsel!==null?(i===QUIZ_DATA[qi].a?" ok":i===qsel?" bad":""):""}`}
                        onClick={()=>handleQ(i)}>
                        <div className="ql">{["A","B","C","D"][i]}</div>
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>

                  {qsel!==null&&(
                    <div className="card fade" style={{marginTop:"12px",borderLeft:`3px solid ${qsel===QUIZ_DATA[qi].a?"var(--lime)":"var(--coral)"}`}}>
                      <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                        <span style={{fontSize:"24px"}}>{qsel===QUIZ_DATA[qi].a?"🎯":"📖"}</span>
                        <div>
                          <div style={{fontFamily:"'Fraunces',serif",fontSize:"17px",fontWeight:"700",marginBottom:"8px",color:qsel===QUIZ_DATA[qi].a?"var(--lime)":"var(--coral)"}}>
                            {qsel===QUIZ_DATA[qi].a?"Correct.":"Not quite — here is why:"}
                          </div>
                          <div className="q-exp">{QUIZ_DATA[qi].exp}</div>
                        </div>
                      </div>
                      <button className="btn mt16" onClick={nextQ}>
                        {qi+1<QUIZ_DATA.length?"Next Question →":"View Final Score →"}
                      </button>
                    </div>
                  )}
                </div>
              ):(
                <div className="fade">
                  <div className="card" style={{textAlign:"center",padding:"48px 24px",borderTop:`2px solid ${qsc>=4?"var(--lime)":"var(--coral)"}`}}>
                    <div style={{fontSize:"56px",marginBottom:"14px"}}>
                      {qsc===5?"🏆":qsc>=4?"🎨":qsc>=3?"📖":"✍️"}
                    </div>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:"56px",fontWeight:"900",color:qsc>=4?"var(--lime)":qsc>=3?"var(--gold)":"var(--coral)",lineHeight:1,marginBottom:"8px",letterSpacing:"-2px"}}>
                      {qsc} / 5
                    </div>
                    <div style={{fontSize:"13px",color:"var(--muted)",lineHeight:"1.8",marginBottom:"24px",maxWidth:"440px",margin:"0 auto 24px"}}>
                      {qsc===5?"Perfect result — you understand modular art thinking and AI creative systems at a professional level.":
                       qsc>=4?"Excellent — strong understanding. One concept to review and you are ready to build pipelines.":
                       qsc>=3?"Good foundation. Review the Style Transfer and Examples sections, then retry.":
                       "Revisit the lesson, particularly the AI Modules and Examples tabs, then retry."}
                    </div>
                    <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
                      <button className="btn" onClick={resetQ}>↺ Retry</button>
                      <button className="btn-ghost" onClick={()=>setTab(0)}>← Review</button>
                      <button className="btn-ghost" onClick={()=>setTab(4)}>View Examples</button>
                    </div>
                  </div>

                  <div className="card mt20">
                    <div className="card-hd">📋 Core Takeaways from This Session</div>
                    {[
                      "Every artwork is a system of modules — colour, composition, style, light, texture each function as independent creative decisions",
                      "Modular thinking allows you to change one artistic variable at a time and observe its effect in isolation — the same method scientists use in experiments",
                      "AI style transfer made style a truly swappable module for the first time — separating visual language from content algorithmically",
                      "Diffusion AI starts with random noise and progressively refines it into your image over 50 steps, guided at every step by your text prompt",
                      "Breaking a complex artwork into separate generated layers makes every component independently revisable — change one module without touching others",
                      "The colour module is the most emotionally powerful swappable element — the same composition in warm versus cool tones conveys a completely different message",
                      "Professional AI art workflows are modular pipelines: art direction → generation → style → colour → compositing → animation",
                    ].map((p,i)=>(
                      <div key={i} style={{display:"flex",gap:"10px",marginBottom:"10px",fontSize:"12px",color:"var(--muted)",lineHeight:"1.75"}}>
                        <span style={{color:"var(--lime)",fontWeight:"700",flexShrink:0}}>→</span>{p}
                      </div>
                    ))}
                  </div>

                  <div className="card mt16">
                    <div className="card-hd">🗺️ Real-World Modular Art in Industry</div>
                    <div className="art-strip" style={{margin:"12px 0 0"}}>
                      {[
                        {yr:"Animation Studio",ico:"🎬",nm:"Character Design",desc:"Character shape, colour palette, costume, and facial rig are each designed as separate modules — swap the colour module to produce regional variants."},
                        {yr:"Brand Agency",ico:"✏️",nm:"Visual Identity",desc:"Logo mark, typeface, colour system, photography style — each a module. Applying the colour module to any new asset maintains brand consistency."},
                        {yr:"Game Studio",ico:"🎮",nm:"Procedural Art",desc:"Terrain, texture, lighting and weather are independent modules — randomly combined to generate infinite unique environments."},
                        {yr:"Fashion Editorial",ico:"👗",nm:"Lookbook Production",desc:"Same model, same photographer, same location — only the clothing module changes between frames. Modular control of every variable."},
                        {yr:"Film Production",ico:"🎥",nm:"VFX Pipeline",desc:"Separate modules for lighting, compositing, colour grade, and CGI. Each module is handled by a specialist team and combined in the final composite."},
                      ].map((e,i)=>(
                        <div key={i} className="art-era" style={{flex:"0 0 190px"}}>
                          <div className="ae-art">{e.ico}</div>
                          <div className="ae-yr">{e.yr}</div>
                          <div className="ae-nm">{e.nm}</div>
                          <div className="ae-desc">{e.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>{/* end .pg */}

        <footer className="footer layer">
          Art × AI Modularity · Studio Session<br/>
          <span>Every module is a creative decision. Every pipeline is a creative system.</span>
        </footer>

      </div>
    </>
  );
}
