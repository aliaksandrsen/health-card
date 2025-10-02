# Agents Guide

## Context
Health Card is a Next.js 15 App Router project that helps users store and review healthcare visits. Authentication relies on Auth.js (NextAuth v5) with a credentials provider backed by Prisma and PostgreSQL. UI components live under `src/components`, and Tailwind CSS 4 utilities drive styling.

## Key workflows
- Authentication is handled through server-side actions in `src/app/(logged-out)` and the shared configuration defined in `auth.config.ts` plus `src/auth.ts`.
- Logged-in routes reside in `src/app/(logged-in)`, where server actions fetch, create, and delete visits.
- Pagination logic is encapsulated in `src/app/(logged-in)/visits/utils.ts` and consumed by `VisitsPagination.tsx`.

## Important files and directories
- `auth.config.ts`: shared Auth.js configuration and route-guard callbacks.
- `src/auth.ts`: Auth.js handler, credentials provider implementation, and session callbacks.
- `middleware.ts`: wires Auth.js middleware into Next.js routing.
- `src/lib/prisma.ts`: Prisma client singleton; reuse it for database access.
- `prisma/schema.prisma`: authoritative schema for `User` and `Visit` models plus migrations.
- `src/app/(logged-in)/visits/actions.ts`: server actions for listing, reading, creating, and deleting visits.
- `src/components/ui`: shadcn-inspired primitives (button, card, form, etc.).

## Commands cheat sheet
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Run migrations locally: `npx prisma migrate dev`
- Seed sample data: `npx prisma db seed`
- Test suite: `npm test`
- Lint and formatting: `npm run lint`, `npm run format`

## Environment requirements
Set the following keys in `.env`:
- `DATABASE_URL` pointing at a PostgreSQL instance.
- `AUTH_SECRET` for token signing.
- `AUTH_URL` matching the site origin (use `http://localhost:3000` locally).

## Implementation notes
- Server actions must include the `'use server'` directive and should rely on `auth()` to validate sessions.
- Stick to existing UI primitives and the `cn` helper in `src/lib/utils.ts` for composing class names.
- Keep Prisma-related logic inside server contexts; the client singleton already guards against hot-reload leaks.
- Tests use Vitest with Testing Library; place new test files next to their targets using the `.test.tsx` suffix.
- When writing unit tests, assign selectors to variables instead of embedding them directly in `expect` expressions.
- When possible, avoid mocking other UI components so tests stay closer to full integration behavior.
- When adding dependencies, use `npm` to keep `package-lock.json` in sync.
