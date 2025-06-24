import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaintsService } from '../../services/saints.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-saint-details-page',
  templateUrl: './saint-details-page.component.html',
  imports: [FooterComponent, HeaderComponent],
})
export class SaintDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private saintsService = inject(SaintsService);

  ngOnInit(): void {
    const fullPath = this.route.snapshot.url
      .map((segment) => segment.path)
      .join('/');
    const slug = fullPath.split('/').pop() || '';

    this.saintsService.getSaint(slug).subscribe({
      next: (saint) => {
        console.log('Saint:', saint);
      },
      error: (err) => {
        console.error('Erro ao buscar santo:', err);
      },
    });
  }
}
