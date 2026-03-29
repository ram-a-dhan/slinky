import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event);

    const id = getRouterParams(event)?.id;

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link ID required.",
    });

    const db = useDb();
    const result = await db
      .delete(linkSchema)
      .where(eq(linkSchema.id, id));

    if (!result.rowsAffected) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "Link not found.",
    });

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Link deleted.",
    };
  } catch (error) {
    return error;
  }
});