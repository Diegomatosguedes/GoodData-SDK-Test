/* Componentes padrões do Angular */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/* Componentes do Angular para comunicação http */
import { HttpClient, HttpClientModule } from '@angular/common/http';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoMenuModule,
  PoNotificationModule,
  PoTableModule,
  PoModule,
  PoModalModule,
  PoLinkModule
} from '@po-ui/ng-components';

/* Módulos da página de configuração */
import { AnalyticsModule } from './analytics/analytics.module';

/* Serviço de comunicação com o menu principal do Agent (para atualizar a tradução do Menu) */
import { MenuService } from './services/menu-service';

import { GoodDataService } from './services/gooddata-service';


/* Serviço de tradução do Agent */
import { CustomTranslationLoader } from './services/translation/custom-translation-loader';
import { TranslationModule } from './services/translation/translation.module';
import {
  TranslateModule,
  TranslateLoader
} from '@ngx-translate/core';

/* Declaração do módulo primário do Agent */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
    AnalyticsModule,
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
    AppRoutingModule
  ],
  providers: [
    AppModule,
    MenuService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
