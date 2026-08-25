import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthMembreService } from '../../core/services/auth-membre';

@Component({
  selector: 'app-connexion-membre',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './connexion-membre.html',
  styleUrl: './connexion-membre.css',
})
export class ConnexionMembre {

  formData = {
    email: '',
    motDePasse: ''
  };

  erreur = signal('');
  chargement = signal(false);

  constructor(
    private authMembreService: AuthMembreService,
    private router: Router
  ) {}

  connexion() {
    if (!this.formData.email || !this.formData.motDePasse) {
      this.erreur.set('Veuillez remplir tous les champs.');
      return;
    }

    this.erreur.set('');
    this.chargement.set(true);

    this.authMembreService.connexion(this.formData).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/mon-espace']);
      },
      error: (err) => {
        this.chargement.set(false);
        if (err.status === 401) {
          this.erreur.set('Email ou mot de passe incorrect.');
        } else {
          this.erreur.set('Une erreur est survenue. Réessayez plus tard.');
        }
      }
    });
  }
}