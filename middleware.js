// Vercel Routing Middleware: protects the whole deployment (page and /api) with HTTP Basic Auth.
// Credentials come from the BASIC_AUTH_USER and BASIC_AUTH_PASSWORD environment variables.
import { next } from '@vercel/functions';

const REALM = 'Stock Analyzer';

export default async function middleware(request) {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD;
  if (!expectedUser || !expectedPassword) {
    return new Response('Zugang ist nicht konfiguriert.', { status: 500 });
  }

  const credentials = parseBasicAuth(request.headers.get('authorization'));
  if (credentials) {
    const [isUserValid, isPasswordValid] = await Promise.all([
      safeEqual(credentials.user, expectedUser),
      safeEqual(credentials.password, expectedPassword)
    ]);
    if (isUserValid && isPasswordValid) return next();
  }

  return new Response('Anmeldung erforderlich.', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` }
  });
}

function parseBasicAuth(header) {
  if (!header?.startsWith('Basic ')) return null;

  let decoded;
  try {
    const bytes = Uint8Array.from(atob(header.slice('Basic '.length)), char => char.charCodeAt(0));
    decoded = new TextDecoder().decode(bytes);
  } catch {
    return null;
  }

  const separator = decoded.indexOf(':');
  if (separator === -1) return null;
  return { user: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
}

/**
 * Constant-time string comparison: hashing first gives equal lengths, then every byte is compared
 */
async function safeEqual(actual, expected) {
  const encoder = new TextEncoder();
  const [actualHash, expectedHash] = await Promise.all(
    [actual, expected].map(value => crypto.subtle.digest('SHA-256', encoder.encode(value)))
  );
  const actualBytes = new Uint8Array(actualHash);
  const expectedBytes = new Uint8Array(expectedHash);

  let difference = 0;
  for (let i = 0; i < expectedBytes.length; i++) {
    difference |= actualBytes[i] ^ expectedBytes[i];
  }
  return difference === 0;
}
