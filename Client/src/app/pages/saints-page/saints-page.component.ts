import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SaintsService } from '../../services/saints.service';
import { MatCardModule } from '@angular/material/card'
import { Router, RouterLink } from '@angular/router';
import { Saint } from '../../interfaces/saint';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-saints-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './saints-page.component.html',
  styleUrl: './saints-page.component.scss'
})
export class SaintsPageComponent implements OnInit {
  private router = inject(Router);
  private saintsService = inject(SaintsService);

  public saints: Saint[] | null = null;
  imageBaseUrl = environment.assetsUrl;

  ngOnInit() {
    this.saintsService.getSaints().subscribe({
      next: saints => this.saints = saints,
      error: err => console.error(err)
    });
  }

  redirectToSaintDetails(slug: string) {
    this.router.navigate(['/saints', slug]);
  }
}
