/* Interface de permissões do GoodData Cloud (BackEnd API) */
export class Permission {
  public values: string[] = [];
  public canEdit: boolean;
  
  constructor(data: Permission) {
    this.values = data.values;
    this.canEdit = data.canEdit;
  }
}