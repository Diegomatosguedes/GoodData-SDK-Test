/* Componentes padrões do Angular */
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

/* Componentes de utilitários da aplicação */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Serviço de tradução da aplicação */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';
import { CustomTranslationLoader } from '../services/translation/custom-translation-loader';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //URL final do iframe para embedar o GoodData Cloud
  protected dynamicsrc = null;

  //Opções de configuração do iframe
  private CNST_IFRAME_OPTIONS: string = '';

  /****** Portinari.UI ******/
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };
  
  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _translateService: TranslationService,
    private _utilities: Utilities,
    public _sanitizationService: DomSanitizer
  ) {
  }
}
