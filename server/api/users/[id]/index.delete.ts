import { eq } from "drizzle-orm";
import { users as userSchema, links as linkSchema } from "#server/database/schema";
import { verifyUser } from "#server/utils/auth";

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
      const links = await tx
        .delete(linkSchema)
        .where(eq(linkSchema.userId, id));
      const user = await tx
        .delete(userSchema)
        .where(eq(userSchema.id, id));
      return {
        user,
        links,
      };
    });

    if (!result.user.rowsAffected && !result.links.rowsAffected) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "User not found.",
    });

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "User deleted.",
    };
  } catch (error) {
    return error;
  }
});