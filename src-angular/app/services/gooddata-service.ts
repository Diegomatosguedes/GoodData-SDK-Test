/* Componentes padrões do Angular */
import { Injectable } from '@angular/core';

/* Interface de dashboard da aplicação */
import { Dashboard } from '../utilities/sharedInterfaces/dashboard-interface';

/* Interface de permissões do ambiente do GoodData Cloud */
import { Workspace } from '../utilities/sharedInterfaces/workspace-interface';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoodDataService {
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Define o ambiente / dashboard atualmente selecionado pelo usuário
  public _CURRENT_WORKSPACE: Workspace = null;
  public _CURRENT_DASHBOARD: Dashboard = null;

  /**************************/
  /*** MÉTODOS DO SERVIÇO ***/
  /**************************/
  constructor() {}

  /***************************/
  /*      Inicialização      */
  /***************************/
  /* Método de inicialização do serviço de comunicação com o GoodData Cloud */
  public init(): Observable<boolean> {

    this._CURRENT_WORKSPACE = new Workspace('0047ab24-4a94-41d1-a093-7bcd7e5b385a', 'my workspace');
    this._CURRENT_DASHBOARD = new Dashboard('97edd462-9858-42c7-9c8d-f52244e33479', 'my dashboard');
    return of(true);
  }
}