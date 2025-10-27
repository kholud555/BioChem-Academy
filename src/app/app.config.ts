import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';


import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './interceptors/auth-interceptor';
import { spinnerInterceptor } from './interceptors/spinner/spinner-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), 
     provideAnimations(), // required animations providers
    provideToastr(), // Toastr providers
   provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClient(withInterceptors([spinnerInterceptor])),
    
  ]
};
