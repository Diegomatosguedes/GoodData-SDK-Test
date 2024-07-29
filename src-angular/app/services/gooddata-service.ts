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
export class GoodDataService {
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Comunicação http com a API.
  private _http: HttpClient = null;
  private CNST_GDCLOUD_HOST: string = 'https://bossy-fly.trial.cloud.gooddata.com';
  private CNST_IFRAME_OPTIONS: string = 'showNavigation=true&setHeight=700';
  private apiToken: string = null;

  private homepageWorkspace: string = null;
  private homepageDashboard: string = null;

  private _CURRENT_WORKSPACE: any = null;
  private _CURRENT_DASHBOARD: any = null;

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
    headers = headers.append('Accept', 'application\/vnd.gooddata.api\+json');
    headers = headers.append('Content-type', 'application/json');
    if (!env.production) {
      headers = headers.append('Authorization', 'Bearer ' + env.GDCloud.apiToken);
    } else {
      headers = headers.append('Authorization', 'Bearer ' + this.getAPIToken());
    }

    return headers;
  }

  /* Método que retorna a URL de comunicação com a API do Angular (Apenas em modo desenv.) */
  public getGDCloudURL(): string {

    //////////////////////////////////////////////////////////////////////////////

    return (!env.production ? this.CNST_GDCLOUD_HOST : this._utilities.getLocalhostURL() + '/gooddata') + '/api/v1/';
  }

  public getGDCloudWorkspaceData(ws: string): Observable<any> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'pegando dados do gooddata cloud', null);
    let headers: HttpHeaders = this.getDefaultHeaders();

    //Consulta da API de testes do Angular
    return this._http.get<any>(this.getGDCloudURL() + 'layout/workspaces/' + ws, { withCredentials: false, headers: headers, observe: 'response' }).pipe(
      map((configuration: any) => {
        this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'dados GD Pegos', null);
        console.log(configuration);
      })
    );
  }

  public getGDCloudWorkspaces(): Observable<any> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'workspaces que tem', null);
    let headers: HttpHeaders = this.getDefaultHeaders();

    //Consulta da API de testes do Angular
    return this._http.get<any>(this.getGDCloudURL() + 'entities/workspaces', { withCredentials: false, headers: headers, observe: 'response' }).pipe(
      map((workspaces: any) => {
        this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'essas sao as workspaces', null);
        //console.log(workspaces);
        return workspaces.body.data;
      })
    );
  }

  public getGDCloudDashboards(ws: string): Observable<any> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'dashboards que tem', null);
    let headers: HttpHeaders = this.getDefaultHeaders();

    //Consulta da API de testes do Angular
    return this._http.get<any>(this.getGDCloudURL() + 'entities/workspaces/' + ws + '/analyticalDashboards', { withCredentials: false, headers: headers, observe: 'response' }).pipe(
      map((dashboards: any) => {
        this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'essas sao os dashbesss', null);
        //console.log(dashboards);
        return dashboards.body.data;
      })
    );
  }

  public getGDCloudEmbedURL(): Observable<any> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'pegando url embed default', null);
    let headers: HttpHeaders = this.getDefaultHeaders();


    return this.getGDCloudWorkspaces().pipe(switchMap((workspaces: any) => {

      //
      workspaces.map((ws: any) => {
        if (ws.id == this.getHomepageWorkspace()) this._CURRENT_WORKSPACE = ws;
      });
      if (this._CURRENT_WORKSPACE == null) this._CURRENT_WORKSPACE = workspaces[0];

      //
      return this.getGDCloudDashboards(this._CURRENT_WORKSPACE.id).pipe(map((dashboards: any) => {

        //
        dashboards.map((dashboard: any) => {
          if (dashboard.id == this.getHomepageDashboard()) this._CURRENT_DASHBOARD = dashboard;
        });
        if (this._CURRENT_DASHBOARD == null) this._CURRENT_DASHBOARD = dashboards[0];

        return this.CNST_GDCLOUD_HOST + '/dashboards/embedded/#/workspace/' + this._CURRENT_WORKSPACE.id + '/dashboard/' + this._CURRENT_DASHBOARD.id + '?' + this.CNST_IFRAME_OPTIONS;
      }));
    }));
  }

  public getAPIToken(): string {
    return this.apiToken;
  }

  public setAPIToken(token: string): void {
    this.apiToken = token;
  }

  public getHomepageWorkspace(): string {
    return this.homepageWorkspace;
  }

  public setHomepageWorkspace(workspace: string): void {
    this.homepageWorkspace = workspace;
  }

  public getHomepageDashboard(): string {
    return this.homepageDashboard;
  }

  public setHomepageDashboard(dashboard: string): void {
    this.homepageDashboard = dashboard;
  }
}
