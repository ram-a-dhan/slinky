import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const body: { source?: string; target?: string, userId?: string } = await readBody(event);

    if (!body?.source) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link source required.",
    });

    if (!body?.target) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link target required.",
    });

    if (!REGEX.LINK_SOURCE.test(body.source)) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link source invalid.",
    });

    if (!REGEX.LINK_TARGET.test(body.target)) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link target invalid.",
    });

    const db = useDb();
    const links = await db
      .select()
      .from(linkSchema)
      .where(eq(linkSchema.source, body.source));

    if (links.length) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link source already exists.",
    });

    const newLinks = await db
      .insert(linkSchema)
      .values({
        source: body.source,
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