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
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RomanPipe } from '../../pipes/roman.pipe';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Observable } from 'rxjs';
import { FeastDayFormatPipe } from "../../pipes/feast-day-format.pipe";

@Component({
  selector: 'app-admin-content-table',
  templateUrl: './admin-content-table.component.html',
  styleUrls: ['./admin-content-table.component.scss'],
  standalone: true,
  imports: [
    MatPaginator,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    RomanPipe,
    CommonModule,
    FeastDayFormatPipe,
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
  route = inject(ActivatedRoute);

  entitySingular = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data.length) {
      this.setColumns();
      this.dataSource.data = this.data;


      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.detectEntityFromRoute();
  }

  private detectEntityFromRoute(): void {
    const url = this.router.url;
    const match = url.match(/\/admin\/(\w+)/);
    if (match && match[1]) {
      const plural = match[1];
      this.entitySingular = plural.endsWith('s') ? plural.slice(0, -1) : plural;
    }
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

    const name = entity.name || entity.title || 'this item';

    this.dialogService
      .confirm({
        title: `Delete ${this.entitySingular}?`,
        message: `You're about to permanently delete “${name}”. This action cannot be undone.`,
        confirmText: 'Yes, delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.deleteFn(entity.id).subscribe({
          next: () => {
            this.snackBarService.success(
              `${this.entitySingular} successfully deleted`
            );
            this.loadData();
          },
          error: (err) => {
            this.snackBarService.error(
              `Failed to delete ${this.entitySingular}`
            );
            console.error(err);
          },
        });
      });
  }
}
