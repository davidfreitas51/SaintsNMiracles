import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
  inject,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { FeastDayFormatPipe } from '../../pipes/feast-day-format.pipe';
import { RomanPipe } from '../../pipes/roman.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-content-table',
  templateUrl: './admin-content-table.component.html',
  styleUrls: ['./admin-content-table.component.scss'],
  standalone: true,
  imports: [
    MatPaginator,
    FeastDayFormatPipe,
    RomanPipe,
    MatIconModule,
    MatCardModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
  ],
})
export class AdminContentTableComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) data: any[] = [];
  @Input() excludedColumns: string[] = [];
  @Input() deleteFn!: (id: number) => Observable<any>;
  @Input() loadData!: () => void;

  columns: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private snackBarService = inject(SnackbarService);
  private dialogService = inject(ConfirmDialogService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  entitySingular = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length) {
      this.setColumns();
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.detectEntityFromRoute();
    this.configureFilterPredicate();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private setColumns(): void {
    this.columns = Object.keys(this.data[0] || {}).filter(
      (col) => !this.excludedColumns.includes(col)
    );

    if (!this.columns.includes('actions')) {
      this.columns.push('actions');
    }

    this.displayedColumns = [...this.columns];
  }

  private detectEntityFromRoute(): void {
    const url = this.router.url;
    const match = url.match(/\/admin\/(\w+)/);
    if (match && match[1]) {
      const plural = match[1];
      this.entitySingular = plural.endsWith('s') ? plural.slice(0, -1) : plural;
    }
  }

  private configureFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const filterText = filter.trim().toLowerCase();
      return this.displayedColumns.some((col) => {
        if (col === 'actions') return false;
        const value = data[col];
        return (
          value != null && value.toString().toLowerCase().includes(filterText)
        );
      });
    };
  }

  humanizeColumn(col: string): string {
    if (!col) return '';
    return col
      .replace(/[_\-]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase());
  }

  editObject(entity: any): void {
    const id = entity?.id;
    if (!id || !this.entitySingular) return;
    this.router.navigate(['/admin', `${this.entitySingular}s`, id, 'edit']);
  }

  deleteObject(entity: any): void {
    if (!this.deleteFn || !this.loadData) {
      console.error('deleteFn or loadData not provided.');
      return;
    }

    const entityName =
      this.entitySingular.charAt(0).toUpperCase() +
      this.entitySingular.slice(1);

    this.dialogService
      .confirm({
        title: `Delete ${entityName}?`,
        message: `You're about to permanently delete “${name}”. This action cannot be undone.`,
        confirmText: 'Yes, delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.deleteFn(entity.id).subscribe({
          next: () => {
            this.snackBarService.success(`${entityName} successfully deleted`);
            this.loadData();
          },
          error: (err) => {
            this.snackBarService.error(`Failed to delete ${entityName}`);
            console.error(err);
          },
        });
      });
  }
}
