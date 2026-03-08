import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParams(event)?.slug;

    if (!slug) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link slug required.",
    });

    const db = useDb();
    const links = await db
      .select()
      .from(linkSchema)
      .where(eq(linkSchema.slug, slug));

    if (!links.length) throw createError({
      statusCode: HTTP_STATUS.NOT_FOUND,
      statusMessage: "Link not found.",
    });

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Link target fetched.",
      data: links[0],
    };
  } catch (error) {
    return error;
  }
});
