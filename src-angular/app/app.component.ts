/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* Componentes padrões do Angular */
import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoMenuItem,
  PoModalComponent
} from '@po-ui/ng-components';

/* Componentes de utilitários do Agent */
import { Utilities } from './utilities/utilities';
import { CNST_LOGLEVEL } from './utilities/utilities-constants';

/* Componentes de utilitários do Agent */
import { GoodDataService } from './services/gooddata-service';

/* Componentes de utilitários do Agent */
import { CarolService } from './services/carol-service';

/* Serviço de configuração do Agent */
import { ConfigurationService } from './configuration/configuration-service';
import { Configuration } from './configuration/configuration-interface';

/* Serviço de tradução do Agent */
import { TranslationService } from './services/translation/translation-service';
import { TranslationInput } from './services/translation/translation-interface';

/* Serviço compartilhado de comunicação com o menu principal do Agent */
import { MenuService } from './services/menu-service';

/* Componentes rxjs para controle de Promise / Observable */
import { switchMap, map } from 'rxjs/operators';

/* Constantes do Agent */
import { CNST_PROGRAM_NAME, CNST_PROGRAM_VERSION } from './app-constants';

import {
  CNST_GOODDATA_APITOKEN,
  CNST_GOODDATA_HOMEPAGE_DASHBOARD,
  CNST_GOODDATA_HOMEPAGE_WORKSPACE
} from './app-constants';

@Component({
  selector: 'totvs-agent-analytics',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  private version: string = null;
  private programName: string = null;
  protected menus: PoMenuItem[] = [];
  
  /****** Portinari.UI ******/
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };
  
  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _carolService: CarolService,
    private _gooddataService: GoodDataService,
    private _translateService: TranslationService,
    private _configurationService: ConfigurationService,
    private _menuService: MenuService,
    private _utilities: Utilities,
    private _ngZone: NgZone,
    private _router: Router
  ) {
    
    //Configurações padrões do Agent
    this.programName = CNST_PROGRAM_NAME.SIMPLE;
    this._translateService.init().pipe(switchMap(() => {
      return this._translateService.use('pt.BR').pipe(switchMap((b: boolean) => {
        this.version = CNST_PROGRAM_VERSION.DEVELOPMENT;

        //Traduz os textos do menu principal do Agent, e vincula o serviço de comunicação do menu
        this.setMenuTranslations('teste');
        //return this._menuService.menuRefObs$.pipe(switchMap(() => {
          //this.setMenuTranslations('teste');

          //
          return this._carolService.getCarolAppSettings().pipe(map((settings: any) => {
            this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'Carol app setings', null);

            settings.map((setting: any) => {
              switch (setting.name) {
                case CNST_GOODDATA_APITOKEN:
                  this._gooddataService.setAPIToken(setting.value);
                  break;
                case CNST_GOODDATA_HOMEPAGE_WORKSPACE:
                  this._gooddataService.setHomepageWorkspace(setting.value);
                  break;
                case CNST_GOODDATA_HOMEPAGE_DASHBOARD:
                  this._gooddataService.setHomepageDashboard(setting.value);
                  break;
              }
            });
          //}));
        }));
      }));
    })).subscribe();
  }
  
  /* Método de tradução dos textos do menu principal do Agent */
  public setMenuTranslations(serialNumber: string): void {
    
    //Tradução das opções do menu principal do Agent, caso a instalação já tenha sido validada
    if (serialNumber != null) {
      this.menus = [
        {
          label: this._translateService.CNST_TRANSLATIONS['MENU.WORKSPACES'], icon: 'po-icon-chart-columns', link: './embed'
        }, {
          label: this._translateService.CNST_TRANSLATIONS['MENU.DATABASES'], icon: 'po-icon-database', link: './database'
        }, {
          label: this._translateService.CNST_TRANSLATIONS['MENU.SCHEDULES'], icon: 'po-icon-clock', link: './schedule'
        }, {
          label: this._translateService.CNST_TRANSLATIONS['MENU.QUERIES'], icon: 'po-icon-filter', link: './query'
        }, {
          label: this._translateService.CNST_TRANSLATIONS['MENU.SCRIPTS'], icon: 'po-icon-filter', link: './script'
        }, {
          label: this._translateService.CNST_TRANSLATIONS['MENU.MONITOR'], icon: 'po-icon-device-desktop', link: './monitor'
        }, {
          label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION'],
          icon: 'po-icon-settings',
          link: './configuration'
        }
      ];

      //Opção de fechamento do Agent no menu.
      this.menus.push({
        label: this._translateService.CNST_TRANSLATIONS['MENU.EXIT'],
        icon: 'po-icon-exit',
        action: () => {
          
        }
      });
      
    //Tradução do menu do Agent, caso a instalação não tenha sido validada
    } else {
      this.menus = [
        {
          label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION'],
          icon: 'po-icon-settings',
          link: './configuration'
        },{
          label: this._translateService.CNST_TRANSLATIONS['MENU.ACTIVATION'],
          icon: 'po-icon-handshake',
          action: () => {
            
          }
        }
      ];

      //Opção de fechamento do Agent no menu.
      this.menus.push({
        label: this._translateService.CNST_TRANSLATIONS['MENU.EXIT'],
        icon: 'po-icon-exit',
        action: () => {
        }
      });
    }
  }
}