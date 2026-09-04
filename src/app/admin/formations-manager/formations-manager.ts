import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../../core/services/formation';
import { AuthService } from '../../core/services/auth';
import { CategorieService } from '../../core/services/categorie';
import { Categorie } from '../../core/models/categorie.model';
@Component({
  selector: 'app-formations-manager',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './formations-manager.html',
  styleUrl: './formations-manager.css'
})
export class FormationsManager implements OnInit {

  formations: any[] = [];
  categories: Categorie[] = [];
  formData = {
    titre: '',
    descriptif: '',
    certifiante: true,
    axesString: '',
    dateDebut: '',
    dateFin: '',
    statut: 'Disponible',
    icone:'',
    couleur:'#29ABE2',
    categorieId: null as number | null
  };

  // Fichiers réellement présents dans src/assets/logos — évite de taper un nom
  // (ou un emoji par erreur) qui ne correspond à aucun fichier existant.
  logosDisponibles = [
    'AI.png', 'ISO.png', 'Itil.png', 'Prince2.png', 'cisco.svg', 'default.png',
    'fortinet.svg', 'microsoft-azure.svg', 'microsoft-office-svgrepo-com.svg',
    'microsoft.svg', 'ms-defender.svg', 'oracle.svg', 'pmp.svg', 'power-Bi.png', 'windows.svg'
  ];

  suggestionsCouleurs = [
    { nom: 'Box Academy', hex: '#29ABE2' },
    { nom: 'Microsoft', hex: '#00A4EF' },
    { nom: 'Azure', hex: '#0089D7' },
    { nom: 'Office 365', hex: '#F25022' },
    { nom: 'Power BI', hex: '#F2C811' },
    { nom: 'Cisco', hex: '#049FD9' },
    { nom: 'Oracle', hex: '#C74634' },
    { nom: 'ITIL', hex: '#00A19A' },
    { nom: 'PRINCE2', hex: '#E4067E' },
    { nom: 'Sécurité / ISO', hex: '#1B4F72' }
  ];

  showFormulaire = false;
  modeEdition = false;
  idEdition = 0;
  recherche = '';
  erreur = '';

  constructor(
    private router: Router,
    private formationService: FormationService,
    private authService: AuthService,
    private categorieService: CategorieService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
     console.log("=== FormationsManager créé ===", this);

  this.chargerFormations();
  this.chargerCategories();
  }

  chargerCategories() {
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur chargement catégories :", err);
      }
    });
  }

chargerFormations() {
  this.formationService.getFormations().subscribe({
    next: (data) => {
      this.formations = data;
      this.cdr.detectChanges(); // ← ajoute cette ligne
    },
    error: (err) => {
      console.error("Erreur :", err);
    }
  });
}

ngOnDestroy() {
  console.log("=== FormationsManager détruit ===");
}



  formationsFiltrees() {
    return this.formations.filter(f =>
      f.titre.toLowerCase().includes(this.recherche.toLowerCase())
    );
  }

  ouvrirFormulaire() {
    this.showFormulaire = true;
    this.modeEdition = false;
    this.formData = { titre: '', descriptif: '', certifiante: true, axesString: '', dateDebut: '', dateFin: '', statut: 'Disponible',icone:'' ,couleur:'#29ABE2', categorieId: null};
    this.erreur = '';
  }

  editer(formation: any) {
    this.showFormulaire = true;
    this.modeEdition = true;
    this.idEdition = formation.id;
    this.formData = {
      titre: formation.titre,
      descriptif: formation.descriptif,
      certifiante: formation.certifiante,
      axesString: formation.axes.join(', '),
      dateDebut: formation.dateDebut,
      dateFin: formation.dateFin,
      statut: formation.statut,
      icone:formation.icone,
      couleur:formation.couleur || '#29ABE2',
      categorieId: formation.categorie?.id ?? null
    };
    this.erreur = '';
  }
  choisirCouleur(hex: string): void {
    this.formData.couleur = hex;
  }



  sauvegarder() {
    if (!this.formData.titre || !this.formData.descriptif) {
      this.erreur = 'Veuillez remplir les champs obligatoires.';
      return;
    }

    const axes = this.formData.axesString
      .split(',')
      .map(a => a.trim())
      .filter(a => a !== '');

    const formation = {
      titre: this.formData.titre,
      descriptif: this.formData.descriptif,
      certifiante: this.formData.certifiante,
      axes: axes,
      dateDebut: this.formData.dateDebut,
      dateFin: this.formData.dateFin,
      statut: this.formData.statut,
      icone:this.formData.icone,
      couleur:this.formData.couleur,
      // L'API exige l'objet catégorie complet (id, nom, description, icone, couleur, slug) —
      // un simple {id} renvoie une erreur 400. On retrouve donc l'objet complet dans la
      // liste déjà chargée plutôt que de n'envoyer que la référence.
      categorie: this.formData.categorieId
        ? (this.categories.find(c => c.id === this.formData.categorieId) ?? null)
        : null
    };

    if (this.modeEdition) {
      this.formationService.modifierFormation(this.idEdition, formation).subscribe({
        next: () => {
          this.chargerFormations();
          this.showFormulaire = false;
        },
        error: () => {
          this.erreur = 'Erreur lors de la modification.';
        }
      });
    } else {
      this.formationService.ajouterFormation(formation).subscribe({
        next: () => {
          this.chargerFormations();
          this.showFormulaire = false;
        },
        error: () => {
          this.erreur = 'Erreur lors de l\'ajout.';
        }
      });
    }
  }

  supprimer(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      this.formationService.supprimerFormation(id).subscribe({
        next: () => {
          this.chargerFormations();
        },
        error: () => {
          this.erreur = 'Erreur lors de la suppression.';
        }
      });
    }
  }

  annuler() {
    this.showFormulaire = false;
    this.erreur = '';
  }

  
}