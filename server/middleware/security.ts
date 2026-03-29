// server/middleware/security.ts
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": import.meta.dev ? false : "max-age=31536000; includeSubDomains; preload",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' blob:;"
  });
});