/* Componentes padrões do React */
import * as React from 'react';

/* Componentes do GoodData.UI */
import { Dashboard, anyEventHandler } from "@gooddata/sdk-ui-dashboard";
import { BackendProvider, WorkspaceProvider } from "@gooddata/sdk-ui";
import tigerFactory, { ContextDeferredAuthProvider, redirectToTigerAuthentication } from "@gooddata/sdk-backend-tiger";

/* Componentes rxjs para controle de Promise / Observable */
import { Observable, Subscription, map, switchMap, of } from 'rxjs';

export interface IMyReactButtonProps {
  workspaceId: string;
  dashboardId: string;
}

export class GoodDataUI extends React.Component<any, any> {

  /**************************/
  /***     VARIÁVEIS      ***/
  /**************************/
  /********* Gerais *********/
  public domain: string = 'https://bossy-fly.trial.cloud.gooddata.com/';
  public backend: any = null;

  //Subscrição para processamento dos eventos da aplicação
  private eventSubscription: Subscription = null;

  //Referência da função a ser disparada, quando um novo evento do GoodData.UI é recebido
  private listenerFunction: any = null;

  /**************************/
  /*** MÉTODOS DO MÓDULO  ***/
  /**************************/
  constructor(props, ref) {
    super(props);
    
    this.backend = tigerFactory()
      .onHostname(this.domain)
      .withAuthentication(new ContextDeferredAuthProvider(redirectToTigerAuthentication));

    //Vínculo da referência da função de subscrição
    this.listenerFunction = this.props.listenerFunction.bind(this);

    //Definição do estado inicial do componente
    this.state = {
      service: this.props.gooddataService
    };

  }
  
  /* Método de renderização do GoodData.UI (Dashboard) */
  render() {
    return (
      <BackendProvider backend={this.backend} >
        <WorkspaceProvider workspace={this.state.service._CURRENT_WORKSPACE.id}>
          <Dashboard
            dashboard={this.state.service._CURRENT_DASHBOARD.id}
          />
        </WorkspaceProvider>
      </BackendProvider>
    );
  }
}