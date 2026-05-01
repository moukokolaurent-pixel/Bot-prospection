/**
 * scripts/build-preview.mjs
 *
 * Génère un HTML standalone (preview-standalone.html) qui contient tout
 * inliné : JS + CSS + ProspectData + image hero (base64 data-URI). Le
 * fichier obtenu s'ouvre en double-clic depuis le Finder/Explorateur,
 * sans serveur ni dépendance, et permet de partager une démo en simple
 * pièce jointe.
 *
 * À lancer après `vite build` (le script `npm run preview:standalone`
 * enchaîne les deux).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'preview-standalone.html');

function read(p) {
  return readFileSync(p, 'utf-8');
}

function dataUri(filePath, mime) {
  const buf = readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

// Localiser les artefacts produits par Vite (hashés)
const assetsDir = path.join(dist, 'assets');
const assetFiles = readdirSync(assetsDir);
const jsFile = assetFiles.find((f) => f.endsWith('.js'));
const cssFile = assetFiles.find((f) => f.endsWith('.css'));
if (!jsFile || !cssFile) {
  throw new Error(`Bundle introuvable dans ${assetsDir} : ${assetFiles.join(', ')}`);
}

const html = read(path.join(dist, 'index.html'));
const js = read(path.join(assetsDir, jsFile));
const css = read(path.join(assetsDir, cssFile));
const prospectJson = read(path.join(root, 'prospect-data.example.json')).trim();
const heroDataUri = dataUri(path.join(root, 'public', 'hero.webp'), 'image/webp');

// 1) Substituer les références /hero.webp par le data-URI dans le bundle JS.
//    Le bundle contient "/hero.webp" en littéral (fallback du <img> hero).
const jsInlined = js.split('"/hero.webp"').join(JSON.stringify(heroDataUri));

// 2) Substituer __PROSPECT_DATA__ par le JSON exemple.
let outHtml = html.replace('__PROSPECT_DATA__', prospectJson);

// 3) Inliner la feuille de style (remplacer le <link rel="stylesheet" ... >).
outHtml = outHtml.replace(
  /<link rel="stylesheet"[^>]*\/assets\/[^"]+\.css[^>]*>/,
  `<style>${css}</style>`
);

// 4) Inliner le bundle JS (remplacer le <script type="module" src=...>).
outHtml = outHtml.replace(
  /<script type="module"[^>]*\/assets\/[^"]+\.js[^>]*><\/script>/,
  `<script type="module">${jsInlined}</script>`
);

writeFileSync(out, outHtml);
const sizeKb = Math.round(Buffer.byteLength(outHtml, 'utf-8') / 1024);
console.log(`✓ preview-standalone.html écrit (${sizeKb} KB)`);
console.log(`  → ouvre-le en double-clic depuis ton Finder/Explorateur.`);
