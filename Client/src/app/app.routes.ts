import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AboutUsPageComponent } from './pages/about-us-page/about-us-page.component';
import { SaintsPageComponent } from './pages/saints-page/saints-page.component';
import { SignsPageComponent } from './pages/signs-page/signs-page.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    {
        path: 'admin',
        component: AdminPageComponent
    },
    {
        path: 'about',
        component:AboutUsPageComponent
    },
    {
        path: 'saints',
        component: SaintsPageComponent
    },
    {
        path: 'signs',
        component: SignsPageComponent
    }
];
