/* Componentes padrões do Angular */
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/* Constantes da aplicação */
import { CNST_GOODDATA_HOST } from '../app-constants';

/* Serviços de conexão ao GoodData */
import { GoodDataService } from '../services/gooddata-service';

/* Serviço de tradução da aplicação */
import { TranslationService } from '../services/translation/translation-service';

@Component({
  selector: 'app-datamodel',
  templateUrl: './datamodel.component.html',
  styleUrls: ['./datamodel.component.css']
})
export class DataModelComponent {

  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //URL final do iframe para embedar o GoodData Cloud
  protected dynamicsrc = null;
  
  /****** Portinari.UI ******/
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };
  
  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _translateService: TranslationService,
    private _gooddataService: GoodDataService,
    public _sanitizationService: DomSanitizer
  ) {
    this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.LOADING_MODEL'] };
    this.setIFrameURL(CNST_GOODDATA_HOST + '/modeler/#/' + this._gooddataService._CURRENT_WORKSPACE.workspaceId);

    //Registra um listener de eventos para tratar as mensagens enviadas pelo iframe, para a aplicação
    //Usando setTimeout como paliativo, porque o editor de métricas não suporta eventos hoje.
    //window.addEventListener('message', this.listenerFunction, false);
    setTimeout(() => {
      this.po_lo_text = { value: null };
    }, 5000);
  }

  /* Método de suporte. Contém a lógica para tratar as mensagens PostMessage recebidas pelo iframe */
  public listenerFunction = (message: any) => {
    let event: any = message.data.gdc.event;
    if (event != undefined) {
      switch (event.name) {
        case ('availableCommands'):
          this.po_lo_text = { value: null };
          break;
        case ('resized'):
          this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.RESIZING'] };
          break;
        default:
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
