import { describe, expect, it } from 'vitest';
import { buildContextBootstrapMessage, redactContext, safeParseJson } from '../AgentInTheAppControl/ChatControl/contextPayload';

describe('context payload helpers', () => {
  it('parses valid Power Apps JSON context', () => {
    expect(safeParseJson('{"accountName":"Contoso"}')).toEqual({ accountName: 'Contoso' });
  });

  it('falls back to raw text for malformed context', () => {
    expect(safeParseJson('not-json')).toMatchObject({ rawContext: 'not-json' });
  });

  it('redacts sensitive keys recursively', () => {
    expect(redactContext({ token: 'abc', nested: { password: 'pw', visible: 'ok' } })).toEqual({
      token: '[REDACTED]',
      nested: { password: '[REDACTED]', visible: 'ok' }
    });
  });

  it('builds a bootstrap message with user and context', () => {
    const msg = buildContextBootstrapMessage({
      username: 'sage@contoso.com',
      contextJson: '{"selectedCaseId":"CASE-1001"}'
    });
    expect(msg).toContain('[APP_CONTEXT_BOOTSTRAP]');
    expect(msg).toContain('sage@contoso.com');
    expect(msg).toContain('CASE-1001');
  });
});
