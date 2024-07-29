/* Componentes padrões do Angular */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Componentes de utilitários do Agent */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Serviço de tradução do Agent */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';

import { env } from '../../environments/environment';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarolService {
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Comunicação http com a API.
  private _http: HttpClient = null;
  private tenant: string = null;

  /**************************/
  /*** MÉTODOS DO SERVIÇO ***/
  /**************************/
  constructor(
    private http: HttpClient,
    private _utilities: Utilities,
    private _translateService: TranslationService
  ) {
    this._http = http;
  }

  /* Método de inclusão dos cabeçalhos padrões das requisições http */
  public getDefaultHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append('Content-type', 'application/json');

    //////////////////////////////////////////////////////////////////////////////
    //if (!env.production) {
      headers = headers.append('X-Auth-Key', env.TOTVSCarol.authToken);
      headers = headers.append('X-Auth-ConnectorId', env.TOTVSCarol.connectorId);
    //}

    return headers;
  }

  /* Método que retorna a URL de comunicação com a API do Angular (Apenas em modo desenv.) */
  public getTOTVSCarolURL(): string {
    return (env.production ? 'https://totvstechfindev.carol.ai' : this._utilities.getLocalhostURL() + '/carol') + '/api/v1/';
  }

  public getCarolCurrentTenantId(): Observable<string> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'pegando tenant atual da carol', null);
    let headers: HttpHeaders = this.getDefaultHeaders();

    if (!env.production) return of(env.TOTVSCarol.tenantId);
    else if (this.getCurrentTenant() != null) return of(this.getCurrentTenant());
    else return this._http.get<any>(this.getTOTVSCarolURL() + 'users/current', { withCredentials: true, headers: headers, observe: 'response' }).pipe(
      map((carol: any) => {
        this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'tenant atual e esse ak', null);
        this.setCurrentTenant(carol.mdmAssignedTenantId);
        return carol.mdmAssignedTenantId;
      })
    );
  }

  public getCarolAppSettings(): Observable<any> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'Config do tenant da carol', null);
    let headers: HttpHeaders = this.getDefaultHeaders();

    return this.getCarolCurrentTenantId().pipe(switchMap((tenantId: string) => {
      return this._http.get<any>(this.getTOTVSCarolURL() + 'tenantApps/' + tenantId + '/settings', { withCredentials: true, headers: headers, observe: 'response' }).pipe(
        map((carol: any) => {
          this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'funcionou a chamada do tenatn carol', null);
          return carol.body.mdmTenantAppSettingValues.map((settings: any) => {
            return {
              name: settings.mdmName,
              value: settings.mdmParameterValue
            };
          });
        })
      );
    }));
  }

  public getCurrentTenant(): string {
    return this.tenant;
  }

  public setCurrentTenant(tenant: string): void {
    this.tenant = tenant;
  }
}
