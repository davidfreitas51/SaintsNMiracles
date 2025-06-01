import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-signs-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './signs-page.component.html',
  styleUrl: './signs-page.component.scss'
})
export class SignsPageComponent {

}
