import { and, eq, ne } from "drizzle-orm";
import { users as userSchema, links as linkSchema } from "#server/database/schema";
import { verifyUser } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);

    const id = getRouterParams(event)?.id;
    const body: { slug?: string; target?: string, userId?: string } = await readBody(event);

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link ID required.",
    });

    if (!body?.userId) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID required.",
    });

    verifyUser(payload, body.userId);

    if (!body?.slug) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link slug required.",
    });

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

    await scanUrl(body.target);

    const db = useDb();

    const links = await db
      .select()
      .from(linkSchema)
      .where(eq(linkSchema.id, id));

    if (!links.length) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "Link not found.",
    });

    if (links[0]?.userId !== body.userId) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "User ID does not match link owner.",
    });

    const existingLinks = await db
      .select()
      .from(linkSchema)
      .where(and(eq(linkSchema.slug, body.slug), ne(linkSchema.id, id)))
      .limit(1);

    if (existingLinks.length) throw createError({
      statusCode: HTTP_STATUS.CONFLICT,
      statusMessage: "Link slug already exists.",
    });

    const updatedLinks = await db
      .update(linkSchema)
      .set({ slug: body.slug, target: body.target })
      .where(eq(linkSchema.id, id))
      .returning();

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Link updated.",
      data: updatedLinks[0],
    };

  } catch (error) {
    return error;
  }
});