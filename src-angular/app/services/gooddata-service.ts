/* Componentes padrões do Angular */
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Componentes de utilitários do Agent */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Serviço de tradução do Agent */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';

import { Workspace } from './gooddata-interface';

import { ResponseObject } from '../utilities/sharedInterfaces/responseObject-interface';
import { ObjectPermission } from '../utilities/sharedInterfaces/objectPermission-interface';
import { WorkspacePermission } from '../utilities/sharedInterfaces/workspacePermission-interface';
import { DatasourcePermission } from '../utilities/sharedInterfaces/datasourcePermission-interface';
import { Dashboard } from '../utilities/sharedInterfaces/dashboard-interface';

import { env } from '../../environments/environment';

import {
  CNST_GOODDATA_HOST,
  CNST_GOODDATA_API_VERSION
} from '../app-constants';

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
  //Client de comunicação https com a API do BackEnd.
  private _http: HttpClient = null;

  //Registro dos ambientes de GoodData disponíveis para o usuário
  public GD_WORKSPACES: WorkspacePermission[] = [];

  //Registro dos dashboards disponíveis para o ambiente atual
  public GD_DASHBOARDS: Dashboard[] = [];

  //Define o ambiente / dashboard atualmente selecionado pelo usuário
  public _CURRENT_WORKSPACE: WorkspacePermission = null;
  public _CURRENT_DASHBOARD: Dashboard = null;

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
  
  /* Método de inicialização do serviço de comunicação com o GoodData */
  public init(): Observable<boolean> {
    return this.getGDCloudWorkspaces('7f01aa48-c641-434a-b056-f2fce2302b2e').pipe(map((workspaces: WorkspacePermission[]) => {
      this.GD_WORKSPACES = workspaces;
      this._CURRENT_WORKSPACE = this.GD_WORKSPACES[0];
      this._CURRENT_DASHBOARD = null;

      return true;
    }));
  }

  /* Método que retorna a URL de comunicação com a API do Angular (Apenas em modo desenv.) */
  public getGDCloudURL(): string {
    return (env.production ? CNST_GOODDATA_HOST + '/api/' + CNST_GOODDATA_API_VERSION + '/' : this._utilities.getLocalhostURL() + '/gooddata');
  }

  /* Método de inclusão dos cabeçalhos padrões das requisições https */
  public getDefaultHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application\/vnd.gooddata.api\+json');
    headers = headers.append('Content-type', 'application/json');
    if (!env.production) {
      headers = headers.append('Authorization', 'Bearer ' + env.GDCloud.apiToken);
    } else {
      //headers = headers.append('Authorization', 'Bearer ' + this.getAPIToken());
    }

    return headers;
  }

  /* Método que retorna todos os workspaces de um usuário */
  public getGDCloudWorkspaces(userId: string): Observable<WorkspacePermission[]> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'workspaces que tem', null);
    let headers: HttpHeaders = this.getDefaultHeaders();

    //Consulta da API de testes do Angular
    return this._http.get<ResponseObject>(this.getGDCloudURL() + '/GetUserPermissions?userId=' + userId, { withCredentials: false, headers: headers, observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status == 200) {
          this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'essas sao as workspaces', null);
          let obj: ObjectPermission = new ObjectPermission(res.body.value);
          return obj.workspaces;
        } else {
          return null;
        }
      })
    );
  }

  /* Método que retorna todos os dashboards presentes em um workspace */
  public getGDCloudDashboards(workspaceId: string): Observable<Dashboard[]> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'dashboards que tem', null);
    let headers: HttpHeaders = this.getDefaultHeaders();

    //Consulta da API de testes do Angular
    return this._http.get<ResponseObject>(this.getGDCloudURL() + '/GetDashboardData?workspaceId=' + workspaceId, { withCredentials: false, headers: headers, observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status == 200) {
          this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'essas sao os dashbesss', null);
          this.GD_DASHBOARDS = res.body.value.map((ds: any) => new Dashboard(ds));
          return this.GD_DASHBOARDS;
        } else {
          return null;
        }
      })
    );
  }

  /* Método que define o workspace atualmente selecionado pelo usuário */
  public setCurrentWorkspace(id: string): Observable<boolean> {
    this._CURRENT_WORKSPACE = this.GD_WORKSPACES.find((ws: WorkspacePermission) => (ws.workspaceId == id));
    if (this._CURRENT_WORKSPACE != null) {
      return this.getGDCloudDashboards(this._CURRENT_WORKSPACE.workspaceId).pipe(map((dashboards: Dashboard[]) => {
        this.GD_DASHBOARDS = dashboards;
        this._CURRENT_DASHBOARD = dashboards[0];
        return true;
      }));
    }
    else return of(false);
  }

  /* Método que define o dashboard atualmente selecionado pelo usuário */
  public setCurrentDashboard(dashboardId: string): Observable<boolean> {
    this._CURRENT_DASHBOARD = this.GD_DASHBOARDS.find((ds: Dashboard) => (ds.dashboardId == dashboardId));
    return of((this._CURRENT_DASHBOARD != null ? true : false));
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
}
