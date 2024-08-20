//Porta que hospeda a API do Angular, usada para cadastro das informações do Agent (Apenas em modo de desenv.)
export const CNST_PROXY: any = {
  PORT: 4200,
  SSL: true
}

export const CNST_BACKEND: any = {
  PORT: 8080,
  SSL: true
}

//Níveis de resposta do sistema (Angular)
export const CNST_SYSTEMLEVEL: any = {
   ANGL: '[ANGL]'
};

//Níveis de resposta dos logs
export const CNST_LOGLEVEL: any = {
   ERROR: { tag: '[ERROR]', level: 0 }
  ,WARN:  { tag: '[WARN ]', level: 1 }
  ,INFO:  { tag: '[INFO ]', level: 2 }
  ,DEBUG: { tag: '[DEBUG]', level: 5 }
};