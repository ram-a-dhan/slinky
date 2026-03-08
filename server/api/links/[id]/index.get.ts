import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParams(event)?.id;

    if (!id) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link ID required.",
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

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Link fetched.",
      data: links[0],
    };
  } catch (error) {
    return error;
  }
});
