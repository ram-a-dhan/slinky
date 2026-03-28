import { eq } from "drizzle-orm";
import { qrOptions as qrOptionSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  const userId = getRouterParams(event)?.id;

  if (!userId) throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "User ID required.",
  });

  const db = useDb();

  const qrOptions = await db
    .select()
    .from(qrOptionSchema)
    .where(eq(qrOptionSchema.userId, userId));

  return {
    statusCode: HTTP_STATUS.CREATED,
    statusMessage: "QR Options fetched.",
    data: qrOptions[0],
  };
});