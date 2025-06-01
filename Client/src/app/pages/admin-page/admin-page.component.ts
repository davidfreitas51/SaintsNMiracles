import { Component } from '@angular/core';
import { AdminMenuComponent } from "../../components/admin-menu/admin-menu.component";

@Component({
  selector: 'app-admin-page',
  imports: [AdminMenuComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss'
})
export class AdminPageComponent {

}
