import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaintsService } from '../../services/saints.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-saint-details-page',
  templateUrl: './saint-details-page.component.html',
  imports: [FooterComponent, HeaderComponent],
})
export class SaintDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private saintsService = inject(SaintsService);
  private sanitizer = inject(DomSanitizer);
  imageBaseUrl = environment.assetsUrl;
  public saint: any = null;
  markdownContent!: SafeHtml;

  ngOnInit(): void {
    const slug =
      this.route.snapshot.url
        .map((s) => s.path)
        .join('/')
        .split('/')
        .pop() || '';

    this.saintsService.getSaintWithMarkdown(slug).subscribe({
      next: (data) => {
        console.log('HTML gerado (puro):', data.markdown.toString()); // <-- esse é o que interessa
        this.saint = data.saint;
        this.markdownContent = this.sanitizer.bypassSecurityTrustHtml(
          data.markdown
        );
      },
      error: (err) => {
        console.error('Erro ao carregar santo:', err);
      },
    });
  }
}
