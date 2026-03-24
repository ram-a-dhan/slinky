// server/api/auth/callback.get.ts
import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";
import { useDb } from "#server/utils/db";
import { signJwt } from "#server/utils/jwt";

interface IResToken {
  access_token: string
  id_token: string
  error?: string
}

interface IResUser {
  email: string
  email_verified: boolean
  name: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // 1. Get code from Google redirect.
  const query = getQuery(event);
  const code = query.code as string | undefined;

  // User denied permission.
  if (!code) return sendRedirect(event, "/?error=no_code");
  
  // 2. Send code get token.
  const tokenResponse = await $fetch<IResToken>(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      body: {
        code,
        client_id: config.GOOGLE_CLIENT_ID,
        client_secret: config.GOOGLE_CLIENT_SECRET,
        redirect_uri: config.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      },
    }
  ).catch(() => null);

  if (!tokenResponse || tokenResponse.error)
    return sendRedirect(event, "/?error=token_exchange_failed");

  // 3. Get user email from Google.
  const userResponse = await $fetch<IResUser>(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    }
  ).catch(() => null);

  if (!userResponse || !userResponse.email)
    return sendRedirect(event, "/?error=no_email");

  if (!userResponse.email_verified)
    return sendRedirect(event, "/?error=email_not_verified");

  // 4. Find or create user in DB.
  const db = useDb();
  let users: IUser[] = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.email, userResponse.email))
    .limit(1);

  // Sign up new user.
  if (!users.length) {
    const newUsers = await db
      .insert(userSchema)
      .values({
        email: userResponse.email,
        username: userResponse.email.split("@")[0]!.replace(/[\.]/gim, "-"),
      })
      .returning();
    users = newUsers
  }

  // 5. Create JWT for user.
  const token = signJwt({
    userId: users[0]!.id,
    email: users[0]!.email,
    googleAccessToken: tokenResponse.access_token,
  });

  // 6. Set JWT as cookie.
  setCookie(
    event,
    "auth_token",
    token,
    {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    },
  );

  // 7. Redirect to user page.
  return sendRedirect(event, "/dashboard");
});
