/* Componentes padrões do Angular */
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

/* Constantes da aplicação */
import { CNST_GOODDATA_HOST } from '../app-constants';

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
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css']
})
export class AnalyzeComponent {

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
    private _gooddataService: GoodDataService,
    private _utilities: Utilities,
    public _sanitizationService: DomSanitizer
  ) {
    this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.LOADING_ANALYZE'] };
    this.setIFrameURL(CNST_GOODDATA_HOST + '/analyze/embedded/#/' + this._gooddataService._CURRENT_WORKSPACE.workspaceId + '/reportId/edit');
    
    //Registra um listener de eventos para tratar as mensagens enviadas pelo iframe, para a aplicação
    window.addEventListener('message', this.listenerFunction, false);
  }

  /* Método de suporte. Contém a lógica para tratar as mensagens PostMessage recebidas pelo iframe */
  public listenerFunction = (message: any) => {
    let event: any = message.data.gdc.event;
    if (event != undefined) {
      switch (event.name) {
        case ('availableCommands'):
          this.po_lo_text = { value: null };
          break;
      }
    }
  }

  /* Método de configuração da URL do iframe */
  public setIFrameURL(url: string) {
    this.dynamicsrc = this._sanitizationService.bypassSecurityTrustResourceUrl(url);
  }
}
