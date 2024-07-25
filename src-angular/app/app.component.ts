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

/* Serviço de comunicação com o Electron */
import { ElectronService } from './core/services';

/* Serviço de consulta do acesso remoto (MirrorMode) */
import { MirrorService } from './services/mirror-service';

/* Serviço de configuração do Agent */
import { ConfigurationService } from './configuration/configuration-service';
import { Configuration } from './configuration/configuration-interface';

/* Serviço de tradução do Agent */
import { TranslationService } from './services/translation/translation-service';
import { TranslationInput } from './services/translation/translation-interface';

/* Serviço compartilhado de comunicação com o menu principal do Agent */
import { MenuService } from './services/menu-service';

/* Componentes rxjs para controle de Promise / Observable */
import { switchMap } from 'rxjs/operators';

/* Constantes do Agent */
import { CNST_PROGRAM_NAME, CNST_PROGRAM_VERSION } from './app-constants';

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
    private _electronService: ElectronService,
    private _mirrorService: MirrorService,
    private _translateService: TranslationService,
    private _configurationService: ConfigurationService,
    private _menuService: MenuService,
    private _utilities: Utilities,
    private _ngZone: NgZone,
    private _router: Router
  ) {
    
    //Configurações padrões do Agent
    this.programName = CNST_PROGRAM_NAME.SIMPLE;
    this._translateService.init().subscribe();
    
    //Carrega as configurações atuais do Agent, caso existam
    //this._configurationService.getConfiguration(false).subscribe((conf: Configuration) => {
      this._translateService.use('pt.BR').subscribe((b: boolean) => {
        
        this.version = CNST_PROGRAM_VERSION.DEVELOPMENT;
        
        //Traduz os textos do menu principal do Agent, e vincula o serviço de comunicação do menu
        this.setMenuTranslations('teste');
        this._menuService.menuRefObs$.subscribe(() => {
          this.setMenuTranslations('teste');
        });
      });
    //});
  }
  
  /* Método de tradução dos textos do menu principal do Agent */
  public setMenuTranslations(serialNumber: string): void {
    
    //Tradução das opções do menu principal do Agent, caso a instalação já tenha sido validada
    if (serialNumber != null) {
      this.menus = [
        {
          label: this._translateService.CNST_TRANSLATIONS['MENU.WORKSPACES'], icon: 'po-icon-chart-columns', link: './workspace'
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