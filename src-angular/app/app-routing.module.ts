/* Componentes padrões do Angular */
import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Componentes padrões do TOTVSApps */
import {
  PageForbiddenComponent,
  OAuthLoginComponent,
  AuthGuard,
  AUTH_OPTIONS
} from '@totvs-apps-components/auth';

/* Módulo da página inicial (Home) da aplicação */
import { HomeComponent } from './home/home.component';

/* Módulo da página do GoodData embedado */
import { AnalyticsComponent } from './analytics/analytics.component';

/* Módulo de análise dos dados da aplicação */
import { AnalyzeComponent } from './analyze/analyze.component';

/* Módulo de métricas da aplicação */
import { MetricsComponent } from './metrics/metrics.component';

/* Módulo de modelo de dados da aplicação */
import { DataModelComponent } from './datamodel/datamodel.component';

/* Módulo de configuração da aplicação */
import { ConfigurationComponent } from './configuration/configuration.component';

/* Rotas de redirecionamento disponíveis na aplicação */
const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: 'analyze', component: AnalyzeComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: 'metrics', component: MetricsComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: 'datamodel', component: DataModelComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: 'configuration', component: ConfigurationComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: 'oauth/login', component: OAuthLoginComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: 'page-forbidden', component: PageForbiddenComponent, canActivate: [() => inject(AuthGuard).canActivate()] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

/* Rotas de redirecionamento disponíveis na aplicação */
/*const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'analyze', component: AnalyzeComponent },
  { path: 'metrics', component: MetricsComponent },
  { path: 'datamodel', component: DataModelComponent },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'oauth/login', component: OAuthLoginComponent },
  { path: 'page-forbidden', component: PageForbiddenComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];*/

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
