import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import middleware from './middleware.js';

const basicAuth = (user, password) => {
  const bytes = new TextEncoder().encode(`${user}:${password}`);
  return `Basic ${btoa(String.fromCharCode(...bytes))}`;
};

const requestWith = (authorization) =>
  new Request('https://stockanalyzer.example/', { headers: authorization ? { authorization } : {} });

describe('basic auth middleware', () => {
  beforeEach(() => {
    vi.stubEnv('BASIC_AUTH_USER', 'team');
    vi.stubEnv('BASIC_AUTH_PASSWORD', 'Grüezi-2026');
  });
  afterEach(() => vi.unstubAllEnvs());

  it('lets requests with valid credentials through', async () => {
    const response = await middleware(requestWith(basicAuth('team', 'Grüezi-2026')));
    expect(response.status).toBe(200);
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });

  it('asks for credentials when none are sent', async () => {
    const response = await middleware(requestWith(null));
    expect(response.status).toBe(401);
    expect(response.headers.get('WWW-Authenticate')).toContain('Basic realm=');
  });

  it('rejects a wrong password', async () => {
    const response = await middleware(requestWith(basicAuth('team', 'wrong')));
    expect(response.status).toBe(401);
  });

  it('rejects malformed authorization headers', async () => {
    expect((await middleware(requestWith('Basic %%%'))).status).toBe(401);
    expect((await middleware(requestWith(`Basic ${btoa('no-separator')}`))).status).toBe(401);
  });

  it('stays closed when no credentials are configured', async () => {
    vi.stubEnv('BASIC_AUTH_PASSWORD', '');
    const response = await middleware(requestWith(basicAuth('team', '')));
    expect(response.status).toBe(500);
  });
});
