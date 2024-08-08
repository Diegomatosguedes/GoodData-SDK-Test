/* Objeto de resposta genérico da API do BackEnd */
export class ResponseObject {
  public status: number;
  public value: any;

  public ResponseObject(status: number, value: any) {
    this.status = status;
    this.value = value;
  }
}