// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { CNST_PROGRAM_NAME } from '../app/app-constants';

export const env = {
  production: false,
  shouldPromptTokenRequest: true,
  appCodeDevMode: CNST_PROGRAM_NAME.DEFAULT,
  TOTVSCarol: {
    tenantId: '878394e9a8a0429ea44373fee4eb602b',
    authToken: 'd58ac1b426824d5aac28ce2249b59f97',
    connectorId: 'cbd9d77a951847adaab48bf490a7471e'
  },
  GDCloud: {
    apiToken: 'MmUzZTNlZmItMjdkMC00NDNlLWE3ZjItZTUzMmFjOTZmMWRiOkdEQ2xvdWRfVG9rZW46VGpKVERUQUQrbE55Zi9zRHFwQ3dLY3g1eWN0S3NXU2s='
  },
  DEV: {
    MANAGER_URL: 'https://api-fluig.dev.totvs.app',
    IDENTITY_URL: 'https://app.fluigidentity.net',
    NOTIFICATION_URL: '',
    TOKEN_URL: '',
    REFRESH_TOKEN_URL: ''
  },
  STAGING: {
    MANAGER_URL: 'https://api-fluig.staging.totvs.app',
    IDENTITY_URL: 'https://app.customerfi.com',
    NOTIFICATION_URL: '',
    TOKEN_URL: '',
    REFRESH_TOKEN_URL: ''
  },
  PROD: {
    MANAGER_URL: 'https://api-fluig.totvs.app',
    IDENTITY_URL: 'https://app.fluigidentity.com',
    NOTIFICATION_URL: '',
    TOKEN_URL: '',
    REFRESH_TOKEN_URL: '',
  }
};

/* Dependência do TOTVSApps para integração com os outros apps da plataforma */
import { HeaderModuleOptions } from '@totvs-apps-components/header';
export const CNST_HEADER_MODULE_OPTIONS: HeaderModuleOptions = {
  DEV: env.DEV,
  STAGING: env.STAGING,
  PROD: env.PROD,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.