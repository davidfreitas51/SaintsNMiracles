import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-miracles-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './miracles-page.component.html',
  styleUrl: './miracles-page.component.scss'
})
export class MiraclesPageComponent {

}
