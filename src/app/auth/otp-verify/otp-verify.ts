import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.css',
})
export class OtpVerify implements OnInit {
  otpDigits: string[] = ['', '', '', '', '', ''];
  erreur = '';
  success = false;
  chargement = false;
  email = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const emailStocke = sessionStorage.getItem('otp_email');
    if (!emailStocke) {
      this.router.navigate(['/login']);
      return;
    }
    this.email = emailStocke;
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (input.value && index < 5) {
      const next = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
      if (next) next.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prev = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;
      if (prev) prev.focus();
    }
  }

  verifier() {
    const code = this.otpDigits.join('');

    if (code.length < 6) {
      this.erreur = 'Veuillez entrer les 6 chiffres du code.';
      return;
    }

    this.erreur = '';
    this.chargement = true;

    this.authService.verifierOtp(this.email, code).subscribe({
      next: (data) => {
        this.chargement = false;
        this.success = true;

        this.authService.sauvegarderSession(data);
        sessionStorage.removeItem('otp_email');
        sessionStorage.removeItem('otp_motDePasse');

        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1000);
      },
     error: (err) => {
  this.chargement = false;
  this.erreur = err.error?.message || 'Code incorrect ou expiré.';
  this.otpDigits = ['', '', '', '', '', ''];
}
    });
  }

  renvoyer() {
    const motDePasse = sessionStorage.getItem('otp_motDePasse');
    if (!motDePasse) {
      this.router.navigate(['/login']);
      return;
    }

    this.otpDigits = ['', '', '', '', '', ''];
    this.erreur = '';

    this.authService.seConnecter(this.email, motDePasse).subscribe({
      next: () => {
        alert('Un nouveau code a été envoyé à votre email.');
      },
      error: () => {
        this.erreur = 'Erreur lors du renvoi du code.';
      }
    });
  }
}