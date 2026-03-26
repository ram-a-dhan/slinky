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
    .where(eq(userSchema.id, payload.userId));

  if (!users.length) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "User not found.",
  });

  // Log access time for user.
  await access(
    db,
    userSchema,
    eq(userSchema.id, users[0]?.id!),
    { count: false },
  );

  return users[0];
});