import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-saints-details-page',
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './saints-details-page.component.html',
  styleUrl: './saints-details-page.component.scss'
})
export class SaintsDetailsPageComponent {

}
