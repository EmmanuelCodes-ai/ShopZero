# Shop Zero

Marketplace starter monorepo for a Next.js storefront and WhatsApp Cloud API sales channel.

## Layout

- `apps/web` — search-first customer storefront
- `services/whatsapp` — Cloud API webhook and conversational cart entry point
- `packages/database` — Prisma schema and shared database client
- `packages/commerce` — channel-independent stock reservation and order logic

## Local start

1. Copy `.env.example` to `.env` and configure PostgreSQL and Meta credentials.
2. Run `pnpm install`, then `pnpm db:generate` and `pnpm db:migrate`.
3. Start the storefront with `pnpm dev:web` and bot service with `pnpm dev:whatsapp`.

## Consistency model

Both sales channels call `reserveStock` in `@shop-zero/commerce`. It uses a serializable transaction and an atomic conditional inventory decrement. A reservation expires after 15 minutes; checkout converts it to an order and finalizes stock. This avoids accepting the final unit twice.
