import { Permission } from './permission-interface';

/* Interface dos Datasources do GoodData Cloud (BackEnd API) */
export class DatasourcePermission {
  public datasourceId: string = null;
  public name: string = null;
  public permissions: Permission = null;

  constructor(data: DatasourcePermission) {
    this.datasourceId = data.datasourceId;
    this.name = data.name;
    this.permissions = new Permission(data.permissions);
  }
}