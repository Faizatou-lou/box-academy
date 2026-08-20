import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscription, NouvelleInscription } from '../models/inscription.model';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  private apiUrl = 'http://localhost:8080/api/inscriptions';

  constructor(private http: HttpClient) {}

  getInscriptions(): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(this.apiUrl);
  }

  getInscriptionsByFormation(formationId: number): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  getInscriptionsByStatut(statut: string): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.apiUrl}/statut/${statut}`);
  }

  ajouterInscription(inscription: NouvelleInscription): Observable<Inscription> {
    return this.http.post<Inscription>(this.apiUrl, inscription);
  }

  validerInscription(id: number): Observable<Inscription> {
    return this.http.patch<Inscription>(`${this.apiUrl}/${id}/valider`, {});
  }

  rejeterInscription(id: number): Observable<Inscription> {
    return this.http.patch<Inscription>(`${this.apiUrl}/${id}/rejeter`, {});
  }

  modifierStatut(id: number, statut: string): Observable<Inscription> {
    return this.http.patch<Inscription>(`${this.apiUrl}/${id}`, { statut });
  }

  supprimerInscription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  verifierAcces(email: string, formationId: number): Observable<{ acces: boolean }> {
    return this.http.get<{ acces: boolean }>(
      `${this.apiUrl}/verifier-acces?email=${encodeURIComponent(email)}&formationId=${formationId}`
    );
  }
}