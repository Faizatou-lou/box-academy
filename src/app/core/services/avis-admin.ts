import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvisAdminService {

  private apiUrl = `${environment.apiUrl}/api/admin/avis`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  valider(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/valider`, {});
  }

  rejeter(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/rejeter`, {});
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}