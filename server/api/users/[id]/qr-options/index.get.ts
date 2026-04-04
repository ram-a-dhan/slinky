import { eq } from "drizzle-orm";
import { qrOptions as qrOptionSchema } from "#server/database/schema";
import { verifyUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);

    const userId = getRouterParams(event)?.id;
  
    if (!userId) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    verifyUser(payload, userId);

    const db = useDb();
  
    const qrOption = await db
      .select()
      .from(qrOptionSchema)
      .where(eq(qrOptionSchema.userId, userId))
      .get();
  
    return {
      statusCode: HTTP_STATUS.CREATED,
      statusMessage: "QR Options fetched.",
      data: qrOption,
    };
    
  } catch (error) {
    return error;
  }
});