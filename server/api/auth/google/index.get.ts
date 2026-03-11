export default defineEventHandler((event) => {
  const config = useRuntimeConfig();

  const params = new URLSearchParams({
    client_id: config.GOOGLE_CLIENT_ID,
    redirect_uri: config.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return sendRedirect(event, `https://accounts.google.com/o/oauth2/v2/auth?${params}`);
})