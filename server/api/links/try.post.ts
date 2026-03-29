import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const body: ILink = await readBody(event);

    if (!body?.target) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Link target required.",
    });

    if (body?.target && !REGEX.LINK_TARGET.test(body.target))
      throw createError({
        statusCode: HTTP_STATUS.BAD_REQUEST,
        statusMessage: "Link target invalid, must be valid HTTP/HTTPS URL.",
      });

    const db = useDb();

    const newLinks = await db
      .insert(linkSchema)
      .values({
        slug: nanoid(16),
        target: body.target,
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