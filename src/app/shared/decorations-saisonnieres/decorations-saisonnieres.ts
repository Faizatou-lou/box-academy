import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaisonService } from '../../core/services/saison';

@Component({
  selector: 'app-decorations-saisonnieres',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './decorations-saisonnieres.html',
  styleUrl: './decorations-saisonnieres.css'
})
export class DecorationsSaisonnieresComponent {

  private readonly saisonService = inject(SaisonService);

  readonly saisonId = computed(() => this.saisonService.saisonActive()?.id ?? null);

  // Positions/délais des flocons — générés une seule fois (pas à chaque détection
  // de changement) pour une distribution stable pendant toute la session.
  readonly flocons = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: Math.round((i / 14) * 100 + (this.pseudoAlea(i) * 6 - 3)),
    delai: (this.pseudoAlea(i + 100) * 6).toFixed(2),
    duree: (9 + this.pseudoAlea(i + 200) * 6).toFixed(2),
    taille: (10 + this.pseudoAlea(i + 300) * 10).toFixed(0)
  }));

  // Délais (s) des étoiles qui suivent le traîneau du Père Noël — un délai
  // positif fait démarrer chaque étoile en retard sur le traîneau, donc
  // toujours un peu derrière lui sur la même trajectoire (effet de traîne).
  readonly etoilesTraineau = [0.15, 0.3, 0.45, 0.6, 0.8];

  readonly oeufIds = [1, 2, 3, 4, 5, 6];

  // Identifiants des œufs actuellement "cassés" (animation d'éclatement en cours) —
  // un oeuf recliqué pendant qu'il est déjà cassé est ignoré (voir casserOeuf).
  readonly oeufsCasses = new Set<number>();

  // Directions de projection des morceaux de chocolat à l'éclatement d'un œuf
  // (8 directions fixes réparties en éventail — pas besoin d'aléatoire ici).
  readonly morceauxChocolat = [
    { tx: -34, ty: -28 }, { tx: 6, ty: -40 }, { tx: 36, ty: -22 },
    { tx: -40, ty: 4 }, { tx: 40, ty: 8 },
    { tx: -30, ty: 30 }, { tx: 4, ty: 38 }, { tx: 32, ty: 26 }
  ];

  casserOeuf(id: number): void {
    if (this.oeufsCasses.has(id)) return;
    this.oeufsCasses.add(id);
    // L'œuf réapparaît après un délai pour pouvoir être ré-ouvert (petit plaisir
    // répétable plutôt qu'un effet à usage unique par visite).
    setTimeout(() => this.oeufsCasses.delete(id), 3200);
  }

  readonly etoiles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    top: Math.round(this.pseudoAlea(i + 400) * 90 + 3),
    left: i % 2 === 0
      ? Math.round(this.pseudoAlea(i + 500) * 14 + 2)
      : Math.round(96 - this.pseudoAlea(i + 500) * 14),
    delai: (this.pseudoAlea(i + 600) * 3).toFixed(2)
  }));

  // Génère une valeur pseudo-aléatoire stable (0-1) à partir d'un indice, pour
  // éviter Math.random() dans le template (recalculé à chaque cycle de détection
  // de changement) tout en gardant un rendu non-uniforme.
  private pseudoAlea(indice: number): number {
    const x = Math.sin(indice * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }
}
