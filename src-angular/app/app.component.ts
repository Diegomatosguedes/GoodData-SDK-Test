/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* Componentes padrões do Angular */
import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoMenuItem,
  PoModalComponent,
  PoMenuComponent
} from '@po-ui/ng-components';

/* Componentes de utilitários do Agent */
import { Utilities } from './utilities/utilities';
import { CNST_LOGLEVEL } from './utilities/utilities-constants';

/* Componentes de utilitários do Agent */
import { GoodDataService } from './services/gooddata-service';


import { WorkspacePermission } from './utilities/sharedInterfaces/workspacePermission-interface';
import { Dashboard } from './utilities/sharedInterfaces/dashboard-interface';


/* Componentes de utilitários do Agent */
import { CarolService } from './services/carol-service';

/* Serviço de tradução do Agent */
import { TranslationService } from './services/translation/translation-service';
import { TranslationInput } from './services/translation/translation-interface';

/* Serviço compartilhado de comunicação com o menu principal do Agent */
import { MenuService } from './services/menu-service';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, of, catchError } from 'rxjs';

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

  @ViewChild(PoMenuComponent, { static: true }) menu: PoMenuComponent;

  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _carolService: CarolService,
    private _gooddataService: GoodDataService,
    private _translateService: TranslationService,
    private _menuService: MenuService,
    private _utilities: Utilities,
    private _ngZone: NgZone,
    private _router: Router
  ) {

    //Configurações padrões do Agent
    this.programName = CNST_PROGRAM_NAME.SIMPLE;
    this.version = CNST_PROGRAM_VERSION.DEVELOPMENT;

    this._menuService.menuRefObs$.subscribe(() => {
      this.setMenuTranslations(true);
      this.po_lo_text = { value: null };
    });

    this._translateService.init().pipe(switchMap(() => {
      return this._translateService.use('pt.BR').pipe(switchMap((b: boolean) => {
        this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MIRROR_MODE.MESSAGES.WAIT'] };
        return this._gooddataService.init().pipe(switchMap((res: boolean) => {
          return this._carolService.getCarolAppSettings().pipe(map((settings: any) => {
            this._utilities.writeToLog(CNST_LOGLEVEL.DEBUG, 'Carol app setings', null);

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

            this._menuService.updateMenu();
          }));
        }));
      }));
    })).subscribe();
  }

  /* Método de tradução dos textos do menu principal do Agent */
  public setMenuTranslations(TOTVER: boolean): void {
    this.menus = [];

    let po_workspaces: PoMenuItem[] = this._gooddataService.GD_WORKSPACES.map((ws: WorkspacePermission) => {
      return {
        label: ws.name,
        shortLabel: ws.name,
        id: ws.workspaceId,
        action: (ws: any) => {
          this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MIRROR_MODE.MESSAGES.WAIT'] };
          this._gooddataService.setCurrentWorkspace(ws.id).subscribe((res: boolean) => {
            if (res) this._menuService.updateMenu();
          });
        }
      }
    });

    let po_dashboards: PoMenuItem[] = this._gooddataService.GD_DASHBOARDS.map((ds: Dashboard) => {
      return {
        label: ds.name,
        shortLabel: ds.name,
        id: ds.dashboardId,
        action: (ds: any) => {
          this.po_lo_text = { value: this._translateService.CNST_TRANSLATIONS['MIRROR_MODE.MESSAGES.WAIT'] };
          this.menu.collapse();
          this._gooddataService.setCurrentDashboard(ds.id).subscribe((res: boolean) => {
            if (res) this._menuService.updateMenu();
            this.po_lo_text = { value: null };
            this._router.navigate(['/analytics'], { state: { dashboard: this._gooddataService._CURRENT_DASHBOARD }});
          });
        }
      }
    });

    //
    if (po_workspaces.length > 0) this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.WORKSPACES'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.WORKSPACES'],
        icon: 'po-icon-server',
        link: './embed',
        subItems: po_workspaces
      }
    );

    //
    if (po_dashboards.length > 0) this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.DASHBOARDS'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.DASHBOARDS'],
        icon: 'po-icon-device-desktop',
        link: './database',
        subItems: po_dashboards
      }
    );

    //
    this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT'],
        icon: 'po-icon-help',
        link: './schedule',
        subItems: [
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_TICKETS'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_TICKETS'],
            icon: 'po-icon-help',
            link: 'https://centraldeatendimento.totvs.com/hc/pt-br/requests/new?ticket_form_id=368847'
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_TDN'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_TDN'],
            icon: 'po-icon-help',
            link: 'https://centraldeatendimento.totvs.com/hc/pt-br/articles/360041176633-TC-AC-TDN-O-que-%C3%A9-o-TDN-a-%C3%A1rea-de-documenta%C3%A7%C3%A3o-da-TOTVS'
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_TRAINING'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_TRAINING'],
            icon: 'po-icon-help',
            link: 'https://academy.fluig.com/theme/totvs_fluig_academy/trilha.php?codigo=1'
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_GOODDATA_HELP'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.SUPPORT_GOODDATA_HELP'],
            icon: 'po-icon-help',
            link: 'https://www.gooddata.com/docs/cloud/'
          }
        ]
      },
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION'],
        icon: 'po-icon-settings',
        link: './query',
        subItems: [
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_USERS'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_USERS'],
            icon: 'po-icon-help',
            link: ''
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_PERMISSIONS'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_PERMISSIONS'],
            icon: 'po-icon-help',
            link: ''
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_STYLE'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_STYLE'],
            icon: 'po-icon-help',
            link: ''
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_CACHE'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.CONFIGURATION_CACHE'],
            icon: 'po-icon-help',
            link: ''
          }
        ]
      },
    );

    //
    if (TOTVER) this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.LCM'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.LCM'],
        icon: 'po-icon-pallet-partial',
        link: './script',
        subItems: [
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.LCM_1'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.LCM_1'],
            icon: 'po-icon-help',
            link: ''
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.LCM_2'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.LCM_2'],
            icon: 'po-icon-help',
            link: ''
          },
          {
            label: this._translateService.CNST_TRANSLATIONS['MENU.LCM_3'],
            shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.LCM_3'],
            icon: 'po-icon-help',
            link: ''
          }
        ]
      }
    );

    //
    this.menus.push(
      {
        label: this._translateService.CNST_TRANSLATIONS['MENU.EXIT'],
        shortLabel: this._translateService.CNST_TRANSLATIONS['MENU.EXIT'],
        icon: 'po-icon-exit',
        link: './monitor'
      }
    );
  }
}