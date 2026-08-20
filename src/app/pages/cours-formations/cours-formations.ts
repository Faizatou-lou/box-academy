import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormationService } from '../../core/services/formation';
import { CoursService } from '../../core/services/cours';
import { NgStyle } from '@angular/common';
@Component({
  selector: 'app-cours-formations',
  standalone: true,
  imports: [RouterLink,NgStyle],
  templateUrl: './cours-formations.html',
  styleUrl: './cours-formations.css'
})
export class CoursFormations implements OnInit {
  formation: any = null;
  coursListe: any[] = [];
  emailProspect = '';
  afficherPlusDescriptif = false;
  videosOuvertes = new Set<number>();

  toggleVideo(coursId: number): void {
    if (this.videosOuvertes.has(coursId)) {
      this.videosOuvertes.delete(coursId);
    } else {
      this.videosOuvertes.add(coursId);
    }
  }

  videoEstOuverte(coursId: number): boolean {
    return this.videosOuvertes.has(coursId);
  }

  private readonly STORAGE_PREFIX = 'box_academy_email_formation_';
  private readonly LIKES_KEY = 'box_academy_likes_';
  private readonly DISLIKES_KEY = 'box_academy_dislikes_';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private coursService: CoursService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const emailStocke = sessionStorage.getItem(this.STORAGE_PREFIX + id);

    if (!emailStocke) {
      this.router.navigate(['/formations', id]);
      return;
    }

    this.emailProspect = emailStocke;

    this.formationService.getFormation(id).subscribe({
      next: (data) => {
        this.formation = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur HTTP :', err)
    });

    this.coursService.getByFormation(id).subscribe({
      next: (data) => {
        this.coursListe = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur HTTP :', err)
    });
  }

  urlTelechargement(coursId: number): string {
    return this.coursService.getUrlTelechargement(coursId, this.emailProspect);
  }

  urlTelechargementVideo(coursId: number): string {
    return this.coursService.getUrlTelechargementVideo(coursId, this.emailProspect);
  }
styleBanniere(): { [key: string]: string } {
  const couleur = this.formation?.couleur || '#29ABE2';
  return {
    'background': `linear-gradient(160deg, ${couleur} 0%, ${this.assombrirCouleur(couleur, 45)} 100%)`
  };
}
styleHero(): { [key: string]: string } {
  const couleur = this.formation?.couleur || '#29ABE2';
  return {
    'background': `radial-gradient(circle at 15% 25%, ${couleur} 0%, #0B1120 55%), #0B1120`
  };
}

private assombrirCouleur(hex: string, pourcentage: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * pourcentage));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * pourcentage));
  const b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * pourcentage));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
  getEmbedUrl(url: string): SafeResourceUrl {
    const videoId = url.includes('watch?v=')
      ? url.split('watch?v=')[1].split('&')[0]
      : url.split('/').pop();
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  estLike(coursId: number): boolean {
    return localStorage.getItem(this.LIKES_KEY + coursId) === '1';
  }

  estDislike(coursId: number): boolean {
    return localStorage.getItem(this.DISLIKES_KEY + coursId) === '1';
  }

  compteurLikes(coursId: number): number {
    const base = Number(localStorage.getItem('base_likes_' + coursId) || 0);
    return base + (this.estLike(coursId) ? 1 : 0);
  }

  toggleLike(coursId: number): void {
    const actif = this.estLike(coursId);
    localStorage.setItem(this.LIKES_KEY + coursId, actif ? '0' : '1');
    if (!actif) localStorage.setItem(this.DISLIKES_KEY + coursId, '0');
  }

  toggleDislike(coursId: number): void {
    const actif = this.estDislike(coursId);
    localStorage.setItem(this.DISLIKES_KEY + coursId, actif ? '0' : '1');
    if (!actif) localStorage.setItem(this.LIKES_KEY + coursId, '0');
  }
progressionPourcentage(): number {
  if (!this.coursListe.length) return 0;
  const aimes = this.coursListe.filter(c => this.estLike(c.id)).length;
  return Math.round((aimes / this.coursListe.length) * 100);
}

progressionLabel(): string {
  const aimes = this.coursListe.filter(c => this.estLike(c.id)).length;
  return `${aimes} / ${this.coursListe.length} module${this.coursListe.length > 1 ? 's' : ''} apprécié${aimes > 1 ? 's' : ''}`;
}
  partager(cours: any): void {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: cours.titre, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papiers !');
    }
  }
}