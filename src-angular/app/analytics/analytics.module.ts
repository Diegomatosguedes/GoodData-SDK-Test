/* Componentes padrões do Angular */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/* Componentes visuais da biblioteca Portinari.UI */
import {
  PoFieldModule,
  PoPageModule,
  PoLoadingModule,
  PoButtonModule,
  PoButtonGroupModule,
  PoTooltipModule
} from '@po-ui/ng-components';

/* Componente de incorporação do GoodData.UI (React) na aplicação */
import { ReactModule } from '../react/react.module';

/* Componente de analytics da aplicação */
import { AnalyticsComponent } from './analytics.component';

@NgModule({
  declarations: [
    AnalyticsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactModule,
    PoFieldModule,
    PoPageModule,
    PoLoadingModule,
    PoButtonModule,
    PoButtonGroupModule,
    PoTooltipModule
  ],
  providers: []
})
export class AnalyticsModule {}