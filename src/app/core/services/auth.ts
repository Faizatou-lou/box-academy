import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  // Connexion via le backend
  seConnecter(email: string, motDePasse: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, {
      email: email,
      motDePasse: motDePasse
    });
  }

  // OTP reste local pour l'instant
  validerOtp(otp: string): boolean {
    if (otp === '123456') {
      localStorage.setItem('otpValidated', 'true');
      return true;
    }
    return false;
  }

  // Sauvegarder les infos admin après connexion
  sauvegarderSession(adminData: any): void {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('adminId', adminData.adminId);
    localStorage.setItem('adminNom', adminData.nom);
    localStorage.setItem('adminPrenom', adminData.prenom);
    localStorage.setItem('adminEmail', adminData.email);
  }

  // Récupérer les infos admin
  getAdminInfo(): any {
    return {
      id: localStorage.getItem('adminId'),
      nom: localStorage.getItem('adminNom'),
      prenom: localStorage.getItem('adminPrenom'),
      email: localStorage.getItem('adminEmail')
    };
  }

  estConnecte(): boolean {
    return localStorage.getItem('otpValidated') === 'true';
  }

  seDeconnecter() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('otpValidated');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminNom');
    localStorage.removeItem('adminPrenom');
    localStorage.removeItem('adminEmail');
    this.router.navigate(['/login']);
  }
}