import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../core/services/contact';

@Component({
  selector: 'app-contact',
  standalone:true,
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
formData = {
    nom: '',
    prenom: '',
    email: '',
    sujet: '',
    message: ''
  };

  succes = false;
  erreur = '';
  chargement = false;

  constructor(private contactService: ContactService){}

  envoyer() {
    if (!this.formData.nom || !this.formData.prenom ||
        !this.formData.email || !this.formData.sujet ||
        !this.formData.message) {
      this.erreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.erreur = '';
    this.chargement = true;

 this.contactService.envoyerMessage(this.formData).subscribe({
      next: () => {
        this.chargement = false;
        this.succes = true;
      },

   error: (err) => {
        this.chargement = false;
        this.erreur = 'Une erreur est survenue. Réessayez plus tard.';
        console.error('Erreur envoi contact:', err);
      }
    });
  }
    




nouveauMessage() {
    this.formData = {
      nom: '',
      prenom: '',
      email: '',
      sujet: '',
      message: ''
    };
    this.succes = false;
    this.erreur = '';
  }
}


