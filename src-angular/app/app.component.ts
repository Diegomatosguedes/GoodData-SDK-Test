/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* Componentes padrões do Angular */
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { HeaderOptionsInterface } from '@totvs-apps-components/header';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoMenuItem,
  PoModalComponent,
  PoMenuComponent,
  PoLanguageService
} from '@po-ui/ng-components';

import { env } from '../environments/environment';

/* Componentes de utilitários da aplicação */
import { Utilities } from './utilities/utilities';
import { CNST_LOGLEVEL } from './utilities/utilities-constants';
import { WorkspacePermission } from './utilities/sharedInterfaces/workspacePermission-interface';
import { Dashboard } from './utilities/sharedInterfaces/dashboard-interface';

/* Serviços de conexão ao GoodData / Carol */
import { GoodDataService } from './services/gooddata-service';
import { CarolService } from './services/carol-service';

/* Serviço de tradução da aplicação */
import { TranslationService } from './services/translation/translation-service';
import { TranslationInput } from './services/translation/translation-interface';

/* Serviço compartilhado de comunicação com o menu principal da aplicação */
import { MenuService } from './services/menu-service';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, of, catchError } from 'rxjs';

/* Constantes da aplicação */
import {
  CNST_PROGRAM_NAME,
  CNST_PROGRAM_VERSION,
  CNST_GOODDATA_APITOKEN,
  CNST_GOODDATA_HOMEPAGE_DASHBOARD,
  CNST_GOODDATA_HOMEPAGE_WORKSPACE
} from './app-constants';

@Component({
  selector: 'totvs-carol-analytics',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Nome e versão da aplicação
  private version: string = null;
  private programName: string = null;

  //Componente que armazena todas as opções de menu disponíveis
  protected menus: PoMenuItem[] = [];

  //Armazena a label e o nome do ambiente de GoodData selecionado pelo usuário, no cabeçalho do menu
  protected environmentLabel: string = null;
  protected environment: string = null;

  /****** Portinari.UI ******/
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };

  @ViewChild(PoMenuComponent, { static: true }) menu: PoMenuComponent;

  public headerConfig: HeaderOptionsInterface = {
    appName: env.appCodeDevMode,
    logoAppLink: '/',
    enableAppSettings: true,
    enableNotifications: true
  };

  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _carolService: CarolService,
    private _gooddataService: GoodDataService,
    private _translateService: TranslationService,
    private _menuService: MenuService,
    private _utilities: Utilities,
    private _router: Router,
    private location: Location,
    private elementRef: ElementRef,
    private _languageService: PoLanguageService,
    private _ngZone: NgZone
  ) {
    
    //Configurações padrões da aplicação
    this.programName = CNST_PROGRAM_NAME.SIMPLE;
    this.version = CNST_PROGRAM_VERSION.DEVELOPMENT;

    //Configuração do listener de atualização do menu (para alterações do idioma)
    this._menuService.menuRefObs$.subscribe(() => {
      this._ngZone.run(() => {
        this.setMenuTranslations();
        this._languageService.setLanguage(this._translateService.CNST_CURRENT_LANGUAGE);
      });
    });

    //Inicialização do serviço de tradução
    this._translateService.init().pipe(switchMap(() => {
      this._languageService.setLanguage(navigator.language);
      return this._translateService.use(navigator.language).pipe(switchMap((b: boolean) => {
        return this._translateService.getTranslations([
          new TranslationInput('MESSAGES.INIT', [this.programName])
        ]).pipe(switchMap((translations: any) => {
          this.po_lo_text = { value: translations['MESSAGES.INIT'] };
          this.environmentLabel = this._translateService.CNST_TRANSLATIONS['MENU.LABELS.ENVIRONMENT'];

          //Inicialização do serviço de conexão do GoodData / Carol
          return this._gooddataService.init().pipe(map((res: boolean) => {
            if (this._gooddataService._CURRENT_WORKSPACE != null) {
              this.environment = this._gooddataService._CURRENT_WORKSPACE.name;
            }
            //return this._carolService.getCarolAppSettings().pipe(map((settings: any) => {
              //this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'Carol app setings', null);
              /*
              settings.map((setting: any) => {
                switch (setting.name) {
                  case CNST_GOODDATA_APITOKEN:
                    //this._gooddataService.setAPIToken(setting.value);
                    break;
                  case CNST_GOODDATA_HOMEPAGE_WORKSPACE:
                    //this._gooddataService.setHomepageWorkspace(setting.value);
                    break;
                  case CNST_GOODDATA_HOMEPAGE_DASHBOARD:
                    //this._gooddataService.setHomepageDashboard(setting.value);
                    break;
                }
              });
              */
              //Configuração do menu inicial
              this._menuService.updateMenu();
              this.po_lo_text = { value: null };
            //}));
          }));
        }));
      }));
    })).subscribe();
  }

  /* Método de tradução dos textos do menu principal da aplicação */
  public setMenuTranslations(): void {
    this.menus = [];

    //Configuração do objeto de menu dos ambientes, para cada opção disponível
    let po_workspaces: PoMenuItem[] = this._gooddataService.GD_WORKSPACES.map((ws: WorkspacePermission) => {
      return {
        label: ws.name,
        shortLabel: ws.name,
        id: ws.workspaceId,
        action: (ws: any) => {
          this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MESSAGES.WAIT'] };
          this._gooddataService.setCurrentWorkspace(ws.id).subscribe((res: boolean) => {
            if (res) {
              this.environment = this._gooddataService._CURRENT_WORKSPACE.name;
              this._menuService.updateMenu();
              this.po_lo_text = { value: null };
            }
          });
        }
      }
    });

    //Configuração do objeto de menu dos paineis, para cada opção disponível
    let po_dashboards: PoMenuItem[] = this._gooddataService.GD_DASHBOARDS.map((ds: Dashboard) => {
      return {
        label: ds.name,
        shortLabel: ds.name,
        id: ds.dashboardId,
        jujuba: ds.dashboardId,
        action: (ds: any) => {
          this.menu.collapse();
          this._gooddataService.setCurrentDashboard(ds.id).subscribe((res: boolean) => {
            if (res) this._menuService.updateMenu();
            this._router.navigate(['/analytics'], { state: { dashboard: this._gooddataService._CURRENT_DASHBOARD }});
          });
        }
      }
    });

    //Configuração das opções de menu dos ambientes (Caso o usuário tenha pelo menos 1 ambiente)
    if (po_workspaces.length > 1) this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.WORKSPACES.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.WORKSPACES.LABELS.TITLE'],
        icon: 'ph ph-server',
        link: './embed',
        subItems: po_workspaces
      }
    );

    //Configuração das opções de menu dos paineis (Caso o usuário tenha pelo menos 1 painel no ambiente atual)
    if (po_dashboards.length > 0) this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.DASHBOARDS.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.DASHBOARDS.LABELS.TITLE'],
        icon: 'ph ph-monitor',
        subItems: po_dashboards
      }
    );

    //Configuração das opções de menu dos paineis (Caso o usuário tenha selecionado um ambiente)
    if (this._gooddataService._CURRENT_WORKSPACE != null) this.menus.push(

      //Configuração da opção da seção Analyze
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.ANALYZE.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.ANALYZE.LABELS.TITLE'],
        icon: 'ph ph-magnifying-glass',
        action: () => {
          this.menu.collapse();
          this._router.navigate(['/analyze'], { state: null });
        }
      },

      //Configuração da opção do editor de métricas
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.METRICS.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.METRICS.LABELS.TITLE'],
        icon: 'ph ph-pencil-simple',
        action: () => {
          this.menu.collapse();
          this._router.navigate(['/metrics'], { state: null });
        }
      },

      //Configuração da opção do visualizador do modelo de dados
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.MODEL.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.MODEL.LABELS.TITLE'],
        icon: 'ph ph-graph',
        action: () => {
          this.menu.collapse();
          this._router.navigate(['/datamodel'], { state: null });
        }
      }
    );

    this.menus.push(

      //Configuração das opções de menu do suporte
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.LABELS.TITLE'],
        icon: 'ph ph-question',
        link: './schedule',
        subItems: [
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.OPTIONS.TICKETS'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.LABELS.TICKETS'],
            icon: 'ph ph-question',
            link: 'https://centraldeatendimento.totvs.com/hc/pt-br/requests/new?ticket_form_id=368847'
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.OPTIONS.TDN'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.LABELS.TDN'],
            icon: 'ph ph-question',
            link: 'https://centraldeatendimento.totvs.com/hc/pt-br/articles/360041176633-TC-AC-TDN-O-que-%C3%A9-o-TDN-a-%C3%A1rea-de-documenta%C3%A7%C3%A3o-da-TOTVS'
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.OPTIONS.TRAINING'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.LABELS.TRAINING'],
            icon: 'ph ph-question',
            link: 'https://academy.fluig.com/theme/totvs_fluig_academy/trilha.php?codigo=1'
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.LABELS.GOODDATA_HELP'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT.LABELS.GOODDATA_HELP'],
            icon: 'ph ph-question',
            link: 'https://www.gooddata.com/docs/cloud/'
          }
        ]
      },

      //Configuração das opções de menu das configurações
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.LABELS.TITLE'],
        icon: 'ph ph-gear',
        subItems: [
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.OPTIONS.GENERIC'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.LABELS.GENERIC'],
            icon: 'ph ph-question',
            action: () => {
              this.menu.collapse();
              this._router.navigate(['/configuration'], { state: null });
            }
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.OPTIONS.STYLE'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.LABELS.STYLE'],
            icon: 'ph ph-question',
            link: ''
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.OPTIONS.CACHE'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION.LABELS.CACHE'],
            icon: 'ph ph-question',
            link: ''
          }
        ]
      },
    );
    
    //Configuração da opção de logout do menu
    this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.EXIT.OPTIONS.TITLE'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.EXIT.LABELS.TITLE'],
        icon: 'ph ph-sign-out',
        link: './monitor'
      }
    );
  }
}