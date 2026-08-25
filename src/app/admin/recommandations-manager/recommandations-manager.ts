import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecommandationAdminService } from '../../core/services/recommandation-admin';

@Component({
  selector: 'app-recommandations-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recommandations-manager.html',
  styleUrl: './recommandations-manager.css'
})
export class RecommandationsManager implements OnInit {

  recommandations: any[] = [];
  categories: any[] = [];
  showFormulaire = false;
  erreur = '';
  envoiEnCours = false;

  secteurs = ['IT', 'Finance', 'Santé', 'Éducation', 'Commerce', 'Industrie', 'Administration', 'Autre'];
  objectifs = ['Reconversion professionnelle', 'Montée en compétence', 'Certification professionnelle', 'Curiosité personnelle'];

  formData = {
    secteur: '',
    objectif: '',
    categorieId: '',
    poids: 2,
    explication: ''
  };

  constructor(
    private recommandationAdminService: RecommandationAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.charger();
    this.chargerCategories();
  }

  charger() {
    this.recommandationAdminService.getAll().subscribe({
      next: (data) => {
        this.recommandations = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur :", err)
    });
  }

  chargerCategories() {
    this.recommandationAdminService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur catégories :", err)
    });
  }

  ouvrirFormulaire() {
    this.showFormulaire = true;
    this.formData = { secteur: '', objectif: '', categorieId: '', poids: 2, explication: '' };
    this.erreur = '';
  }

  annuler() {
    this.showFormulaire = false;
    this.erreur = '';
  }

  enregistrer() {
    if (!this.formData.secteur || !this.formData.objectif || !this.formData.categorieId || !this.formData.explication) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }

    this.envoiEnCours = true;
    this.erreur = '';

    this.recommandationAdminService.creer(this.formData).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.showFormulaire = false;
        this.charger();
      },
      error: (err) => {
        this.envoiEnCours = false;
        this.erreur = 'Erreur lors de la création.';
      }
    });
  }

  supprimer(id: number) {
    if (confirm('Supprimer cette recommandation ?')) {
      this.recommandationAdminService.supprimer(id).subscribe({
        next: () => this.charger(),
        error: (err) => console.error("Erreur suppression :", err)
      });
    }
  }
}