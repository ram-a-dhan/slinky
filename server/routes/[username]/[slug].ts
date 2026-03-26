import { and, eq } from "drizzle-orm";
import { links as linkSchema, users as userSchema } from "#server/database/schema";
import { access } from "#server/utils/access";

export default defineEventHandler(async (event) => {
  setHeader(event, "X-Robots-Tag", "noindex, nofollow");

  const username = getRouterParams(event)?.username;
  const slug = getRouterParams(event)?.slug;

  if (!username || !slug) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  const db = useDb();

  const result = await db
    .select()
    .from(linkSchema)
    .innerJoin(userSchema, eq(linkSchema.userId, userSchema.id))
    .where(and(
      eq(linkSchema.slug, slug),
      eq(userSchema.username, username),
    ))
    .limit(1);

  if (!result?.[0]?.links?.target) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  // Log access time for link and user.
  await db.transaction(async (tx) => {
    await access(
      tx,
      linkSchema,
      eq(linkSchema.id, result[0]?.links.id!),
    );
    await access(
      tx,
      userSchema,
      eq(userSchema.id, result[0]?.users.id!),
    );
  });

  return sendRedirect(
    event,
    result[0].links.target,
    HTTP_STATUS.FOUND,
  );
});