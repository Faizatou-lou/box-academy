import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormationService } from '../../core/services/formation';
import { CategorieService } from '../../core/services/categorie';
import { Categorie } from '../../core/models/categorie.model';
import { CategoryIcon } from '../../shared/category-icon/category-icon';

interface HeroSlide {
  titre: string;
  sousTitre: string;
  image: string;
}


interface ColonneFormations {
  titre: string;
  items: any[];
}

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, CommonModule, CategoryIcon],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class AccueilComponent implements OnInit, OnDestroy, AfterViewInit {

  formations: any[] = [];
  formationsAVenir: any[] = [];
  formationsColonnes: ColonneFormations[] = [];
  carouselIndex = 0;
  private autoScrollInterval: any;

  // ===== HERO CAROUSEL =====
  heroIndex = 0;
  private heroAutoInterval: any;
  heroSlides: HeroSlide[] = [
    {
      titre: 'Formez-vous avec les meilleurs experts',
      sousTitre: "Box Academy vous accompagne vers l'excellence grâce à des formations innovantes, certifiantes et adaptées au marché professionnel.",
      image: 'assets/hero/hero1.jpg'
    },
    {
      titre: 'Des formations certifiantes reconnues',
      sousTitre: "Développez des compétences concrètes, validées par des certifications appréciées des recruteurs.",
      image: 'assets/hero/hero2.jpg'
    },
    {
      titre: 'Rejoignez une communauté de professionnels',
      sousTitre: "Apprenez aux côtés de centaines d'apprenants et bâtissez votre réseau professionnel.",
      image: 'assets/hero/hero3.jpg'
    }
  ];

  // ===== CATEGORIES (chargées via CategorieService, comme dans Formations) =====
  categories: Categorie[] = [];

  // ===== PARTENAIRES (vrais partenaires Box Academy, répartis en 2 rangées pour le défilement) =====
 partenairesTous = [
  { nom: 'CAMEG', fichier: 'cameg.png' },
  { nom: 'ONEA', fichier: 'onea.png' },
  { nom: 'SONABEL', fichier: 'sonabel.png' },
  { nom: 'SOFITEX', fichier: 'sofitex.png' },
  { nom: 'CRRAE-UMOA', fichier: 'crrae.png' },
  { nom: 'PETROCI', fichier: 'petroci.png' },
  { nom: 'OMA', fichier: 'oma.png' },
  { nom: 'SOCIETE GENERALE', fichier: 'societe-generale.png' },
  { nom: 'BDM SA', fichier: 'bdm-sa.png' },
  { nom: 'BDU-CI', fichier: 'bdu-ci.png' },
  { nom: 'BDU-BF', fichier: 'bdu-bf.png' },
  { nom: 'BRIDGE BANK GROUP', fichier: 'bridge-bank.png' },
  { nom: 'NSIA', fichier: 'nsia.png' },
  { nom: 'ECOBANK', fichier: 'ecobank.png' },
  { nom: 'BPBF', fichier: 'bpbf.png' },
  { nom: 'AFTRANS', fichier: 'aftrans.png' },
  { nom: 'BMS-CI', fichier: 'bms-ci.png' },
  { nom: 'FINACOM', fichier: 'finacom.png' },
  { nom: 'GLOBUS-RE', fichier: 'globus.png' },
  { nom: 'SUNU', fichier: 'sunu.png' },
  { nom: 'SANLAM', fichier: 'salam.png' },
  { nom: 'CORIS INVEST GROUP', fichier: 'coris-invest.png' },
  { nom: 'CORIS HOLDING', fichier: 'coris-holding.png' },
  { nom: 'ACEP', fichier: 'acep.png' },
  { nom: 'BHN', fichier: 'bn.png' },
  { nom: 'BNI', fichier: 'bni.png' },
  { nom: 'IB BANK', fichier: 'ibbank.png' },
  { nom: 'BADF', fichier: 'badf.png' },
  { nom: 'CAIDP', fichier: 'caidp.png' },
  { nom: 'NOUVELLE FSPCI', fichier: 'psp-ci.png' },
  { nom: 'CIMAF', fichier: 'cimaf.png' },
  { nom: 'ANEC', fichier: 'anec.png' },
  { nom: 'FIDRA', fichier: 'fidra.png' },
  { nom: 'SNEDAI', fichier: 'snedai.png' },
  { nom: 'ENVOL TECHNOLOGIES', fichier: 'envol.png' },
  { nom: 'SODIBO', fichier: 'sodibo.png' },
  { nom: 'ORANGE', fichier: 'orange.png' },
  { nom: 'MOOV AFRICA', fichier: 'moov.png' }
];

afficherTousPartenaires = false;
private readonly NB_PARTENAIRES_APERCU = 11;

get partenairesLigne1() {
  const milieu = Math.ceil(this.partenairesTous.length / 2);
  return this.partenairesTous.slice(0, milieu);
}

get partenairesLigne2() {
  const milieu = Math.ceil(this.partenairesTous.length / 2);
  return this.partenairesTous.slice(milieu);
}

get partenairesAffiches() {
  return this.afficherTousPartenaires
    ? this.partenairesTous
    : this.partenairesTous.slice(0, this.NB_PARTENAIRES_APERCU);
}

get nbPartenairesRestants(): number {
  return this.partenairesTous.length - this.NB_PARTENAIRES_APERCU;
}

toggleTousPartenaires(): void {
  this.afficherTousPartenaires = !this.afficherTousPartenaires;
}
  // Stats
  statFormations = 0;
  statApprenants = 0;
  statExperience = 0;
  statSatisfaction = 0;

  erreursLogo = new Set<number>();

  constructor(
    private formationService: FormationService,
    private categorieService: CategorieService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Erreur lors du chargement des catégories :', error)
    });

    this.formationService.getFormations().subscribe(data => {
      this.formations = data;
      this.formationsAVenir = data.filter(f => f.statut === 'a-venir');
      const disponibles = data.filter(f => f.statut !== 'a-venir').slice(0, 9);
      this.formationsColonnes = this.repartirEnColonnes(disponibles);
      this.cdr.detectChanges();
      this.demarrerDefilementAuto();
    });

    this.demarrerHeroAuto();
  }

  ngOnDestroy(): void {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
    if (this.heroAutoInterval) clearInterval(this.heroAutoInterval);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.observeElements('.fmc', 100);
      this.observeElements('.why-card', 120);
      this.observeElements('.cat-card', 80);
      this.observerStats();
    }, 1000);
  }

  // ===== COMPTAGE DES FORMATIONS PAR CATEGORIE =====
  nombreFormationsCategorie(categorieId: number): number {
    return this.formations.filter(f => f.categorie?.id === categorieId).length;
  }

  private repartirEnColonnes(formations: any[]): ColonneFormations[] {
    const titres = ['Les plus demandées', 'Nouveautés', 'Les plus certifiantes'];
    const colonnes: ColonneFormations[] = titres.map(titre => ({ titre, items: [] }));
    formations.forEach((formation, index) => {
      colonnes[index % 3].items.push(formation);
    });
    return colonnes.filter(c => c.items.length > 0);
  }

  // ===== HERO CAROUSEL =====
  heroGoTo(index: number): void {
    const total = this.heroSlides.length;
    this.heroIndex = (index + total) % total;
    this.cdr.detectChanges();
  }

  heroNext(): void {
    this.heroGoTo(this.heroIndex + 1);
  }

  heroPrev(): void {
    this.heroGoTo(this.heroIndex - 1);
  }

  private demarrerHeroAuto(): void {
    if (this.heroSlides.length <= 1) return;
    this.ngZone.runOutsideAngular(() => {
      this.heroAutoInterval = setInterval(() => {
        this.ngZone.run(() => this.heroNext());
      }, 6000);
    });
  }

  // ===== COMPTEURS STATS =====
  private statsFinals: { [key: string]: number } = {
    statFormations: 50,
    statApprenants: 500,
    statExperience: 10,
    statSatisfaction: 95
  };

  incrementerStat(property: string, target: number): void {
    if ((this as any)[property] === target) return;
    (this as any)[property] = 0;
    this.cdr.detectChanges();

    const steps = 60;
    const duration = 1500;
    const increment = target / steps;
    let current = 0;

    this.ngZone.runOutsideAngular(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          this.ngZone.run(() => {
            (this as any)[property] = target;
            this.cdr.detectChanges();
          });
          clearInterval(interval);
        } else {
          this.ngZone.run(() => {
            (this as any)[property] = Math.floor(current);
            this.cdr.detectChanges();
          });
        }
      }, duration / steps);
    });
  }

  private observerStats(): void {
    const section = document.querySelector('#stats-section');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.incrementerStat('statFormations', 50);
          this.incrementerStat('statApprenants', 500);
          this.incrementerStat('statExperience', 10);
          this.incrementerStat('statSatisfaction', 95);
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(section);
  }

  // ===== SCROLL ANIMATIONS =====
  private observeElements(selector: string, delay: number): void {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  // ===== CARROUSEL ANNONCES =====
  allerVersAnnonce(index: number): void {
    const total = this.formationsAVenir.length;
    this.carouselIndex = (index + total) % total;
    this.cdr.detectChanges();
  }

  annonceSuivante(): void {
    this.allerVersAnnonce(this.carouselIndex + 1);
  }

  annoncePrecedente(): void {
    this.allerVersAnnonce(this.carouselIndex - 1);
  }

  private demarrerDefilementAuto(): void {
    if (this.formationsAVenir.length <= 1) return;
    this.ngZone.runOutsideAngular(() => {
      this.autoScrollInterval = setInterval(() => {
        this.ngZone.run(() => this.annonceSuivante());
      }, 3500);
    });
  }

  pauseDefilement(): void {
    if (this.autoScrollInterval) clearInterval(this.autoScrollInterval);
  }

  reprendreDefilement(): void {
    this.demarrerDefilementAuto();
  }

  joursAvantDebut(dateDebut: string): number | null {
    if (!dateDebut) return null;
    const parties = dateDebut.split('/');
    if (parties.length !== 3) return null;
    const dateFormation = new Date(+parties[2], +parties[1] - 1, +parties[0]);
    const maintenant = new Date();
    const diffMs = dateFormation.getTime() - maintenant.getTime();
    const jours = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return jours > 0 ? jours : null;
  }

  onLogoError(formationId: number) {
    this.erreursLogo.add(formationId);
    this.cdr.detectChanges();
  }

  getInitiales(titre: string): string {
    if (!titre) return '?';
    const mots = titre.trim().split(/\s+/).filter(m => m.length > 0);
    if (mots.length === 0) return '?';
    if (mots.length === 1) return mots[0].substring(0, 2).toUpperCase();
    return (mots[0][0] + mots[1][0]).toUpperCase();
  }
}