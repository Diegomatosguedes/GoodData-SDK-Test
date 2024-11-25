/* Componentes padrões do Angular */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

/* Serviço de conexão ao GoodData Cloud */
import { GoodDataService } from './services/gooddata-service';

/* Componentes rxjs para controle de Promise / Observable */
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'totvs-analytics-frontend',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Nome e versão da aplicação
  private version: string = null;
  private programName: string = null;
  
  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _gooddataService: GoodDataService,
    private _router: Router,
  ) {

    //Configurações padrões da aplicação
    this.programName = 'TOTVS';
    this.version = 'test';
    
    //Inicialização do serviço de conexão do GoodData Cloud
    this._gooddataService.init().pipe(switchMap((res1: boolean) => {
      if (res1) {
        this._router.navigate(['/analytics'], { state: null });
        return of(true);
      } else {
        return of(false);
      }
    })).subscribe();
  }
}