export interface AvisGoogle {
  author: string;
  rating: number;
  text: string;
  /** Toujours "Client Google" pour les reviews issues de la GMB. */
  role: string;
}

export interface ProspectData {
  nom_entreprise: string;
  ville_principale: string;
  code_postal: string;
  /** Ex. "Hérault (34)". */
  departement_label: string;
  /** Ex. "Saint-Clément-de-Rivière · 34980 Hérault". */
  adresse_complete: string;
  /** Ex. "06 02 40 91 47". */
  telephone_display: string;
  /** Ex. "+33602409147" (sans espaces, pour href="tel:..."). */
  telephone_e164: string;
  /** Vide si non récupérable depuis le site web. */
  email: string;
  note_google?: number;
  nombre_avis?: number;
  /** URL d'une photo GMB ; fallback `/hero.webp` côté composant. */
  photo_hero_url?: string;
  /** 0..5 reviews. La section témoignages est masquée si length < 3. */
  avis_google: AvisGoogle[];
}

declare global {
  interface Window {
    PROSPECT_DATA: ProspectData;
  }
}
