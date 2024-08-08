/* Componentes padrões do Angular */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Módulos da página do GoodData embedado */
import { AnalyticsComponent } from './analytics/analytics.component';

/* Rotas de redirecionamento disponíveis no Agent */
const routes: Routes = [
  { path: 'analytics', component: AnalyticsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
