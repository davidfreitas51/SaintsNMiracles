import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { SaintsPageComponent } from './pages/saints-page/saints-page.component';
import { MiraclesPageComponent } from './pages/miracles-page/miracles-page.component';
import { SaintDetailsPageComponent } from './pages/saint-details-page/saint-details-page.component';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ContentManagerPageComponent } from './pages/content-manager-page/content-manager-page.component';
import { SaintFormPageComponent } from './pages/saint-form-page/saint-form-page.component';
import { MiracleDetailsPageComponent } from './pages/miracle-details-page/miracle-details-page.component';
import { ContentFormWrapperComponent } from './components/content-form-wrapper/content-form-wrapper.component';

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
    component: MiracleDetailsPageComponent
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
        path: ':object',
        children: [
          {
            path: '',
            component: ContentManagerPageComponent,
          },
          {
            path: 'create',
            component: ContentFormWrapperComponent,
          },
          {
            path: ':id/edit',
            component: ContentFormWrapperComponent,
          },
        ],
      },
    ],
  },
];
  