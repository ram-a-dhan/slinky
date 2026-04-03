import { eq } from "drizzle-orm";
import { users as userSchema, links as linkSchema, qrOptions as qrOptionSchema } from "#server/database/schema";
import { verifyUser } from "#server/utils/auth";
import { del } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);

    const id = getRouterParams(event)?.id;

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    verifyUser(payload, id);

    // Revoke Google account access.
    if (payload.googleAccessToken) {
      await $fetch(
        `https://oauth2.googleapis.com/revoke?token=${payload.googleAccessToken}`,
        { method: HTTP_METHOD.POST },
      ).catch(() => null);
    }

    // Delete user from DB.
    const db = useDb();
    const result = await db.transaction(async (tx) => {
      const link = await tx
        .delete(linkSchema)
        .where(eq(linkSchema.userId, id))
        .returning()
        .get();

      const qrOption = await tx
        .delete(qrOptionSchema)
        .where(eq(qrOptionSchema.userId, id))
        .returning()
        .get();

      const user = await tx
        .delete(userSchema)
        .where(eq(userSchema.id, id))
        .returning()
        .get();

      return {
        user,
        qrOption,
        link,
      };
    });

    if (!result.user) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "User not found.",
    });

    // Remove QR image asset if exists.
    if (result.qrOption?.imageUrl) {
      const config = useRuntimeConfig();

      await del(
        result.qrOption.imageUrl,
        { token: config.BLOB_READ_WRITE_TOKEN },
      ).catch(() => null);
    }

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "User deleted.",
    };
  } catch (error) {
    return error;
  }
});