import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../../core/services/formation';
import { CoursService } from '../../core/services/cours';

@Component({
  selector: 'app-cours-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cours-manager.html',
  styleUrl: './cours-manager.css'
})
export class CoursManager implements OnInit {

  formations: any[] = [];
  formationSelectionneeId: number | null = null;
  fichierVideoSelectionne: File | null = null;
  coursListe: any[] = [];

  titre = '';
  description = '';
  fichierSelectionne: File | null = null;
  chargement = false;
  erreur = '';
  succes = '';

  // Liens facultatifs
  liensYoutube: string[] = [];
  liensGoogle: string[] = [];

  // Mode édition
  coursEnEditionId: number | null = null;

  private readonly ADMIN_ID = 11;

  constructor(
    private formationService: FormationService,
    private coursService: CoursService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formationService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur formations :', err)
    });
  }

  selectionnerFormation(formationId: number): void {
    this.formationSelectionneeId = formationId;
    this.annulerEdition();
    this.chargerCours();
  }

  chargerCours(): void {
    if (!this.formationSelectionneeId) return;
    this.coursService.getByFormation(this.formationSelectionneeId).subscribe({
      next: (data) => {
        this.coursListe = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur cours :', err)
    });
  }

  onFichierChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichierSelectionne = input.files[0];
    }
  }

  retirerFichier(inputElement: HTMLInputElement): void {
    this.fichierSelectionne = null;
    inputElement.value = '';
    this.cdr.detectChanges();
  }

  onFichierVideoChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.fichierVideoSelectionne = input.files[0];
  }
}

retirerFichierVideo(inputElement: HTMLInputElement): void {
  this.fichierVideoSelectionne = null;
  inputElement.value = '';
  this.cdr.detectChanges();
}

  // --- Gestion des liens YouTube (facultatifs) ---
  ajouterChampYoutube(): void {
    this.liensYoutube.push('');
  }

  retirerChampYoutube(index: number): void {
    this.liensYoutube.splice(index, 1);
  }

  // --- Gestion des liens Google (facultatifs) ---
  ajouterChampGoogle(): void {
    this.liensGoogle.push('');
  }

  retirerChampGoogle(index: number): void {
    this.liensGoogle.splice(index, 1);
  }

  // --- Passage en mode édition ---
  editerCours(cours: any): void {
    this.coursEnEditionId = cours.id;
    this.titre = cours.titre;
    this.description = cours.description || '';
    this.liensYoutube = cours.liensYoutube ? [...cours.liensYoutube] : [];
    this.liensGoogle = cours.liensGoogle ? [...cours.liensGoogle] : [];
    this.fichierSelectionne = null;
    this.erreur = '';
    this.succes = '';
  }

  annulerEdition(): void {
    this.coursEnEditionId = null;
    this.titre = '';
    this.description = '';
    this.liensYoutube = [];
    this.liensGoogle = [];
    this.fichierSelectionne = null;
    this.fichierVideoSelectionne = null;
    this.erreur = '';
  }

  private nettoyerLiens(liste: string[]): string[] {
    return liste.map(l => l.trim()).filter(l => l.length > 0);
  }

  soumettre(inputElement: HTMLInputElement): void {
    if (this.coursEnEditionId) {
      this.modifierCours(inputElement);
    } else {
      this.uploaderCours(inputElement);
    }
  }

 uploaderCours(inputElement: HTMLInputElement): void {
    const auMoinsUnContenu = this.fichierSelectionne || this.fichierVideoSelectionne || this.liensYoutube.some(l => l.trim()) || this.liensGoogle.some(l => l.trim());

    if (!this.titre || !auMoinsUnContenu || !this.formationSelectionneeId) {
      this.erreur = 'Veuillez remplir le titre et ajouter au moins un fichier, une vidéo ou un lien.';
      this.cdr.detectChanges();
      return;
    }

    this.erreur = '';
    this.succes = '';
    this.chargement = true;

    this.coursService.uploader(
      this.fichierSelectionne,
      this.fichierVideoSelectionne,
      this.titre,
      this.description,
      this.formationSelectionneeId,
      this.ADMIN_ID,
      this.nettoyerLiens(this.liensYoutube),
      this.nettoyerLiens(this.liensGoogle)
    ).subscribe({
      next: () => {
        this.chargement = false;
        this.succes = 'Cours ajouté avec succès !';
        this.annulerEdition();
        inputElement.value = '';
        this.chargerCours();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.succes = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur upload :', err);
        this.erreur = "Erreur lors de l'ajout du cours.";
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
}




  modifierCours(inputElement: HTMLInputElement): void {
    if (!this.titre || !this.coursEnEditionId) {
      this.erreur = 'Veuillez remplir le titre.';
      return;
    }

    this.erreur = '';
    this.succes = '';
    this.chargement = true;

    this.coursService.modifier(
      this.coursEnEditionId,
      this.titre,
      this.description,
      this.fichierSelectionne,
      this.nettoyerLiens(this.liensYoutube),
      this.nettoyerLiens(this.liensGoogle)
    ).subscribe({
      next: () => {
        this.chargement = false;
        this.succes = 'Cours modifié avec succès !';
        this.annulerEdition();
        inputElement.value = '';
        this.chargerCours();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.succes = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur modification :', err);
        this.erreur = "Erreur lors de la modification du cours.";
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  supprimerCours(id: number): void {
    if (!confirm('Supprimer ce cours ?')) return;

    this.coursService.supprimer(id).subscribe({
      next: () => {
        if (this.coursEnEditionId === id) this.annulerEdition();
        this.chargerCours();
      },
      error: (err) => console.error('Erreur suppression :', err)
    });
  }
}