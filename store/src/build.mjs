#!/usr/bin/env node
// Génère les visuels des stores (Google Play + Connect IQ) à partir des captures
// du kit (`assets/`). Chaque visuel est une page HTML rendue par Chromium
// (Playwright) à la taille exacte demandée, puis aplatie en PNG RGB (voir
// `postprocess.py`, lancé en fin de build).
//
//   node store/src/build.mjs            # tout
//   node store/src/build.mjs play       # seulement les sorties dont le nom contient « play »
//
// Les chiffres montrés viennent des captures (course du 10/10/2026, démo du cadran) ;
// rien n'est inventé ici, on ne fait que composer.

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Playwright peut être installé globalement (NODE_PATH) : on passe par require.
const { chromium } = createRequire(import.meta.url)('playwright');

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(SRC, 'assets');
const OUT = path.join(SRC, '..');
const ORIGIN = 'http://gpx-pacer.local';

// ---------------------------------------------------------------------------
// Palette (brief-design.md)
// ---------------------------------------------------------------------------
const C = {
  ink: '#12151B',
  amber: '#FFA827',
  bg: '#0C0E13',
  card: '#151A23',
  line: '#262C38',
  fg: '#F0F2F7',
  fg2: '#8A92A4',
  fg3: '#5C6470',
  blue: '#2196F3',
  green: '#7BD88F',
  red: '#E0645C',
  beige: '#EDE4D0',
  bezelNoir: '#3A3D45',
  bezelBeige: '#6E6656',
};

// Teintes dérivées, calculées une fois pour toutes (mélanges encre/ambre, encre/fond)
// pour rester en aplats : aucun dégradé, aucune ombre.
const D = {
  amberEyebrow: '#59411F', // encre à 70 % sur ambre
  amberSub: '#3A2C17', // encre à 80 % sur ambre
  amberCrest: '#1B1F27', // crête sur ambre, un cran plus clair que le cadre du téléphone
  darkCrest: '#151A23', // crête sur fond sombre = couleur de carte
  phoneFrame: '#1E222A',
  phoneRing: '#333945',
  watchCase: '#20252E',
  watchStrap: '#1A1E26',
  beigeInk: '#12151B',
  beigeStrap: '#D5CAB2',
  beigeCase: '#C8BC9F',
};

// ---------------------------------------------------------------------------
// Textes FR / EN (légendes du brief, slogan, sous-titres descriptifs)
// ---------------------------------------------------------------------------
const T = {
  fr: {
    slogan: 'Cours ton plan, pas ta montre.',
    s1: {
      eyebrow: '01 · Plan d’allure',
      title: 'Ton GPX devient un plan d’allure',
      sub: 'Un temps de référence pour chaque point du parcours, pondéré par le dénivelé et le terrain.',
    },
    s2: {
      eyebrow: '02 · Profil par pente',
      title: 'Chaque pente a son coût',
      sub: 'Profil coloré par pente, courbe d’allure, stratégie de split réglable.',
    },
    s3: {
      eyebrow: '03 · Points de passage',
      title: 'Tes points de passage, tes temps',
      sub: 'Passages, rappels, envoi du plan à la montre.',
    },
    s4: {
      eyebrow: '04 · Champ de données',
      title: 'Sur la montre : l’écart, rien d’autre',
      sub: 'Écart au plan en minutes, chrono, heure d’arrivée estimée.',
    },
    s5: {
      eyebrow: '05 · Rapport de course',
      title: 'À l’arrivée, le rapport de course',
      sub: 'Temps final, écart au plan, gagné ou perdu par pente, effort cardiaque.',
    },
    s6: {
      eyebrow: '06 · Profil du coureur',
      title: 'Ton profil apprend de tes courses',
      sub: 'Allure selon la pente : toi face au traileur moyen.',
    },
    s7: {
      eyebrow: '07 · Cadrans',
      title1: 'Deux cadrans,',
      title2: 'deux thèmes.',
      sub1: 'Anneau de progression ou Horizon.',
      sub2: 'Noir ou beige.',
    },
    feature: {
      sub: 'Un plan d’allure sur le téléphone, l’écart au plan sur la montre.',
    },
    hero: {
      eyebrow: 'Champ de données',
      sub: 'L’écart au plan, en minutes, et l’heure d’arrivée. Le plan vient du téléphone.',
    },
  },
  en: {
    slogan: 'Run your plan, not your watch.',
    s1: {
      eyebrow: '01 · Pacing plan',
      title: 'Your GPX becomes a pacing plan',
      sub: 'A reference time for every point of the route, weighted by elevation and terrain.',
    },
    s2: {
      eyebrow: '02 · Gradient profile',
      title: 'Every climb has its price',
      sub: 'Profile coloured by gradient, pace curve, adjustable split strategy.',
    },
    s3: {
      eyebrow: '03 · Checkpoints',
      title: 'Your checkpoints, your times',
      sub: 'Checkpoints, reminders, send the plan to the watch.',
    },
    s4: {
      eyebrow: '04 · Data field',
      title: 'On the watch: the gap, nothing else',
      sub: 'Gap to plan in minutes, chrono, estimated finish time.',
    },
    s5: {
      eyebrow: '05 · Race report',
      title: 'At the finish, the race report',
      sub: 'Final time, gap to plan, gained or lost per gradient, heart-rate effort.',
    },
    s6: {
      eyebrow: '06 · Runner profile',
      title: 'Your profile learns from your races',
      sub: 'Pace by gradient: you versus the average trail runner.',
    },
    s7: {
      eyebrow: '07 · Dials',
      title1: 'Two dials,',
      title2: 'two themes.',
      sub1: 'Progress ring or Horizon.',
      sub2: 'Black or beige.',
    },
    feature: {
      sub: 'A pacing plan on the phone, the gap to plan on the watch.',
    },
    hero: {
      eyebrow: 'Data field',
      sub: 'The gap to plan, in minutes, and the finish time. The plan comes from the phone.',
    },
  },
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------
const PHONE = (n) => `assets/telephone/${n}.png`;

// Rendus 830 × 830 découpés dans l'aperçu téléphone : le cercle de la lunette est
// centré en (414, 420), rayon extérieur 361,5 px (mesuré).
const DIAL_GEOM = { size: 830, cx: 414, cy: 420, r: 361.5 };
const DIALS = {
  anneauNoir2: { src: 'assets/cadrans/cadran_anneau_noir_2champs.png', theme: 'noir' },
  anneauNoir3: { src: 'assets/cadrans/cadran_anneau_noir_3champs.png', theme: 'noir' },
  anneauNoir4: { src: 'assets/cadrans/cadran_anneau_noir_4champs.png', theme: 'noir' },
  anneauBeige2: { src: 'assets/cadrans/cadran_anneau_beige_2champs.png', theme: 'beige' },
  horizonNoir: { src: 'assets/cadrans/cadran_horizon_noir.png', theme: 'noir' },
  horizonBeige: { src: 'assets/cadrans/cadran_horizon_beige.png', theme: 'beige' },
  // Écran d'attente : contenu de l'écran seul (454 px, découpé en cercle dans la
  // capture du simulateur, sans boîtier) ; on lui redessine la même lunette que les cadrans.
  attente: { src: 'assets/montre/attente_fr965_454.png', theme: 'noir', screenOnly: true },
};

// Profil d'altitude réel de gta.gpx (16,2 km, 392 m D+), extrait de la capture
// plein écran : 0..1000 en x (distance), 0..1000 en y (0 = sommet, 1000 = point bas).
const PROFILE = JSON.parse(await fs.readFile(path.join(ASSETS, 'profil_gta.json'), 'utf8'));

// ---------------------------------------------------------------------------
// Briques
// ---------------------------------------------------------------------------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Pictogramme montagne du mot-symbole (relevé sur la capture : deux sommets, base plate).
const MOUNTAIN = (h, color) =>
  `<svg class="mtn" viewBox="0 0 370 227" style="height:${h}px;width:${(h * 370) / 227}px" aria-hidden="true">
     <polygon fill="${color}" points="0,227 128,0 195,107 245,40 370,227"/></svg>`;

function wordmark({ size = 46, color = C.amber } = {}) {
  return `<div class="wordmark" style="font-size:${size}px;color:${color}">
    <span>GPX PACER</span>${MOUNTAIN(size * 0.66, color)}</div>`;
}

// Crête : le profil réel étiré dans la boîte (x, y, w, h), rempli jusqu'au bas de
// la page (`floor`) ou tracé en ligne.
function crest({ pageW, pageH, x, y, w, h, fill, stroke, strokeWidth = 6, floor = pageH + 20 }) {
  const pts = PROFILE.map(([px, py]) => [x + (px / 1000) * w, y + (py / 1000) * h]);
  const line = pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a.toFixed(1)} ${b.toFixed(1)}`).join(' ');
  const shapes = [];
  if (fill) {
    const [x0] = pts[0];
    const [x1] = pts[pts.length - 1];
    shapes.push(`<path d="${line} L${x1.toFixed(1)} ${floor} L${x0.toFixed(1)} ${floor} Z" fill="${fill}"/>`);
  }
  if (stroke) {
    shapes.push(
      `<path d="${line}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"/>`,
    );
  }
  return `<svg class="abs" width="${pageW}" height="${pageH}" viewBox="0 0 ${pageW} ${pageH}" aria-hidden="true">${shapes.join('')}</svg>`;
}

// Téléphone générique : cadre arrondi uni, écran = capture 1080 × 2400 à l'échelle.
function phone({ src, x, y, width = 820, frame = D.phoneFrame, ring = D.phoneRing, radius = 96, bezel = 14 }) {
  const sw = width - 2 * bezel;
  const sh = (sw * 2400) / 1080;
  const ringCss = ring ? `box-shadow:inset 0 0 0 2px ${ring};` : '';
  return `<div class="phone" style="left:${x}px;top:${y}px;width:${width}px;padding:${bezel}px;border-radius:${radius}px;background:${frame};${ringCss}">
    <div class="screen" style="width:${sw}px;height:${sh}px;border-radius:${radius - bezel}px"><img src="${src}" width="${sw}" height="${sh}"></div></div>`;
}

// Montre ronde générique : bracelet (haut/bas), boîtier, cadran découpé en cercle.
// `top` / `bottom` : 'edge' (file jusqu'au bord), un nombre (longueur du moignon) ou null.
function watch({ dial, d, cx, cy, pageH, caseColor = D.watchCase, strap = D.watchStrap, top = 'edge', bottom = 'edge', strapW = 0.42, strapRadius = 40 }) {
  const parts = [];
  const sw = Math.round(d * strapW);
  const strapCss = `left:${cx - sw / 2}px;width:${sw}px;background:${strap};border-radius:${strapRadius}px`;
  if (top !== null) {
    const y0 = top === 'edge' ? -sw : cy - d / 2 - top;
    parts.push(`<div class="abs" style="${strapCss};top:${y0}px;height:${cy - y0}px"></div>`);
  }
  if (bottom !== null) {
    const y1 = bottom === 'edge' ? pageH + sw : cy + d / 2 + bottom;
    parts.push(`<div class="abs" style="${strapCss};top:${cy}px;height:${y1 - cy}px"></div>`);
  }
  const dc = d * 1.05;
  parts.push(`<div class="abs circle" style="left:${cx - dc / 2}px;top:${cy - dc / 2}px;width:${dc}px;height:${dc}px;background:${caseColor}"></div>`);
  const g = DIAL_GEOM;
  if (dial.screenOnly) {
    // lunette redessinée + écran noir contenant la capture 454 px
    const ds = d * (638 / 723); // même rapport écran/lunette que les cadrans
    parts.push(`<div class="abs circle" style="left:${cx - d / 2}px;top:${cy - d / 2}px;width:${d}px;height:${d}px;background:${C.bezelNoir}"></div>`);
    parts.push(`<div class="abs circle" style="left:${cx - ds / 2}px;top:${cy - ds / 2}px;width:${ds}px;height:${ds}px;background:#000;overflow:hidden">
      <img src="${dial.src}" width="${ds}" height="${ds}" style="position:absolute;left:0;top:0"></div>`);
  } else {
    const s = d / (2 * g.r);
    parts.push(`<div class="abs circle" style="left:${cx - d / 2}px;top:${cy - d / 2}px;width:${d}px;height:${d}px;overflow:hidden">
      <img src="${dial.src}" width="${g.size * s}" height="${g.size * s}" style="position:absolute;left:${d / 2 - g.cx * s}px;top:${d / 2 - g.cy * s}px"></div>`);
  }
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
function page({ w, h, bg, body, css = '' }) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>
@font-face{font-family:Roboto;src:url(${ORIGIN}/assets/fonts/Roboto-Variable.ttf) format('truetype');font-weight:100 900;font-style:normal}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${bg};font-family:Roboto,sans-serif;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.abs{position:absolute}
.circle{border-radius:50%}
.phone{position:absolute}
.screen{overflow:hidden;background:${C.bg};position:relative}
.screen img{display:block}
.wordmark{display:flex;align-items:center;gap:.28em;font-weight:700;letter-spacing:.16em;line-height:1;white-space:nowrap}
.wordmark .mtn{display:block;margin-left:-.1em}
h1,h2{font-weight:700;letter-spacing:-.02em;line-height:1.0;text-wrap:balance}
.eyebrow{font-weight:600;letter-spacing:.18em;text-transform:uppercase;line-height:1}
.sub{font-weight:400;line-height:1.3;text-wrap:pretty}
${css}
</style></head><body>${body}</body></html>`;
}

// Capture Play 1080 × 1920 : légende en haut, scène en dessous.
function playSlide({ theme, eyebrow, title, sub, stage, backdrop = '', stageTop = 600, stageGap = 56, titleSize = 112 }) {
  const amber = theme === 'amber';
  const colors = amber
    ? { bg: C.amber, fg: C.ink, fg2: D.amberSub, accent: D.amberEyebrow }
    : { bg: C.bg, fg: C.fg, fg2: C.fg2, accent: C.amber };
  const body = `
    ${backdrop}
    <div class="stage" style="top:${stageTop}px">${stage}</div>
    <div class="copy">
      <div class="eyebrow">${esc(eyebrow)}</div>
      <h1>${esc(title)}</h1>
      <p class="sub">${esc(sub)}</p>
    </div>
    <script>
      // La scène descend si le texte (3 lignes de titre en anglais, par ex.) déborde.
      document.fonts.ready.then(() => {
        const copy = document.querySelector('.copy').getBoundingClientRect();
        const stage = document.querySelector('.stage');
        stage.style.top = Math.max(${stageTop}, Math.round(copy.bottom) + ${stageGap}) + 'px';
        document.body.dataset.ready = '1';
      });
    </script>`;
  const css = `
    .copy{position:absolute;left:72px;right:72px;top:132px;color:${colors.fg}}
    .eyebrow{font-size:34px;color:${colors.accent};margin-bottom:40px}
    h1{font-size:${titleSize}px}
    .sub{font-size:42px;color:${colors.fg2};margin-top:34px;max-width:900px}
    .stage{position:absolute;left:0;width:1080px;height:0;overflow:visible}`;
  return page({ w: 1080, h: 1920, bg: colors.bg, body, css });
}

// ---------------------------------------------------------------------------
// Les visuels
// ---------------------------------------------------------------------------
function playSet(lang) {
  const t = T[lang];
  const W = 1080, H = 1920;
  const PHONE_X = 130, PHONE_W = 820;
  const out = [];

  // 01 — ambre, crête d'encre, téléphone noir qui en sort
  out.push({
    name: `play/${lang}/01_plan_allure.png`, w: W, h: H,
    html: playSlide({
      theme: 'amber', ...t.s1, stageTop: 630,
      backdrop: crest({ pageW: W, pageH: H, x: -40, y: 1120, w: W + 80, h: 700, fill: D.amberCrest }),
      stage: phone({ src: PHONE('01_accueil'), x: PHONE_X, y: 0, width: PHONE_W, frame: C.ink, ring: null }),
    }),
  });

  const dark = (n, name, src, extra = {}) => ({
    name: `play/${lang}/${name}.png`, w: W, h: H,
    html: playSlide({
      theme: 'dark', ...t[n],
      backdrop: crest({ pageW: W, pageH: H, x: -40, y: 1200, w: W + 80, h: 640, fill: D.darkCrest }),
      stage: phone({ src, x: PHONE_X, y: 0, width: PHONE_W }),
      ...extra,
    }),
  });
  out.push(dark('s2', '02_chaque_pente', PHONE('02_plan_profil_split')));
  out.push(dark('s3', '03_points_de_passage', PHONE('03_passages_rappels_montre')));

  // 04 — ambre, la montre seule, très grande
  out.push({
    name: `play/${lang}/04_sur_la_montre.png`, w: W, h: H,
    html: playSlide({
      theme: 'amber', ...t.s4, titleSize: 104, stageTop: 640, stageGap: 90,
      stage: watch({ dial: DIALS.anneauNoir2, d: 920, cx: 540, cy: 600, pageH: H, caseColor: C.ink, strap: C.ink, top: 130, bottom: 130 }),
    }),
  });

  out.push(dark('s5', '05_rapport_de_course', PHONE('04_bilan_ecart_par_pente')));
  out.push(dark('s6', '06_profil_coureur', PHONE('07_allure_par_pente_profil_coureur')));

  // 07 — moitié noire / moitié beige, quatre montres
  const half = H / 2;
  const d7 = 440;
  const row = (y, left, right, strap, caseColor) =>
    watch({ dial: left, d: d7, cx: 300, cy: y, pageH: H, strap, caseColor, top: 100, bottom: 100 }) +
    watch({ dial: right, d: d7, cx: 780, cy: y, pageH: H, strap, caseColor, top: 100, bottom: 100 });
  const body7 = `
    <div class="abs" style="left:0;top:${half}px;width:${W}px;height:${half}px;background:${C.beige}"></div>
    ${row(half - 270, DIALS.anneauNoir4, DIALS.horizonNoir, D.watchStrap, D.watchCase)}
    ${row(H - 270, DIALS.anneauBeige2, DIALS.horizonBeige, D.beigeStrap, D.beigeCase)}
    <div class="copy" style="top:132px;color:${C.fg}">
      <div class="eyebrow" style="color:${C.amber}">${esc(t.s7.eyebrow)}</div>
      <h1>${esc(t.s7.title1)}</h1>
      <p class="sub" style="color:${C.fg2}">${esc(t.s7.sub1)}</p>
    </div>
    <div class="copy" style="top:${half + 96}px;color:${C.ink}">
      <h1>${esc(t.s7.title2)}</h1>
      <p class="sub" style="color:#5A5140">${esc(t.s7.sub2)}</p>
    </div>`;
  out.push({
    name: `play/${lang}/07_deux_cadrans.png`, w: W, h: H,
    html: page({
      w: W, h: H, bg: C.bg, body: body7,
      css: `.copy{position:absolute;left:72px;right:72px}.eyebrow{font-size:34px;margin-bottom:40px}h1{font-size:112px}.sub{font-size:42px;margin-top:26px}`,
    }),
  });

  // Image de présentation Play 1024 × 500 (zone sûre : 15 % de marge)
  const FW = 1024, FH = 500;
  const bodyF = `
    ${crest({ pageW: FW, pageH: FH, x: -20, y: 392, w: FW + 40, h: 160, fill: D.darkCrest })}
    ${crest({ pageW: FW, pageH: FH, x: -20, y: 392, w: FW + 40, h: 160, stroke: C.amber, strokeWidth: 4 })}
    ${phone({ src: PHONE('01_accueil'), x: 606, y: 104, width: 230, radius: 28, bezel: 5 })}
    ${watch({ dial: DIALS.anneauNoir2, d: 300, cx: 862, cy: 250, pageH: FH, top: 'edge', bottom: 'edge', strapRadius: 30 })}
    <div class="abs" style="left:154px;top:100px;width:460px">
      ${wordmark({ size: 36 })}
      <h1 style="font-size:62px;color:${C.fg};margin-top:26px">${esc(t.slogan)}</h1>
      <p class="sub" style="font-size:22px;color:${C.fg2};margin-top:18px;max-width:400px">${esc(t.feature.sub)}</p>
    </div>`;
  out.push({ name: `play/feature_play_1024x500_${lang}.png`, w: FW, h: FH, html: page({ w: FW, h: FH, bg: C.bg, body: bodyF }) });

  return out;
}

function connectIqSet(lang) {
  const t = T[lang];
  const out = [];

  // Bandeau 1440 × 720
  const W = 1440, H = 720;
  const body = `
    ${crest({ pageW: W, pageH: H, x: -20, y: 430, w: W + 40, h: 330, fill: D.darkCrest })}
    ${crest({ pageW: W, pageH: H, x: -20, y: 430, w: W + 40, h: 330, stroke: C.amber, strokeWidth: 5 })}
    ${watch({ dial: DIALS.anneauNoir2, d: 640, cx: 1060, cy: 372, pageH: H, top: 'edge', bottom: 'edge' })}
    <div class="abs" style="left:96px;top:140px;width:640px">
      ${wordmark({ size: 44 })}
      <h1 style="font-size:84px;color:${C.fg};margin-top:40px">${esc(t.slogan)}</h1>
      <p class="sub" style="font-size:28px;color:${C.fg2};margin-top:28px;max-width:560px">${esc(t.hero.sub)}</p>
    </div>`;
  out.push({ name: `connectiq/hero_connectiq_1440x720_${lang}.png`, w: W, h: H, html: page({ w: W, h: H, bg: C.bg, body }) });
  return out;
}

// Captures montre 800 × 800, fond uni, sans texte (identiques FR/EN : les cadrans
// sont ceux de l'aperçu, en français ; l'écran d'attente est en anglais).
function watchShots() {
  const S = 800;
  const list = [
    ['01_anneau_noir_2champs', DIALS.anneauNoir2],
    ['02_anneau_noir_3champs', DIALS.anneauNoir3],
    ['03_anneau_noir_4champs', DIALS.anneauNoir4],
    ['04_anneau_beige_2champs', DIALS.anneauBeige2],
    ['05_horizon_noir', DIALS.horizonNoir],
    ['06_horizon_beige', DIALS.horizonBeige],
    ['07_ecran_attente', DIALS.attente],
  ];
  return list.map(([name, dial]) => ({
    name: `connectiq/montre/${name}_800.png`, w: S, h: S,
    html: page({ w: S, h: S, bg: C.bg, body: watch({ dial, d: 640, cx: S / 2, cy: S / 2, pageH: S, top: 'edge', bottom: 'edge' }) }),
  }));
}

const SPECS = [...playSet('fr'), ...playSet('en'), ...connectIqSet('fr'), ...connectIqSet('en'), ...watchShots()];

// ---------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------
const filter = process.argv[2] || '';
const todo = SPECS.filter((s) => s.name.includes(filter));
if (!todo.length) {
  console.error(`aucun visuel ne correspond à « ${filter} »`);
  process.exit(1);
}

const MIME = { png: 'image/png', ttf: 'font/ttf', json: 'application/json' };
const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const pg = await ctx.newPage();
let current = '';
await pg.route(`${ORIGIN}/**`, async (route) => {
  const url = new URL(route.request().url());
  if (url.pathname === '/index.html') return route.fulfill({ body: current, contentType: 'text/html; charset=utf-8' });
  const file = path.join(SRC, decodeURIComponent(url.pathname));
  try {
    const body = await fs.readFile(file);
    return route.fulfill({ body, contentType: MIME[path.extname(file).slice(1)] || 'application/octet-stream' });
  } catch {
    return route.fulfill({ status: 404, body: 'not found' });
  }
});

for (const spec of todo) {
  current = spec.html;
  await pg.setViewportSize({ width: spec.w, height: spec.h });
  await pg.goto(`${ORIGIN}/index.html`, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  if (spec.html.includes('data-ready') || spec.html.includes('dataset.ready')) await pg.waitForSelector('body[data-ready]');
  const dest = path.join(OUT, spec.name);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await pg.screenshot({ path: dest, type: 'png', clip: { x: 0, y: 0, width: spec.w, height: spec.h } });
  console.log(`${spec.name}  ${spec.w}×${spec.h}`);
}
await browser.close();

// Aplatissement en PNG RGB (pas de canal alpha : exigence Play pour l'image de présentation).
const post = spawnSync('python3', ['-I', path.join(SRC, 'postprocess.py'), ...todo.map((s) => path.join(OUT, s.name))], { stdio: 'inherit' });
process.exit(post.status ?? 1);
