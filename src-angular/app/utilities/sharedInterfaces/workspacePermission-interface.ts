import { Permission } from './permission-interface';

/* Interface dos ambientes do GoodData Cloud (BackEnd API) */
export class WorkspacePermission {
  public workspaceId: string = null;
  public name: string = null;
  public permissions: Permission = null;

  constructor(data: WorkspacePermission) {
    this.workspaceId = data.workspaceId;
    this.name = data.name;
    this.permissions = new Permission(data.permissions);
  }
}