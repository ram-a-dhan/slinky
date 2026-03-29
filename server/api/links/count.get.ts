import { and, count, eq, like, isNull, or } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";
import { verifyUser } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);

    const { search = undefined, userId = undefined }: IParamsLink = getQuery(event);
  
    if (userId) verifyUser(payload, userId);

    if (search && search.trim().length < 4) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Search query must be at least 4 characters long."
    });
  
    const whereClause = [];

    if (search) whereClause.push(
      or(
          like(linkSchema.slug, `%${search}%`),
          like(linkSchema.target, `%${search}%`),
      ),
    );
      
    if (userId !== undefined && userId !== "undefined") {
      if (userId === null && userId === "null") {
        whereClause.push(isNull(linkSchema.userId));
      } else {
        whereClause.push(eq(linkSchema.userId, userId));
      }
    }
  
    const db = useDb();
    const linkCount = await db
      .select({ count: count() })
      .from(linkSchema)
      .where(whereClause.length ? and(...whereClause) : undefined);
  
    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Link count fetched.",
      data: linkCount[0],
    };
  } catch (error) {
    return error;
  }
});