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

Copy `.env` file from `.env.example`:

```bash
cp .env.example .env
```

For production, change `.env` database URL to Turso and fill the token:

```bash
DB_URL=libsql://example-db.turso.io
DB_TOKEN=example-token-123
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

## Development Server

Edit your `hosts` file:

```bash
sudo nano /etc/hosts 
```

Add this line:

```bash
127.0.0.1       dev.slinky.app
```

Start dev server on `http://dev.slinky.app:3000`:

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
