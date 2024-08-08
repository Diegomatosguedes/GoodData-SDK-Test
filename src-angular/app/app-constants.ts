/* Constante para adicionar ao nome dos objetos duplicados */
export const CNST_DUPLICATE_REGEX: string = '\\(([0-9]*)\\)';

/* Nome do Agent (Completo e Simplificado) */
export const CNST_PROGRAM_NAME: any = {
   DEFAULT: 'TOTVS Carol Analytics'
  ,SIMPLE: 'TOTVS Carol'
};

/* Versão do Agent (Desenv. e Prod.) */
export const CNST_PROGRAM_VERSION: any = {
   DEVELOPMENT: 'Angular'
  ,PRODUCTION: 'v'
};

export const CNST_BACKEND_API_PORT: number = 4100;
export const CNST_BACKEND_API_HOST: string = 'https://analytics.totvs.carol:' + CNST_BACKEND_API_PORT;

export const CNST_PROXY_API_PORT: number = 4100;
export const CNST_PROXY_API_HOST: string = 'https://analytics.totvs.carol:/gooddata' + CNST_BACKEND_API_PORT;

export const CNST_GOODDATA_HOST: string = 'https://bossy-fly.trial.cloud.gooddata.com';
export const CNST_GOODDATA_API_VERSION: string = 'v1';

export const CNST_GOODDATA_APITOKEN: string = 'gooddataapitoken';
export const CNST_GOODDATA_HOMEPAGE_DASHBOARD: string = 'gooddatadashboardhomepage';
export const CNST_GOODDATA_HOMEPAGE_WORKSPACE: string = 'gdworkspacehomepage';