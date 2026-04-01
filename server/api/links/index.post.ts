import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { users as userSchema, links as linkSchema } from "#server/database/schema";
import { verifyUser } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);

    const body: ILink = await readBody(event);

    if (!body?.slug) {
        throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: "Link slug required.",
      });
    }

    if (!body?.target) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link target required.",
    });

    if (!body?.userId) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    verifyUser(payload, body.userId);

    if (body?.slug && !REGEX.LINK_SLUG.test(body.slug))
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: "Link slug invalid, must be minimum 8 characters aphanumeric, underscore, or hyphen.",
      });

    if (body?.target && !REGEX.LINK_TARGET.test(body.target))
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: "Link target invalid, must be valid HTTP/HTTPS URL.",
      });

    await scanUrl(body.target);

    const db = useDb();

    const links = await db
      .select()
      .from(linkSchema)
      .where(eq(linkSchema.slug, body.slug))
      .limit(1);

    if (links.length) throw createError({
      statusCode: HTTP_STATUS.CONFLICT,
      statusMessage: "Link slug already exists.",
    });

    const users = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, body.userId));

    if (!users.length) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "User not found.",
    });

    const newLinks = await db
      .insert(linkSchema)
      .values({
        slug: body.slug || nanoid(16),
        target: body.target,
        userId: body.userId || null,
      })
      .returning();

    return {
      statusCode: HTTP_STATUS.CREATED,
      statusMessage: "Link created.",
      data: newLinks[0],
    };
  } catch (error) {
    return error;
  }
});