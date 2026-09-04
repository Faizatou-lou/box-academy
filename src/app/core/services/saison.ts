import { Injectable, signal } from '@angular/core';
import { DateSaison, THEMES_SAISONNIERS, ThemeSaisonnier } from '../config/saisons.config';

@Injectable({ providedIn: 'root' })
export class SaisonService {

  private readonly STORAGE_KEY = 'saison-forcee';

  /** Thème saisonnier actuellement actif (détecté ou forcé), ou null hors saison. */
  readonly saisonActive = signal<ThemeSaisonnier | null>(null);

  constructor() {
    const forcee = this.getForcageActuel();
    if (forcee === null) {
      this.detecterEtAppliquer();
    } else {
      this.appliquer(this.trouverTheme(forcee));
    }
  }

  /**
   * Force un thème saisonnier indépendamment de la date du jour (utilisé depuis
   * le dashboard admin pour les démos). Passer `null` pour revenir à la
   * détection automatique.
   */
  forcerSaison(id: string | null): void {
    if (id === null) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.detecterEtAppliquer();
      return;
    }

    localStorage.setItem(this.STORAGE_KEY, id);
    this.appliquer(this.trouverTheme(id));
  }

  /** Le forçage actuel ('noel' / 'paques' / 'ramadan'), ou null si automatique. */
  getForcageActuel(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  private trouverTheme(id: string): ThemeSaisonnier | null {
    return THEMES_SAISONNIERS.find(t => t.id === id) ?? null;
  }

  private detecterEtAppliquer(): void {
    const aujourdHui = new Date();
    const theme = THEMES_SAISONNIERS.find(t => this.estDansLaPeriode(aujourdHui, t.dateDebut, t.dateFin)) ?? null;
    this.appliquer(theme);
  }

  /**
   * Teste si `date` tombe entre `debut` et `fin` (mois/jour, année ignorée),
   * en gérant les périodes à cheval sur deux années civiles (ex. Noël :
   * 1er décembre → 6 janvier, où debut > fin en valeur MMJJ).
   */
  private estDansLaPeriode(date: Date, debut: DateSaison, fin: DateSaison): boolean {
    const valeur = (mois: number, jour: number) => mois * 100 + jour;
    const jourActuel = valeur(date.getMonth() + 1, date.getDate());
    const jourDebut = valeur(debut.mois, debut.jour);
    const jourFin = valeur(fin.mois, fin.jour);

    if (jourDebut <= jourFin) {
      return jourActuel >= jourDebut && jourActuel <= jourFin;
    }
    // Période à cheval sur le 31 décembre / 1er janvier.
    return jourActuel >= jourDebut || jourActuel <= jourFin;
  }

  private appliquer(theme: ThemeSaisonnier | null): void {
    this.saisonActive.set(theme);
    if (theme) {
      document.documentElement.setAttribute('data-saison', theme.id);
    } else {
      document.documentElement.removeAttribute('data-saison');
    }
  }
}
