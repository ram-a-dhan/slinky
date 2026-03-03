# Slinky - URL Shortener

## Requirements

- `node` >= 18.x.x
- `pnpm` >= 10.30.3

## Initialization

Install the dependencies:

```bash
pnpm install
```

## Setup Database

Create and seed the database:

```bash
pnpm run db:setup
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed
```

Use Drizzle Studio to check database:

```bash
pnpm run db:studio
```

## Development Server

Start dev server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Change .env database URL to Turso and fill the token:

```bash
DB_URL=libsql://example-db.turso.io
DB_TOKEN=example-token-123
```

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```
