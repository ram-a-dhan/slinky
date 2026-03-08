import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParams(event)?.id;
    const body: { slug?: string; target?: string } = await readBody(event);

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link ID required.",
    });

    if (!body.slug) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link slug required.",
    });

    if (!body.target) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link target required.",
    });

    if (!REGEX.LINK_SLUG.test(body.slug)) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link slug invalid.",
    });

    if (!REGEX.LINK_TARGET.test(body.target)) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link target invalid.",
    });

    const db = useDb();
    const links = await db
      .select()
      .from(linkSchema)
      .where(eq(linkSchema.id, id));

    if (!links.length) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "Link not found.",
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