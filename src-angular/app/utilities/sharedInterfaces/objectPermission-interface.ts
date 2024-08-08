import { DatasourcePermission } from './datasourcePermission-interface';
import { WorkspacePermission } from './workspacePermission-interface';

/* Interface das licenças do Agent-Server */
export class ObjectPermission {
  datasources: DatasourcePermission[] = [];
  workspaces: WorkspacePermission[] = [];

  constructor(data: ObjectPermission) {
    this.datasources = data.datasources.map((ds: any) => {
      return new DatasourcePermission(ds);
    });

    this.workspaces = data.workspaces.map((ws: any) => {
      return new WorkspacePermission(ws);
    });
  }
}