import { asc, desc, like, or } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "asc",
      search = undefined,
    }: IParams<IUser> = getQuery(event);

    if (search && search.length < 4) throw createError({
      statusCode: 400,
      statusMessage: "Search query must be at least 4 characters long."
    });

    const db = useDb();
    const users = await db
      .select()
      .from(userSchema)
      .where(
        search
          ? or(
              like(userSchema.email, `%${search}%`),
              like(userSchema.username, `%${search}%`),
            )
          : undefined,
      )
      .orderBy((order === "asc" ? asc : desc)(userSchema[sort]))
      .limit(Number(limit))
      .offset(((Number(page)) - 1) * Number(limit));

    return users;
  } catch (error) {
    return error;
  }
});
