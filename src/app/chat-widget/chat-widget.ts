import { Component, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer,SafeHtml } from '@angular/platform-browser';

interface MessageChat {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.scss'
})
export class ChatWidgetComponent implements AfterViewChecked {
  @ViewChild('zoneMessages') zoneMessages!: ElementRef;

  panneauOuvert = signal(false);
  aNouveaute = signal(true);
  enChargement = signal(false);
  texteSaisi = '';
 limiteMessages = 15;
  nombreMessagesEnvoyes = signal(0);



  messages = signal<MessageChat[]>([
    { role: 'assistant', content: "Bonjour 👋 Je suis l'assistant Box Academy. Pose-moi n'importe quelle question sur nos formations !" }
  ]);

  private readonly urlApi = 'http://localhost:8080/api/chatbot';

  constructor(private http: HttpClient,private sanitizer:DomSanitizer) {}

  ngAfterViewChecked(): void {
    this.faireDefilerVersLeBas();
  }

  togglePanneau(): void {
    this.panneauOuvert.update(v => !v);
    if (this.panneauOuvert()) {
      this.aNouveaute.set(false);
    }
  }

  fermer(): void {
    this.panneauOuvert.set(false);
  }

formaterTexte(texte: string): SafeHtml {
  const avecLiens = texte.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="lien-chat">$1</a>'
  );
  return this.sanitizer.bypassSecurityTrustHtml(avecLiens);
}
  envoyerMessage(): void {
    const texte = this.texteSaisi.trim();
    if (!texte || this.enChargement()) return;

 if (this.nombreMessagesEnvoyes() >= this.limiteMessages) {
      this.messages.update(msgs => [...msgs, {
        role: 'assistant',
        content: "Tu as atteint la limite de questions pour cette conversation. N'hésite pas à [nous contacter](/contact) pour aller plus loin !"
      }]);
      return;
    }


    // Ajoute le message de l'utilisateur à l'affichage
    this.messages.update(msgs => [...msgs, { role: 'user', content: texte }]);
    this.texteSaisi = '';
    this.enChargement.set(true);
    this.nombreMessagesEnvoyes.update(n => n + 1);

    // Envoie tout l'historique au backend
    this.http.post<{ reponse: string }>(this.urlApi, {
      historique: this.messages()
    }).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, { role: 'assistant', content: res.reponse }]);
        this.enChargement.set(false);
      },
      error: () => {
        this.messages.update(msgs => [...msgs, {
          role: 'assistant',
          content: "Désolé, une erreur est survenue. Réessaie dans quelques instants."
        }]);
        this.enChargement.set(false);
      }
    });
  }

  gererEntree(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyerMessage();
    }
  }

  private faireDefilerVersLeBas(): void {
    try {
      this.zoneMessages.nativeElement.scrollTop = this.zoneMessages.nativeElement.scrollHeight;
    } catch {}
  }
}