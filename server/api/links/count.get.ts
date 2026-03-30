import { and, count, eq, like, isNull, or } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";
import { verifyUser } from "#server/utils/auth";
import { countLinks } from "#server/utils/count";

export default defineEventHandler(async (event) => {
  try {
    const payload = requireAuth(event);

    const { search = undefined, userId = undefined }: IParamsLink = getQuery(event);
  
    if (userId) verifyUser(payload, userId);

    const linkCount = await countLinks(search, userId);
  
    return {
      statusCode: HTTP_STATUS.OK,
      statusMessage: "Link count fetched.",
      data: linkCount[0],
    };
  } catch (error) {
    return error;
  }
});