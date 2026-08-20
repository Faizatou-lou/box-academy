import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormationService } from '../../core/services/formation';
import { CoursService } from '../../core/services/cours';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-formation-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './formation-detail.html',
  styleUrl: './formation-detail.css'
})
export class FormationDetail implements OnInit {

  formation: any = null;

  emailProspect = '';
  emailSaisi = false;
  enregistrementEnCours = false;
  erreurEmail = '';

  isDev = !environment.production;

  private readonly STORAGE_PREFIX = 'box_academy_email_formation_';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private coursService: CoursService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.formationService.getFormation(id).subscribe({
      next: (data) => {
        this.formation = data;

        const emailStocke = sessionStorage.getItem(this.getStorageKey(this.formation.id));
        if (emailStocke) {
          this.emailProspect = emailStocke;
          this.emailSaisi = true;
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur HTTP :', err);
      }
    });
  }

  private getStorageKey(formationId: number): string {
    return `${this.STORAGE_PREFIX}${formationId}`;
  }

  soumettreEmail(): void {
    if (!this.emailProspect || !this.emailProspect.includes('@')) {
      this.erreurEmail = 'Veuillez entrer un email valide.';
      return;
    }

    this.erreurEmail = '';
    this.enregistrementEnCours = true;

    this.coursService.enregistrerProspect(this.emailProspect, this.formation.id, this.formation.titre).subscribe({
      next: () => this.allerVersCours(),
      error: () => this.allerVersCours()
    });
  }

  private allerVersCours(): void {
    sessionStorage.setItem(this.getStorageKey(this.formation.id), this.emailProspect);
    this.enregistrementEnCours = false;
    this.router.navigate(['/formation-detail', this.formation.id, 'cours']);
  }

  resetEmailDev(): void {
    if (!this.formation) return;
    sessionStorage.removeItem(this.getStorageKey(this.formation.id));
    this.emailSaisi = false;
    this.emailProspect = '';
    this.cdr.detectChanges();
  }
}