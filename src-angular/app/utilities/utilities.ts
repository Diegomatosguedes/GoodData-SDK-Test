/* Componentes padrões do Angular */
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoNotificationService,
  PoNotification,
  PoToasterOrientation
} from '@po-ui/ng-components';

/* Serviço de sessão do Agent */
import { SessionService } from '../services/session-service';

import { env } from '../../environments/environment';

/* Constantes de utilitários do Agent */
import { CNST_LOGLEVEL, CNST_SYSTEMLEVEL, CNST_LOCALHOST_PORT } from './utilities-constants';

@Injectable({
  providedIn: 'root'
})
export class Utilities {
  
  //Define se o modo debug está ativado, ou não (via serviço de configuração)
  private debug: boolean = false;

  public CNST_LOADING_URL: string = '../../../resources/loading.gif';

  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _sessionService: SessionService,
    private _notificationService: PoNotificationService
  ) { this.debug = !env.production; }

  /* Método que retorna a URL de comunicação com a API do Angular (Apenas em modo desenv.) */
  public getLocalhostURL(): string {
    return 'https://analytics.totvs.carol:' + CNST_LOCALHOST_PORT;
  }
  
  /* Método de inclusão dos cabeçalhos padrões das requisições http */
  public getDefaultHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Content-type', 'application/json');
    headers = headers.append('X-PO-No-Message', 'true');
    return headers;
  }
  
  /* Método de inclusão dos cabeçalhos de autenticação da plataforma GoodData */
  public addGoodDataHeaders(headers: HttpHeaders): HttpHeaders {
    let token: string = 'MmUzZTNlZmItMjdkMC00NDNlLWE3ZjItZTUzMmFjOTZmMWRiOkdEQ2xvdWRfVG9rZW46VGpKVERUQUQrbE55Zi9zRHFwQ3dLY3g1eWN0S3NXU2s=';
    headers = headers.append('Authorization', 'Bearer ' + token);
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
