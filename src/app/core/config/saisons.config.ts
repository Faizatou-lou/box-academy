/**
 * Configuration des thèmes saisonniers du site public.
 *
 * Chaque thème réutilise les variables CSS de couleur déjà définies pour le site
 * (--black, --blue, --blue-deep, --blue-soft) — voir les blocs
 * `:root[data-saison="..."]` dans src/styles.css. Aucune nouvelle variable de
 * couleur n'est introduite : seules leurs valeurs sont surchargées le temps de
 * la saison.
 */

export interface DateSaison {
  /** Mois 1-12 */
  mois: number;
  /** Jour du mois, 1-31 */
  jour: number;
}

export interface ThemeSaisonnier {
  /** Identifiant technique, utilisé pour l'attribut data-saison et le forçage manuel. */
  id: string;
  /** Nom affiché (ex. dans le sélecteur admin). */
  nom: string;
  dateDebut: DateSaison;
  dateFin: DateSaison;
  /**
   * Identifiants des décorations à afficher pour ce thème.
   * Interprétés par DecorationsSaisonnieresComponent.
   */
  decorations: string[];
}

export const THEMES_SAISONNIERS: ThemeSaisonnier[] = [
  {
    id: 'noel',
    nom: 'Noël',
    // 1er décembre → 6 janvier : période à cheval sur deux années civiles,
    // gérée explicitement par SaisonService (dateDebut.mois > dateFin.mois).
    dateDebut: { mois: 12, jour: 1 },
    dateFin: { mois: 1, jour: 6 },
    decorations: ['neige', 'sapins']
  },
  {
    id: 'paques',
    nom: 'Pâques',
    // Pâques change de date chaque année (calcul du "comput pascal"). À défaut
    // d'implémenter ce calcul, on retient une fenêtre par défaut couvrant la
    // période où Pâques tombe le plus souvent (1er → 21 avril). À ajuster
    // ponctuellement ici si Pâques tombe en dehors de cette fenêtre une année donnée.
    dateDebut: { mois: 4, jour: 1 },
    dateFin: { mois: 4, jour: 21 },
    decorations: ['oeufs', 'lapin']
  },
  {
    id: 'ramadan',
    // ⚠️ CALENDRIER LUNAIRE — DATES À METTRE À JOUR CHAQUE ANNÉE ⚠️
    // Le Ramadan suit le calendrier hégirien : ses dates grégoriennes reculent
    // d'environ 10-11 jours chaque année et ne peuvent pas être calculées de
    // façon fiable ici (elles dépendent en outre de l'observation locale de la
    // lune selon les pays). Les valeurs ci-dessous doivent être vérifiées et
    // corrigées à l'avance chaque année (source : calendrier hégirien officiel).
    //   2026 : 19 février → 20 mars
    //   2027 : 8 février → 9 mars
    // Au-delà de 2027, mettre à jour dateDebut/dateFin avant le début de la saison.
    nom: 'Ramadan',
    dateDebut: { mois: 2, jour: 19 },
    dateFin: { mois: 3, jour: 20 },
    decorations: ['lune', 'lanternes', 'etoiles']
  }
];
