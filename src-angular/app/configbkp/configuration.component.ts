/* Componentes padrões do Angular */
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

/* Componentes visuais da biblioteca Portinari.UI */
import { PoSwitchLabelPosition } from '@po-ui/ng-components';

/* Componentes de utilitários do Agent */
import { Utilities } from '../utilities/utilities';
import { CNST_LOGLEVEL } from '../utilities/utilities-constants';
import { CNST_MANDATORY_FORM_FIELD } from '../utilities/angular-constants';
import { CNST_JAVA_XMX_MINIMUM } from '../utilities/java-constants';
import { CNST_DEFAULT_LANGUAGE } from '../services/translation/translation-constants';
import { CNST_TIMEZONES } from '../services/timezones';

/* Serviço de comunicação com o Electron */
import { ElectronService } from '../core/services';

/* Serviço de consulta do acesso remoto (MirrorMode) */
import { MirrorService } from '../services/mirror-service';

/* Serviço de configuração do Agent */
import { ConfigurationService } from './configuration-service';
import { Configuration } from './configuration-interface';
import { CNST_LOGFILES_MINIMUM, CNST_LOGFILES_MAXIMUM, CNST_DEFAULT_CLIENT_PORT } from './configuration-constants';

/* Serviço de tradução do Agent */
import { TranslationService } from '../services/translation/translation-service';
import { TranslationInput } from '../services/translation/translation-interface';
import { CustomTranslationLoader } from '../services/translation/custom-translation-loader';

/* Componentes rxjs para controle de Promise / Observable */
import { map, switchMap, from, of } from 'rxjs';

/* Constantes do Agent */
import {
  CNST_PROGRAM_NAME,
  CNST_PROGRAM_VERSION
} from '../app-constants';

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
  
  //Variável de suporte, para mostrar ao usuário os fusos horários disponíveis.
  protected _CNST_TIMEZONES: Array<any> = [];
  
  //Versões do Agent / Java
  protected AgentVersion: string = null;
  protected JavaVersionTitle: string = null;
  protected JavaVersionDetails: string = null;
  
  //Objeto de configuração do formulário
  protected configuration: Configuration = new Configuration(3, true, 2048, '', CNST_DEFAULT_LANGUAGE, true);
  
  //Define se o Agent está sendo executado via acesso remoto (MirrorMode)
  protected mirrorMode: number = 0;
  
  /****** Portinari.UI ******/
  //Posicionamento do texto do label do modo debug (Esquerda)
  protected poDebugModeLabelPosition: PoSwitchLabelPosition = PoSwitchLabelPosition.Left;
  
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };
  
  //Idiomas disponíveis no Agent
  protected CNST_LANGUAGES: Array<any> = [];
  
  //Variável de suporte, que armazena o valor mínimo aceitável do parâmetro Xmx do Java.
  protected _CNST_JAVA_XMX_MINIMUM: number = CNST_JAVA_XMX_MINIMUM;
  
  //Variável de suporte, que armazena o numero mínimo de arquivos de log a serem mantidos pelo Agent.
  protected _CNST_LOGFILES_MINIMUM: number = CNST_LOGFILES_MINIMUM;
  
  /****** Formulários *******/
  //Títulos
  protected lbl_title: string = null;
  protected lbl_application: string = null;
  protected lbl_version: string = null;
  protected lbl_java: string = null;
  
  //Campos
  protected lbl_logfilesToKeep: string = null;
  protected lbl_javaXmx: string = null;
  protected lbl_javaTmpDir: string = null;
  protected lbl_javaJREDir: string = null;
  protected lbl_instance: string = null;
  protected lbl_debugMode: string = null;
  protected lbl_autoUpdate: string = null;
  protected lbl_activated_1: string = null;
  protected lbl_activated_2: string = null;
  protected lbl_deactivated_1: string = null;
  protected lbl_deactivated_2: string = null;
  protected lbl_save: string = null;
  protected lbl_locale: string = null;
  protected lbl_timezone: string = null;
  
  //Balões de ajuda
  protected ttp_instance: string = null;
  protected ttp_debugMode: string = null;
  protected ttp_javaTmpDir: string = null;
  protected ttp_javaJREDir: string = null;
  protected ttp_javaXmx: string = null;
  protected ttp_logfilesToKeep: string = null;
  protected ttp_autoUpdate: string = null;
  
  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _electronService: ElectronService,
    private _mirrorService: MirrorService,
    private _configurationService: ConfigurationService,
    private _translateService: TranslationService,
    private _customTranslationLoader: CustomTranslationLoader,
    private _utilities: Utilities,
    private _router: Router
  ) {}
  
  /* Método de inicialização do componente */
  public ngOnInit(): void {
    this.reloadConfiguration();
  }
  
  /* Método de recarga do componente de Configuração do Agent */
  protected reloadConfiguration(): void {

    //Tradução dos títulos
    this.lbl_title = this._translateService.CNST_TRANSLATIONS['CONFIGURATION.TITLE'];
    
  }
}
