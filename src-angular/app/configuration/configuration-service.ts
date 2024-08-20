/* Componentes padrões do Angular */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/* Componentes de utilitários da aplicação */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Serviço de tradução da aplicação */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';

/* Serviço compartilhado de comunicação com o menu principal da aplicação */
import { MenuService } from '../services/menu-service';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Comunicação http com a API de testes (Angular).
  private _http: HttpClient;
  
  /**************************/
  /*** MÉTODOS DO SERVIÇO ***/
  /**************************/
  constructor(
    private http: HttpClient,
    private _utilities: Utilities,
    private _translateService: TranslationService,
    private _menuService: MenuService
  ) {
    this._http = http;
  }
}
