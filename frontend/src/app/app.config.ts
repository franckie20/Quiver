import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Configuration } from '@api/configuration';

export function apiConfigFactory(): Configuration {
  return new Configuration({
    basePath: isDevMode()
      ? ''
      : 'https://quiver-backend.onrender.com',
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: Configuration,
      useFactory: apiConfigFactory,
    },
  ],
};
