import { count, like, or } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";
import { countUsers } from "#server/utils/count";

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event, { isAdminOnly: true });

    const { search = undefined }: IParams<IUser> = getQuery(event);

    const userCount = await countUsers(search);
  
    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "User count fetched.",
      data: userCount[0],
    };
  } catch (error) {
    return error;
  }
});