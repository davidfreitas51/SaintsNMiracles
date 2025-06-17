import { Component } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-saint-details-page',
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './saint-details-page.component.html',
  styleUrl: './saint-details-page.component.scss'
})
export class SaintDetailsPageComponent {

}
