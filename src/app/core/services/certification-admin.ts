import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificationAdminService {

  private apiUrl = `${environment.apiUrl}/api/admin/certifications`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMembres(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/membres`);
  }

  upload(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData);
  }

  genererEtEnvoyer(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generer`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}