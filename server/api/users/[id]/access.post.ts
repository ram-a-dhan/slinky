import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  const id = getRouterParams(event)?.id;

  if (!id) throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "User ID required.",
  });

  const db = useDb();

  await db
    .update(userSchema)
    .set({ lastAccessedAt: new Date() })
    .where(eq(userSchema.id, id));

  return {
    statusCode: HTTP_STATUS.NO_CONTENT,
    statusMessage: "Access time updated.",
  }
});
