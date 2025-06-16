import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  imports: [
    MatCardModule,
    MatTableModule,
  ],
})
export class DashboardPageComponent {
  summary = [
    { label: 'Total Saints', value: 120 },
    { label: 'Total Signs', value: 45 },
    { label: 'Total Users', value: 30 },
  ];

  tableColumns: string[] = ['name', 'status', 'lastActive'];
  tableData = [
    { name: 'John Doe', status: 'Active', lastActive: '2 days ago' },
    { name: 'Jane Smith', status: 'Inactive', lastActive: '10 days ago' },
    { name: 'Bob Johnson', status: 'Active', lastActive: '1 day ago' },
  ];
}
