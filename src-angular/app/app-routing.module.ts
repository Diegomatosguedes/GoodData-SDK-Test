/* Componentes padrões do Angular */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Componente de homepage da aplicação */
import { HomeComponent } from './home/home.component';

/* Componente de analytics da aplicação */
import { AnalyticsComponent } from './analytics/analytics.component';

/* Rotas de redirecionamento disponíveis na aplicação */
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false, onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
