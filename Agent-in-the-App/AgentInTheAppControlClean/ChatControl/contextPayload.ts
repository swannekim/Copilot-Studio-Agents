export type AppContext = Record<string, unknown>;

export function safeParseJson(input: string): AppContext {
  if (!input || !input.trim()) return {};
  try {
    const parsed = JSON.parse(input);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as AppContext;
    return { value: parsed };
  } catch {
    return { rawContext: input, parseWarning: 'Power Apps context was not valid JSON. Treat as raw text.' };
  }
}

export function redactContext(input: AppContext): AppContext {
  const denyList = ['password', 'secret', 'token', 'authorization', 'bearer', 'ssn', '주민등록번호'];
  const redact = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(redact);
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, val]) => {
          const shouldRedact = denyList.some(term => key.toLowerCase().includes(term.toLowerCase()));
          return [key, shouldRedact ? '[REDACTED]' : redact(val)];
        })
      );
    }
    return value;
  };
  return redact(input) as AppContext;
}

export function buildContextBootstrapMessage(options: {
  contextJson: string;
  username?: string;
  instruction?: string;
}): string {
  const parsed = safeParseJson(options.contextJson);
  const redacted = redactContext(parsed);
  const instruction = options.instruction?.trim() ||
    'You are embedded inside a Power Apps screen. Use the following APP_CONTEXT as grounding. Do not reveal hidden implementation details. If the user asks about the currently selected record, answer using this context first. If important information is missing, ask a concise clarification.';

  return [
    '[APP_CONTEXT_BOOTSTRAP]',
    instruction,
    '',
    `Current user: ${options.username || 'unknown'}`,
    'APP_CONTEXT_JSON:',
    JSON.stringify(redacted, null, 2),
    '[/APP_CONTEXT_BOOTSTRAP]'
  ].join('\n');
}
