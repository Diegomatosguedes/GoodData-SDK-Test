/* Componentes padrões do Angular */
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

/* Componentes de utilitários do Agent */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';

/* Componentes de utilitários do Agent */
import { GoodDataService } from '../services/gooddata-service';

/* Componentes de utilitários do Agent */
import { CarolService } from '../services/carol-service';

import { CNST_GOODDATA_APITOKEN } from '../app-constants';

/* Serviço de tradução do Agent */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';
import { CustomTranslationLoader } from '../services/translation/custom-translation-loader';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-embed',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.css']
})
export class EmbedComponent implements OnInit {
  
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  protected dynamicsrc = null;

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
    private _router: Router
  ) {}
  
  /* Método de inicialização do componente */
  public ngOnInit(): void {

    //Tradução dos títulos
    this.lbl_title = this._translateService.CNST_TRANSLATIONS['CONFIGURATION.TITLE'];

    this.setIFrameURL(this._utilities.CNST_LOADING_URL);

    this._gooddataService.getGDCloudEmbedURL().subscribe((url: string) => {
      this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'URL Final:', null);
      console.log(url);
      this.setIFrameURL(url);
    });
  }

  public setIFrameURL(url: string) {
    this.dynamicsrc = this._sanitizationService.bypassSecurityTrustResourceUrl(url);
  }
}
