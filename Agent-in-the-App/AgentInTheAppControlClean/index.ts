import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { IInputs, IOutputs } from './generated/ManifestTypes';
import { AgentInTheApp } from './ChatControl/AgentInTheApp';

export class AgentInTheAppControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private container!: HTMLDivElement;
  private root?: Root;
  private notifyOutputChanged!: () => void;

  private latestResponse = '';
  private conversationId = '';
  private status = 'initializing';

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    _state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this.container = container;
    this.notifyOutputChanged = notifyOutputChanged;
    this.root = createRoot(container);
    this.render(context);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.render(context);
  }

  private render(context: ComponentFramework.Context<IInputs>): void {
    const props = {
      agentTitle: context.parameters.agentTitle.raw || 'Agent in the App',
      appClientId: context.parameters.appClientId.raw || '',
      tenantId: context.parameters.tenantId.raw || '',
      environmentId: context.parameters.environmentId.raw || '',
      agentIdentifier: context.parameters.agentIdentifier.raw || '',
      username: context.parameters.username.raw || '',
      appContextJson: context.parameters.appContextJson.raw || '{}',
      autoSendContext: context.parameters.autoSendContext.raw ?? true,
      contextInstruction: context.parameters.contextInstruction.raw || '',
      styleOptions: context.parameters.styleOptions.raw || '{}',
      disableFileUpload: context.parameters.disableFileUpload.raw ?? true,
      allocatedHeight: context.mode.allocatedHeight,
      allocatedWidth: context.mode.allocatedWidth,
      onResponse: (text: string) => {
        this.latestResponse = text;
        this.notifyOutputChanged();
      },
      onConversationId: (id: string) => {
        this.conversationId = id;
        this.notifyOutputChanged();
      },
      onStatus: (status: string) => {
        this.status = status;
        this.notifyOutputChanged();
      }
    };

    this.root?.render(React.createElement(AgentInTheApp, props));
  }

  public getOutputs(): IOutputs {
    return {
      response: this.latestResponse,
      conversationId: this.conversationId,
      status: this.status
    };
  }

  public destroy(): void {
    this.root?.unmount();
  }
}
