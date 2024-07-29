/* Componentes padrões do Angular */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Módulos da página de configuração */
import { ConfigurationComponent } from './configuration/configuration.component';

/* Módulos da página do GoodData embedado */
import { EmbedComponent } from './embed/embed.component';

/* Rotas de redirecionamento disponíveis no Agent */
const routes: Routes = [
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'embed', component: EmbedComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
