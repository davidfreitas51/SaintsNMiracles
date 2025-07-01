import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SaintsService } from '../../services/saints.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Saint } from '../../interfaces/saint';
import { environment } from '../../../environments/environment';
import { RomanPipe } from '../../pipes/roman.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SaintFilters } from '../../interfaces/saint-filter';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { CommonModule } from '@angular/common';
countries.registerLocale(enLocale);

@Component({
  selector: 'app-saints-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    RouterLink,
    RomanPipe,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './saints-page.component.html',
  styleUrl: './saints-page.component.scss',
})
export class SaintsPageComponent implements OnInit {
  private router = inject(Router);
  private saintsService = inject(SaintsService);

  countries: string[] = [];
  centuries: number[] = Array.from({ length: 21 }, (_, i) => i + 1); 
  public saints: Saint[] | null = null;
  imageBaseUrl = environment.assetsUrl;

  saintFilters: SaintFilters = new SaintFilters();

  ngOnInit() {
    this.updateData();
    this.saintsService.getCountries().subscribe({
      next: (countries) => (this.countries = countries),
      error: (err) => console.error(err),
    });
  }

  redirectToSaintDetails(slug: string) {
    this.router.navigate(['/saints', slug]);
  }

  private updateData() {
    console.log('filters:', this.saintFilters);
    this.saintsService.getSaints(this.saintFilters).subscribe({
      next: (saints) => (this.saints = saints),
      error: (err) => console.error(err),
    });
  }

  handleFilterChange(
    key: keyof typeof this.saintFilters,
    event: MatSelectChange
  ) {
    this.saintFilters[key] = event.value;
    console.log(this.saintFilters);
    this.updateData();
  }

  handleSearch(query: string) {
    this.saintFilters.search = query
    this.updateData();
  }

  clearFilters() {
    this.saintFilters = new SaintFilters()
    this.updateData()
  }

  getFlagCode(country: string): string | null {
    return countries.getAlpha2Code(country, 'en')?.toLowerCase() ?? null;
  }
}
