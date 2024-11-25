export class Workspace {

  //Código do ambiente do GoodData Cloud.
  public id: string = null;

  //Nome do ambiente do GoodData Cloud.
  public name: string = null;

  /**************************/
  /*** MÉTODOS DO OBJETO  ***/
  /**************************/
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}