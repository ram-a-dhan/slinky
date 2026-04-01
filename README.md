# Slinky - URL Shortener

## Requirements

- `node` >= 18.x.x
- `pnpm` >= 10.30.3

## Initialization

Install the dependencies:

```bash
pnpm install
```

## Setup

### Dotenv

Copy `.env` file from `.env.example`:

```bash
cp .env.example .env
```

### Database

For production, change `.env` database URL to Turso and fill the token:

```bash
TURSO_DB_URL=libsql://example-db.turso.io
TURSO_AUTH_TOKEN=example-token-123
```

Create and seed the database:

```bash
pnpm run db:push
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed
```

Use Drizzle Studio to check database:

```bash
pnpm run db:studio
```

### Google Sign-In

Make a new [OAuth Consent Screen](oauth-consent-screen) project at Google Cloud Console and add the credentials to your `.env`:

[oauth-consent-screen]: https://console.cloud.google.com/auth

```bash
GOOGLE_CLIENT_ID=your-client-id-123
GOOGLE_CLIENT_SECRET=your-client-secret-123
```

Add the Google Redirect URI from the `.env` to Google Cloud Console's client's Authorized Redirect URIs:

```baash
http://dev.slin.ky:3000/api/auth/google/callback
```

For production, change the redirect URI:

```bash
GOOGLE_REDIRECT_URI=http://<YOUR.PRODUCTION.DOMAIN>/api/auth/google/callback
```

### Google Safe Browsing

Enable [Safe Browsing API](safe-browsing-api) in API & Services at Google Cloud Console and get the API Key:

```bash
GOOGLE_SAFE_BROWSING_API_KEY=your-api-key
```

[safe-browsing-api]: https://console.cloud.google.com/apis/api/safebrowsing.googleapis.com

### Cloudflare Captcha

Get the Turnstile site key and secret key from the [Cloudflare Dashboard](cloudflare-dash) and put them into the `.env`:

```bash
TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
```

[cloudflare-dash]: https://dash.cloudflare.com/

### Vercel Storage

Setup a [Vercel Blob](vercel-blob) and make use of [Vercel CLI](vercel-cli):

```bash
pnpm add -g vercel
vercel link
vercel storage create
vercel env pull
```

After pulling the env, copy them from `.env.local` to `.env`:

```bash
BLOB_READ_WRITE_TOKEN=your-read-write-token
VERCEL_OIDC_TOKEN=your-vercel-oidc-token
```

[vercel-blob]: https://vercel.com/docs/vercel-blob/using-blob-sdk
[vercel-cli]: https://vercel.com/docs/cli/blob

### Miscellaneous

For production, change the base URL to your production base URL:

```bash
BASE_URL=<YOUR.PRODUCTION.DOMAIN>
```

## Development Server

Edit your `hosts` file:

```bash
sudo nano /etc/hosts 
```

Add this line:

```bash
127.0.0.1       dev.slin.ky
```

Start dev server on `http://dev.slin.ky:3000`:

```bash
pnpm dev
```

## Production

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```
