import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Loading } from './shared/loading/loading';
import { ChatWidgetComponent } from './chat-widget/chat-widget';
import { ScrollTop } from './shared/scroll-top/scroll-top';
import { DecorationsSaisonnieresComponent } from './shared/decorations-saisonnieres/decorations-saisonnieres';
import { SaisonService } from './core/services/saison';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, Loading,ChatWidgetComponent,ScrollTop,DecorationsSaisonnieresComponent],
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
    private cdr: ChangeDetectorRef,
    // Injecté ici pour déclencher la détection de la saison dès le démarrage
    // de l'application (le service applique lui-même l'attribut data-saison).
    private saisonService: SaisonService
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
         this.currentUrl === '/otp-verify' ||
         this.currentUrl === '/connexion' ||
         this.currentUrl === '/creer-compte' ||
         this.currentUrl === '/onboarding' ||
         this.currentUrl === '/mon-espace';
}
}