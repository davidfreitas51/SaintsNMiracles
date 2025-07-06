import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EntityDialogData } from '../../interfaces/entity-dialog-data';

@Component({
  selector: 'app-create-entity-dialog',
  standalone: true,
  templateUrl: './create-entity-dialog.component.html',
  styleUrls: ['./create-entity-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class CreateEntityDialogComponent {
  @ViewChild('inputEl') inputEl!: ElementRef<HTMLInputElement>;
  readonly dialogRef = inject(MatDialogRef<CreateEntityDialogComponent>);
  readonly data = inject<EntityDialogData>(MAT_DIALOG_DATA);

  name = '';
  loading = false;

  get entityName(): string {
    return this.data.entityName;
  }


  ngAfterViewInit() {
    setTimeout(() => this.inputEl.nativeElement.focus());
  }

  create(): void {
    const trimmed = this.name.trim();
    if (!trimmed) return;

    this.loading = true;
    this.data.createFn(trimmed).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => {
        console.error(`Failed to create ${this.entityName}`, err);
        this.loading = false;
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
