export class Dashboard {

  //Id do dashboard
  public id: string;

  //Nome do dashboard
  public name: string;
  
  /**************************/
  /*** MÉTODOS DO OBJETO  ***/
  /**************************/
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}