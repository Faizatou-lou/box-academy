import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CertificationData {
  id: number;
  formation: {
    id: number;
    titre: string;
    categorie: {
      nom: string;
      couleur: string;
    };
  };
  nomFichier: string;
  dateObtention: string;
  dateUpload: string;
  statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class CertificationService {

  private apiUrl = `${environment.apiUrl}/api/membres/mes-certifications`;
  private telechargerUrl = `${environment.apiUrl}/api/certifications`;

  constructor(private http: HttpClient) {}

  getMesCertifications(): Observable<CertificationData[]> {
    return this.http.get<CertificationData[]>(this.apiUrl);
  }

  getUrlTelechargement(certificationId: number): string {
    return `${this.telechargerUrl}/${certificationId}/telecharger`;
  }
}