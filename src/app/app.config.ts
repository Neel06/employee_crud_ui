import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptors,withXsrfConfiguration } from '@angular/common/http';

import { apiLoggingInterceptor } from './interceptors/api-logging-interceptor';
import { provideAuth, LogLevel } from 'angular-auth-oidc-client';
import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withXsrfConfiguration({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
      withInterceptors(
        [
          apiLoggingInterceptor
        ]
      ),
    ),

    provideAuth(
      {
        config: {
          authority: environment.auth.authority,
          clientId: environment.auth.clientId,
          redirectUrl: window.location.origin + '/',
          postLogoutRedirectUri: window.location.origin + '/',

          responseType: 'code',
          scope: 'openid profile email',

          silentRenew: false, // First implement explicit login/logout.
          secureRoutes: [
            environment.apiUrl,
            environment.authMeUrl
          ],
          logLevel: LogLevel.None
        }
      }
    )
  ]
};
