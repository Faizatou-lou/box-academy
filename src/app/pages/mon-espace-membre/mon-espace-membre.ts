import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthMembreService } from '../../core/services/auth-membre';
import { ProfilMembreService, ProfilData } from '../../core/services/profil-membre';
import { RecommandationService, FormationRecommandee } from '../../core/services/recommandation';
import { CertificationService, CertificationData } from '../../core/services/certification';


@Component({
  selector: 'app-mon-espace-membre',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './mon-espace-membre.html',
  styleUrl: './mon-espace-membre.css',
})
export class MonEspaceMembre implements OnInit {

  profil = signal<ProfilData | null>(null);
  chargement = signal(true);
  modeEditionProfil = signal(false);
recommandations = signal<FormationRecommandee[]>([]);
certifications = signal<CertificationData[]>([]);

editData = {
  metier: '',
  secteur: '',
  objectif: '',
  couleurAccent: '#29abe2'
};

secteurs = ['IT', 'Finance', 'Santé', 'Éducation', 'Commerce', 'Industrie', 'Administration', 'Autre'];
objectifs = ['Reconversion professionnelle', 'Montée en compétence', 'Certification professionnelle', 'Curiosité personnelle'];

couleursDisponibles = [
  { nom: 'Bleu', valeur: '#29abe2' },
  { nom: 'Violet', valeur: '#8b5cf6' },
  { nom: 'Rose', valeur: '#ec4899' },
  { nom: 'Vert', valeur: '#10b981' },
  { nom: 'Orange', valeur: '#f97316' },
  { nom: 'Rouge', valeur: '#ef4444' },
];

accentActuel = computed(() => {
  return this.profil()?.couleurAccent || '#29abe2';
});

  progression = computed(() => {
    const p = this.profil();
    if (!p) return 0;
    let rempli = 2; // nom + prenom toujours présents
    if (p.metier) rempli++;
    if (p.secteur) rempli++;
    if (p.objectif) rempli++;
    if (p.telephone) rempli++;
    return Math.round((rempli / 6) * 100);
  });



  nombreCertifications = computed(() => this.certifications().length);

  salutation = computed(() => {
    const heure = new Date().getHours();
    if (heure < 12) return 'Bonjour';
    if (heure < 18) return 'Bon après-midi';
    return 'Bonsoir';
  });

constructor(
  private authMembreService: AuthMembreService,
  private profilMembreService: ProfilMembreService,
  private recommandationService: RecommandationService,
  private certificationService: CertificationService,
  private router: Router
) {}
  ngOnInit(): void {
    if (!this.authMembreService.estConnecte()) {
      this.router.navigate(['/connexion']);
      return;
    }

    this.profilMembreService.getProfil().subscribe({
  next: (data) => {
    this.profil.set(data);
    this.editData = {
      metier: data.metier || '',
      secteur: data.secteur || '',
      objectif: data.objectif || '',
      couleurAccent: data.couleurAccent || '#29abe2'
    };
    this.chargement.set(false);
    this.chargerRecommandations();
    this.chargerCertifications();
  },
  error: () => {
    this.chargement.set(false);
  }
});
  }
chargerRecommandations(): void {
  this.recommandationService.getRecommandations().subscribe({
    next: (data) => {
      this.recommandations.set(data.formations);
    }
  });
}
recommandationsGroupees = computed(() => {
  const formations = this.recommandations();
  const groupes = new Map<string, { categorieNom: string; explication: string; formations: FormationRecommandee[] }>();

  for (const f of formations) {
    if (!groupes.has(f.categorieNom)) {
      groupes.set(f.categorieNom, {
        categorieNom: f.categorieNom,
        explication: f.explication,
        formations: []
      });
    }
    groupes.get(f.categorieNom)!.formations.push(f);
  }

  return Array.from(groupes.values());
});


chargerCertifications(): void {
  this.certificationService.getMesCertifications().subscribe({
    next: (data) => {
      this.certifications.set(data);
    }
  });
}

telechargerCertification(certificationId: number): void {
  const url = this.certificationService.getUrlTelechargement(certificationId);
  window.open(url, '_blank');
}


  ouvrirEditionProfil(): void {
    this.modeEditionProfil.set(true);
  }
choisirCouleur(couleur: string): void {
  this.editData.couleurAccent = couleur;
}
  fermerEditionProfil(): void {
    this.modeEditionProfil.set(false);
  }

  enregistrerProfil(): void {
    this.profilMembreService.mettreAJourProfil(this.editData).subscribe({
      next: () => {
        const p = this.profil();
        if (p) {
          this.profil.set({ ...p, ...this.editData });
        }
        this.modeEditionProfil.set(false);
      }
    });
  }

  deconnexion(): void {
    this.authMembreService.deconnexion();
    this.router.navigate(['/connexion']);
  }
}