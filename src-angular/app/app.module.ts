/* Componentes padrões do Angular */
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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

/* Módulo de analytics da aplicação */
import { AnalyticsModule } from './analytics/analytics.module';

/* Módulo de homepage da aplicação */
import { HomeModule } from './home/home.module';

/* Componente de incorporação do GoodData.UI (React) na aplicação */
import { ReactModule } from './react/react.module';

/* Declaração do módulo primário da aplicação */
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactModule,
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
    AppRoutingModule
  ],
  providers: [
    AppModule,
    provideAnimationsAsync()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}