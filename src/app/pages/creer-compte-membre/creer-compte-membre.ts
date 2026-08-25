import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthMembreService } from '../../core/services/auth-membre';

@Component({
  selector: 'app-creer-compte-membre',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './creer-compte-membre.html',
  styleUrl: './creer-compte-membre.css',
})
export class CreerCompteMembre {

  formData = {
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    telephone: ''
  };

  erreur = signal('');
  chargement = signal(false);

  constructor(
    private authMembreService: AuthMembreService,
    private router: Router
  ) {}

  enTransition = signal(false);

creerCompte() {
  if (!this.formData.nom || !this.formData.prenom || !this.formData.email || !this.formData.motDePasse) {
    this.erreur.set('Veuillez remplir tous les champs obligatoires.');
    return;
  }

  if (this.formData.motDePasse.length < 6) {
    this.erreur.set('Le mot de passe doit contenir au moins 6 caractères.');
    return;
  }

  this.erreur.set('');
  this.chargement.set(true);

  this.authMembreService.inscription(this.formData).subscribe({
    next: () => {
      this.chargement.set(false);
      this.enTransition.set(true);
      setTimeout(() => {
        this.router.navigate(['/onboarding']);
      }, 1200);
    },
    error: (err) => {
      this.chargement.set(false);
      if (err.status === 400) {
        this.erreur.set(err.error?.message || 'Un compte existe déjà avec cet email.');
      } else {
        this.erreur.set('Une erreur est survenue. Réessayez plus tard.');
      }
    }
  });
}
  
}