import { Component, HostListener, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  standalone: true,
  imports: [],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.css'
})
export class ScrollTop {

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