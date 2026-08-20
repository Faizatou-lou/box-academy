import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
@Component({
  selector: 'app-otp-verify',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './otp-verify.html',
  styleUrl: './otp-verify.css',
})
export class OtpVerify {
otpDigits: string[] = ['', '', '', '', '', ''];
  otpCorrect = '123456';
  erreur = '';
  success = false;
  chargement = false;

  constructor(private router: Router,
    private authService: AuthService
  ) {}

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

  setTimeout(() => {
    this.chargement = false;

    if (this.authService.validerOtp(code)) {
      this.success = true;

      setTimeout(() => {
        this.router.navigate(['/admin/dashboard']);
      }, 1000);

    } else {
      this.erreur = 'Code incorrect. Veuillez réessayer.';
      this.otpDigits = ['', '', '', '', '', ''];
    }

  }, 1000);
}

renvoyer() {
  this.otpDigits = ['', '', '', '', '', ''];
  this.erreur = '';
  alert('Un nouveau code a été envoyé à votre email.');
}
}
