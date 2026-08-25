import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InscriptionData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
}

export interface ConnexionData {
  email: string;
  motDePasse: string;
}

export interface AuthReponse {
  token: string;
  nom: string;
  prenom: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthMembreService {

  private apiUrl = `${environment.apiUrl}/api/membres/auth`;

  constructor(private http: HttpClient) {}

  inscription(data: InscriptionData): Observable<AuthReponse> {
    return this.http.post<AuthReponse>(`${this.apiUrl}/inscription`, data).pipe(
      tap(reponse => this.stockerSession(reponse))
    );
  }

  connexion(data: ConnexionData): Observable<AuthReponse> {
    return this.http.post<AuthReponse>(`${this.apiUrl}/connexion`, data).pipe(
      tap(reponse => this.stockerSession(reponse))
    );
  }

  private stockerSession(reponse: AuthReponse): void {
    localStorage.setItem('membre_token', reponse.token);
    localStorage.setItem('membre_nom', reponse.nom);
    localStorage.setItem('membre_prenom', reponse.prenom);
    localStorage.setItem('membre_email', reponse.email);
  }

  deconnexion(): void {
    localStorage.removeItem('membre_token');
    localStorage.removeItem('membre_nom');
    localStorage.removeItem('membre_prenom');
    localStorage.removeItem('membre_email');
  }

  estConnecte(): boolean {
    return !!localStorage.getItem('membre_token');
  }

  getToken(): string | null {
    return localStorage.getItem('membre_token');
  }

  getPrenom(): string | null {
    return localStorage.getItem('membre_prenom');
  }
}