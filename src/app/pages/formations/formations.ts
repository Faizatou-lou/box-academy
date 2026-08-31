import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormationService } from '../../core/services/formation';
import { CategorieService } from '../../core/services/categorie';
import { Categorie } from '../../core/models/categorie.model';
import { CommonModule } from '@angular/common';
import { CategoryIcon } from '../../shared/category-icon/category-icon';


@Component({
  selector: 'app-formations',
  standalone: true,
  imports: [RouterLink, CommonModule, CategoryIcon],
  templateUrl: './formations.html',
  styleUrl: './formations.css'
})
export class Formations implements OnInit {

  formations: any[] = [];
  formationsFiltrees: any[] = [];
  categories: Categorie[] = [];

  filtreType = 'tous';
  recherche = '';
  erreursLogo = new Set<number>();

  // 'toutes' | 'non-classees' | number (id de catégorie)
  activeCategory: string | number = 'toutes';
  private categorieSlugActif: string | null = null;

  constructor(
    private formationService: FormationService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.appliquerCategorieActive();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories :', error);
      }
    });

    this.formationService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.formationsFiltrees = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des formations :', error);
      }
    });

    // Réagit à chaque changement de ?categorie=slug (ex: clic sur un lien du footer
    // alors qu'on est déjà sur /formations — Angular réutilise le même composant,
    // donc on ne peut pas se contenter d'un snapshot lu une seule fois)
    this.route.queryParams.subscribe(params => {
      this.categorieSlugActif = params['categorie'] ?? null;
      this.appliquerCategorieActive();
    });
  }

  private appliquerCategorieActive(): void {
    if (!this.categorieSlugActif) {
      this.activeCategory = 'toutes';
      this.cdr.detectChanges();
      return;
    }

    // les catégories peuvent ne pas encore être chargées : on retentera dès qu'elles le seront
    const cat = this.categories.find(c => c.slug === this.categorieSlugActif);
    if (cat) {
      this.activeCategory = cat.id;
      this.cdr.detectChanges();
    }
  }

  get nombreCertifiantes(): number {
    if (!this.formations.length) return 0;
    const nombre = this.formations.filter(f => f.certifiante).length;
    return Math.round((nombre / this.formations.length) * 100);
  }

  selectionnerCategorie(categorie: string | number): void {
    this.activeCategory = categorie;
  }

  // Remplace formationDansCategorie() : lien direct via l'objet categorie renvoyé par le backend
  getFormationsCategorie(categorieId: number): any[] {
    return this.formationsFiltrees.filter(
      formation => formation.categorie?.id === categorieId
    );
  }

  // Formations sans catégorie assignée en base (categorie_id = null)
  getFormationsNonClassees(): any[] {
    return this.formationsFiltrees.filter(
      formation => !formation.categorie
    );
  }

  filtrerType(event: Event): void {
    this.filtreType = (event.target as HTMLSelectElement).value;
    this.appliquerFiltres();
  }

  rechercher(event: Event): void {
    this.recherche = (event.target as HTMLInputElement).value.toLowerCase();
    this.appliquerFiltres();
  }

  appliquerFiltres(): void {
    this.formationsFiltrees = this.formations.filter(formation => {

      const matchType =
        this.filtreType === 'tous' ||
        (this.filtreType === 'certifiante' && formation.certifiante) ||
        (this.filtreType === 'non-certifiante' && !formation.certifiante);

      const titre = (formation.titre || '').toLowerCase();
      const description = (formation.descriptif || '').toLowerCase();

      const matchRecherche =
        titre.includes(this.recherche) ||
        description.includes(this.recherche);

      return matchType && matchRecherche;
    });

    this.cdr.detectChanges();
  }

  getInitiales(titre: string): string {
    if (!titre) return '?';
    const mots = titre.trim().split(' ');
    if (mots.length === 1) return mots[0].substring(0, 2).toUpperCase();
    return (mots[0][0] + mots[1][0]).toUpperCase();
  }

  onLogoError(formationId: number): void {
    this.erreursLogo.add(formationId);
    this.cdr.detectChanges();
  }
}