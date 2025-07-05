import { Routes } from '@angular/router';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MiracleDetailsPageComponent } from './pages/miracle-details-page/miracle-details-page.component';
import { MiraclesPageComponent } from './pages/miracles-page/miracles-page.component';
import { SaintDetailsPageComponent } from './pages/saint-details-page/saint-details-page.component';
import { SaintsPageComponent } from './pages/saints-page/saints-page.component';
import { SaintFormPageComponent } from './pages/saint-form-page/saint-form-page.component';
import { MiracleFormPageComponent } from './pages/miracle-form-page/miracle-form-page.component';
import { ManageMiraclesPageComponent } from './pages/manage-miracles-page/manage-miracles-page.component';
import { ManageSaintsPageComponent } from './pages/manage-saints-page/manage-saints-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'about',
    component: AboutUsPageComponent,
  },
  {
    path: 'saints',
    component: SaintsPageComponent,
  },
  {
    path: 'saints/:slug',
    component: SaintDetailsPageComponent,
  },
  {
    path: 'miracles',
    component: MiraclesPageComponent,
  },
  {
    path: 'miracles/:slug',
    component: MiracleDetailsPageComponent,
  },
  {
    path: 'admin',
    component: AdminPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardPageComponent,
      },
      {
        path: 'saints',
        children: [
          { path: '', component: ManageSaintsPageComponent },
          { path: 'create', component: SaintFormPageComponent },
          { path: ':id/edit', component: SaintFormPageComponent },
        ],
      },
      {
        path: 'miracles',
        children: [
          { path: '', component: ManageMiraclesPageComponent },
          { path: 'create', component: MiracleFormPageComponent },
          { path: ':id/edit', component: MiracleFormPageComponent },
        ],
      },
      {
        path: 'users',
        children: [
        ],
      },
    ],
  },
];
