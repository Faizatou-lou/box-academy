import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ScrollTop } from '../../../shared/scroll-top/scroll-top';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ScrollTop],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  constructor(private authService: AuthService) {}

  seDeconnecter() {
    this.authService.seDeconnecter();
  }
}