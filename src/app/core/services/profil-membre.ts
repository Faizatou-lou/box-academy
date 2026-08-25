import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfilData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  metier: string | null;
  secteur: string | null;
  objectif: string | null;
  couleurAccent: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilMembreService {

  private apiUrl = `${environment.apiUrl}/api/membres/profil`;

  constructor(private http: HttpClient) {}

  getProfil(): Observable<ProfilData> {
    return this.http.get<ProfilData>(this.apiUrl);
  }

 mettreAJourProfil(data: { metier: string; secteur: string; objectif: string; couleurAccent: string }): Observable<any> {
    return this.http.put(this.apiUrl, data);
  }
}