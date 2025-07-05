import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminContentTableComponent } from '../../components/admin-content-table/admin-content-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SaintFilters } from '../../interfaces/saint-filter';
import { Saint } from '../../interfaces/saint';
import { SaintsService } from '../../services/saints.service';

@Component({
  selector: 'app-manage-saints-page',
  standalone: true,
  imports: [
    AdminContentTableComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './manage-saints-page.component.html',
  styleUrls: ['./manage-saints-page.component.scss'],
})
export class ManageSaintsPageComponent {
  private saintsService = inject(SaintsService);

  saintsFilter: SaintFilters = new SaintFilters();

  saints: Saint[] = [];

  ngOnInit(): void {
    this.loadSaints();
  }

  loadSaints = () => {
    this.saintsService.getSaints(this.saintsFilter).subscribe((res) => {
      this.saints = res.items;
    });
  };

  deleteSaint = (id: number) => this.saintsService.deleteSaint(id);
}
