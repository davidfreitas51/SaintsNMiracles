import { Component } from '@angular/core';
import { AdminMenuComponent } from "../../components/admin-menu/admin-menu.component";
import { AdminHeaderComponent } from "../../components/admin-header/admin-header.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  imports: [
    AdminMenuComponent,
    AdminHeaderComponent,
    MatButtonModule,
    MatIconModule,
    RouterOutlet
  ],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})

export class AdminPageComponent {
  public object = '';

  constructor(private router: Router) {
    this.setObjectFromUrl(this.router.url); 

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setObjectFromUrl(event.urlAfterRedirects);
      });
  }

  private setObjectFromUrl(url: string) {
    const segments = url.split('/');
    const last = segments[segments.length - 1];
    this.object = last.endsWith('s') ? last.slice(0, -1) : last;
  }
}