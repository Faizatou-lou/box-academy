import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilMembreService } from '../../core/services/profil-membre';

@Component({
  selector: 'app-onboarding-membre',
  standalone: true,
  imports: [],
  templateUrl: './onboarding-membre.html',
  styleUrl: './onboarding-membre.css',
})
export class OnboardingMembre {

  etape = signal(1);
  totalEtapes = 3;

  metier = signal('');
  secteur = signal('');
  objectif = signal('');

  metiersSuggestions = [
    'Comptable', 'Développeur', 'Commercial', 'Enseignant',
    'Infirmier', 'Chef de projet', 'Étudiant', 'Sans emploi'
  ];

  secteurs = [
    { valeur: 'IT', icone: 'ti-device-laptop', label: 'Informatique & Tech' },
    { valeur: 'Finance', icone: 'ti-cash', label: 'Finance & Banque' },
    { valeur: 'Santé', icone: 'ti-heart', label: 'Santé' },
    { valeur: 'Éducation', icone: 'ti-school', label: 'Éducation' },
    { valeur: 'Commerce', icone: 'ti-shopping-cart', label: 'Commerce' },
    { valeur: 'Industrie', icone: 'ti-building-factory', label: 'Industrie' },
    { valeur: 'Administration', icone: 'ti-briefcase', label: 'Administration' },
    { valeur: 'Autre', icone: 'ti-dots', label: 'Autre' },
  ];

  objectifs = [
    { valeur: 'Reconversion professionnelle', icone: 'ti-refresh', desc: 'Changer de métier ou de secteur' },
    { valeur: 'Montée en compétence', icone: 'ti-trending-up', desc: 'Progresser dans mon métier actuel' },
    { valeur: 'Certification professionnelle', icone: 'ti-certificate', desc: 'Obtenir une certification reconnue' },
    { valeur: 'Curiosité personnelle', icone: 'ti-bulb', desc: 'Apprendre pour le plaisir' },
  ];

  constructor(
    private profilMembreService: ProfilMembreService,
    private router: Router
  ) {}

  choisirMetier(m: string): void {
    this.metier.set(m);
  }

  choisirSecteur(s: string): void {
    this.secteur.set(s);
  }

  choisirObjectif(o: string): void {
    this.objectif.set(o);
  }

  etapeSuivante(): void {
    if (this.etape() < this.totalEtapes) {
      this.etape.set(this.etape() + 1);
    } else {
      this.terminer();
    }
  }

  etapePrecedente(): void {
    if (this.etape() > 1) {
      this.etape.set(this.etape() - 1);
    }
  }

  peutContinuer(): boolean {
    if (this.etape() === 1) return this.metier().length > 0;
    if (this.etape() === 2) return this.secteur().length > 0;
    if (this.etape() === 3) return this.objectif().length > 0;
    return false;
  }

  terminer(): void {
  this.profilMembreService.mettreAJourProfil({
    metier: this.metier(),
    secteur: this.secteur(),
    objectif: this.objectif(),
    couleurAccent: '#29abe2'
  }).subscribe({
      next: () => {
        this.router.navigate(['/mon-espace']);
      },
      error: () => {
        this.router.navigate(['/mon-espace']);
      }
    });
  }

  passer(): void {
    this.router.navigate(['/mon-espace']);
  }
}