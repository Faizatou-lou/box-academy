import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormationService } from '../../core/services/formation';
import { CategorieService } from '../../core/services/categorie';
import { Categorie } from '../../core/models/categorie.model';
import { CategoryIcon } from '../../shared/category-icon/category-icon';
import { AvisService, AvisData } from '../../core/services/avis';
import { FormsModule } from '@angular/forms';


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
  imports: [RouterLink, CommonModule, CategoryIcon,FormsModule],
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

  // Stats
  statFormations = 0;
  statApprenants = 0;
  statExperience = 0;
  statSatisfaction = 0;

  erreursLogo = new Set<number>();
avisListe: AvisData[] = [];
showFormulaireAvis = false;
avisEnvoiEnCours = false;
avisErreur = '';
avisSucces = false;

avisFormData = {
  nom: '',
  email: '',
  note: 5,
  commentaire: ''
};
  // ===== ONGLET / BULLE À PROPOS =====
  tabTop = 140;
  bubbleVisible = false;
  isPopping = false;
  showAboutModal = false;
  particles: { id: number; x: number; y: number; delay: number }[] = [];
  private readonly TAB_TOP_MARGIN = 140;
  private readonly TAB_BOTTOM_MARGIN = 180;
  private scrollTicking = false;

  // Sur mobile, la navbar + le titre du hero occupent plus de hauteur relative :
  // on pousse le point de départ de l'onglet plus bas pour ne pas les chevaucher.
  private get tabTopMargin(): number {
    return window.innerWidth <= 768 ? 230 : this.TAB_TOP_MARGIN;
  }

 constructor(
  private formationService: FormationService,
  private categorieService: CategorieService,
  private avisService: AvisService,
  private cdr: ChangeDetectorRef,
  private ngZone: NgZone
) {}

  ngOnInit(): void {

    this.avisService.getPublies().subscribe({
  next: (data) => {
    this.avisListe = data;
    this.cdr.detectChanges();
  },
  error: (err) => console.error('Erreur avis :', err)
});
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('CATEGORIES REÇUES:', data);
        this.cdr.detectChanges();
        setTimeout(() => {
          const elements = document.querySelectorAll('.cat-card');
          console.log('ELEMENTS .cat-card TROUVÉS:', elements.length);
          this.observeElements('.cat-card', 80);
        }, 100);
      },
      error: (error) => console.error('Erreur lors du chargement des categories :', error)
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
    this.updateTabPosition();
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
    // Déclenche le compteur animé dès que la carte "+50 formations" entre dans le viewport
    // (remplace l'ancienne bande de stats du hero, supprimée).
    const section = document.querySelector('.formations-highlight');
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

  // ===== ONGLET / BULLE À PROPOS =====
  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      this.updateTabPosition();
      this.scrollTicking = false;
    });
  }

  private updateTabPosition(): void {
    const margin = this.tabTopMargin;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    const trackHeight = window.innerHeight - margin - this.TAB_BOTTOM_MARGIN;
    this.tabTop = margin + progress * trackHeight;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateTabPosition();
  }

  onTabClick(): void {
    this.bubbleVisible = true;
  }

  onBubbleClick(): void {
    if (this.isPopping) return;
    this.isPopping = true;
    this.particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 250,
      y: (Math.random() - 0.5) * 250,
      delay: Math.random() * 0.1
    }));
    setTimeout(() => {
      this.showAboutModal = true;
      this.cdr.detectChanges();
    }, 420);
  }

  closeAboutModal(): void {
    this.showAboutModal = false;
    this.isPopping = false;
    this.bubbleVisible = false;
    this.particles = [];
    this.cdr.detectChanges();
  }
ouvrirFormulaireAvis(): void {
  this.showFormulaireAvis = true;
  this.avisSucces = false;
  this.avisErreur = '';
  this.avisFormData = { nom: '', email: '', note: 5, commentaire: '' };
}

fermerFormulaireAvis(): void {
  this.showFormulaireAvis = false;
}

choisirNote(note: number): void {
  this.avisFormData.note = note;
}
envoyerAvis(): void {
  this.avisEnvoiEnCours = true;

  this.avisService.creer(this.avisFormData).subscribe({
    next: () => {
      this.avisEnvoiEnCours = false;
      this.avisSucces = true;
      this.avisFormData = { nom: '', email: '', note: 5, commentaire: '' };
    },
    error: (err) => {
      this.avisEnvoiEnCours = false;
      this.avisErreur = err.error?.message || 'Une erreur est survenue.';
    }
  });
}


}