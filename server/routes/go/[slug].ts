import { and, eq, isNull } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";
import { access } from "#server/utils/access";

export default defineEventHandler(async (event) => {
  setHeader(event, "X-Robots-Tag", "noindex, nofollow");

  const slug = getRouterParams(event)?.slug;

  if (!slug) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  const db = useDb();

  const result = await db
    .select()
    .from(linkSchema)
    .where(and(
      eq(linkSchema.slug, slug),
      isNull(linkSchema.userId),
    ))
    .limit(1);

  if (!result?.[0]?.target) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  // Log access time for link.
  await access(
    db,
    linkSchema,
    eq(linkSchema.id, result[0].id),
  );

  return sendRedirect(
    event,
    result[0].target,
    HTTP_STATUS.FOUND,
  );
});