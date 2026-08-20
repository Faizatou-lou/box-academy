import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Prospect {
  id: number;
  email: string;
  coursConsulte: string;
  dateConsultation: string;
  contacte: boolean;
}

@Component({
  selector: 'app-prospection',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './prospection.html',
  styleUrl: './prospection.css'
})
export class Prospection implements OnInit {

  prospects: Prospect[] = [];
  chargement = true;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerProspects();
  }

  chargerProspects(): void {
    this.chargement = true;
    this.http.get<Prospect[]>('http://localhost:8080/api/prospects').subscribe({
      next: (data) => {
        this.prospects = data.sort((a, b) =>
          new Date(b.dateConsultation).getTime() - new Date(a.dateConsultation).getTime()
        );
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement prospects :', err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  marquerContacte(id: number): void {
    this.http.patch<Prospect>(`http://localhost:8080/api/prospects/${id}/contacte`, {}).subscribe({
      next: () => {
        const p = this.prospects.find(p => p.id === id);
        if (p) p.contacte = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur maj prospect :', err)
    });
  }

  get totalProspects(): number {
    return this.prospects.length;
  }

  get emailsUniques(): number {
    return new Set(this.prospects.map(p => p.email)).size;
  }

  get nonContactes(): number {
    return this.prospects.filter(p => !p.contacte).length;
  }
}