/* Componentes padrões do Angular */
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoNotificationService,
  PoNotification,
  PoToasterOrientation
} from '@po-ui/ng-components';

import { env } from '../../environments/environment';

/* Constantes de utilitários da aplicação */
import {
  CNST_LOGLEVEL,
  CNST_SYSTEMLEVEL,
  CNST_PROXY,
  CNST_BACKEND
} from './utilities-constants';

@Injectable({
  providedIn: 'root'
})
export class Utilities {
  
  //Define se o modo debug está ativado, ou não (via serviço de configuração)
  private debug: boolean = false;
  
  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _notificationService: PoNotificationService
  ) { this.debug = !env.production; }

  /* Método que retorna a URL de comunicação do FrontEnd do Angular */
  public getBackEndURL(): string {
    let ssl: string = ((env.production ? CNST_BACKEND.SSL : CNST_PROXY.SSL) == true ? 's' : '');
    let port: string = (env.production ? CNST_BACKEND.PORT : CNST_PROXY.PORT);
    return 'http' + ssl + '://analytics.totvs.carol:' + port;
  }
  
  /* Método de inclusão dos cabeçalhos padrões das requisições http */
  public getDefaultHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application\/vnd.gooddata.api\+json');
    headers = headers.append('Content-type', 'application/json');
    headers = headers.append('X-PO-No-Message', 'true');
    return headers;
  }
  
  /* Método de escrita de mensagens de log para o usuário */
  public writeToLog(loglevel: any, message: string, err?: any): void {
    
    //Escrita da mensagem de log, via prompt de comando
    if (loglevel.level == CNST_LOGLEVEL.ERROR.level) {
      console.error(loglevel.tag + ' ' + message);
      if (err) console.error(err);
    }
    if (loglevel.level == CNST_LOGLEVEL.WARN.level) console.warn(loglevel.tag + ' ' + message);
    if (loglevel.level == CNST_LOGLEVEL.INFO.level) console.info(loglevel.tag + ' ' + message);
    if ((this.debug) && (loglevel.level == CNST_LOGLEVEL.DEBUG.level)) console.debug(loglevel.tag + ' ' + message);
  }
  
  /* Método de criação da popup de notificações para o usuário */
  public async createNotification(type: any, message: string, errObj?: any): Promise<void> {
    
    //Criação do objeto de popup
    let notification: PoNotification = {
       message: (errObj != null ? errObj : message)
      ,orientation: PoToasterOrientation.Top
      ,duration: 4000
    };
    
    //Renderização da popup, de acordo com o tipo de mensagem
    switch (type.level) {
      case (CNST_LOGLEVEL.ERROR.level):
        this._notificationService.error(notification);
        break;
      case (CNST_LOGLEVEL.INFO.level):
        this._notificationService.success(notification);
        break;
      case (CNST_LOGLEVEL.WARN.level):
        this._notificationService.warning(notification);
        break;
    }
  }
  
  /* Método GET do modo debug */
  get debugMode(): boolean {
    return this.debug
  }
  
  /* Método SET do modo debug */
  set debugMode(_debug: boolean) {
    this.debug = _debug;
  }
}
