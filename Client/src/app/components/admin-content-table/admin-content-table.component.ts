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
import { MiraclesService } from '../../services/miracles.service';
import { SnackbarService } from '../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RomanPipe } from '../../pipes/roman.pipe';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { combineLatest } from 'rxjs';

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
  private miraclesService = inject(MiraclesService);
  private snackBarService = inject(SnackbarService);
  private dialogService = inject(ConfirmDialogService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  public router = inject(Router);
  public columns: string[] = [];
  public displayedColumns: string[] = [];
  public dataSource = new MatTableDataSource<any>([]);
  public currentEntity = '';
  totalCount: number = 0;

  saintFilters = {
    country: '',
    century: '',
    search: '',
    pageNumber: 1,
    pageSize: 25,
    orderBy: 'name',
  };

  miracleFilters = {
    country: '',
    century: '',
    search: '',
    pageNumber: 1,
    pageSize: 25,
    orderBy: 'title',
  };

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
    combineLatest([this.route.paramMap, this.route.queryParams]).subscribe(
      ([params, queryParams]) => {
        const plural = params.get('object') || '';
        this.currentEntity = this.getSingularName(plural.toLowerCase());
        this.setColumnsByEntity();

        // Atualizar filtros a partir dos query params
        if (this.currentEntity === 'saint') {
          this.saintFilters.country = queryParams['country'] || '';
          this.saintFilters.century = queryParams['century'] || '';
          this.saintFilters.search = queryParams['search'] || '';
          this.saintFilters.pageNumber = 1;
        } else if (this.currentEntity === 'miracle') {
          this.miracleFilters.country = queryParams['country'] || '';
          this.miracleFilters.century = queryParams['century'] || '';
          this.miracleFilters.search = queryParams['search'] || '';
          this.miracleFilters.pageNumber = 1;
        }

        this.loadData();
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private loadData(): void {
    if (this.currentEntity === 'saint') {
      this.saintsService.getSaints(this.saintFilters).subscribe((res: any) => {
        this.dataSource.data = res.items;
        this.totalCount = res.totalCount;
        this.cdr.detectChanges();
      });
    } else if (this.currentEntity === 'miracle') {
      this.miraclesService
        .getMiracles(this.miracleFilters)
        .subscribe((res: any) => {
          this.dataSource.data = res.items;
          this.totalCount = res.totalCount;
          this.cdr.detectChanges();
        });
    }
  }

  editObject(entity: any): void {
    this.router.navigate([
      '/admin',
      this.currentEntity.toLowerCase() + 's',
      entity.id,
      'edit',
    ]);
  }

  deleteObject(entity: any): void {
    this.dialogService
      .confirm({
        title: `Delete ${this.currentEntity}?`,
        message: `You're about to permanently delete “${
          entity.name || entity.title
        }”. This action cannot be undone.`,
        confirmText: 'Yes, delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        if (this.currentEntity === 'saint') {
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
        } else if (this.currentEntity === 'miracle') {
          this.miraclesService.deleteMiracle(entity.id).subscribe({
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
        }
      });
  }

  private getSingularName(plural: string): string {
    const map: Record<string, string> = {
      saints: 'saint',
      miracles: 'miracle',
    };
    return map[plural] || this.capitalize(plural);
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private setColumnsByEntity(): void {
    if (this.currentEntity === 'saint') {
      this.columns = ['name', 'country', 'century', 'actions'];
    } else if (this.currentEntity === 'miracle') {
      this.columns = ['title', 'country', 'century', 'actions'];
    } else {
      this.columns = ['id', 'actions'];
    }
    this.displayedColumns = [...this.columns];
  }
}
