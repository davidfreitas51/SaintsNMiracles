import { Component, inject, OnInit, viewChild, ViewChild } from '@angular/core';
import { SaintsService } from '../../services/saints.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-content-table',
  templateUrl: './admin-content-table.component.html',
  styleUrls: ['./admin-content-table.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSortModule,
    MatCardModule,
    RouterLink,
  ],
})
export class AdminContentTableComponent implements OnInit {
  private saintsService = inject(SaintsService);
  private route = inject(ActivatedRoute);

  public columns: string[] = ['name', 'country', 'century', 'actions'];
  public displayedColumns = [...this.columns];
  public dataSource = new MatTableDataSource<any>([]);

  public currentEntity: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.currentEntity = this.route.snapshot.paramMap.get('object') || '';

    this.saintsService.getSaints().subscribe((saints) => {
      this.dataSource.data = saints;
    });
  }

  editObject(entity: any) {}

  deleteObject(entity: any) {}
}
