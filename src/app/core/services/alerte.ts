import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AlerteData {
  type: string;
  message: string;
  urgence: string;
  referenceId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlerteService {

  private apiUrl = `${environment.apiUrl}/api/admin/alertes`;

  constructor(private http: HttpClient) {}

  getAlertes(): Observable<AlerteData[]> {
    return this.http.get<AlerteData[]>(this.apiUrl);
  }
}