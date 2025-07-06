import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminContentTableComponent } from '../../../../shared/components/admin-content-table/admin-content-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MiracleFilters } from '../../../miracles/interfaces/miracle-filter';
import { Miracle } from '../../../miracles/interfaces/miracle';
import { MiraclesService } from '../../../../core/services/miracles.service';

@Component({
  selector: 'app-manage-miracles-page',
  standalone: true,
  imports: [
    AdminContentTableComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './manage-miracles-page.component.html',
  styleUrls: ['./manage-miracles-page.component.scss'],
})
export class ManageMiraclesPageComponent {
  private miraclesService = inject(MiraclesService);

  miraclesFilter: MiracleFilters = new MiracleFilters();

  miracles: Miracle[] = [];

  ngOnInit(): void {
    this.loadMiracles();
  }

  loadMiracles = () => {
    this.miraclesService.getMiracles(this.miraclesFilter).subscribe((res) => {
      this.miracles = res.items;
    });
  };

  deleteMiracle = (id: number) => this.miraclesService.deleteMiracle(id);
}
