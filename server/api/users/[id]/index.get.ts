import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event, { isAdminOnly: true });

    const id = getRouterParams(event)?.id;

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    const db = useDb();
    const users = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));

    if (!users.length) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "User not found.",
    });

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "User fetched.",
      data: users[0],
    };
  } catch (error) {
    return error;
  }
});
