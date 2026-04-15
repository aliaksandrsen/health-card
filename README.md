# Health Card

Health Card is a Next.js 16 application for tracking healthcare visits and storing notes connected to each appointment. It ships with authentication, visit management, and a responsive interface tailored for patient record keeping.

**Live demo:** https://health-card-xi.vercel.app/

## Features

- Credentials-based authentication powered by Auth.js (NextAuth) and Drizzle ORM
- Registration and sign-in flows with React Hook Form and Zod validation
- Dashboard that shows up to six recent visits on the home page
- Paginated visits index (four items per page) with quick links to visit details
- Visit creation, detail display, edit, and deletion workflows
- Responsive UI built with Tailwind CSS 4 utilities and shadcn-inspired components

## Tech Stack

- Next.js 16 App Router with Server Components and Server Actions
- Auth.js (NextAuth v5) credentials provider for username/password auth
- Drizzle ORM targeting PostgreSQL through `postgres`
- React 19 with TypeScript
- Tailwind CSS 4, tw-animate, class-variance-authority, and Radix UI primitives
- ESLint + Prettier for linting/formatting and Vitest with Testing Library for tests

## Prerequisites

- Node.js 24.14.1
- pnpm 10.33.0
- PostgreSQL database accessible from your development environment

## Install Node.js and pnpm

### Install with nvm (recommended)

```bash
nvm install 24.14.1
nvm use 24.14.1
corepack enable
corepack prepare pnpm@10.33.0 --activate
```

If `node --version` does not print `v24.14.1`, install the required Node.js version first.

## Environment variables

Copy [.env.example](.env.example) to `.env` and provide the values below.

| Variable       | Description                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection, e.g. `postgresql://user:password@localhost:5432/your_app` |
| `AUTH_SECRET`  | Secret used by Auth.js to sign and encrypt tokens (`openssl rand -base64 32`)    |
| `NEXTAUTH_URL` | Site origin used for auth callbacks locally, usually `http://localhost:3000`     |

## Getting started

1. Install Node.js 24.14.1 and enable pnpm.
   ```bash
   nvm install 24.14.1
   nvm use 24.14.1
   corepack enable
   corepack prepare pnpm@10.33.0 --activate
   ```
2. Verify that pnpm is available.
   ```bash
   pnpm --version
   ```
3. Install dependencies.
   ```bash
   pnpm install
   ```
4. Generate and apply the database migrations.
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```
   For production or CI environments run `pnpm migrate:deploy` instead.
5. (Optional) Seed the database with demo users and visits.
   ```bash
   pnpm db:seed
   ```

## Common commands

### Development

- `pnpm dev` - start the development server with Turbopack
- `pnpm build` - build the production bundle
- `pnpm start` - serve the production bundle

### Quality checks

- `pnpm lint` - run ESLint
- `pnpm typecheck` - run TypeScript without emitting files
- `pnpm format` - apply Prettier formatting
- `pnpm format:check` - check formatting without writing

### Tests

- `pnpm test` - run Vitest in watch mode
- `pnpm test -- --run` - run the full suite once
- `pnpm test:coverage` - run the suite with coverage
- `pnpm test -- src/app/(logged-out)/login/page.test.tsx` - run a single test file
- `pnpm test -- --run src/app/(logged-in)/visits/page.test.tsx` - run a single test file once

### Database

- `pnpm db:generate` - generate SQL migrations from the Drizzle schema
- `pnpm db:migrate` - apply pending Drizzle migrations locally
- `pnpm migrate:deploy` - apply pending Drizzle migrations in deployment environments
- `pnpm db:studio` - open Drizzle Studio
- `pnpm db:seed` - seed the database with demo data

## Architecture overview

### App structure

- Routes live in [src/app/](src/app/).
- The app is split by auth state using route groups:
  - logged-in experience in [src/app/(logged-in)/](<src/app/(logged-in)/>)
  - logged-out auth pages in [src/app/(logged-out)/](<src/app/(logged-out)/>)
- Shared UI primitives live in [src/components/ui/](src/components/ui/).
- Shared app-level components live in [src/components/](src/components/).
- Drizzle schema and database client live in [src/lib/db/](src/lib/db/) and [src/lib/drizzle.ts](src/lib/drizzle.ts).
- Drizzle migrations live in [drizzle/](drizzle/).
- Seed logic lives in [scripts/seed.ts](scripts/seed.ts).

### Auth flow

Auth is intentionally split across three places:

- [auth.config.ts](auth.config.ts) defines public/protected route behavior.
- [src/auth.ts](src/auth.ts) wires the credentials provider, bcrypt password verification, and JWT/session callbacks.
- [middleware.ts](middleware.ts) applies auth enforcement across the app.

Protected layouts and server actions call `auth()` and redirect unauthenticated users to `/login`, for example in [src/app/(logged-in)/layout.tsx](<src/app/(logged-in)/layout.tsx>) and [src/app/(logged-in)/visits/actions.ts](<src/app/(logged-in)/visits/actions.ts>).

### Data model and server-side flow

The Drizzle schema in [src/lib/db/schema.ts](src/lib/db/schema.ts) contains two core models:

- `User`
- `Visit` linked to a user

Most application state is server-driven:

1. A Server Component or form triggers a server action.
2. The action resolves the current session with `auth()`.
3. Input is validated with Zod.
4. Database queries are scoped by `session.user.id`.
5. Successful mutations redirect with `next/navigation`.

Visit CRUD is centralized in [src/app/(logged-in)/visits/actions.ts](<src/app/(logged-in)/visits/actions.ts>).

### Database access

Use the shared Drizzle client from [src/lib/drizzle.ts](src/lib/drizzle.ts) together with the data-access helpers in [src/lib/db/](src/lib/db/). In development the client is cached on `globalThis`, and when `DATABASE_URL` is missing it returns a throwing proxy so builds/tests can still start until DB access is actually attempted.

### UI and state management

- Prefer Server Components by default.
- Client Components are used for interactive forms and local UI state.
- There is no global client-side state library; state is mainly handled through server rendering, redirects, `useActionState`, and `react-hook-form`.

## Testing and CI

- Vitest config lives in [vitest.config.mts](vitest.config.mts), using `jsdom` and setup from [vitest.setup.ts](vitest.setup.ts).
- Tests are colocated with implementation using `*.test.tsx`.
- CI is defined in [.github/workflows/ci.yml](.github/workflows/ci.yml) and runs install, typecheck, lint, coverage tests, build, and SonarQube scanning.

## Agent-specific guidance

For agent-specific implementation guidance, repo conventions, and editing entry points, see [AGENTS.md](AGENTS.md).
