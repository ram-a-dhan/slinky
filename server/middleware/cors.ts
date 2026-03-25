export default defineEventHandler((event) => {
  const origin = getRequestHeaders(event)?.origin;
  const baseUrl = useRuntimeConfig()?.public.BASE_URL;

  const allowList = [baseUrl];

  if (origin && allowList.includes(origin)) {
    setResponseHeaders(event, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true", // Allow cookies and auth headers
      "Access-Control-Max-Age": import.meta.dev ? "600" : "86400", // Cache preflight response for 10 minutes in development, 24 hours in production
    });
  }

  if (event.method === "OPTIONS") {
    return sendNoContent(event); // Respond to preflight requests with 204 No Content
  }
});
