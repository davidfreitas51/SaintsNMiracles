import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CreateEntityDialogComponent } from '../create-entity-dialog/create-entity-dialog.component';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Entity } from '../../../interfaces/entity';
import { EntityDialogData } from '../../../interfaces/entity-dialog-data';
import { EntityFilters } from '../../../interfaces/entity-filters';
import { LowercasePipe } from '../../pipes/lowercase.pipe';


@Component({
  selector: 'app-entity-manager-dialog',
  standalone: true,
  templateUrl: './entity-manager-dialog.component.html',
  styleUrls: ['./entity-manager-dialog.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    LowercasePipe,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatSortModule,
  ],
})
export class EntityManagerDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EntityManagerDialogComponent>);
  readonly snackbar = inject(SnackbarService);
  readonly data = inject<EntityDialogData>(MAT_DIALOG_DATA);
  dialogService = inject(ConfirmDialogService);

  filters = new EntityFilters();

  entityName = '';
  dataSource = new MatTableDataSource<Entity>([]);
  newName = '';
  isLoading = false;

  editingElement: Entity | null = null;
  originalElement: Entity | null = null;

  ngOnInit(): void {
    this.entityName = this.data.entityName;
    this.loadEntities();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadEntities(): void {
    this.isLoading = true;
    this.data
      .getAllFn(this.filters)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.items;
        },
        error: (err) => {
          console.error(`Failed to load ${this.entityName}s`, err);
        },
      });
  }

  updateEntity(entity: Entity): void {
    this.data.updateFn(entity).subscribe({
      next: () => {
        this.snackbar.success(`${this.entityName} updated`);
      },
      error: () => {
        this.snackbar.error(`Failed to update ${this.entityName}`);
      },
    });
  }

  deleteEntity(entity: Entity): void {
    this.dialogService
      .confirm({
        title: `Delete ${this.entityName}?`,
        message: `You're about to permanently delete “${entity.name}”. This action cannot be undone.`,
        confirmText: 'Yes, delete',
        cancelText: 'Cancel',
      })
      .subscribe((confirmed) => {
        if (!confirmed) return;

        this.data.deleteFn(entity.id).subscribe({
          next: () => {
            this.snackbar.success(`${this.entityName} deleted`);
            this.loadEntities();
          },
          error: () => {
            this.snackbar.error(`Failed to delete ${this.entityName}`);
          },
        });
      });
  }

  createEntity(): void {
    this.dialog
      .open(CreateEntityDialogComponent, {
        height: '250px',
        width: '300px',
        data: {
          entityName: this.entityName,
          createFn: this.data.createFn,
        },
      })
      .afterClosed()
      .subscribe((created) => {
        if (created) {
          this.snackbar.success(`${this.entityName} successfully created`);
          this.loadEntities();
        }
      });
  }

  startEdit(element: Entity): void {
    this.originalElement = element;
    this.editingElement = { ...element };
  }

  saveEdit(): void {
    if (!this.originalElement || !this.editingElement) return;

    Object.assign(this.originalElement, this.editingElement);
    this.updateEntity(this.originalElement);

    this.editingElement = null;
    this.originalElement = null;
  }

  cancelEdit(): void {
    this.editingElement = null;
    this.originalElement = null;
  }

  onPageChange(event: PageEvent): void {
    this.filters.page = event.pageIndex + 1;
    this.filters.pageSize = event.pageSize;
    this.loadEntities();
  }
}
