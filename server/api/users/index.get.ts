import { asc, desc, like, or } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    let {
      page = 1,
      size = 10,
      sort = "createdAt",
      order = "asc",
      search = undefined,
    }: IParams<IUser> = getQuery(event);

    page = Number(page);
    size = Number(size);
    const offset = (page - 1) * size;
    const orderBy = order === "asc" ? asc : desc;

    if (search && search.length < 4) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
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
      .orderBy(orderBy(userSchema[sort]))
      .limit(size)
      .offset(offset);

    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Users fetched.",
      data: users,
      paging: {
        page,
        size,
      },
    }
  } catch (error) {
    return error;
  }
});
