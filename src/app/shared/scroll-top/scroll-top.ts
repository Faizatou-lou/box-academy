import { Component, HostListener, ChangeDetectorRef, Input } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.css'
})
export class ScrollTop {

  /** Sur les pages où le bas-gauche est déjà occupé (ex: sidebar admin), passer "right". */
  @Input() position: 'left' | 'right' = 'left';

  visible = false;

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.visible = window.scrollY > 400;
    this.cdr.detectChanges();
  }

  remonter(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}