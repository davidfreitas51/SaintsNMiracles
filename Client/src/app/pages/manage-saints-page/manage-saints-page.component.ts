import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminContentTableComponent } from '../../components/admin-content-table/admin-content-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SaintFilters } from '../../interfaces/saint-filter';
import { Saint } from '../../interfaces/saint';
import { SaintsService } from '../../services/saints.service';
import { MatDialog } from '@angular/material/dialog';
import { EntityManagerDialogComponent } from '../../components/entity-manager-dialog/entity-manager-dialog.component';
import { TagsService } from '../../services/tags.service';
import { ReligiousOrdersService } from '../../services/religious-orders.service';
import { EntityFilters } from '../../interfaces/entity-filters';

@Component({
  selector: 'app-manage-saints-page',
  standalone: true,
  imports: [
    AdminContentTableComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatButtonModule,
  ],
  templateUrl: './manage-saints-page.component.html',
  styleUrls: ['./manage-saints-page.component.scss'],
})
export class ManageSaintsPageComponent {
  private saintsService = inject(SaintsService);
  private tagsService = inject(TagsService);
  private religiousOrdersService = inject(ReligiousOrdersService);
  readonly dialog = inject(MatDialog);
  saintsFilter: SaintFilters = new SaintFilters();
  entityFilter: EntityFilters = new EntityFilters();

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

  manageTags() {
    this.dialog.open(EntityManagerDialogComponent, {
      height: '600px',
      panelClass: 'entity-manager-dialog',
      data: {
        entityName: 'Tag',
        getAllFn: (filters: EntityFilters) => this.tagsService.getTags(filters),
        createFn: (name: string) => this.tagsService.createTag(name),
        updateFn: (entity: any) =>
          this.tagsService.updateTag(entity),
        deleteFn: (id: number) => this.tagsService.deleteTag(id),
      },
    });
  }

  manageReligiousOrders() {
    this.dialog.open(EntityManagerDialogComponent, {
      height: '600px',
      panelClass: 'entity-manager-dialog',
      data: {
        entityName: 'Religious Order',
      },
    });
  }
}
