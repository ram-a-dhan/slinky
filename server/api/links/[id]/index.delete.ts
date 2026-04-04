import { eq, sql } from "drizzle-orm";
import { users as userSchema, links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event);

    const id = getRouterParams(event)?.id;

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link ID required.",
    });

    const db = useDb();

    const result = await db.transaction(async (tx) => {
      const link = await tx
        .delete(linkSchema)
        .where(eq(linkSchema.id, id))
        .returning()
        .get();

      let user;
      if (link?.userId) {
        user = await tx
          .update(userSchema)
          .set({
            hitCount: sql`hit_count - ${link.hitCount}`,
            linkCount: sql`link_count - 1`,
          })
          .where(eq(userSchema.id, link.userId))
          .returning()
          .get();
      }

      return {
        link,
        user,
      }
    });

    if (!result.link) throw createError({
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