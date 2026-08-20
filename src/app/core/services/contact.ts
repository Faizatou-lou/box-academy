import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) {}

  envoyerMessage(data: {
    nom: string;
    prenom: string;
    email: string;
    sujet: string;
    message: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}