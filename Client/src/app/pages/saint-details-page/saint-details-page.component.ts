import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaintsService } from '../../services/saints.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-saint-details-page',
  templateUrl: './saint-details-page.component.html',
  imports: [FooterComponent, HeaderComponent],
})
export class SaintDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private saintsService = inject(SaintsService);

  imageBaseUrl = environment.assetsUrl;
  public saint: any = null;

  ngOnInit(): void {
    const slug =
      this.route.snapshot.url
        .map((s) => s.path)
        .join('/')
        .split('/')
        .pop() || '';

    this.saintsService.getSaint(slug).subscribe({
      next: (saint) => {
        this.saint = saint;
        console.log(saint);
      },
      error: (err) => {
        console.error('Erro ao carregar santo:', err);
      },
    });
  }
}