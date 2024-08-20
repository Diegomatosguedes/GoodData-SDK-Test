/* Componentes padrões do Angular */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/* Componentes do Angular para comunicação http */
import { HttpClient, HttpClientModule } from '@angular/common/http';

/* Dependências do TOTVSApps para comunicação com outros aplicativos da plataforma */
import {
  AppHeaderModule,
  HeaderModuleOptions
} from '@totvs-apps-components/header';
import {
  AuthModule,
  AuthModuleOptions
} from '@totvs-apps-components/auth';

/* Configurações de ambiente da aplicação */
import { CNST_HEADER_MODULE_OPTIONS } from '../environments/environment';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoMenuModule,
  PoNotificationModule,
  PoTableModule,
  PoModule,
  PoModalModule,
  PoLinkModule
} from '@po-ui/ng-components';

/* Configurações de ambiente da aplicação */
import { env } from '../environments/environment';

/* Módulo da página inicial (Home) da aplicação */
import { HomeModule } from './home/home.module';

/* Módulo da página de analytics */
import { AnalyticsModule } from './analytics/analytics.module';

/* Módulo da página de análise dos dados */
import { AnalyzeModule } from './analyze/analyze.module';

/* Módulo da página de edição de métricas */
import { MetricsModule } from './metrics/metrics.module';

/* Módulo da página de edição de métricas */
import { DataModelModule } from './datamodel/datamodel.module';

/* Módulo da página de configuração */
import { ConfigurationModule } from './configuration/configuration.module';

/* Serviço de comunicação com o menu principal do Agent (para atualizar a tradução do Menu) */
import { MenuService } from './services/menu-service';

/* Serviço de tradução do Agent */
import { CustomTranslationLoader } from './services/translation/custom-translation-loader';
import { TranslationModule } from './services/translation/translation.module';
import {
  TranslateModule,
  TranslateLoader
} from '@ngx-translate/core';

/* Declaração do módulo primário da aplicação */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

const authOptions: AuthModuleOptions = {
  config: {
    shouldPromptTokenRequest: env.shouldPromptTokenRequest,
    appCodeDevMode: env.appCodeDevMode,
    DEV: env.DEV,
    STAGING: env.STAGING,
    PROD: env.PROD,
    pkceEnabled: false
  },
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    PoMenuModule,
    PoNotificationModule,
    PoTableModule,
    PoModule,
    PoModalModule,
    PoLinkModule,
    HomeModule,
    AnalyticsModule,
    AnalyzeModule,
    MetricsModule,
    DataModelModule,
    ConfigurationModule,
    TranslationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslationLoader,
        deps: [
          HttpClient
        ]
      }
    }),
    AppHeaderModule.forRoot(CNST_HEADER_MODULE_OPTIONS),
    //AuthModule.forRoot(authOptions),
    AppRoutingModule
  ],
  providers: [
    AppModule,
    MenuService,
    provideAnimationsAsync()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
