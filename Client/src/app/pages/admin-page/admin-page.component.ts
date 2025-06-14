import { Component } from '@angular/core';
import { AdminMenuComponent } from "../../components/admin-menu/admin-menu.component";
import { AdminHeaderComponent } from "../../components/admin-header/admin-header.component";

@Component({
  selector: 'app-admin-page',
  imports: [AdminMenuComponent, AdminHeaderComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {

}
