export type StatutInscription = 'en-attente' | 'valide' | 'rejete';

export interface Inscription {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  formation: string;     // titre de la formation (snapshot texte)
  formationId: number;
  message: string;
  date: string;
  statut: StatutInscription;
}

// Payload d'envoi (avant que le back ne génère l'id définitif)
export type NouvelleInscription = Omit<Inscription, 'id'>;