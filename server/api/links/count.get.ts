import { and, count, eq, ilike, isNull, or } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const { search = undefined, userId = undefined }: IParamsLink = getQuery(event);
  
    if (search && search.trim().length < 4) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Search query must be at least 4 characters long."
    });
  
    const whereClause = [];

    if (search) whereClause.push(
      or(
          ilike(linkSchema.slug, `%${search}%`),
          ilike(linkSchema.target, `%${search}%`),
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