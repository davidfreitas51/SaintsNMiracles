import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-content-form-wrapper',
  template: `<ng-container *ngComponentOutlet="formComponent"></ng-container>`,
  standalone: true,
  imports: [CommonModule]
})
export class ContentFormWrapperComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  formComponent: any = null;

  async ngOnInit() {
    const objectType = this.route.snapshot.parent?.paramMap
      .get('object')
      ?.toLowerCase();

    if (objectType === 'saints') {
      const { SaintFormPageComponent } = await import(
        '../../pages/saint-form-page/saint-form-page.component'
      );
      this.formComponent = SaintFormPageComponent;
    } else if (objectType === 'miracles') {
      const { MiracleFormPageComponent } = await import(
        '../../pages/miracle-form-page/miracle-form-page.component'
      );
      this.formComponent = MiracleFormPageComponent;
    } else {
      this.router.navigate(['/admin']);
    }
  }
}
