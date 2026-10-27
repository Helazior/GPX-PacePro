#!/usr/bin/env node
// Visuels des stores, façon fiches Google (Agenda, Keep, Fit) : un aplat ambre pâle,
// la vraie capture dans un cadre de téléphone fin, coupée en bas, une phrase courte en
// tête. Rendu HTML/CSS dans Chromium (Playwright) à la taille exacte, puis aplati en
// PNG RGB par `postprocess.py`.
//
//   node store/src/build_google.mjs          # tout
//   node store/src/build_google.mjs fr       # filtre sur le nom de sortie
//
// Sorties sous `store/google/`. Rien n'est retouché : les écrans sont les captures du kit.

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = pathToFileURL(path.join(SRC, 'assets')).href;
const OUT = path.join(SRC, '..', 'google');
const TMP = path.join(OUT, '.tmp');

const C = {
  bg: '#FFF1D6', // ambre de l'icône, très éclairci
  ink: '#12151B',
  sub: '#5C4A2A', // 7,9:1 sur le fond
  frame: '#1B1E24',
  watchCase: '#22262E',
  strap: '#2C313B',
  bezel: '#3A3D45',
};

const T = {
  fr: {
    shots: [
      ['01_plan_allure', 'phone', '01_accueil', 'Ton GPX devient\nun plan d’allure'],
      ['02_chaque_pente', 'phone', '02_plan_profil_split', 'Chaque pente\na son coût'],
      ['03_sur_la_montre', 'watch', 'anneauNoir2', 'Sur la montre,\nl’écart au plan'],
      ['04_envoi_montre', 'phone', '03_passages_rappels_montre', 'Points de passage,\nenvoi en un geste'],
      ['05_bilan_par_pente', 'phone', '04_bilan_ecart_par_pente', 'Le bilan,\npente par pente'],
      ['06_profil_coureur', 'phone', '07_allure_par_pente_profil_coureur', 'Ton profil apprend\nde tes courses'],
      ['07_deux_cadrans', 'pair', null, 'Deux cadrans,\nnoir ou beige'],
    ],
    tagline: 'Cours ton plan,\npas ta montre.',
    ciqSub: 'L’écart au plan et l’heure d’arrivée,\nen course. Le plan vient du téléphone.',
  },
  en: {
    shots: [
      ['01_plan_allure', 'phone', '01_accueil', 'Turn any GPX\ninto a pacing plan'],
      ['02_chaque_pente', 'phone', '02_plan_profil_split', 'Every climb\nhas its cost'],
      ['03_sur_la_montre', 'watch', 'anneauNoir2', 'On your watch,\nthe gap to plan'],
      ['04_envoi_montre', 'phone', '03_passages_rappels_montre', 'Checkpoints, sent\nto your watch'],
      ['05_bilan_par_pente', 'phone', '04_bilan_ecart_par_pente', 'Your race,\nslope by slope'],
      ['06_profil_coureur', 'phone', '07_allure_par_pente_profil_coureur', 'Your profile learns\nfrom every run'],
      ['07_deux_cadrans', 'pair', null, 'Two watch faces,\ndark or light'],
    ],
    tagline: 'Run your plan,\nnot your watch.',
    ciqSub: 'Gap to plan and finish time, while\nyou run. The plan comes from your phone.',
  },
};

// Cadrans : captures 830 px de l'aperçu téléphone, lunette comprise dans r.
const DIAL = { size: 830, cx: 414, cy: 420, r: 361.5 };
const DIALS = {
  anneauNoir2: 'cadrans/cadran_anneau_noir_2champs.png',
  anneauBeige2: 'cadrans/cadran_anneau_beige_2champs.png',
  horizonNoir: 'cadrans/cadran_horizon_noir.png',
  horizonBeige: 'cadrans/cadran_horizon_beige.png',
};

const br = (s) => s.replace(/\n/g, '<br>');

function phone({ shot, x, y, w }) {
  const bezel = Math.round(w * 0.02);
  const sw = w - 2 * bezel;
  const sh = Math.round((sw * 2400) / 1080);
  const r = Math.round(w * 0.09);
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;padding:${bezel}px;border-radius:${r}px;background:${C.frame}">
    <div style="width:${sw}px;height:${sh}px;border-radius:${r - bezel}px;overflow:hidden"><img src="${ASSETS}/telephone/${shot}.png" width="${sw}" height="${sh}"></div></div>`;
}

// Montre ronde générique : bracelet jusqu'aux bords, boîtier, cadran découpé au cercle.
function watch({ dial, d, cx, cy, h, straps = true, top = -40, caseColor = C.watchCase, strap = C.strap }) {
  const sw = Math.round(d * 0.44);
  const parts = [];
  if (straps) parts.push(`<div class="abs" style="left:${cx - sw / 2}px;top:${top}px;width:${sw}px;height:${h + 40 - top}px;background:${strap};border-radius:36px"></div>`);
  const dc = d * 1.06;
  parts.push(`<div class="abs round" style="left:${cx - dc / 2}px;top:${cy - dc / 2}px;width:${dc}px;height:${dc}px;background:${caseColor}"></div>`);
  const s = d / (2 * DIAL.r);
  parts.push(`<div class="abs round" style="left:${cx - d / 2}px;top:${cy - d / 2}px;width:${d}px;height:${d}px;overflow:hidden">
    <img src="${ASSETS}/${DIALS[dial]}" width="${DIAL.size * s}" height="${DIAL.size * s}" style="position:absolute;left:${d / 2 - DIAL.cx * s}px;top:${d / 2 - DIAL.cy * s}px"></div>`);
  return parts.join('\n');
}

function icon(size) {
  return `<div style="width:${size}px;height:${size}px;border-radius:${size * 0.22}px;overflow:hidden;flex:none"><img src="${ASSETS}/icone_play_512.svg" width="${size}" height="${size}"></div>`;
}

function page(w, h, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Roboto;src:url(${ASSETS}/fonts/Roboto-Variable.ttf) format('truetype');font-weight:100 900}
*{margin:0;box-sizing:content-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${C.bg};color:${C.ink};font-family:Roboto,sans-serif;position:relative;-webkit-font-smoothing:antialiased}
img{display:block}
.abs{position:absolute}.round{border-radius:50%}
h1{font-weight:600;letter-spacing:-.01em;line-height:1.14;text-align:center}
</style></head><body>${body}</body></html>`;
}

// Capture Play 1080 × 1920 : titre centré, téléphone (ou montre) qui sort par le bas.
function shotPage(kind, src, title) {
  const W = 1080, H = 1920;
  const head = `<h1 class="abs" style="left:80px;right:80px;top:150px;font-size:68px">${br(title)}</h1>`;
  let art;
  if (kind === 'phone') art = phone({ shot: src, x: 150, y: 470, w: 780 });
  else if (kind === 'watch') art = watch({ dial: src, d: 760, cx: W / 2, cy: 1200, h: H, top: 470 });
  else art = [
    watch({ dial: 'horizonNoir', d: 470, cx: 300, cy: 900, h: H, top: 470 }),
    watch({ dial: 'anneauBeige2', d: 470, cx: 780, cy: 1180, h: H, top: 470, caseColor: '#C8BC9F', strap: '#D9CDB4' }),
  ].join('\n');
  return page(W, H, art + head);
}

// Image de présentation Play 1024 × 500 : texte dans la zone sûre, téléphone + montre à droite.
function featurePage(lang) {
  const W = 1024, H = 500;
  return page(W, H, `
    ${phone({ shot: '01_accueil', x: 640, y: 70, w: 270 })}
    ${watch({ dial: 'anneauNoir2', d: 210, cx: 610, cy: 330, h: H, straps: false })}
    <div class="abs" style="left:96px;top:118px;display:flex;align-items:center;gap:18px">${icon(64)}
      <div style="font-size:34px;font-weight:600">GPX Pacer</div></div>
    <div class="abs" style="left:96px;top:212px;font-size:44px;font-weight:600;line-height:1.12;letter-spacing:-.01em">${br(T[lang].tagline)}</div>`);
}

// Bandeau Connect IQ 1440 × 720 : la montre seule, en grand.
function ciqPage(lang) {
  const W = 1440, H = 720;
  return page(W, H, `
    ${watch({ dial: 'anneauNoir2', d: 520, cx: 1060, cy: 360, h: H })}
    <div class="abs" style="left:120px;top:170px;display:flex;align-items:center;gap:20px">${icon(76)}
      <div style="font-size:40px;font-weight:600">GPX Pacer</div></div>
    <div class="abs" style="left:120px;top:282px;font-size:64px;font-weight:600;line-height:1.1;letter-spacing:-.015em">${br(T[lang].tagline)}</div>
    <div class="abs" style="left:120px;top:448px;font-size:26px;line-height:1.4;color:${C.sub}">${br(T[lang].ciqSub)}</div>`);
}

const jobs = [];
for (const lang of ['fr', 'en']) {
  for (const [name, kind, src, title] of T[lang].shots) jobs.push({ name: `play/${lang}/${name}.png`, w: 1080, h: 1920, html: shotPage(kind, src, title) });
  jobs.push({ name: `play/feature_1024x500_${lang}.png`, w: 1024, h: 500, html: featurePage(lang) });
  jobs.push({ name: `connectiq/hero_1440x720_${lang}.png`, w: 1440, h: 720, html: ciqPage(lang) });
}

const filter = process.argv[2];
const todo = jobs.filter((j) => !filter || j.name.includes(filter));
await fs.mkdir(TMP, { recursive: true });
const browser = await chromium.launch();
const done = [];
for (const j of todo) {
  const dest = path.join(OUT, j.name);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const f = path.join(TMP, j.name.replace(/\//g, '_') + '.html');
  await fs.writeFile(f, j.html);
  const pg = await browser.newPage({ viewport: { width: j.w, height: j.h } });
  await pg.goto(pathToFileURL(f).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForLoadState('networkidle');
  await pg.screenshot({ path: dest, clip: { x: 0, y: 0, width: j.w, height: j.h } });
  await pg.close();
  done.push(dest);
}
await browser.close();
await fs.rm(TMP, { recursive: true, force: true });
const r = spawnSync('python3', ['-I', path.join(SRC, 'postprocess.py'), ...done], { stdio: 'inherit' });
process.exit(r.status ?? 1);
