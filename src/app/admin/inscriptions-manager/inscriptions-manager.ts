import { Component, OnInit,ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InscriptionService } from '../../core/services/inscription';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-inscriptions-manager',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './inscriptions-manager.html',
  styleUrl: './inscriptions-manager.css'
})
export class InscriptionsManager implements OnInit {

  inscriptions: any[] = [];
  filtreStatut = 'tous';
  recherche = '';

  constructor(
    private router: Router,
    private inscriptionService: InscriptionService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef 
  ) {}

 ngOnInit() {
  console.log("=== InscriptionsManager créé ===");
  this.chargerInscriptions();
}

ngOnDestroy() {
  console.log("=== InscriptionsManager détruit ===");
}
 chargerInscriptions() {
    this.inscriptionService.getInscriptions().subscribe({
      next: (data) => {
        this.inscriptions = data;
        this.cdr.detectChanges(); // ← ajoute
      },
      error: (err) => {
        console.error("Erreur inscriptions :", err);
      }
    });
  }

  inscriptionsFiltrees() {
  return this.inscriptions.filter(i => {
    const matchStatut = this.filtreStatut === 'tous' || i.statut === this.filtreStatut;
    const matchRecherche =
      i.nom.toLowerCase().includes(this.recherche.toLowerCase()) ||
      i.prenom.toLowerCase().includes(this.recherche.toLowerCase()) ||
      (i.formation?.titre?.toLowerCase().includes(this.recherche.toLowerCase()) ?? false);
    return matchStatut && matchRecherche;
  });
}

  compterStatut(statut: string) {
    return this.inscriptions.filter(i => i.statut === statut).length;
  }

  filtrerStatut(statut: string) {
    this.filtreStatut = statut;
  }

  valider(id: number) {
  this.inscriptionService.validerInscription(id).subscribe({
    next: () => {
      const index = this.inscriptions.findIndex(i => i.id === id);
      if (index !== -1) {
        this.inscriptions[index].statut = 'validée';
      }
      this.cdr.detectChanges();
    },
    error: (err) => console.error("Erreur validation :", err)
  });
}

rejeter(id: number) {
  this.inscriptionService.rejeterInscription(id).subscribe({
    next: () => {
      const index = this.inscriptions.findIndex(i => i.id === id);
      if (index !== -1) {
        this.inscriptions[index].statut = 'rejetée';
      }
      this.cdr.detectChanges();
    },
    error: (err) => console.error("Erreur rejet :", err)
  });
}

  
}