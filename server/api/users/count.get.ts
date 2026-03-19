import { count, like, or } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const { search = undefined }: IParams<IUser> = getQuery(event);
  
    if (search && search.trim().length < 4) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Search query must be at least 4 characters long."
    });
  
    const db = useDb();
    const userCount = await db
      .select({ count: count() })
      .from(userSchema)
      .where(search
        ? or(
            like(userSchema.email, `%${search}%`),
            like(userSchema.username, `%${search}%`),
          )
        : undefined
      );
  
    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "User count fetched.",
      data: userCount[0],
    };
  } catch (error) {
    return error;
  }
});