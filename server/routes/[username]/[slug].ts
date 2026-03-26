import { and, eq } from "drizzle-orm";
import { links as linkSchema, users as userSchema } from "#server/database/schema";

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

  // Log access time for link.
  await $fetch(
    `/api/links/${result?.[0]?.links?.id}/access`,
    { method: HTTP_METHOD.POST },
  ).catch(() => null);

  // Log access time for user.
  await $fetch(
    `/api/users/${result?.[0]?.users?.id}/access`,
    { method: HTTP_METHOD.POST },
  ).catch(() => null);

  return sendRedirect(
    event,
    result[0].links.target,
    HTTP_STATUS.FOUND,
  );
});