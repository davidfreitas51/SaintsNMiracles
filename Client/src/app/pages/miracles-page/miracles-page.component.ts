import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MiraclesService } from '../../services/miracles.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Miracle } from '../../interfaces/miracle';
import { environment } from '../../../environments/environment';
import { RomanPipe } from '../../pipes/roman.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MiracleFilters } from '../../interfaces/miracle-filter';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { CommonModule } from '@angular/common';
import { CountryCodePipe } from '../../pipes/country-code.pipe';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

countries.registerLocale(enLocale);

@Component({
  selector: 'app-miracles-page',
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
    CountryCodePipe,
    MatPaginator,
  ],
  templateUrl: './miracles-page.component.html',
  styleUrl: './miracles-page.component.scss',
})
export class MiraclesPageComponent implements OnInit {
  private router = inject(Router);
  private miraclesService = inject(MiraclesService);
  private route = inject(ActivatedRoute);

  countries: string[] = [];
  centuries: number[] = Array.from({ length: 21 }, (_, i) => i + 1);
  public miracles: Miracle[] | null = null;
  totalCount: number = 0;
  imageBaseUrl = environment.assetsUrl;

  miracleFilters: MiracleFilters = new MiracleFilters();

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const country = params['country'];
      const century = params['century'];
      const search = params['search'];

      if (country) this.miracleFilters.country = country;
      if (century) this.miracleFilters.century = century;
      if (search) this.miracleFilters.search = search;

      this.updateData();
    });

    this.miraclesService.getCountries().subscribe({
      next: (countries) => (this.countries = countries),
      error: (err) => console.error(err),
    });
  }

  redirectToMiracleDetails(slug: string) {
    this.router.navigate(['/miracles', slug]);
  }

  private updateData() {
    this.miraclesService.getMiracles(this.miracleFilters).subscribe({
      next: (res) => {
        this.miracles = res.items;
        this.totalCount = res.totalCount;
      },
      error: (err) => console.error(err),
    });
  }

  handleFilterChange(
    key: keyof typeof this.miracleFilters,
    event: MatSelectChange
  ) {
    (this.miracleFilters as any)[key] = event.value;
    this.updateData();
  }

  handleSearch(query: string) {
    this.miracleFilters.pageNumber = 1;
    this.miracleFilters.search = query;
    this.updateData();
  }

  clearFilters() {
    this.miracleFilters = new MiracleFilters();
    this.updateData();
  }

  handlePageChange(event: PageEvent): void {
    this.miracleFilters.pageNumber = event.pageIndex + 1;
    this.miracleFilters.pageSize = event.pageSize;
    this.updateData();
  }
}
