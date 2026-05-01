import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { ProspectProvider } from './shared';
import type { ProspectData } from './types';
import './styles.css';

/**
 * Le bandeau `<script>window.PROSPECT_DATA = __PROSPECT_DATA__;</script>` est
 * substitué :
 *   • en dev par le plugin Vite (vite.config.ts) à partir de
 *     `prospect-data.example.json` ;
 *   • en prod par le Worker (Module 3) à partir des données stockées en D1.
 *
 * `validateProspect()` vérifie les champs requis pour fail fast si la
 * substitution n'a pas eu lieu (placeholder visible) — utile pour spot une
 * mauvaise route dans le Worker pendant le dev de Module 3.
 */
function validateProspect(d: unknown): ProspectData {
  if (!d || typeof d !== 'object') {
    throw new Error('window.PROSPECT_DATA manquant — la substitution n\'a pas eu lieu.');
  }
  const obj = d as Record<string, unknown>;
  const required: (keyof ProspectData)[] = [
    'nom_entreprise',
    'ville_principale',
    'code_postal',
    'departement_label',
    'adresse_complete',
    'telephone_display',
    'telephone_e164',
    'avis_google'
  ];
  for (const k of required) {
    if (!(k in obj)) throw new Error(`ProspectData incomplet : champ "${k}" manquant.`);
  }
  if (!Array.isArray(obj.avis_google)) {
    throw new Error('ProspectData.avis_google doit être un tableau.');
  }
  // email peut être chaîne vide ; on coerce defensively
  if (typeof obj.email !== 'string') (obj as { email: string }).email = '';
  return obj as unknown as ProspectData;
}

const data = validateProspect(window.PROSPECT_DATA);

// Title + meta description dynamiques (§3.1 du template-vars.md)
document.title = `${data.nom_entreprise} — Électricien à ${data.ville_principale}`;
const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) {
  metaDesc.setAttribute(
    'content',
    `${data.nom_entreprise}, votre artisan électricien à ${data.ville_principale}, ${data.departement_label}. Dépannage, mise aux normes, domotique, bornes de recharge.`
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root introuvable dans index.html');

createRoot(rootEl).render(
  <StrictMode>
    <ProspectProvider value={data}>
      <App />
    </ProspectProvider>
  </StrictMode>
);
