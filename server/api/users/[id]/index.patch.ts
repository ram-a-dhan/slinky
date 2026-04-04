import { and, eq, ne } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";
import { verifyUser } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);

    const id = getRouterParams(event)?.id;
    const username = (await readBody(event))?.username;

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    verifyUser(payload, id);

    if (!username) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Username required.",
    });

    if (!REGEX.USERNAME.test(username)) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Username invalid. Must be 8-16 alphanumeric characters.",
    });

    const db = useDb();
    // Find another user with the same username.
    const existingUser = await db
      .select()
      .from(userSchema)
      .where(and(eq(userSchema.username, username), ne(userSchema.id, id)))
      .limit(1)
      .get();

    if (existingUser) throw createError({
      statusCode: HTTP_STATUS.CONFLICT,
      statusMessage: "Username already exists.",
    });

    const updatedUser = await db
      .update(userSchema)
      .set({ username })
      .where(eq(userSchema.id, id))
      .returning()
      .get();

    if (!updatedUser) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "User not found.",
    });

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "User updated.",
      data: updatedUser,
    };

  } catch (error) {
    return error;
  }
});