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
import { ConnexionMembre } from './pages/connexion-membre/connexion-membre';
import { CreerCompteMembre } from './pages/creer-compte-membre/creer-compte-membre';
import { MonEspaceMembre } from './pages/mon-espace-membre/mon-espace-membre';
import { OnboardingMembre } from './pages/onboarding-membre/onboarding-membre';
import { CertificationsManager } from './admin/certifications-manager/certifications-manager';
import { RecommandationsManager } from './admin/recommandations-manager/recommandations-manager';


export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'formations', component: Formations },
  { path: 'formation-detail/:id', component: FormationDetail },
  {path:'formation-detail/:id/cours', component: CoursFormations},
  { path: 'inscription', component: Inscription },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'otp-verify', component: OtpVerify },
  { path: 'connexion', component: ConnexionMembre },
{ path: 'creer-compte', component: CreerCompteMembre },
{ path: 'mon-espace', component: MonEspaceMembre },
{ path: 'onboarding', component: OnboardingMembre },

  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'formations', component: FormationsManager },
      { path: 'cours', component: CoursManager },
      { path: 'inscriptions', component: InscriptionsManager },
      { path: 'certifications', component: CertificationsManager },
      { path: 'profil', component: Profil },
      {path:'prospection',component: Prospection},
      { path: 'recommandations', component: RecommandationsManager },

    ]
  },

  { path: '**', redirectTo: '' }
];