import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CoursService {

  private apiUrl = `${environment.apiUrl}/api/cours`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getByFormation(formationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getUrlTelechargement(coursId: number, email: string): string {
    return `${this.apiUrl}/${coursId}/telecharger?email=${encodeURIComponent(email)}`;
  }
  getUrlTelechargementVideo(coursId: number, email: string): string {
  return `${this.apiUrl}/${coursId}/telecharger-video?email=${encodeURIComponent(email)}`;
}

  uploader(
  fichier: File | null,
  fichierVideo: File | null,
  titre: string,
  description: string,
  formationId: number,
  adminId: number,
  liensYoutube: string[] = [],
  liensGoogle: string[] = []
): Observable<any> {
  const formData = new FormData();
  if (fichier) formData.append('fichier', fichier);
  if (fichierVideo) formData.append('fichierVideo', fichierVideo);
  formData.append('titre', titre);
  formData.append('description', description);
  formData.append('formationId', formationId.toString());
  formData.append('adminId', adminId.toString());

  liensYoutube.forEach(lien => formData.append('liensYoutube', lien));
  liensGoogle.forEach(lien => formData.append('liensGoogle', lien));

  return this.http.post<any>(`${this.apiUrl}/upload`, formData);
}
  modifier(
    id: number,
    titre: string,
    description: string,
    fichier: File | null,
    liensYoutube: string[] = [],
    liensGoogle: string[] = []
  ): Observable<any> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    if (fichier) formData.append('fichier', fichier);

    liensYoutube.forEach(lien => formData.append('liensYoutube', lien));
    liensGoogle.forEach(lien => formData.append('liensGoogle', lien));

    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  enregistrerProspect(email: string, formationId: number, titreFormation: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/prospects`, {
      email,
      formationId,
      coursConsulte: titreFormation
    });
  }
}