import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly STORAGE_KEY = 'couleur-theme';
   private readonly FORME_KEY = 'forme-particule';

  // Quelques couleurs prédéfinies pour Formation Academy
  presets = [
    { nom: 'Bleu marine', valeur: '#1a3a6b' },
    { nom: 'Bleu roi', valeur: '#1d4ed8' },
    { nom: 'Vert émeraude', valeur: '#047857' },
    { nom: 'Violet', valeur: '#6d28d9' },
    { nom: 'Rouge bordeaux', valeur: '#991b1b' },
    { nom: 'Orange', valeur: '#c2410c' },
    { nom: 'Noir', valeur: '#111111' }
  ];

 formes = ['rond', 'triangle', 'coeur'];


  constructor() {
    const couleur = this.getCouleurActuelle();
    this.appliquer(couleur, false);
    this.appliquerForme(this.getFormeActuelle());
  }

  getCouleurActuelle(): string {
    return localStorage.getItem(this.STORAGE_KEY) || this.presets[0].valeur;
  }

  appliquer(couleur: string, sauvegarder = true) {
    document.documentElement.style.setProperty('--primary-color', couleur);
    document.documentElement.style.setProperty('--primary-color-dark', this.assombrir(couleur, 25));
    document.documentElement.style.setProperty('--primary-color-light', this.eclaircir(couleur, 85));
    document.documentElement.style.setProperty('--primary-color-rgb', this.hexVersRgb(couleur));

    if (sauvegarder) {
      localStorage.setItem(this.STORAGE_KEY, couleur);
    }
  }

getFormeActuelle(): string {
    return localStorage.getItem(this.FORME_KEY) || 'rond';
  }
  
appliquerForme(forme: string) {
    document.documentElement.setAttribute('data-forme-particule', forme);
    localStorage.setItem(this.FORME_KEY, forme);
  }



  // Assombrit une couleur hex d'un pourcentage donné
  private assombrir(hex: string, pourcentage: number): string {
    return this.ajusterLuminosite(hex, -pourcentage);
  }

  // Éclaircit une couleur hex d'un pourcentage donné
  private eclaircir(hex: string, pourcentage: number): string {
    return this.ajusterLuminosite(hex, pourcentage);
  }

  private ajusterLuminosite(hex: string, pourcentage: number): string {
    const nombre = parseInt(hex.replace('#', ''), 16);
    let r = (nombre >> 16) + Math.round(2.55 * pourcentage);
    let g = ((nombre >> 8) & 0x00ff) + Math.round(2.55 * pourcentage);
    let b = (nombre & 0x0000ff) + Math.round(2.55 * pourcentage);

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // Convertit une couleur hex en "r, g, b" pour usage dans rgba()
  private hexVersRgb(hex: string): string {
    const nombre = parseInt(hex.replace('#', ''), 16);
    const r = (nombre >> 16) & 0xff;
    const g = (nombre >> 8) & 0xff;
    const b = nombre & 0xff;
    return `${r}, ${g}, ${b}`;
  }
}