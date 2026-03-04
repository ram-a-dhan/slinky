import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParams(event)?.id;

    if (!id) throw createError({
      statusCode: 400,
      statusMessage: "User ID required.",
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

    await db
      .update(userSchema)
      .set({ lastAccessedAt: new Date() })
      .where(eq(userSchema.id, id));

    return users[0];
  } catch (error) {
    return error;
  }
});
