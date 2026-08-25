import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FormationRecommandee {
  formationId: number;
  titre: string;
  descriptif: string;
  icone: string;
  couleur: string | null;
  categorieNom: string;
  explication: string;
  poids: number;
}

export interface RecommandationsReponse {
  profilComplet: boolean;
  message?: string;
  formations: FormationRecommandee[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommandationService {

  private apiUrl = `${environment.apiUrl}/api/membres/recommandations`;

  constructor(private http: HttpClient) {}

  getRecommandations(): Observable<RecommandationsReponse> {
    return this.http.get<RecommandationsReponse>(this.apiUrl);
  }
}