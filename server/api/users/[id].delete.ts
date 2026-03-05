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
    const result = await db
      .delete(userSchema)
      .where(eq(userSchema.id, id));

    if (!result.rowsAffected) throw createError({
      statusCode: 404,
      statusMessage: "User not found.",
    });

    return {
      statusCode: 200,
      statusMessage: "User deleted.",
    };
  } catch (error) {
    return error;
  }
});