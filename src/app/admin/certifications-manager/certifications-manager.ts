
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CertificationAdminService } from '../../core/services/certification-admin';
import { FormationService } from '../../core/services/formation';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-certifications-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './certifications-manager.html',
  styleUrl: './certifications-manager.css'
})
export class CertificationsManager implements OnInit {

  certifications: any[] = [];
  membres: any[] = [];
  formations: any[] = [];

  showFormulaire = false;
  modeGeneration = false;
  fichierSelectionne: File | null = null;
  erreur = '';
  envoiEnCours = false;

  formData = {
    membreId: '',
    formationId: '',
    dateObtention: '',
    civilite: 'M.',
    dateDebutFormation: '',
    dateFinFormation: '',
    lieu: ''
  };

  recherche = '';

  constructor(
    private certificationAdminService: CertificationAdminService,
    private formationService: FormationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerCertifications();
    this.chargerMembres();
    this.chargerFormations();
  }

  chargerCertifications() {
    this.certificationAdminService.getAll().subscribe({
      next: (data) => {
        this.certifications = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur certifications :", err)
    });
  }

  chargerMembres() {
    this.certificationAdminService.getMembres().subscribe({
      next: (data) => {
        this.membres = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur membres :", err)
    });
  }

  chargerFormations() {
    this.formationService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur formations :", err)
    });
  }

  certificationsFiltrees() {
    return this.certifications.filter(c =>
      c.membre?.nom?.toLowerCase().includes(this.recherche.toLowerCase()) ||
      c.membre?.prenom?.toLowerCase().includes(this.recherche.toLowerCase()) ||
      c.formation?.titre?.toLowerCase().includes(this.recherche.toLowerCase())
    );
  }

  ouvrirFormulaire() {
    this.showFormulaire = true;
    this.modeGeneration = false;
    this.formData = {
      membreId: '',
      formationId: '',
      dateObtention: '',
      civilite: 'M.',
      dateDebutFormation: '',
      dateFinFormation: '',
      lieu: ''
    };
    this.fichierSelectionne = null;
    this.erreur = '';
  }

  annuler() {
    this.showFormulaire = false;
    this.erreur = '';
  }

  onFichierSelectionne(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichierSelectionne = input.files[0];
    }
  }

  envoyer() {
    if (!this.formData.membreId || !this.formData.formationId || !this.formData.dateObtention || !this.fichierSelectionne) {
      this.erreur = 'Veuillez remplir tous les champs et sélectionner un fichier.';
      return;
    }

    const adminInfo = this.authService.getAdminInfo();

    const formDataEnvoi = new FormData();
    formDataEnvoi.append('fichier', this.fichierSelectionne);
    formDataEnvoi.append('membreId', this.formData.membreId);
    formDataEnvoi.append('formationId', this.formData.formationId);
    formDataEnvoi.append('adminId', adminInfo.id);
    formDataEnvoi.append('dateObtention', this.formData.dateObtention);

    this.envoiEnCours = true;
    this.erreur = '';

    this.certificationAdminService.upload(formDataEnvoi).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.showFormulaire = false;
        this.chargerCertifications();
      },
      error: (err) => {
        this.envoiEnCours = false;
        this.erreur = err.error?.erreur || 'Erreur lors de l\'envoi.';
      }
    });
  }

  genererAttestation() {
    if (!this.formData.membreId || !this.formData.formationId || !this.formData.dateObtention ||
        !this.formData.dateDebutFormation || !this.formData.dateFinFormation) {
      this.erreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    const adminInfo = this.authService.getAdminInfo();

    const payload = {
      membreId: this.formData.membreId,
      formationId: this.formData.formationId,
      adminId: adminInfo.id,
      civilite: this.formData.civilite,
      dateObtention: this.formData.dateObtention,
      dateDebutFormation: this.formData.dateDebutFormation,
      dateFinFormation: this.formData.dateFinFormation,
      lieu: this.formData.lieu
    };

    this.envoiEnCours = true;
    this.erreur = '';

    this.certificationAdminService.genererEtEnvoyer(payload).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.showFormulaire = false;
        this.chargerCertifications();
      },
      error: (err) => {
        this.envoiEnCours = false;
        this.erreur = err.error?.erreur || 'Erreur lors de la génération.';
      }
    });
  }

  supprimer(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette certification ?')) {
      this.certificationAdminService.delete(id).subscribe({
        next: () => this.chargerCertifications(),
        error: (err) => console.error("Erreur suppression :", err)
      });
    }
  }
}