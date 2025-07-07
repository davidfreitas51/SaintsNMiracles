import { Component, inject, OnInit } from '@angular/core';
import { SaintsService } from '../../../../core/services/saints.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Saint } from '../../interfaces/saint';
import { environment } from '../../../../../environments/environment';
import { RomanPipe } from '../../../../shared/pipes/roman.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SaintFilters } from '../../interfaces/saint-filter';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { CommonModule } from '@angular/common';
import { CountryCodePipe } from '../../../../shared/pipes/country-code.pipe';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { MatDialog } from '@angular/material/dialog';
import { AdvancedSearchSaintsDialogComponent } from '../../components/advanced-search-saints-dialog/advanced-search-saints-dialog.component';
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
    CountryCodePipe,
    MatPaginator,
  ],
  templateUrl: './saints-page.component.html',
  styleUrl: './saints-page.component.scss',
})
export class SaintsPageComponent implements OnInit {
  private router = inject(Router);
  private saintsService = inject(SaintsService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  countries: string[] = [];
  centuries: number[] = Array.from({ length: 21 }, (_, i) => i + 1);
  months: string[] = [];
  religiousOrders: string[] = [];
  public saints: Saint[] | null = null;
  totalCount: number = 0;
  imageBaseUrl = environment.assetsUrl;

  saintFilters: SaintFilters = new SaintFilters();

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const country = params['country'];
      const century = params['century'];
      const search = params['search'];

      if (country) this.saintFilters.country = country;
      if (century) this.saintFilters.century = century;
      if (search) this.saintFilters.search = search;

      this.updateData();
    });

    this.saintsService.getCountries().subscribe({
      next: (countries) => (this.countries = countries),
      error: (err) => console.error(err),
    });
  }

  redirectToSaintDetails(slug: string) {
    this.router.navigate(['/saints', slug]);
  }

  private updateData() {
    this.saintsService.getSaints(this.saintFilters).subscribe({
      next: (res) => {
        this.saints = res.items;
        this.totalCount = res.totalCount;
      },
      error: (err) => console.error(err),
    });
  }

  handleFilterChange(
    key: keyof typeof this.saintFilters,
    event: MatSelectChange
  ) {
    (this.saintFilters as any)[key] = event.value;
    this.updateData();
  }

  handleSearch(query: string) {
    this.saintFilters.pageNumber = 1;
    this.saintFilters.search = query;
    this.updateData();
  }

  clearFilters() {
    this.saintFilters = new SaintFilters();
    this.updateData();
  }

  handlePageChange(event: PageEvent): void {
    this.saintFilters.pageNumber = event.pageIndex + 1;
    this.saintFilters.pageSize = event.pageSize;
    this.updateData();
  }

  handleAdvancedSearch() {
    const dialogRef = this.dialog.open(AdvancedSearchSaintsDialogComponent, {
      height: '600px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Selected tags:', result.tags);
        console.log('Selected month:', result.month);
        console.log('Selected order:', result.order);

        this.saintFilters.religiousOrder = result.order
        this.updateData()
      }
    });
  }
}
