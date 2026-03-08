import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParams(event)?.id;

  if (!id) throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "Link ID required.",
  });

  const db = useDb();
  const links = await db
    .update(linkSchema)
    .set({ lastAccessedAt: new Date() })
    .where(eq(linkSchema.id, id));

  if (!links.rowsAffected) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found.",
  });

  return {
    statusCode: HTTP_STATUS.NO_CONTENT,
    statusMessage: "Access time updated.",
  }
});
