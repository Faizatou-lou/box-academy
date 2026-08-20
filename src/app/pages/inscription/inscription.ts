import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { FormationService } from '../../core/services/formation';
import { InscriptionService } from '../../core/services/inscription';
import { CategoryIcon } from '../../shared/category-icon/category-icon';
import { Formation } from '../../core/models/formation.model';
import { NouvelleInscription } from '../../core/models/inscription.model';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CategoryIcon],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css'
})
export class Inscription implements OnInit {

  private formationService = inject(FormationService);
  private inscriptionService = inject(InscriptionService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  currentStep = 1;
  readonly totalSteps = 5;

  formations: Formation[] = [];
  formationsChargees = false;
  formationPreselectionnee: Formation | null = null;

  formData: NouvelleInscription = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    formation: '',
    formationId: 0,
    message: '',
    date: new Date().toLocaleDateString('fr-FR'),
    statut: 'en-attente'
  };

  success = false;
  erreur = '';
  chargement = false;

  ngOnInit(): void {
    const formationId = this.route.snapshot.queryParamMap.get('formation');

    this.formationService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.formationsChargees = true;

        if (formationId) {
          const trouvee = this.formations.find(
            f => String(f.id) === String(formationId)
          );
          if (trouvee) {
            this.selectFormation(trouvee);
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des formations :', err);
        this.formationsChargees = true;
        this.cdr.detectChanges();
      }
    });
  }

  selectFormation(formation: Formation): void {
    this.formData.formation = formation.titre;
    this.formData.formationId = formation.id;
    this.formationPreselectionnee = formation;
    this.goToStep(2);
    this.cdr.detectChanges();
  }

  changerFormation(): void {
    this.formationPreselectionnee = null;
    this.formData.formation = '';
    this.formData.formationId = 0;
    this.goToStep(1);
    this.cdr.detectChanges();
  }

  nextStep(): void {
    if (this.canContinue() && this.currentStep < this.totalSteps) {
      this.goToStep(this.currentStep + 1);
      this.cdr.detectChanges();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
      this.cdr.detectChanges();
    }
  }

  private goToStep(step: number): void {
    this.currentStep = step;
  }

  canContinue(): boolean {
    switch (this.currentStep) {
      case 1: return !!this.formData.formationId;
      case 2: return this.formData.prenom.trim().length > 1;
      case 3: return this.formData.nom.trim().length > 1;
      case 4: return this.isValidEmail(this.formData.email) && this.formData.telephone.trim().length >= 8;
      case 5: return true;
      default: return false;
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getBotMessage(): string {
    switch (this.currentStep) {
      case 1: return "Bonjour 👋 Quelle formation vous intéresse ?";
      case 2: return `Excellent choix pour « ${this.formData.formation} » ! Quel est votre prénom ?`;
      case 3: return `Enchanté, ${this.formData.prenom} ! Et votre nom de famille ?`;
      case 4: return `Parfait ${this.formData.prenom}, comment puis-je vous contacter ?`;
      case 5: return "Une dernière chose : un message ou une question à ajouter ?";
      default: return '';
    }
  }

  soumettre(): void {
    if (!this.canContinue() || this.chargement) return;

    this.erreur = '';
    this.chargement = true;
    this.formData.date = new Date().toLocaleDateString('fr-FR');

    this.inscriptionService.ajouterInscription(this.formData).subscribe({
      next: () => {
        this.chargement = false;
        this.success = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur', err);
        this.chargement = false;
        this.erreur = 'Une erreur est survenue. Veuillez réessayer.';
        this.cdr.detectChanges();
      }
    });
  }

  get progressPercent(): number {
    return (Math.min(this.currentStep, this.totalSteps) / this.totalSteps) * 100;
  }

  trackByFormationId(index: number, formation: Formation): number {
    return formation.id;
  }
}