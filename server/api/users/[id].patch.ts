import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParams(event)?.id;
    const username = (await readBody(event))?.username;

    if (!id) throw createError({
      statusCode: 400,
      statusMessage: "User ID required.",
    });

    if (!username) throw createError({
      statusCode: 400,
      statusMessage: "Username required.",
    });

    if (!REGEX.USERNAME.test(username)) throw createError({
      statusCode: 400,
      statusMessage: "Username invalid. Must be 8-16 characters, alphanumeric, underscores, or hyphens.",
    });

    const db = useDb();
    const users = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));

    if (!users.length) throw createError({
      statusCode: 404,
      statusMessage: "User not found.",
    });

    const updatedUsers = await db
      .update(userSchema)
      .set({
        username,
        lastAccessedAt: new Date(),
      })
      .where(eq(userSchema.id, id))
      .returning();

    return {
      statusCode: 200,
      statusMessage: "User updated.",
      data: updatedUsers[0],
    };

  } catch (error) {
    return error;
  }
});