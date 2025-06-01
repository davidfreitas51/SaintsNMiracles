import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-saints-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './saints-page.component.html',
  styleUrl: './saints-page.component.scss'
})
export class SaintsPageComponent {

}
