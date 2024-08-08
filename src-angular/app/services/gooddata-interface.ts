/* Componentes rxjs para controle de Promise / Observable */
import { Observable } from 'rxjs';

/* Interface de bancos de dados do Agent */
export class Workspace {
  id: string;
  name: string;
  link: string;
  ob_dashboards: Observable<Dashboard[]>;
  dashboards: Dashboard[];
  constructor(id: string, name: string, link: string, ob_dashboards: Observable<Dashboard[]>) {
    this.id = id;
    this.name = name;
    this.link = link;
    this.ob_dashboards = ob_dashboards;
    this.dashboards = [];
  }
}

export class Dashboard {
  id: string;
  name: string;
  dashboardLink: string;
  constructor(id: string, name: string, link: string) {
    this.id = id;
    this.name = name;
    this.dashboardLink = link;
  }
}