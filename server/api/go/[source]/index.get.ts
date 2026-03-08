import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const source = getRouterParams(event)?.source;

    if (!source) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link source required.",
    });

    const db = useDb();
    const links = await db
      .select()
      .from(linkSchema)
      .where(eq(linkSchema.source, source));

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
