import * as React from 'react';
import ReactWebChat, { createStore } from 'botframework-webchat';
import { Button, Caption1, Card, Spinner, Text, makeStyles, tokens } from '@fluentui/react-components';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import {
  ConnectionSettings,
  CopilotStudioClient,
  CopilotStudioWebChat,
  PowerPlatformCloud
} from '@microsoft/agents-copilotstudio-client';
import { buildContextBootstrapMessage } from './contextPayload';

export interface AgentInTheAppProps {
  agentTitle: string;
  appClientId: string;
  tenantId: string;
  environmentId: string;
  agentIdentifier: string;
  username: string;
  appContextJson: string;
  autoSendContext: boolean;
  contextInstruction: string;
  styleOptions: string;
  disableFileUpload: boolean;
  allocatedHeight: number;
  allocatedWidth: number;
  onResponse: (text: string) => void;
  onConversationId: (id: string) => void;
  onStatus: (status: string) => void;
}

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '480px',
    width: '100%',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground1
  },
  header: {
    padding: '12px 14px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  chat: { flexGrow: 1, minHeight: 0 },
  error: { padding: '14px' },
  contextPreview: {
    maxHeight: '80px',
    overflow: 'auto',
    padding: '8px 14px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2
  }
});

function parseStyleOptions(input: string): Record<string, unknown> {
  try {
    return input?.trim() ? JSON.parse(input) : {};
  } catch {
    return {};
  }
}

export function AgentInTheApp(props: AgentInTheAppProps): JSX.Element {
  const styles = useStyles();
  const [directLine, setDirectLine] = React.useState<any>();
  const [error, setError] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);
  const clientRef = React.useRef<CopilotStudioClient | null>(null);
  const lastContextRef = React.useRef<string>('');
  const conversationStartedRef = React.useRef(false);

  const store = React.useMemo(() => createStore({}, () => (next: any) => (action: any) => {
    if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const activity = action.payload?.activity;
      if (activity?.type === 'message' && activity?.from?.role !== 'user') {
        const text = activity.text || '';
        if (text) props.onResponse(text);
        if (activity.conversation?.id) props.onConversationId(activity.conversation.id);
      }
    }
    return next(action);
  }), [props.onResponse, props.onConversationId]);

  const getToken = React.useCallback(async (scope: string): Promise<string> => {
    const msal = new PublicClientApplication({
      auth: {
        clientId: props.appClientId,
        authority: `https://login.microsoftonline.com/${props.tenantId}`,
        redirectUri: window.location.origin
      },
      cache: { cacheLocation: 'sessionStorage' }
    });

    await msal.initialize();
    const accounts = msal.getAllAccounts();
    const request = { scopes: [scope], account: accounts[0] };

    try {
      const result = accounts.length
        ? await msal.acquireTokenSilent(request)
        : await msal.loginPopup({ scopes: [scope], prompt: 'select_account' });
      return result.accessToken;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        const result = await msal.acquireTokenPopup({ scopes: [scope] });
        return result.accessToken;
      }
      throw e;
    }
  }, [props.appClientId, props.tenantId]);

  const connect = React.useCallback(async () => {
    setIsLoading(true);
    setError('');
    props.onStatus('connecting');

    if (!props.appClientId || !props.tenantId || !props.environmentId || !props.agentIdentifier) {
      setError('Missing required PCF properties: appClientId, tenantId, environmentId, or agentIdentifier.');
      setIsLoading(false);
      props.onStatus('missing-configuration');
      return;
    }

    try {
      const settings = new ConnectionSettings({
        appClientId: props.appClientId,
        tenantId: props.tenantId,
        environmentId: props.environmentId,
        agentIdentifier: props.agentIdentifier,
        cloud: PowerPlatformCloud.Prod
      });
      const scope = CopilotStudioClient.scopeFromSettings(settings);
      const token = await getToken(scope);
      const client = new CopilotStudioClient(settings, token);
      clientRef.current = client;
      conversationStartedRef.current = false;

      const connection = CopilotStudioWebChat.createConnection(client, { showTyping: true });
      setDirectLine(connection);
      props.onStatus('connected');
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      props.onStatus(`error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [props, getToken]);

  const sendContextToAgent = React.useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    const bootstrap = buildContextBootstrapMessage({
      contextJson: props.appContextJson,
      username: props.username,
      instruction: props.contextInstruction
    });
    if (bootstrap === lastContextRef.current) return;
    lastContextRef.current = bootstrap;
    props.onStatus('sending-app-context');
    if (!conversationStartedRef.current) {
      const startActivities = await client.startConversationAsync(false) as any;
      conversationStartedRef.current = true;
      const startActivity = Array.isArray(startActivities)
        ? startActivities.find((a: any) => a?.conversation?.id) ?? startActivities[0]
        : startActivities;
      const cid = startActivity?.conversation?.id;
      if (cid) props.onConversationId(cid);
    }
    const activities = await client.askQuestionAsync(bootstrap) as any[];
    const latest = activities.map((a: any) => a.text).filter(Boolean).join('\n');
    if (latest) props.onResponse(latest);
    const cid = activities.find((a: any) => a.conversation?.id)?.conversation?.id;
    if (cid) props.onConversationId(cid);
    props.onStatus('context-sent');
  }, [props.appContextJson, props.username, props.contextInstruction, props.onResponse, props.onConversationId, props.onStatus]);

  React.useEffect(() => { void connect(); }, [connect]);

  React.useEffect(() => {
    if (props.autoSendContext && clientRef.current) {
      void sendContextToAgent().catch(e => props.onStatus(`context-error: ${e instanceof Error ? e.message : String(e)}`));
    }
  }, [props.autoSendContext, props.appContextJson, sendContextToAgent, props.onStatus]);

  return (
    <Card className={styles.shell} style={{ height: props.allocatedHeight || 520, width: props.allocatedWidth || '100%' }}>
      <div className={styles.header}>
        <div>
          <Text weight="semibold">{props.agentTitle}</Text><br />
          <Caption1>Copilot Studio agent embedded in Power Apps via PCF</Caption1>
        </div>
        <Button size="small" onClick={() => void sendContextToAgent()} disabled={!clientRef.current}>Send app context</Button>
      </div>
      <pre className={styles.contextPreview} aria-label="App context preview">{props.appContextJson || '{}'}</pre>
      {isLoading && <Spinner label="Connecting to Copilot Studio agent" />}
      {error && <div className={styles.error}><Text>{error}</Text><br /><Button onClick={() => void connect()}>Retry</Button></div>}
      {!isLoading && !error && directLine && (
        <div className={styles.chat}>
          <ReactWebChat
            directLine={directLine}
            store={store}
            userID={props.username || 'powerapps-user'}
            username={props.username || 'Power Apps user'}
            styleOptions={{
              hideUploadButton: props.disableFileUpload,
              rootHeight: '100%',
              rootWidth: '100%',
              ...parseStyleOptions(props.styleOptions)
            }}
          />
        </div>
      )}
    </Card>
  );
}
