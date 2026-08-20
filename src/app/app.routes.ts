import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil';
import { Formations } from './pages/formations/formations';
import { FormationDetail } from './pages/formation-detail/formation-detail';
import { Inscription } from './pages/inscription/inscription';
import { Login } from './auth/login/login';
import { OtpVerify } from './auth/otp-verify/otp-verify';
import { Dashboard } from './admin/dashboard/dashboard';
import { FormationsManager } from './admin/formations-manager/formations-manager';
import { InscriptionsManager } from './admin/inscriptions-manager/inscriptions-manager';
import { CoursManager } from './admin/cours-manager/cours-manager';
import { Profil } from './admin/profil/profil';
import { Contact } from './pages/contact/contact';
import { AdminLayout } from './admin/shared/admin-layout/admin-layout';
import { Prospection } from './admin/prospection/prospection';
import { CoursFormations } from './pages/cours-formations/cours-formations';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'formations', component: Formations },
  { path: 'formation-detail/:id', component: FormationDetail },
  {path:'formation-detail/:id/cours', component: CoursFormations},
  { path: 'inscription', component: Inscription },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'otp-verify', component: OtpVerify },
 

  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'formations', component: FormationsManager },
      { path: 'cours', component: CoursManager },
      { path: 'inscriptions', component: InscriptionsManager },
      { path: 'profil', component: Profil },
      {path:'prospection',component: Prospection}
    ]
  },

  { path: '**', redirectTo: '' }
];