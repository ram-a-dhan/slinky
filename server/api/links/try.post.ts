import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";
import { rateLimit } from "#server/utils/limit";

export default defineEventHandler(async (event) => {
  try {
    const ip = getRequestIP(event, { xForwardedFor: true });

    if (ip && !import.meta.dev) await rateLimit(ip, 3, 24);

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

    await scanUrl(body.target);

    const db = useDb();

    const newLink = await db
      .insert(linkSchema)
      .values({
        slug: nanoid(16),
        target: body.target,
      })
      .returning()
      .get();

    return {
      statusCode: HTTP_STATUS.CREATED,
      statusMessage: "Link created.",
      data: newLink,
    };
  } catch (error) {
    return error;
  }
});