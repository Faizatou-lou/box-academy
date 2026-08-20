import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Loading } from './shared/loading/loading';
import { ChatWidgetComponent } from './chat-widget/chat-widget';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Loading,ChatWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('site-Box-Academy');
  currentUrl = '';
  isLoading = false;
  private urlPrecedente = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        const onQuitteAccueil = this.urlPrecedente === '/';
        const onVaVersFormations= event.url === '/formations';

      
        if (onQuitteAccueil&& onVaVersFormations) {
          console.log('✅ ÉCRAN DE CHARGEMENT ACTIVÉ');
          this.isLoading = true;
          this.cdr.detectChanges();
        }
      }

      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
        this.urlPrecedente = event.urlAfterRedirects;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (this.isLoading) {
          setTimeout(() => {
            this.isLoading = false;
            this.cdr.detectChanges();
          }, 1500);
        }
      }
    });
  }

  isAdminOrAuth(): boolean {
    return this.currentUrl.startsWith('/admin') ||
           this.currentUrl === '/login' ||
           this.currentUrl === '/otp-verify';
  }
}