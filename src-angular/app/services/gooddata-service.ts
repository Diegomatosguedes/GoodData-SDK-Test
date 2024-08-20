/* Componentes padrões do Angular */
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Componentes de utilitários da aplicação */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Serviço de tradução da aplicação */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';

import { Workspace } from './gooddata-interface';

import { ResponseObject } from '../utilities/sharedInterfaces/responseObject-interface';
import { ObjectPermission } from '../utilities/sharedInterfaces/objectPermission-interface';
import { WorkspacePermission } from '../utilities/sharedInterfaces/workspacePermission-interface';
import { DatasourcePermission } from '../utilities/sharedInterfaces/datasourcePermission-interface';
import { Dashboard } from '../utilities/sharedInterfaces/dashboard-interface';

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
    return this.getGDCloudWorkspaces('7f01aa48-c641-434a-b056-f2fce2302b2e').pipe(switchMap((workspaces: WorkspacePermission[]) => {
      this.GD_WORKSPACES = workspaces;

      if (this.GD_WORKSPACES.length == 1) {
        this._CURRENT_WORKSPACE = this.GD_WORKSPACES[0];
        return this.getGDCloudDashboards(this._CURRENT_WORKSPACE.workspaceId).pipe(map((dashboards: Dashboard[]) => {
          this._CURRENT_DASHBOARD = (this.GD_DASHBOARDS.length == 1 ? this.GD_DASHBOARDS[0] : null);
          return true;
        }));
      } else {
        this._CURRENT_WORKSPACE = null;
        this._CURRENT_DASHBOARD = null;
        return of(true);
      }
    }));
  }
  
  /* Método que retorna todos os workspaces de um usuário */
  public getGDCloudWorkspaces(userId: string): Observable<WorkspacePermission[]> {
    this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'workspaces que tem', null);
    let headers: HttpHeaders = this._utilities.getDefaultHeaders();

    //Consulta da API de testes do Angular
    return this._http.get<ResponseObject>(this._utilities.getBackEndURL() + '/gooddata/GetUserPermissions?userId=' + userId, { withCredentials: false, headers: headers, observe: 'response' }).pipe(
      map((res: HttpResponse<ResponseObject>) => {
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
    let headers: HttpHeaders = this._utilities.getDefaultHeaders();

    //Consulta da API de testes do Angular
    return this._http.get<ResponseObject>(this._utilities.getBackEndURL() + '/gooddata/GetDashboardData?workspaceId=' + workspaceId, { withCredentials: false, headers: headers, observe: 'response' }).pipe(
      map((res: HttpResponse<ResponseObject>) => {
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
}
