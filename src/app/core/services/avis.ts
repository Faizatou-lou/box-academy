import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AvisData {
  id: number;
  nom: string;
  email: string;
  note: number;
  commentaire: string;
  statut: string;
  dateCreation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  private apiUrl = `${environment.apiUrl}/api/avis`;

  constructor(private http: HttpClient) {}

  creer(data: { nom: string; email: string; note: number; commentaire: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getPublies(): Observable<AvisData[]> {
    return this.http.get<AvisData[]>(`${this.apiUrl}/publies`);
  }
}