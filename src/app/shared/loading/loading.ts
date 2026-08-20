import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, NgZone, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
  encapsulation: ViewEncapsulation.None
})
export class Loading implements OnChanges {
  @Input() isVisible = false;
  @ViewChild('confettiContainer') confettiContainer!: ElementRef;

  displayText = '';
  private fullText = 'BOX ACADEMY';
  private typeInterval: any;
  private confettiInterval: any;

  constructor(
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible']) {
      if (this.isVisible) {
        setTimeout(() => {
          this.startTypewriter();
          this.startConfetti();
        }, 50);
      } else {
        this.stopAnimations();
      }
    }
  }

  private startTypewriter(): void {
    let i = 0;
    this.displayText = '';
    this.cdr.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      this.typeInterval = setInterval(() => {
        if (i <= this.fullText.length) {
          this.ngZone.run(() => {
            this.displayText = this.fullText.substring(0, i);
            this.cdr.detectChanges();
          });
          i++;
        } else {
          setTimeout(() => {
            i = 0;
          }, 800);
        }
      }, 100);
    });
  }

  private startConfetti(): void {
    const colors = ['#29ABE2', '#0e7aad', '#111111', '#7fd4f5'];

    this.ngZone.runOutsideAngular(() => {
      this.confettiInterval = setInterval(() => {
        if (!this.confettiContainer) return;

        const piece = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 6 + 4;
        const left = Math.random() * 100;
        const duration = Math.random() * 2 + 2.5;
        const isCircle = Math.random() > 0.5;

        piece.className = 'box-confetti-piece';
        piece.style.position = 'absolute';
        piece.style.top = '-20px';
        piece.style.left = left + '%';
        piece.style.width = size + 'px';
        piece.style.height = size + 'px';
        piece.style.background = color;
        piece.style.borderRadius = isCircle ? '50%' : '2px';
        piece.style.animation = `boxConfettiFall ${duration}s linear forwards`;

        this.confettiContainer.nativeElement.appendChild(piece);

        setTimeout(() => piece.remove(), duration * 1000);
      }, 150);
    });
  }

  private stopAnimations(): void {
    if (this.typeInterval) clearInterval(this.typeInterval);
    if (this.confettiInterval) clearInterval(this.confettiInterval);
    if (this.confettiContainer) {
      this.confettiContainer.nativeElement.innerHTML = '';
    }
  }
}