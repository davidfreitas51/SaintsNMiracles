import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { TagsService } from '../../../../core/services/tags.service';
import { ReligiousOrdersService } from '../../../../core/services/religious-orders.service';
import { EntityFilters } from '../../../../interfaces/entity-filters';
import { Tag } from '../../../../interfaces/tag';
import { ReligiousOrder } from '../../../../interfaces/religious-order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-search-saints-dialog',
  templateUrl: './advanced-search-saints-dialog.component.html',
  styleUrl: './advanced-search-saints-dialog.component.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class AdvancedSearchSaintsDialogComponent implements OnInit {
  readonly dialogRef = inject(
    MatDialogRef<AdvancedSearchSaintsDialogComponent>
  );
  readonly tagsService = inject(TagsService);
  readonly religiousOrdersService = inject(ReligiousOrdersService);

  months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  tags: Tag[] = [];
  religiousOrders: ReligiousOrder[] = [];

  selectedTags: Tag[] = [];
  selectedMonth: string = '';
  selectedOrder: string = '';

  ngOnInit(): void {
    this.tagsService.getTags(new EntityFilters()).subscribe({
      next: (res) => {
        this.tags = res.items;
      },
      error: (err) => {
        console.error('Failed to load tags', err);
      },
    });

    this.religiousOrdersService.getOrders(new EntityFilters()).subscribe({
      next: (res) => {
        this.religiousOrders = res.items;
      },
      error: (err) => {
        console.error('Failed to load religious orders', err);
      },
    });
  }

  selectTag(tag: Tag) {
    if (!this.selectedTags.some((t) => t.id === tag.id)) {
      this.selectedTags = [...this.selectedTags, tag];
    }
  }

  unselectTag(tag: Tag) {
    this.selectedTags = this.selectedTags.filter((t) => t.id !== tag.id);
  }

  onApplyFilters() {
    this.dialogRef.close()
  }
}
