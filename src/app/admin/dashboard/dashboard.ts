import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormationService } from '../../core/services/formation';
import { InscriptionService } from '../../core/services/inscription';
import { AuthService } from '../../core/services/auth';
import { Chart, registerables } from 'chart.js';
import { AlerteService, AlerteData } from '../../core/services/alerte';


Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, AfterViewInit {

  @ViewChild('sparkline') sparklineRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartAnnees') chartAnneesRef!: ElementRef<HTMLCanvasElement>;

  formations: any[] = [];
  inscriptions: any[] = [];
  dernieresInscriptions: any[] = [];
  dernieresFormations:any[]= [];
  alertes: AlerteData[] = [];

  dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  totalAnime = 0;
  selectedPill: string | null = null;
  donutCenterValue = 0;
  donutCenterLabel = 'total';

  private donneesChargees = 0;
  private sparklineChart?: Chart;
  private donutChart?: Chart;

  constructor(
    private router: Router,
    private formationService: FormationService,
    private inscriptionService: InscriptionService,
    private authService: AuthService,
    private alerteService: AlerteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.alerteService.getAlertes().subscribe({
      next: (data) => {
      this.alertes = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error("Erreur alertes :", err)
    });

    this.formationService.getFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.dernieresFormations = data.slice(0, 5);
        this.donneesChargees++;
        this.cdr.detectChanges();
        this.tryInit();
      },
      error: (err) => console.error("Erreur formations :", err)
    });

    this.inscriptionService.getInscriptions().subscribe({
      next: (data) => {
        this.inscriptions = data;
        this.dernieresInscriptions = data.slice(0, 5);
        this.donneesChargees++;
        this.cdr.detectChanges();
        this.tryInit();
      },
      error: (err) => console.error("Erreur inscriptions :", err)
    });
  }

  ngAfterViewInit(): void {
    this.tryInit();
  }

  private tryInit() {
    if (this.donneesChargees < 2) return;
    if (!this.sparklineRef || !this.chartAnneesRef) return;
    this.animerTotal();
    this.renderSparkline();
    this.renderDonut();
  }

  // ---------- Stats de base ----------

  compterStatut(statut: string): number {

    return this.inscriptions.filter(i => i.statut === statut).length;
  }

  compterInscritsParFormation(formationId: number): number {
  return this.inscriptions.filter(i => i.formation?.id === formationId).length;
}

  get totalInscriptions(): number {
    return this.inscriptions.length;
  }

  get statPills() {
    return [
      { key: 'formations', icone: '📚', count: this.formations.length, label: `${this.formations.length} formations actives` },
      { key: 'valide', icone: '✅', count: this.compterStatut('validée'), label: `${this.compterStatut('validée')} inscriptions validées` },
      { key: 'attente', icone: '📝', count: this.compterStatut('en-attente'), label: `${this.compterStatut('en-attente')} inscriptions en attente` },
      { key: 'rejete', icone: '❌', count: this.compterStatut('rejetée'), label: `${this.compterStatut('rejetée')} inscriptions rejetées` }
    ];
  }

  get totalAffiche(): number {
    if (this.selectedPill) {
      return this.statPills.find(p => p.key === this.selectedPill)?.count ?? this.totalInscriptions;
    }
    return this.totalAnime;
  }

  get hintAffiche(): string {
    if (this.selectedPill) {
      return this.statPills.find(p => p.key === this.selectedPill)?.label ?? '';
    }
    return this.pourcentageTexte;
  }

  selectPill(key: string) {
    this.selectedPill = this.selectedPill === key ? null : key;
  }

  // ---------- Évolution mensuelle ----------

  private parseDate(dateStr: string): { mois: number; annee: number } | null {
    if (!dateStr) return null;
    const parties = dateStr.split('/');
    if (parties.length !== 3) return null;
    const mois = parseInt(parties[1], 10) - 1;
    const annee = parseInt(parties[2], 10);
    if (isNaN(mois) || isNaN(annee)) return null;
    return { mois, annee };
  }

  private derniersMois(nb: number) {
    const maintenant = new Date();
    const noms = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
    const result = [];
    for (let i = nb - 1; i >= 0; i--) {
      const d = new Date(maintenant.getFullYear(), maintenant.getMonth() - i, 1);
      result.push({ mois: d.getMonth(), annee: d.getFullYear(), label: noms[d.getMonth()] });
    }
    return result;
  }

  get tendanceMensuelle() {
    const mois6 = this.derniersMois(6);
    return mois6.map(m => ({
      label: m.label,
      total: this.inscriptions.filter(i => {
        const d = this.parseDate(i.date);
        return d && d.mois === m.mois && d.annee === m.annee;
      }).length
    }));
  }

  get pourcentageVsMoisDernier(): number | null {
    const donnees = this.tendanceMensuelle;
    if (donnees.length < 2) return null;
    const moisActuel = donnees[donnees.length - 1].total;
    const moisPrecedent = donnees[donnees.length - 2].total;
    if (moisPrecedent === 0) return moisActuel > 0 ? 100 : 0;
    return Math.round(((moisActuel - moisPrecedent) / moisPrecedent) * 100);
  }

  get pourcentageTexte(): string {
    const pct = this.pourcentageVsMoisDernier;
    if (pct === null) return 'vs mois dernier';
    return `${pct >= 0 ? '+' : ''}${pct}% vs mois dernier`;
  }

  // ---------- Classement des formations ----------

  get classementFormations() {
    const stats = this.formations
      .map(f => ({
        titre: f.titre,
        total: this.inscriptions.filter(i => i.formation?.id === f.id).length
      }))
      .sort((a, b) => b.total - a.total);

    const max = stats[0]?.total || 1;
    return stats.map((s, i) => ({
      ...s,
      rang: i + 1,
      pct: Math.round((s.total / max) * 100),
      hot: i === 0 && s.total > 0
    }));
  }

  // ---------- Récapitulatif par année ----------

  get recapAnnees() {
    const compteur: { [annee: string]: number } = {};
    this.inscriptions.forEach(i => {
      const d = this.parseDate(i.date);
      if (d) compteur[d.annee] = (compteur[d.annee] || 0) + 1;
    });

    const total = this.inscriptions.length || 1;
    const couleurs = ['#1a3a6b', '#3b6fd6', '#7ba3e8', '#a9c4f0', '#d6e3fa'];

    return Object.entries(compteur)
      .map(([annee, total_annee], i) => ({
        annee,
        total: total_annee,
        pct: Math.round((total_annee / total) * 100),
        couleur: couleurs[i % couleurs.length]
      }))
      .sort((a, b) => a.annee.localeCompare(b.annee));
  }

  selectYear(index: number) {
    const recap = this.recapAnnees;
    if (recap[index]) {
      this.donutCenterValue = recap[index].total;
      this.donutCenterLabel = recap[index].annee;
    }
  }

  // ---------- Animation du compteur total ----------

  private animerTotal() {
    const cible = this.totalInscriptions;
    this.donutCenterValue = cible;
    let n = 0;
    const step = () => {
      n++;
      this.totalAnime = n;
      this.cdr.detectChanges();
      if (n < cible) setTimeout(step, 30);
    };
    if (cible > 0) step(); else this.totalAnime = 0;
  }

  // ---------- Graphiques Chart.js ----------

  private renderSparkline() {
    const donnees = this.tendanceMensuelle;
    this.sparklineChart?.destroy();
    this.sparklineChart = new Chart(this.sparklineRef.nativeElement, {
      type: 'line',
      data: {
        labels: donnees.map(d => d.label),
        datasets: [{
          data: donnees.map(d => d.total),
          borderColor: '#4f8ef7',
          backgroundColor: (ctx: any) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 90);
            g.addColorStop(0, 'rgba(79,142,247,0.35)');
            g.addColorStop(1, 'rgba(79,142,247,0)');
            return g;
          },
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: { duration: 900, easing: 'easeOutQuart' }
      }
    });
  }

  private renderDonut() {
    const recap = this.recapAnnees;
    this.donutChart?.destroy();
    this.donutChart = new Chart(this.chartAnneesRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: recap.map(r => r.annee),
        datasets: [{
          data: recap.map(r => r.total),
          backgroundColor: recap.map(r => r.couleur),
          borderColor: '#fff',
          borderWidth: 3,
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { legend: { display: false } },
        animation: { animateRotate: true, duration: 900, easing: 'easeOutQuart' },
        onClick: (evt, elements) => {
          if (elements.length) this.selectYear(elements[0].index);
        }
      }
    });
  }
traiterAlerte(alerte: AlerteData): void {
  if (alerte.type === 'inscription') {
    this.router.navigate(['/admin/inscriptions']);
  } else if (alerte.type === 'formation') {
    this.router.navigate(['/admin/formations']);
  }
}

get alertesRouges() {
  return this.alertes.filter(a => a.urgence === 'rouge');
}

get alertesOranges() {
  return this.alertes.filter(a => a.urgence === 'orange');
}

}