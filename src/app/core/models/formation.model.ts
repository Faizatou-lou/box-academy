import { Categorie } from './categorie.model';

export type StatutFormation = 'a-venir' | 'disponible' | string;

export interface Formation {
  id: number;
  titre: string;
  descriptif: string;
  certifiante: boolean;
  statut: StatutFormation;
  icone?: string;
  axes?: string[];
  categorie?: Categorie | null;
}