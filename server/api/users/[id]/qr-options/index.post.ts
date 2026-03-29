import { qrOptions as qrOptionSchema } from "#server/database/schema";
import { IQrOptions } from "#shared/types/data";
import { verifyUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);
    
    const userId = getRouterParams(event)?.id;
    const body = await readBody<IQrOptions>(event);
  
    if (!userId) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    verifyUser(payload, userId);

    const db = useDb();
  
    const qrOptions = await db
      .insert(qrOptionSchema)
      .values({
        userId,
        style: body.style,
        color1: body.color1,
        color2: body.color2,
        gradientType: body.gradientType,
        gradientAngle: body.gradientAngle,
        imageUrl: body.imageUrl,
      })
      .onConflictDoUpdate({
        target: qrOptionSchema.userId,
        set: {
          style: body.style,
          color1: body.color1,
          color2: body.color2,
          gradientType: body.gradientType,
          gradientAngle: body.gradientAngle,
          imageUrl: body.imageUrl,
        },
      })
      .returning();
  
    return {
      statusCode: HTTP_STATUS.CREATED,
      statusMessage: "QR Options saved.",
      data: qrOptions,
    };
  } catch (error) {
    return error;
  }
});