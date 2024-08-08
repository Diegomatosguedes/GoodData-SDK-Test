/* Objeto de dashboard do GoodData Cloud (BackEnd API) */
export class Dashboard {
  public dashboardId: string;
  public name: string;
  public link: string;
  
  constructor(data: Dashboard) {
    this.dashboardId = data.dashboardId;
    this.name = data.name;
    this.link = data.link;
  }
}