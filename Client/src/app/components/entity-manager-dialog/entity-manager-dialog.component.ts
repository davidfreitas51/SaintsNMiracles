import { Component, OnInit, inject } from '@angular/core';
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
  ],
})
export class EntityManagerDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EntityManagerDialogComponent>);
  readonly data = inject<EntityDialogData>(MAT_DIALOG_DATA);

  entityName = '';
  dataSource = new MatTableDataSource<Entity>([]);
  search = '';
  newName = '';
  isLoading = false;

  ngOnInit(): void {
    this.entityName = this.data.entityName;
    this.loadEntities();
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
    this.data.deleteFn(entity.id).subscribe({
      next: () => {
        console.log(`${this.entityName} deleted`);
        this.loadEntities();
      },
      error: (err) => {
        console.error(`Failed to delete ${this.entityName}`, err);
      },
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
}
