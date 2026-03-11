import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";
import { verifyJwt } from "#server/utils/jwt";

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "auth_token");

  if (!token) throw createError({
    statusCode: HTTP_STATUS.NOT_AUTHENTICATED,
    statusMessage: "Not authenticated.",
  });

  const payload = verifyJwt(token);

  if (!payload) throw createError({
    statusCode: HTTP_STATUS.NOT_AUTHENTICATED,
    statusMessage: "Token invalid or expired.",
  });

  const db = useDb();
  const users = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, payload.userId))
    .limit(1);

  if (!users.length) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "User not found.",
  });

  return users[0];
});