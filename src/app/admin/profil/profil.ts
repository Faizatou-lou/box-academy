import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { ThemeService } from '../../core/services/theme';
import { SaisonService } from '../../core/services/saison';
import { THEMES_SAISONNIERS } from '../../core/config/saisons.config';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class Profil {

  profil = {
    nom: 'Administrateur',
    prenom: 'Formation Academy',
    email: 'admin@formationacademy.bf',
    telephone: '+226 XX XX XX XX'
  };

  passwordData = {
    actuel: '',
    nouveau: '',
    confirmation: ''
  };

  ongletActif = 'infos';
  successInfos = false;
  successPassword = false;
  erreurPassword = '';
  motDePasseActuel = 'Admin123';

  couleurSelectionnee!: string;
  formeSelectionnee!: string;

  themesDisponibles = THEMES_SAISONNIERS;
  saisonForcee: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    public themeService:ThemeService,
    private saisonService: SaisonService
  ) {

this.couleurSelectionnee = this.themeService.getCouleurActuelle();
this.formeSelectionnee = this.themeService.getFormeActuelle();
this.saisonForcee = this.saisonService.getForcageActuel();
}

  choisirSaison(id: string | null): void {
    this.saisonForcee = id;
    this.saisonService.forcerSaison(id);
  }

changerCouleur(couleur: string) {
  this.couleurSelectionnee = couleur;
  this.themeService.appliquer(couleur);
}

changerForme(forme: string): void {

  console.log('forme cliquée :', forme);
    this.themeService.appliquerForme(forme);
    this.formeSelectionnee = forme;
  }


  get couleurParticule(): string {
    const palette = ['#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#7fd4ff', '#fb923c'];
    const texte = this.profil.nom + this.profil.prenom;
    let hash = 0;
    for (let i = 0; i < texte.length; i++) {
      hash = texte.charCodeAt(i) + ((hash << 5) - hash);
    }
    return palette[Math.abs(hash) % palette.length];
  }


  
  get initiales(): string {
    return this.profil.nom.charAt(0).toUpperCase() +
           this.profil.prenom.charAt(0).toUpperCase();
  }

  sauvegarderInfos() {
    this.successInfos = true;
    setTimeout(() => {
      this.successInfos = false;
    }, 3000);
  }

  changerMotDePasse() {
    if (!this.passwordData.actuel || !this.passwordData.nouveau || !this.passwordData.confirmation) {
      this.erreurPassword = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.passwordData.actuel !== this.motDePasseActuel) {
      this.erreurPassword = 'Mot de passe actuel incorrect.';
      return;
    }

    if (this.passwordData.nouveau !== this.passwordData.confirmation) {
      this.erreurPassword = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.passwordData.nouveau.length < 6) {
      this.erreurPassword = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.motDePasseActuel = this.passwordData.nouveau;
    this.passwordData = { actuel: '', nouveau: '', confirmation: '' };
    this.erreurPassword = '';
    this.successPassword = true;

    setTimeout(() => {
      this.successPassword = false;
    }, 3000);
  }

  
}