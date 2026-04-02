import { eq, lt } from "drizzle-orm";
import { rateLimits as rateLimitSchema } from "#server/database/schema";

export const rateLimit = async (ip: string, limit: number, hours: number) => {
  const now = Date.now();
  const time = hours * 60 * 60 * 1000;
  const resetAt = new Date(now + time);

  const db = useDb();

  // Clear requests that are past cooldown time. Consider if table rows become too many.
  // await db
  //   .delete(rateLimitSchema)
  //   .where(lt(rateLimitSchema.resetAt, new Date()))

  const existing = await db
    .select()
    .from(rateLimitSchema)
    .where(eq(rateLimitSchema.ip, ip))
    .get();

  // Upsert if not exist yet or past the cooldown time.
  if (!existing || existing.resetAt.getTime() < now) {
    await db
      .insert(rateLimitSchema)
      .values({
        ip,
        count: 1,
        resetAt,
      })
      .onConflictDoUpdate({
        target: rateLimitSchema.ip,
        set: {
          count: 1,
          resetAt,
        },
      });

    return;
  }

  // Restrict request over limit during cooldonw time.
  if (existing.count >= limit) {
    throw createError({
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      statusMessage: "Too many requests",
    });
  }

  // Increment count if still haven't reached limit.
  await db
    .update(rateLimitSchema)
    .set({ count: existing.count + 1 })
    .where(eq(rateLimitSchema.ip, ip));

  return;
};