/**
 * Security header definitions for Vercel deployment.
 * Keep `vercel.json` in sync — see `src/config/__tests__/vercel-config.test.ts`.
 */

export type HeaderEntry = { readonly key: string; readonly value: string };

export const SECURITY_HEADERS: readonly HeaderEntry[] = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
] as const;

export const IMMUTABLE_CACHE_HEADERS: readonly HeaderEntry[] = [
  {
    key: "Cache-Control",
    value: "public, max-age=31536000, immutable",
  },
] as const;

/** @deprecated Use IMMUTABLE_CACHE_HEADERS */
export const FONT_CACHE_HEADERS = IMMUTABLE_CACHE_HEADERS;
