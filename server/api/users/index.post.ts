import { eq } from "drizzle-orm";
import { users as userSchema } from "#server/database/schema";

export default defineEventHandler(async (event) => {
  try {
    const email: string | undefined = (await readBody(event))?.email;

    if (!email) throw createError({
      statusCode: 400,
      statusMessage: "Email required.",
    });

    if (!REGEX.EMAIL.test(email)) throw createError({
      statusCode: 400,
      statusMessage: "Email invalid.",
    });

    const db = useDb();
    const users = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.email, email));

    if (users.length) throw createError({
      statusCode: 400,
      statusMessage: "Email already registered.",
    });

    const newUsers = await db
      .insert(userSchema)
      .values({
        email,
        username: email.split("@")[0]!,
      })
      .returning();

    return {
      statusCode: 201,
      statusMessage: "User created.",
      data: newUsers[0],
    };
  } catch (error) {
    return error;
  }
});