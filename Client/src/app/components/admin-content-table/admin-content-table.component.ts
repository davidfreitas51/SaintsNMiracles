import { Component, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { SaintsService } from '../../services/saints.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-content-table',
  templateUrl: './admin-content-table.component.html',
  styleUrls: ['./admin-content-table.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSortModule,
    MatCardModule
  ]
})
export class AdminContentTableComponent implements OnInit {
  private saintsService = inject(SaintsService);

  public columns: string[] = ['name', 'country', 'century', 'actions'];
  public displayedColumns = ['name', 'country', 'century', 'actions'];
  public dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteObject(_t19: any) {
    throw new Error('Method not implemented.');
  }

  editObject(_t19: any) {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.saintsService.getSaints().subscribe(saints => {
      this.dataSource.data = saints;
    });
  }
}
