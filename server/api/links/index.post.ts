import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const body: { slug?: string; target?: string, userId?: string } = await readBody(event);

    // Allow either both slug and userId are present or both absent.
    if (!body?.slug && body?.userId || body?.slug && !body?.userId) {
        throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: "Link slug required.",
      });
    }

    if (!body?.target) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link target required.",
    });

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

    const db = useDb();

    if (body?.slug && body?.userId) {
      const links = await db
        .select()
        .from(linkSchema)
        .where(eq(linkSchema.slug, body.slug));

      if (links.length) throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: "Link slug already exists.",
      });
    }

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