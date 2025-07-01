import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SaintsService } from '../../services/saints.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDividerModule } from '@angular/material/divider';
import { RomanPipe } from '../../pipes/roman.pipe';
import countries from 'i18n-iso-countries';
import { marked } from 'marked';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { CommonModule } from '@angular/common';
import { CountryCodePipe } from '../../pipes/country-code.pipe';
countries.registerLocale(enLocale);

@Component({
  selector: 'app-saint-details-page',
  templateUrl: './saint-details-page.component.html',
  imports: [
    FooterComponent,
    HeaderComponent,
    MatDividerModule,
    RomanPipe,
    CommonModule,
    CountryCodePipe,
  ],
})
export class SaintDetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private saintsService = inject(SaintsService);
  private sanitizer = inject(DomSanitizer);
  imageBaseUrl = environment.assetsUrl;
  public saint: any = null;
  markdownContent!: SafeHtml;
  headings: { id: string; text: string }[] = [];

  ngOnInit(): void {
    const slug =
      this.route.snapshot.url
        .map((s) => s.path)
        .join('/')
        .split('/')
        .pop() || '';
    this.saintsService.getSaintWithMarkdown(slug).subscribe({
      next: async (data) => {
        this.saint = data.saint;
        this.headings = [];

        const renderer = new marked.Renderer();

        renderer.heading = ({ depth, text }) => {
          if (depth === 2) {
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            this.headings.push({ id, text });
            return `<h2 id="${id}" class="scroll-mt-32 text-xl font-semibold mt-8 mb-2">${text}</h2>`;
          }
          return `<h${depth}>${text}</h${depth}>`;
        };
        

        const rawHtml = await marked.parse(data.markdown, { renderer });
        this.markdownContent = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
      },
      error: (err) => {
        console.error('Error loading saint: ', err);
      },
    });
  }

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
