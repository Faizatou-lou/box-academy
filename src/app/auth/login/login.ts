import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  formData = {
    email: '',
    motDePasse: ''
  };

  showPassword = false;
  erreur = '';
  chargement = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  seConnecter() {
    if (!this.formData.email || !this.formData.motDePasse) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }

    this.erreur = '';
    this.chargement = true;

    this.authService.seConnecter(this.formData.email, this.formData.motDePasse).subscribe({
      next: () => {
        this.chargement = false;
        sessionStorage.setItem('otp_email', this.formData.email);
        sessionStorage.setItem('otp_motDePasse', this.formData.motDePasse);
        this.router.navigate(['/otp-verify']);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = 'Email ou mot de passe incorrect.';
      }
    });
  }
}