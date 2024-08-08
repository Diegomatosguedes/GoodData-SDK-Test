/* Componentes padrões do Angular */
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, Navigation, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

/* Componentes de utilitários do Agent */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Componentes de utilitários do Agent */
import { GoodDataService } from '../services/gooddata-service';

/* Componentes de utilitários do Agent */
import { CarolService } from '../services/carol-service';

import { CNST_GOODDATA_APITOKEN, CNST_GOODDATA_HOST } from '../app-constants';

/* Serviço de tradução do Agent */
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
    private _customTranslationLoader: CustomTranslationLoader,
    private _gooddataService: GoodDataService,
    private _carolService: CarolService,
    public _sanitizationService: DomSanitizer,
    private _utilities: Utilities,
    private _router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MIRROR_MODE.MESSAGES.WAIT'] };

    //Tradução dos títulos
    this.lbl_title = this._translateService.CNST_TRANSLATIONS['CONFIGURATION.TITLE'];

    //Definição do título da página
    let nav: Navigation = this._router.getCurrentNavigation();
    if ((nav != undefined) && (nav.extras.state)) this.setIFrameURL(nav.extras.state.dashboard.dashboardId);
    else this.setIFrameURL(this._utilities.CNST_LOADING_URL);

    this._router.events.subscribe(res => {
      this.setIFrameURL(this._utilities.CNST_LOADING_URL);
    })

    this.po_lo_text = { value: null };
  }
  
  public setIFrameURL(url: string) {
    this.dynamicsrc = this._sanitizationService.bypassSecurityTrustResourceUrl(
      CNST_GOODDATA_HOST + '/dashboards/embedded/#/workspace/' + this._gooddataService._CURRENT_WORKSPACE.workspaceId + '/dashboard/' + this._gooddataService._CURRENT_DASHBOARD.dashboardId + '?' + this.CNST_IFRAME_OPTIONS
    );
  }
}
