import { eq } from "drizzle-orm";
import { qrOptions as qrOptionSchema } from "#server/database/schema";
import { IQrOptions } from "#shared/types/data";
import { verifyUser } from "#server/utils/auth";
import { put, del } from "@vercel/blob";

interface IQrValues extends Partial<Omit<IQrOptions, "id" | "userId" | "style" | "gradientType">> {
  style?: string;
  gradientType?: string;
}

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);
    
    const userId = getRouterParams(event)?.id;
    const body = await readMultipartFormData(event);
  
    if (!body) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Invalid multipart form data.",
    });
  
    if (!userId) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    verifyUser(payload, userId);

    const db = useDb();
  
    let imageUrl;
    const image = body.find((field) => field.name === "image");

    if (image) {
      const existing = await db
        .select()
        .from(qrOptionSchema)
        .where(eq(qrOptionSchema.userId, userId));

      const config = useRuntimeConfig();
      
      if (existing?.[0]?.imageUrl) {
        await del(
          existing[0].imageUrl,
          { token: config.BLOB_READ_WRITE_TOKEN },
        );
      }

      const extension = image.filename?.split(".").pop();
      const imageBlob = await put(
        `${Date.now()}.${extension}`,
        image.data!,
        {
          access: "public",
          addRandomSuffix: true,
          contentType: image.type,
          token: config.BLOB_READ_WRITE_TOKEN,
        },
      );

      imageUrl = imageBlob.url;
    }

    const values: IQrValues = {
      style: body.find((field) => field.name === "style")?.data.toString(),
      color1: body.find((field) => field.name === "color1")?.data.toString(),
      color2: body.find((field) => field.name === "color2")?.data.toString(),
      gradientType: body.find((field) => field.name === "gradientType")?.data.toString(),
      gradientAngle: Number(body.find((field) => field.name === "gradientAngle")?.data.toString()),
      imageUrl,
    };
    
    const qrOptions = await db
      .insert(qrOptionSchema)
      .values({
        userId,
        style: values.style,
        color1: values.color1,
        color2: values.color2,
        gradientType: values.gradientType,
        gradientAngle: values.gradientAngle,
        imageUrl: values.imageUrl,
      })
      .onConflictDoUpdate({
        target: qrOptionSchema.userId,
        set: {
          style: values.style,
          color1: values.color1,
          color2: values.color2,
          gradientType: values.gradientType,
          gradientAngle: values.gradientAngle,
          imageUrl: values.imageUrl,
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