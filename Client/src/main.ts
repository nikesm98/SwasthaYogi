import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { AuthInterceptorProvider } from './app/services/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideRouter(routes),

    provideHttpClient(),              
    AuthInterceptorProvider,   
    importProvidersFrom(ReactiveFormsModule), 
    provideAnimations()
  ]
})
.catch(err => console.error(err));
