#!/usr/bin/env node
// Visuels des stores, façon fiches Google (Agenda, Keep, Fit) : un aplat ambre pâle,
// un titre court, la vraie capture dans un cadre de téléphone fin qui sort par le bas,
// et, selon l'écran, une carte de l'interface agrandie ou la montre qui vient chevaucher
// le téléphone. En fond, la crête du vrai profil de gta.gpx, à peine plus foncée que
// la page. Rendu HTML/CSS dans Chromium (Playwright) à la taille exacte, puis aplati
// en PNG RGB par `postprocess.py`.
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

// Palette : l'ambre et l'encre de l'icône, le reste en est dérivé.
const C = {
  bg: '#FFF2DA', // ambre de l'icône à 20 % sur blanc
  crest: '#FFE4B8', // la crête, un cran plus foncé que la page
  ink: '#12151B',
  sub: '#5C4A2A', // 7,5:1 sur la page
  eyebrow: '#9A5B00', // 5,3:1 sur la page
  frame: '#1B1E24',
  frameRing: '#2C313B',
  cardRing: '#2A313D',
  watchCase: '#22262E',
  strap: '#2E333D',
  beigeCase: '#C8BC9F',
  beigeStrap: '#D9CDB4',
};
const SHADOW = '0 28px 64px rgba(18,21,27,.24), 0 2px 8px rgba(18,21,27,.10)';
const SHADOW_CARD = '0 24px 56px rgba(18,21,27,.32), 0 2px 6px rgba(18,21,27,.14)';

// Profil d'altitude réel de gta.gpx : 0..1000 en x, 0..1000 en y (0 = sommet).
const PROFILE = JSON.parse(await fs.readFile(path.join(SRC, 'assets', 'profil_gta.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Textes
// ---------------------------------------------------------------------------
// Chaque capture : [nom de sortie, composition, source, surtitre, titre, sous-titre].
const T = {
  fr: {
    shots: [
      ['01_plan_allure', 'hero', '01_accueil', 'Plan d’allure', 'Ton GPX devient\nun plan d’allure', 'Un temps de référence pour chaque point\ndu parcours, pondéré par le dénivelé.'],
      ['02_chaque_pente', 'zoom-right', { shot: '02_plan_profil_split', box: [160, 790, 1000, 1465] }, 'Profil par pente', 'Chaque pente\na son coût', 'Profil coloré par pente, courbe d’allure,\nstratégie de split réglable.'],
      ['03_sur_la_montre', 'watch', 'anneauNoir2', 'Champ de données', 'Sur la montre,\nl’écart au plan', 'En minutes, avec l’heure d’arrivée estimée.\nRien d’autre à lire en course.'],
      ['04_envoi_montre', 'phone-watch', '03_passages_rappels_montre', 'Envoi', 'Points de passage,\nenvoi en un geste', 'Passages, rappels, puis le plan part\nsur la montre par Garmin Connect.'],
      ['05_bilan_par_pente', 'zoom-left', { shot: '04_bilan_ecart_par_pente', box: [56, 728, 1023, 1228] }, 'Rapport de course', 'Le bilan,\npente par pente', 'Temps final, écart au plan, effort :\ngagné ou perdu selon la pente.'],
      ['06_profil_coureur', 'zoom-right', { shot: '07_allure_par_pente_profil_coureur', box: [56, 1318, 1023, 1930], zoomY: 1330, zoomS: 0.9 }, 'Profil du coureur', 'Ton profil apprend\nde tes courses', 'Ton allure selon la pente, face au traileur\nmoyen. Le plan suivant s’y ajuste.'],
      ['07_deux_cadrans', 'pair', null, 'Cadrans', 'Deux cadrans,\nnoir ou beige', 'Anneau de progression ou Horizon.\nDeux thèmes, au choix sur le téléphone.'],
    ],
    tagline: 'Cours ton plan,\npas ta montre.',
    featureSub: 'Plan d’allure sur le téléphone,\nécart au plan sur la montre Garmin.',
    ciqSub: 'L’écart au plan et l’heure d’arrivée, en course.\nLe plan vient de l’appli GPX Pacer sur le téléphone.',
  },
  en: {
    shots: [
      ['01_plan_allure', 'hero', '01_accueil', 'Pacing plan', 'Turn any GPX\ninto a pacing plan', 'A reference time for every point of the\nroute, weighted by elevation gain.'],
      ['02_chaque_pente', 'zoom-right', { shot: '02_plan_profil_split', box: [160, 790, 1000, 1465] }, 'Gradient profile', 'Every climb\nhas its cost', 'Profile coloured by gradient, pace curve,\nadjustable split strategy.'],
      ['03_sur_la_montre', 'watch', 'anneauNoir2', 'Data field', 'On your watch,\nthe gap to plan', 'In minutes, with the estimated finish time.\nNothing else to read while you run.'],
      ['04_envoi_montre', 'phone-watch', '03_passages_rappels_montre', 'Send', 'Checkpoints, then\none tap to the watch', 'Checkpoints, reminders, and the plan goes\nto the watch through Garmin Connect.'],
      ['05_bilan_par_pente', 'zoom-left', { shot: '04_bilan_ecart_par_pente', box: [56, 728, 1023, 1228] }, 'Race report', 'Your race,\nslope by slope', 'Finish time, gap to plan, effort:\nwhat you won or lost on each gradient.'],
      ['06_profil_coureur', 'zoom-right', { shot: '07_allure_par_pente_profil_coureur', box: [56, 1318, 1023, 1930], zoomY: 1330, zoomS: 0.9 }, 'Runner profile', 'Your profile learns\nfrom every run', 'Your pace by gradient, against the average\ntrail runner. The next plan adjusts to it.'],
      ['07_deux_cadrans', 'pair', null, 'Watch faces', 'Two watch faces,\ndark or light', 'Progress ring or Horizon.\nTwo themes, picked on the phone.'],
    ],
    tagline: 'Run your plan,\nnot your watch.',
    featureSub: 'A pacing plan on the phone,\nthe gap to plan on your Garmin watch.',
    ciqSub: 'Gap to plan and finish time, while you run.\nThe plan comes from the GPX Pacer app on the phone.',
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

// ---------------------------------------------------------------------------
// Briques
// ---------------------------------------------------------------------------

// Crête : le profil réel étiré dans la boîte (x, y, w, h), rempli jusqu'au bas de la page.
function crest({ pageW, pageH, x, y, w, h, fill = C.crest }) {
  const pts = PROFILE.map(([px, py]) => [x + (px / 1000) * w, y + (py / 1000) * h]);
  const line = pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a.toFixed(1)} ${b.toFixed(1)}`).join(' ');
  const [x0] = pts[0];
  const [x1] = pts[pts.length - 1];
  return `<svg class="abs" style="left:0;top:0" width="${pageW}" height="${pageH}" viewBox="0 0 ${pageW} ${pageH}" aria-hidden="true">
    <path d="${line} L${x1.toFixed(1)} ${pageH + 20} L${x0.toFixed(1)} ${pageH + 20} Z" fill="${fill}"/></svg>`;
}

// Téléphone générique : cadre fin, coins arrondis, écran = capture 1080 × 2400 à l'échelle.
function phone({ shot, x, y, w }) {
  const bezel = Math.round(w * 0.018);
  const sw = w - 2 * bezel;
  const sh = Math.round((sw * 2400) / 1080);
  const r = Math.round(w * 0.085);
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;padding:${bezel}px;border-radius:${r}px;background:${C.frame};box-shadow:${SHADOW},inset 0 0 0 2px ${C.frameRing}">
    <div style="width:${sw}px;height:${sh}px;border-radius:${r - bezel}px;overflow:hidden;background:#0C0E13"><img src="${ASSETS}/telephone/${shot}.png" width="${sw}" height="${sh}"></div></div>`;
}

// Carte agrandie : une zone (box, en px de la capture 1080 × 2400) à l'échelle s.
function zoom({ shot, box, s, x, y, radius = 30 }) {
  const [bx, by, bx2, by2] = box;
  const w = Math.round((bx2 - bx) * s);
  const h = Math.round((by2 - by) * s);
  return `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${radius}px;overflow:hidden;background:#151A23;box-shadow:${SHADOW_CARD},0 0 0 2px ${C.cardRing}">
    <img src="${ASSETS}/telephone/${shot}.png" width="${1080 * s}" height="${2400 * s}" style="position:absolute;left:${-bx * s}px;top:${-by * s}px"></div>`;
}

// Montre ronde générique : bracelet, boîtier, cadran découpé au cercle.
// `top` : départ du bracelet haut (null = pas de bracelet) ; `bottom` : arrivée du bas.
function watch({ dial, d, cx, cy, top = null, bottom = null, caseColor = C.watchCase, strap = C.strap }) {
  const sw = Math.round(d * 0.42);
  const parts = [];
  const strapCss = `left:${cx - sw / 2}px;width:${sw}px;background:${strap};border-radius:${Math.round(sw * 0.18)}px`;
  if (top !== null) parts.push(`<div class="abs" style="${strapCss};top:${top}px;height:${cy - top}px"></div>`);
  if (bottom !== null) parts.push(`<div class="abs" style="${strapCss};top:${cy}px;height:${bottom - cy}px"></div>`);
  const dc = d * 1.06;
  parts.push(`<div class="abs round" style="left:${cx - dc / 2}px;top:${cy - dc / 2}px;width:${dc}px;height:${dc}px;background:${caseColor};box-shadow:${SHADOW}"></div>`);
  const s = d / (2 * DIAL.r);
  parts.push(`<div class="abs round" style="left:${cx - d / 2}px;top:${cy - d / 2}px;width:${d}px;height:${d}px;overflow:hidden;background:#000">
    <img src="${ASSETS}/${DIALS[dial]}" width="${DIAL.size * s}" height="${DIAL.size * s}" style="position:absolute;left:${d / 2 - DIAL.cx * s}px;top:${d / 2 - DIAL.cy * s}px"></div>`);
  return parts.join('\n');
}

function icon(size) {
  return `<div style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.22)}px;overflow:hidden;flex:none;box-shadow:0 6px 18px rgba(18,21,27,.18)"><img src="${ASSETS}/icone_play_512.svg" width="${size}" height="${size}"></div>`;
}

// Bloc de titre centré : surtitre mono, titre Archivo, sous-titre Roboto.
function head({ eyebrow, title, sub, top = 128 }) {
  return `<div class="abs head" style="left:72px;right:72px;top:${top}px">
    <div class="eyebrow">${eyebrow}</div>
    <h1>${br(title)}</h1>
    <p class="sub">${br(sub)}</p></div>`;
}

function page(w, h, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url(${ASSETS}/fonts/Archivo-500.ttf);font-weight:500}
@font-face{font-family:Archivo;src:url(${ASSETS}/fonts/Archivo-600.ttf);font-weight:600}
@font-face{font-family:Archivo;src:url(${ASSETS}/fonts/Archivo-700.ttf);font-weight:700}
@font-face{font-family:Archivo;src:url(${ASSETS}/fonts/Archivo-800.ttf);font-weight:800}
@font-face{font-family:Plex;src:url(${ASSETS}/fonts/IBMPlexMono-500.ttf);font-weight:500}
@font-face{font-family:Roboto;src:url(${ASSETS}/fonts/Roboto-Variable.ttf) format('truetype');font-weight:100 900}
*{margin:0;box-sizing:content-box}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${C.bg};color:${C.ink};font-family:Roboto,sans-serif;position:relative;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
img{display:block}
.abs{position:absolute}.round{border-radius:50%}
.head{display:flex;flex-direction:column;align-items:center;text-align:center;gap:20px}
.eyebrow{font-family:Plex,monospace;font-weight:500;font-size:24px;letter-spacing:.22em;text-transform:uppercase;color:${C.eyebrow}}
h1{font-family:Archivo,sans-serif;font-weight:700;font-size:76px;line-height:1.08;letter-spacing:-.022em;text-wrap:balance}
.sub{font-size:31px;line-height:1.38;color:${C.sub};max-width:860px}
.brand{display:flex;align-items:center;gap:18px;font-family:Archivo,sans-serif;font-weight:600;letter-spacing:-.01em}
.tag{font-family:Archivo,sans-serif;font-weight:700;line-height:1.08;letter-spacing:-.022em}
</style></head><body>${body}</body></html>`;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

// Capture Play 1080 × 1920.
function shotPage(kind, src, eyebrow, title, sub) {
  const W = 1080, H = 1920;
  const parts = [crest({ pageW: W, pageH: H, x: -40, y: 1140, w: W + 80, h: 820 })];
  switch (kind) {
    case 'hero':
      parts.push(phone({ shot: src, x: 140, y: 520, w: 800 }));
      break;
    case 'zoom-right': {
      // Téléphone à gauche, carte agrandie (×1,5 par rapport à l'écran) qui le chevauche à droite.
      parts.push(phone({ shot: src.shot, x: 40, y: 520, w: 680 }));
      const s = src.zoomS ?? 0.95;
      const zw = (src.box[2] - src.box[0]) * s;
      parts.push(zoom({ shot: src.shot, box: src.box, s, x: Math.round(1050 - zw), y: src.zoomY ?? 1270 }));
      break;
    }
    case 'zoom-left':
      parts.push(phone({ shot: src.shot, x: 360, y: 520, w: 680 }));
      parts.push(zoom({ shot: src.shot, box: src.box, s: 0.92, x: 30, y: 1400 }));
      break;
    case 'watch':
      parts.push(watch({ dial: src, d: 760, cx: W / 2, cy: 1230, top: 500, bottom: H + 40 }));
      break;
    case 'phone-watch':
      parts.push(phone({ shot: src, x: 110, y: 520, w: 780 }));
      parts.push(watch({ dial: 'anneauNoir2', d: 400, cx: 880, cy: 1700, top: 1400, bottom: H + 40 }));
      break;
    case 'pair':
      parts.push(watch({ dial: 'horizonNoir', d: 470, cx: 300, cy: 920, top: 500, bottom: H + 40 }));
      parts.push(watch({ dial: 'anneauBeige2', d: 470, cx: 780, cy: 1200, top: 500, bottom: H + 40, caseColor: C.beigeCase, strap: C.beigeStrap }));
      break;
  }
  parts.push(head({ eyebrow, title, sub }));
  return page(W, H, parts.join('\n'));
}

// Image de présentation Play 1024 × 500 : texte dans la zone sûre, téléphone + montre à droite.
function featurePage(lang) {
  const W = 1024, H = 500;
  return page(W, H, `
    ${crest({ pageW: W, pageH: H, x: -20, y: 300, w: W + 40, h: 260 })}
    ${phone({ shot: '01_accueil', x: 690, y: 64, w: 262 })}
    ${watch({ dial: 'anneauNoir2', d: 208, cx: 650, cy: 338 })}
    <div class="abs brand" style="left:104px;top:96px;font-size:34px">${icon(62)}<span>GPX Pacer</span></div>
    <div class="abs tag" style="left:104px;top:190px;font-size:54px">${br(T[lang].tagline)}</div>
    <div class="abs sub" style="left:106px;top:338px;font-size:21px;line-height:1.4">${br(T[lang].featureSub)}</div>`);
}

// Bandeau Connect IQ 1440 × 720 : la montre seule, en grand.
function ciqPage(lang) {
  const W = 1440, H = 720;
  return page(W, H, `
    ${crest({ pageW: W, pageH: H, x: -20, y: 420, w: W + 40, h: 360 })}
    ${watch({ dial: 'anneauNoir2', d: 520, cx: 1060, cy: 360, top: -40, bottom: H + 40 })}
    <div class="abs brand" style="left:120px;top:150px;font-size:40px">${icon(74)}<span>GPX Pacer</span></div>
    <div class="abs tag" style="left:120px;top:262px;font-size:72px">${br(T[lang].tagline)}</div>
    <div class="abs sub" style="left:122px;top:452px;font-size:26px;line-height:1.42">${br(T[lang].ciqSub)}</div>`);
}

// ---------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------
const jobs = [];
for (const lang of ['fr', 'en']) {
  for (const [name, kind, src, eyebrow, title, sub] of T[lang].shots) {
    jobs.push({ name: `play/${lang}/${name}.png`, w: 1080, h: 1920, html: shotPage(kind, src, eyebrow, title, sub) });
  }
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
