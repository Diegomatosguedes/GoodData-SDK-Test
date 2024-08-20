import { CNST_PROGRAM_NAME } from '../app/app-constants';

export const env = {
  production: true,
  shouldPromptTokenRequest: false,
  appCodeDevMode: CNST_PROGRAM_NAME.DEFAULT,
  TOTVSCarol: {
    tenantId: '',
    authToken: 'd58ac1b426824d5aac28ce2249b59f97',
    connectorId: 'cbd9d77a951847adaab48bf490a7471e'
  },
  GDCloud: {
    apiToken: ''
  },
  DEV: {
    MANAGER_URL: 'https://api-fluig.dev.totvs.app',
    IDENTITY_URL: 'https://app.fluigidentity.net',
    NOTIFICATION_URL: 'https://communication.dev.totvs.app',
    TOKEN_URL: '',
    REFRESH_TOKEN_URL: ''
  },
  STAGING: {
    MANAGER_URL: 'https://api-fluig.staging.totvs.app',
    IDENTITY_URL: 'https://app.customerfi.com',
    NOTIFICATION_URL: 'https://communication.staging.totvs.app',
    TOKEN_URL: '',
    REFRESH_TOKEN_URL: ''
  },
  PROD: {
    MANAGER_URL: 'https://api-fluig.totvs.app',
    IDENTITY_URL: 'https://app.fluigidentity.com',
    NOTIFICATION_URL: 'https://communication.totvs.app',
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
