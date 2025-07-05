import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EntityDialogData } from '../../interfaces/entity-dialog-data';
import { finalize } from 'rxjs/operators';
import { MatFormField, MatLabel } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { LowercasePipe } from '../../pipes/lowercase.pipe';
import { Entity } from '../../interfaces/entity';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { MatSort, MatSortModule } from '@angular/material/sort';

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
  readonly dialogRef = inject(MatDialogRef<EntityManagerDialogComponent>);
  readonly data = inject<EntityDialogData>(MAT_DIALOG_DATA);
  dialogService = inject(ConfirmDialogService);

  entityName = '';
  dataSource = new MatTableDataSource<Entity>([]);
  search = '';
  newName = '';
  isLoading = false;

  editingElement: Entity | null = null;

  ngOnInit(): void {
    this.entityName = this.data.entityName;
    this.loadEntities();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadEntities(): void {
    this.isLoading = true;
    this.data
      .getAllFn({ search: this.search })
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
        console.log(`${this.entityName} updated`);
      },
      error: (err) => {
        console.error(`Failed to update ${this.entityName}`, err);
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
            console.log(`${this.entityName} deleted`);
            this.loadEntities();
          },
          error: (err) => {
            console.error(`Failed to delete ${this.entityName}`, err);
          },
        });
      });
  }

  createEntity(): void {
    const trimmed = this.newName.trim();
    if (!trimmed) return;

    this.data.createFn(trimmed).subscribe({
      next: () => {
        console.log(`${this.entityName} created`);
        this.newName = '';
        this.loadEntities();
      },
      error: (err) => {
        console.error(`Failed to create ${this.entityName}`, err);
      },
    });
  }

  startEdit(element: Entity): void {
    this.editingElement = { ...element };
  }

  saveEdit(element: Entity): void {
    this.updateEntity(element);
    this.editingElement = null;
  }

  cancelEdit(): void {
    this.editingElement = null;
  }
}
