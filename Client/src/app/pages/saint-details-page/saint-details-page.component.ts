import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaintsService } from '../../services/saints.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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
  public markdownContent: string | null = null;

  ngOnInit(): void {
    const slug =
      this.route.snapshot.url
        .map((s) => s.path)
        .join('/')
        .split('/')
        .pop() || '';

    this.saintsService.getSaintWithMarkdown(slug).subscribe({
      next: (data) => {
        this.saint = data.saint;
        this.markdownContent = data.markdown;
      },
      error: (err) => {
        console.error('Erro ao carregar santo:', err);
      },
    });
  }
}
