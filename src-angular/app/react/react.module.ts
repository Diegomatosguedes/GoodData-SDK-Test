/* Componentes padrões do Angular */
import { NgModule } from '@angular/core';

/* Componente de encapsulamento do React --> Angular */
import { ReactWrapperComponent } from './reactWrapper.component';

@NgModule({
  declarations: [
    ReactWrapperComponent
  ],
  imports: [],
  providers: [],
  exports: [
    ReactWrapperComponent
  ],
})
export class ReactModule {}