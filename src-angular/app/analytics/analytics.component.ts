/* Componentes padrões do Angular */
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

/* Constantes da aplicação */
import {
  CNST_GOODDATA_HOST,
  CNST_LOADING_URL
} from '../app-constants';

/* Componentes de utilitários da aplicação */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Serviços de conexão ao GoodData */
import { GoodDataService } from '../services/gooddata-service';

/* Serviço de tradução da aplicação */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';
import { CustomTranslationLoader } from '../services/translation/custom-translation-loader';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {

  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //URL final do iframe para embedar o GoodData Cloud
  protected dynamicsrc = null;

  //Opções de configuração do iframe
  private CNST_IFRAME_OPTIONS: string = 'showNavigation=false';

  /****** Portinari.UI ******/
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };

  /****** Formulários *******/
  //Títulos
  protected lbl_title: string = null;

  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _translateService: TranslationService,
    private _gooddataService: GoodDataService,
    public _sanitizationService: DomSanitizer,
    private _utilities: Utilities,
    private _router: Router
  ) {
    this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.LOADING_DASHBOARD'] };

    //Tradução dos títulos
    this.lbl_title = this._translateService.CNST_TRANSLATIONS['CONFIGURATION.TITLE'];

    //Definição da URL a ser carregada inicialmente no iframe
    let nav: Navigation = this._router.getCurrentNavigation();
    if ((nav != undefined) && (nav.extras.state)) this.setIFrameURL(nav.extras.state.dashboard.dashboardId);
    else this.setIFrameURL(CNST_LOADING_URL);

    this._router.events.subscribe(res => {
      this.setIFrameURL(CNST_LOADING_URL);
    });

    //Registra um listener de eventos para tratar as mensagens enviadas pelo iframe, para a aplicação
    window.addEventListener('message', this.listenerFunction, false);
  }

  /* Método de suporte. Contém a lógica para tratar as mensagens PostMessage recebidas pelo iframe */
  public listenerFunction = (message: any) => {
    let event: any = message.data.gdc.event;
    if (event != undefined) {
      switch (event.name) {
        case ('loadingStarted'):
          this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.LOADING_DASHBOARD'] };
          break;
        case ('availableCommands'):
          this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.RESIZING'] };
          break;
        case ('loaded'):
          this.po_lo_text = { value: null };
          break;
      }
    }
  }

  /*
    Método executado ao sair do componente.
    Remove o listener das mensagens PostMessage do GoodData Cloud
  */
  public ngOnDestroy(): void {
    window.removeEventListener('message', this.listenerFunction);
  }

  /* Método de configuração da URL do iframe */
  public setIFrameURL(url: string) {
    this.dynamicsrc = this._sanitizationService.bypassSecurityTrustResourceUrl(
      CNST_GOODDATA_HOST + '/dashboards/embedded/#/workspace/' + this._gooddataService._CURRENT_WORKSPACE.workspaceId + '/dashboard/' + this._gooddataService._CURRENT_DASHBOARD.dashboardId + '?' + this.CNST_IFRAME_OPTIONS
    );
  }
}
