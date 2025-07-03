import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';

import { SaintsService } from '../../services/saints.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SaintFilters } from '../../interfaces/saint-filter';
import { RomanPipe } from '../../pipes/roman.pipe';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-admin-content-table',
  templateUrl: './admin-content-table.component.html',
  styleUrls: ['./admin-content-table.component.scss'],
  standalone: true,
  imports: [
    MatPaginator,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    RomanPipe,
  ],
})
export class AdminContentTableComponent implements OnInit {
  private saintsService = inject(SaintsService);
  private snackBarService = inject(SnackbarService);
  private dialogService = inject(ConfirmDialogService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  public router = inject(Router);
  public columns: string[] = ['name', 'country', 'century', 'actions'];
  public displayedColumns = [...this.columns];
  public dataSource = new MatTableDataSource<any>([]);
  public currentEntity = '';
  totalCount: number = 0;

  saintFilters: SaintFilters = new SaintFilters();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  humanizeColumn(col: string): string {
    if (!col) return '';
    return col
      .replace(/[_\-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  }

  ngOnInit(): void {
    const plural = this.route.snapshot.paramMap.get('object') || '';
    this.currentEntity = this.getSingularName(plural);

    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadData(): void {
    this.saintsService.getSaints(this.saintFilters).subscribe((res) => {
      this.dataSource.data = res.items;
      this.totalCount = res.totalCount;
      this.cdr.detectChanges();
    });
  }

  editObject(entity: any): void {
    this.router.navigate([
      '/admin',
      this.currentEntity.toLowerCase(),
      entity.id,
      'edit',
    ]);
  }

  deleteObject(entity: any): void {
    this.dialogService
      .confirm({
        title: `Delete ${this.currentEntity}?`,
        message: `You're about to permanently delete “${entity.name}”. This action cannot be undone.`,
        confirmText: 'Yes, delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.saintsService.deleteSaint(entity.id).subscribe({
          next: () => {
            this.snackBarService.success(
              `${this.currentEntity} successfully deleted`
            );
            this.loadData();
          },
          error: (err) => {
            this.snackBarService.error(
              `Failed to delete ${this.currentEntity.toLowerCase()}`
            );
            console.error(err);
          },
        });
      });
  }

  private getSingularName(plural: string): string {
    const map: Record<string, string> = {
      saints: 'Saint',
    };
    return map[plural] || this.capitalize(plural);
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
