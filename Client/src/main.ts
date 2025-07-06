import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideEnvironmentNgxMask } from 'ngx-mask';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideEnvironmentNgxMask({ validation: true }),
  ],
}).catch((err) => console.error(err));
