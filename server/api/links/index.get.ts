import { and, asc, desc, eq, isNull, like, or } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";
import { IParamsLink } from "~~/shared/types/fetch";

export default defineEventHandler(async (event) => {
  try {
    let {
      page = 1,
      size = 10,
      sort = "createdAt",
      order = "asc",
      search = undefined,
      userId = undefined,
    }: IParamsLink = getQuery(event);

    page = Number(page);
    size = Number(size);
    const offset = (page - 1) * size;
    const orderBy = order === "asc" ? asc : desc;

    if (search && search.length < 4) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Search query must be at least 4 characters long."
    });

    const whereClause = [];

    if (search) whereClause.push(
      or(
        like(linkSchema.source, `%${search}%`),
        like(linkSchema.target, `%${search}%`),
      )
    );
    
    if (userId !== undefined && userId !== "undefined") {
      if (userId === null && userId === "null") {
        whereClause.push(isNull(linkSchema.userId));
      } else {
        whereClause.push(eq(linkSchema.userId, userId));
      }
    }

    const db = useDb();
    const links = await db
      .select()
      .from(linkSchema)
      .where(whereClause.length ? and(...whereClause) : undefined)
      .orderBy(orderBy(linkSchema[sort]))
      .limit(size)
      .offset(offset);

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Links fetched.",
      data: links,
      paging: {
        page,
        size,
      },
    }
  } catch (error) {
    return error;
  }
});
