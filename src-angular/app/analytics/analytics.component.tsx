/* Componentes padrões do Angular */
import { Component, NgZone } from "@angular/core";

/* Serviços de conexão com o GoodData Cloud */
import { GoodDataService } from '../services/gooddata-service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent {

  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  
  /********* GD SDK *********/
  //Array que controla os Ids dos widgets do GoodData.UI, que estão na fila de renderização
  private widgets: string[] = [];
  
  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    public _gooddataService: GoodDataService,
    private _ngZone: NgZone
  ) {}
  
  /*****************************/
  /*** RENDERIZAÇÃO (GD SDK) ***/
  /*****************************/
  public listenerFunctionSDK(message: any): void {
    this._ngZone.run(() => {
      switch (message.type) {
        case ('GDC.DASH/EVT.RENDER.REQUESTED'):
          break;
        case ('GDC.DASH/EVT.WIDGET.EXECUTION_STARTED'):
          this.widgets.push(message.correlationId);
          break;
        case ('GDC.DASH/EVT.WIDGET.EXECUTION_SUCCEEDED'):
          this.widgets = this.widgets.filter((elem: string) => (elem != message.correlationId));
          break;
        case ('GDC.DASH/EVT.WIDGET.EXECUTION_FAILED'):
          this.widgets = this.widgets.filter((elem: string) => (elem != message.correlationId));
          break;
        case ('GDC.DASH/EVT.RENDER.RESOLVED'):
          break;
      }
    });
  }
}