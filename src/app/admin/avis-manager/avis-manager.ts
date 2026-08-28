import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvisAdminService } from '../../core/services/avis-admin';

@Component({
  selector: 'app-avis-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './avis-manager.html',
  styleUrl: './avis-manager.css'
})
export class AvisManager implements OnInit {

  avisListe: any[] = [];
  filtreStatut = 'tous';

  constructor(
    private avisAdminService: AvisAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger() {
    this.avisAdminService.getAll().subscribe({
      next: (data) => {
        this.avisListe = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur avis :", err)
    });
  }

  avisFiltres() {
    if (this.filtreStatut === 'tous') return this.avisListe;
    return this.avisListe.filter(a => a.statut === this.filtreStatut);
  }

  compterStatut(statut: string) {
    return this.avisListe.filter(a => a.statut === statut).length;
  }

  valider(id: number) {
    this.avisAdminService.valider(id).subscribe({
      next: () => this.charger(),
      error: (err) => console.error("Erreur validation :", err)
    });
  }

  rejeter(id: number) {
    this.avisAdminService.rejeter(id).subscribe({
      next: () => this.charger(),
      error: (err) => console.error("Erreur rejet :", err)
    });
  }

  supprimer(id: number) {
    if (confirm('Supprimer définitivement cet avis ?')) {
      this.avisAdminService.supprimer(id).subscribe({
        next: () => this.charger(),
        error: (err) => console.error("Erreur suppression :", err)
      });
    }
  }
}