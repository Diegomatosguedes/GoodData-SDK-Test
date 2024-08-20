/* Componentes padrões do Angular */
import { Injectable, Pipe, PipeTransform } from '@angular/core';

/* Serviço de tradução da aplicação */
import { TranslateService } from '@ngx-translate/core';
import { TranslationInput } from './translation-interface';

/* Nome da aplicação */
import { CNST_PROGRAM_NAME } from '../../app-constants';

/* Idioma padrão da aplicação */
import { CNST_DEFAULT_LANGUAGE } from './translation-constants';

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, map, switchMap, filter } from 'rxjs';

@Pipe({name: 'translateExtended'})
export class TranslationService extends TranslateService implements PipeTransform {
  
  //Armazena todas as mensagens da aplicação, já traduzidas
  public CNST_TRANSLATIONS: Array<string> = [];

  //Armazena o idioma atualmente seleciondao pelo usuário
  public CNST_CURRENT_LANGUAGE: string = null;

  /* Método executado ao usar a pipe "translateExtended" em um componente HTML do Angular */
  public transform(value: string): Observable<string> {
    return this.getTranslations([
      new TranslationInput(value, [])
    ]).pipe(map((translations: any) => {
      return translations[value];
    }));
  }
  
  /*
    Método usado para definir o idioma padrão da aplicação
    (Caso o idioma selecionado pelo usuário, ou do 
    sistema operacional do mesmo, não tenha sido 
    configurado).
  */
  public init(): Observable<any> {
    super.setDefaultLang(CNST_DEFAULT_LANGUAGE);
    this.CNST_CURRENT_LANGUAGE = CNST_DEFAULT_LANGUAGE;
    return this.use(CNST_DEFAULT_LANGUAGE);
  }
  
  /* Método usado para trocar o idioma da aplicação */
  public use(language: string): Observable<boolean> {
    return super.use(language).pipe(switchMap((res: boolean) => {
      
      //Atualiza todas as mensagens da aplicação
      this.CNST_CURRENT_LANGUAGE = language;
      return this.updateStandardTranslations();
    }));
  }
  
  /* Método de tradução das mensagens da aplicação */
  public getTranslations(translationInputs: TranslationInput[]): Observable<any> {
    
    //Separa todas as chaves informadas a serem traduzidas
    let keys: string[] = translationInputs.map((ti: TranslationInput) => {
      return ti.key;
    });
    
    //Solicita a mensagem traduzida para serviço pai de tradução (ngx-translate)
    return super.get(keys).pipe(map((translations: any) => {
      
      //Procura em cada mensagem as variáveis de parâmetros padrões
      Object.getOwnPropertyNames.call(Object, translations).map((p: any) => {
        let p1: string = null;
        let p2: string = null;
        let p3: string = null;
        
        //Substitui os parâmetros da mensagem, pelos argumentos passados
        let ti: TranslationInput = translationInputs.find((ti: TranslationInput) => (ti.key == p));
        if (ti.replacements.length > 0) {
          p1 = ti.replacements[0];
          p2 = ti.replacements[1];
          p3 = ti.replacements[2];
          
          //Executa a substituição dos parâmetros, pelos seus valores
          translations[p] = eval('`' + translations[p] + '`');
        }
        
        return translations;
      });
      
      //Retorna todas as mensagens traduzidas
      return translations;
    }));
  }
  
  /* Método de atualização das traduções da aplicação */
  public updateStandardTranslations(): Observable<boolean> {
    return this.getTranslations([
      new TranslationInput('MENU.WORKSPACES.OPTIONS.TITLE', []),
      new TranslationInput('MENU.WORKSPACES.LABELS.TITLE', []),
      new TranslationInput('MENU.DASHBOARDS.OPTIONS.TITLE', []),
      new TranslationInput('MENU.DASHBOARDS.LABELS.TITLE', []),
      new TranslationInput('MENU.ANALYZE.OPTIONS.TITLE', []),
      new TranslationInput('MENU.ANALYZE.LABELS.TITLE', []),
      new TranslationInput('MENU.METRICS.OPTIONS.TITLE', []),
      new TranslationInput('MENU.METRICS.LABELS.TITLE', []),
      new TranslationInput('MENU.MODEL.OPTIONS.TITLE', []),
      new TranslationInput('MENU.MODEL.LABELS.TITLE', []),
      new TranslationInput('MENU.SUPPORT.OPTIONS.TITLE', []),
      new TranslationInput('MENU.SUPPORT.OPTIONS.TICKETS', []),
      new TranslationInput('MENU.SUPPORT.OPTIONS.TDN', []),
      new TranslationInput('MENU.SUPPORT.OPTIONS.TRAINING', []),
      new TranslationInput('MENU.SUPPORT.OPTIONS.GOODDATA_HELP', []),
      new TranslationInput('MENU.SUPPORT.LABELS.TITLE', []),
      new TranslationInput('MENU.SUPPORT.LABELS.TICKETS', []),
      new TranslationInput('MENU.SUPPORT.LABELS.TDN', []),
      new TranslationInput('MENU.SUPPORT.LABELS.TRAINING', []),
      new TranslationInput('MENU.SUPPORT.LABELS.GOODDATA_HELP', []),
      new TranslationInput('MENU.CONFIGURATION.OPTIONS.TITLE', []),
      new TranslationInput('MENU.CONFIGURATION.OPTIONS.GENERIC', []),
      new TranslationInput('MENU.CONFIGURATION.OPTIONS.STYLE', []),
      new TranslationInput('MENU.CONFIGURATION.OPTIONS.CACHE', []),
      new TranslationInput('MENU.CONFIGURATION.LABELS.TITLE', []),
      new TranslationInput('MENU.CONFIGURATION.LABELS.GENERIC', []),
      new TranslationInput('MENU.CONFIGURATION.LABELS.STYLE', []),
      new TranslationInput('MENU.CONFIGURATION.LABELS.CACHE', []),
      new TranslationInput('MENU.EXIT.OPTIONS.TITLE', []),
      new TranslationInput('MENU.EXIT.LABELS.TITLE', []),
      new TranslationInput('MENU.LABELS.CLOSE', []),
      new TranslationInput('MENU.LABELS.SEARCH', []),
      new TranslationInput('MENU.LABELS.ENVIRONMENT', []),
      new TranslationInput('MESSAGES.WAIT', []),
      new TranslationInput('MESSAGES.RESIZING', []),
      new TranslationInput('MESSAGES.LOADING_DASHBOARD', []),
      new TranslationInput('MESSAGES.LOADING_ANALYZE', []),
      new TranslationInput('MESSAGES.LOADING_METRICS', []),
      new TranslationInput('MESSAGES.LOADING_MODEL', []),
      new TranslationInput('LANGUAGES.TITLE', []),
      new TranslationInput('LANGUAGES.en-US', []),
      new TranslationInput('LANGUAGES.pt-BR', []),
      new TranslationInput('LANGUAGES.es-ES', []),
      new TranslationInput('BUTTONS.APPLY', []),
      new TranslationInput('CONFIGURATION.TITLE', [CNST_PROGRAM_NAME.DEFAULT]),
      new TranslationInput('CONFIGURATION.FIELDS.TIMEZONE', []),
      new TranslationInput('CONFIGURATION.MESSAGES.LOADING_ERROR', []),
      new TranslationInput('CONFIGURATION.MESSAGES.SAVE', []),
      new TranslationInput('CONFIGURATION.MESSAGES.SAVE_OK', []),
      new TranslationInput('CONFIGURATION.MESSAGES.SAVE_ERROR', [])
    ]).pipe(map((translations: any) => {
      this.CNST_TRANSLATIONS = translations;
      return true;
    }));
  }
}
