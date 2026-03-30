import { and, count, eq, isNull, like, or } from "drizzle-orm";
import { users as userSchema, links as linkSchema } from "#server/database/schema";

export const countUsers = async (searchUser: string | undefined) => {
  if (searchUser && searchUser.trim().length < 4) throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "Search query must be at least 4 characters long."
  });

  const db = useDb();
  
  return await db
    .select({ count: count() })
    .from(userSchema)
    .where(searchUser
      ? or(
          like(userSchema.email, `%${searchUser}%`),
          like(userSchema.username, `%${searchUser}%`),
        )
      : undefined
    );
};

export const countLinks = async (searchLink: string | undefined, userIdLink: string | undefined) => {
  if (searchLink && searchLink.trim().length < 4) throw createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "Search query must be at least 4 characters long."
  });

  const whereClause = [];

  if (searchLink) whereClause.push(
    or(
      like(linkSchema.slug, `%${searchLink}%`),
      like(linkSchema.target, `%${searchLink}%`),
    ),
  );
    
  if (userIdLink !== undefined && userIdLink !== "undefined") {
    if (userIdLink === null && userIdLink === "null") {
      whereClause.push(isNull(linkSchema.userId));
    } else {
      whereClause.push(eq(linkSchema.userId, userIdLink));
    }
  }

  const db = useDb();
  return await db
    .select({ count: count() })
    .from(linkSchema)
    .where(whereClause.length
      ? and(...whereClause)
      : undefined,
    );
};
