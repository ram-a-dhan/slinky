import { and, eq, isNull } from "drizzle-orm";
import { links as linkSchema } from "#server/database/schema";
import { access } from "#server/utils/access";

export default defineEventHandler(async (event) => {
  setHeader(event, "X-Robots-Tag", "noindex, nofollow");

  const slug = getRouterParams(event)?.slug;

  if (!slug) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  const db = useDb();

  const link = await db
    .select()
    .from(linkSchema)
    .where(and(
      eq(linkSchema.slug, slug),
      isNull(linkSchema.userId),
    ))
    .limit(1)
    .get();

  if (!link?.target) throw createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Link not found."
  });

  // Log access time for link.
  await access(
    db,
    linkSchema,
    eq(linkSchema.id, link.id),
  );

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
        <meta property="og:url" content="${config.public.BASE_URL}/go/${slug}" />

        <!-- Twitter/X card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="${config.public.BASE_URL}/og-image.png" />

        <style>
          html { background: #ffffff; }
          @media (prefers-color-scheme: dark) {
            html { background: #000000; }
          }
        </style>

        <meta http-equiv="refresh" content="0;url=${link.target}" />
        <script>window.location.replace("${link.target}")<\/script>
      </head>
      <body></body>
    </html>
  `;

  setHeader(event, "Content-Type", "text/html");

  return html;
});