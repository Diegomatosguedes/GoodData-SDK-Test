/* Componentes padrões do Angular */
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

/* Componentes de utilitários da aplicação */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';
import { CNST_TIMEZONES } from '../services/timezones';

/* Serviço de configuração da aplicação */
import { ConfigurationService } from './configuration-service';

/* Serviço de tradução da aplicação */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';
import { CustomTranslationLoader } from '../services/translation/custom-translation-loader';

/* Serviço compartilhado de comunicação com o menu principal do Agent */
import { MenuService } from '../services/menu-service';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, from, of } from 'rxjs';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Variável de suporte, para mostrar ao usuário os campos obrigatórios não preenchidos.
  protected CNST_FIELD_NAMES: Array<any> = [];

  //Variável de suporte, para mostrar ao usuário os fusos horários disponíveis
  protected _CNST_TIMEZONES: Array<any> = [];

  //Variável de suporte, que armazena o idioma escolhido pelo usuário
  protected locale: string = null;

  /****** Portinari.UI ******/
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };

  //Idiomas disponíveis na aplicação
  protected CNST_LANGUAGES: Array<any> = [];

  /****** Formulários *******/
  //Títulos
  protected lbl_title: string = null;

  //Campos
  protected lbl_apply: string = null;
  protected lbl_locale: string = null;
  protected lbl_timezone: string = null;

  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _translateService: TranslationService,
    private _customTranslationLoader: CustomTranslationLoader,
    private _menuService: MenuService,
    private _utilities: Utilities,
    private _router: Router
  ) { }

  /* Método de inicialização do componente */
  public ngOnInit(): void {

    /*
      Definição dos fusos horários disponíveis
      
      Isso tem que rodar só 1x, no init do Angular,
      porque o PO.UI é louco.
    */
    this.locale = navigator.language;
    this._CNST_TIMEZONES = CNST_TIMEZONES.sort().map((timezone: string) => {
      return { label: timezone, value: timezone };
    });

    this.reloadConfiguration();
  }

  /* Método de recarga do componente de Configuração da aplicação */
  protected reloadConfiguration(): void {

    //Consulta das traduções
    this._translateService.updateStandardTranslations().subscribe(() => {
      this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.WAIT'] };

      //Tradução dos títulos
      this.lbl_title = this._translateService.CNST_TRANSLATIONS['CONFIGURATION.TITLE'];

      //Tradução dos campos de formulário
      this.lbl_locale = this._translateService.CNST_TRANSLATIONS['LANGUAGES.TITLE'];
      this.lbl_timezone = this._translateService.CNST_TRANSLATIONS['CONFIGURATION.FIELDS.TIMEZONE'];
      this.lbl_apply = this._translateService.CNST_TRANSLATIONS['BUTTONS.APPLY'];

      //Definição dos idiomas suportados pela aplicação
      this.CNST_LANGUAGES = this._customTranslationLoader.getAvailableLanguages().map((locale: string) => ({
        label: this._translateService.CNST_TRANSLATIONS['LANGUAGES.' + locale],
        icon: 'ph ph-user',
        action: (locale: any) => this.locale = locale.value,
        selected: (locale == this.locale),
        value: locale
      }));

      this.po_lo_text = { value: null };
    }, (err: any) => {
      this._utilities.createNotification(CNST_LOGLEVEL.ERROR, this._translateService.CNST_TRANSLATIONS['CONFIGURATION.MESSAGES.LOADING_ERROR'], err);
      this.po_lo_text = { value: null };
      throw err;
    });
  }

  /* Método de publicação das configurações atualizadas */
  public setConfiguration(): void {
    this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.WAIT'] };
    this._translateService.use(this.locale).subscribe((res: boolean) => {
      this._menuService.updateMenu();
      this.reloadConfiguration();

      if (res) this._utilities.createNotification(CNST_LOGLEVEL.INFO, this._translateService.CNST_TRANSLATIONS['CONFIGURATION.MESSAGES.SAVE_OK'], null);
      else this._utilities.createNotification(CNST_LOGLEVEL.ERROR, this._translateService.CNST_TRANSLATIONS['CONFIGURATION.MESSAGES.SAVE_ERROR'], null);
      this.po_lo_text = { value: null };
      return res;
    });
  }
}