import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AdminContentTableComponent } from '../../components/admin-content-table/admin-content-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-content-manager-page',
  imports: [AdminContentTableComponent, MatIconModule, MatButtonModule],
  templateUrl: './content-manager-page.component.html',
  styleUrl: './content-manager-page.component.scss',
})
export class ContentManagerPageComponent {
  public object = '';

  constructor(private router: Router) {
    this.setObjectFromUrl(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
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
