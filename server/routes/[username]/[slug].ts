import { and, eq } from "drizzle-orm";
import { links as linkSchema, users as userSchema } from "#server/database/schema";
import { access } from "#server/utils/access";

export default defineEventHandler(async (event) => {
  setHeader(event, "X-Robots-Tag", "noindex, nofollow");

  const username = getRouterParams(event)?.username;
  const slug = getRouterParams(event)?.slug;

  if (!username || !slug) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  const db = useDb();

  const result = await db
    .select()
    .from(linkSchema)
    .innerJoin(userSchema, eq(linkSchema.userId, userSchema.id))
    .where(and(
      eq(linkSchema.slug, slug),
      eq(userSchema.username, username),
    ))
    .limit(1)
    .get();
    
  if (!result?.links?.target) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  // Log access time for link and user.
  await db.transaction(async (tx) => {
    await access(
      tx,
      linkSchema,
      eq(linkSchema.id, result.links.id!),
    );
    await access(
      tx,
      userSchema,
      eq(userSchema.id, result.users.id!),
    );
  });

  const config = useRuntimeConfig();

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />

        <title>Slinky - Redirecting...</title>

        <!-- OG tags -->
        <meta property="og:title" content="Slinky - URL Shortener" />
        <meta property="og:description" content="Shorten long URLs in one click, generate QR codes, with style!" />
        <meta property="og:image" content="${config.public.BASE_URL}/og-image.png" />
        <meta property="og:url" content="${config.public.BASE_URL}/${username}/${slug}" />

        <!-- Twitter/X card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="${config.public.BASE_URL}/og-image.png" />

        <style>
          html { background: #ffffff; }
          @media (prefers-color-scheme: dark) {
            html { background: #000000; }
          }
        </style>

        <meta http-equiv="refresh" content="0;url=${result.links.target}" />
        <script>window.location.replace("${result.links.target}")<\/script>
      </head>
      <body></body>
    </html>
  `;

  setHeader(event, "Content-Type", "text/html");

  return html;
});