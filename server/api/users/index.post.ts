import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event, { isAdminOnly: true });

    const email: string | undefined = (await readBody(event))?.email;

    if (!email) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Email required.",
    });

    if (!REGEX.EMAIL.test(email)) throw createError({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      statusMessage: "Email invalid.",
    });

    const db = useDb();
    const existingUser = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email))
      .limit(1)
      .get();

    if (existingUser) throw createError({
      statusCode: HTTP_STATUS.CONFLICT,
      statusMessage: "Email already registered.",
    });

    const newUser = await db
      .insert(userSchema)
      .values({
        email,
        username: email.split("@")[0]!.replace(/[\_\-\.]/gim, ""),
      })
      .returning()
      .get();

    return {
      statusCode: HTTP_STATUS.CREATED,
      statusMessage: "User created.",
      data: newUser,
    };
  } catch (error) {
    return error;
  }
});