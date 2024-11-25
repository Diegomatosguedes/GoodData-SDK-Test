/* Componentes padrões do Angular */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Input } from "@angular/core";

/* Componentes padrões do React */
import * as React from "react";
import * as ReactDOM from "react-dom";

/* Componente do GoodData.UI (React) */
import { GoodDataUI } from "./GoodDataUI";

/* Serviços de conexão com o GoodData Cloud */
import { GoodDataService } from '../services/gooddata-service';

@Component({
  selector: "react-container",
  template: `<div #reactContainer></div>`,
  styleUrls: ['./react.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ReactWrapperComponent implements OnDestroy, OnInit {

  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  //Referência do componente <div> em que o GoodData.UI será renderizado
  @ViewChild("reactContainer", { static: true }) containerRef!: ElementRef;

  //Referência da função de travamento de tela do componente Pai
  @Input({ required: true }) listenerFunction: any;

  /****** Portinari.UI ******/
  //Comunicação c/ animação (gif) de carregamento
  protected po_lo_text: any = { value: null };

  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(
    private _gooddataService: GoodDataService
  ) {
  }

  /* Método de inicialização do componente */
  public ngOnInit(): void {
    this.render();
  }

  /* Método de eliminação do container do React */
  public ngOnDestroy(): void {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }
  
  /* Método de renderização do GoodData.UI (React) */
  private render() {
    ReactDOM.render(
      <GoodDataUI
        gooddataService={this._gooddataService}
        listenerFunction={this.listenerFunction}
      />,
      this.containerRef.nativeElement
    );
  }
}