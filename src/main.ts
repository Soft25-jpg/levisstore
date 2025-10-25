import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // 👈 Aquí se agregan tus rutas
    ...appConfig.providers // 👈 Y tu configuración (HttpClient, interceptores, etc.)
  ]
}).catch(err => console.error(err));
