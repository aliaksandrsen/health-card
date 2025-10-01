# Health Card

Health Card is a Next.js 15 application for tracking healthcare visits and storing notes connected to each appointment. It ships with authentication, visit management, and a responsive interface tailored for patient record keeping.

**Live demo:** https://health-card-xi.vercel.app/

## Features
- Credentials-based authentication powered by Auth.js (NextAuth) and Prisma
- Registration and sign-in flows with React Hook Form and Zod validation
- Dashboard that shows up to six recent visits on the home page
- Paginated visits index (four items per page) with quick links to visit details
- Visit creation, detail display, and deletion workflows
- Responsive UI built with Tailwind CSS 4 utilities and shadcn-inspired components

## Tech Stack
- Next.js 15 App Router with Server Components and Server Actions
- Auth.js (NextAuth v5) credentials provider for username/password auth
- Prisma ORM targeting PostgreSQL
- React 19 with TypeScript for type safety
- Tailwind CSS 4, tw-animate, class-variance-authority, and Radix UI primitives
- Biome for linting/formatting and Vitest with Testing Library for tests

## Prerequisites
- Node.js 20 or newer (Next.js 15 requires >= 18.18; 20 LTS is recommended)
- npm 10 (bundled with supported Node.js versions)
- PostgreSQL database accessible from your development environment

## Environment variables
Create a `.env` file in the repository root and define the values below.

| Variable | Description |
| --- | --- |
| DATABASE_URL | PostgreSQL connection, e.g. `postgresql://user:password@localhost:5432/your_app` |
| AUTH_SECRET | Secret used by Auth.js to sign and encrypt tokens (`openssl rand -base64 32`) |
| AUTH_URL | Base URL Auth.js uses for callback URLs (set to `http://localhost:3000` locally) |

Next.js also honors `NEXT_PUBLIC_*` variables for client-facing configuration if you introduce them later.

## Getting started
1. Install dependencies.
   ```bash
   npm install
   ```
2. Apply the database schema.
   ```bash
   npx prisma migrate dev
   ```
   For production or CI environments run `npx prisma migrate deploy` instead.
3. (Optional) Seed the database with demo users and visits.
   ```bash
   npx prisma db seed
   ```
   The seed script creates accounts such as `alice@example.com` with the password `password123`.

## Running the application
- Start the development server with Turbopack:
  ```bash
  npm run dev
  ```
- Build an optimized production bundle:
  ```bash
  npm run build
  ```
- Serve the production build:
  ```bash
  npm start
  ```

## Quality checks
- Run unit and component tests:
  ```bash
  npm test
  ```
- Lint the codebase with Biome:
  ```bash
  npm run lint
  ```
- Apply formatting fixes:
  ```bash
  npm run format
  ```

## Project structure
```
src/
  app/                Next.js App Router routes, layouts, and server actions
  components/         Shared UI building blocks (including shadcn-style primitives)
  lib/                Prisma client setup and utility helpers
  types/              Type augmentations for third-party libraries
prisma/               Prisma schema, migrations, and seed script
```

## Database models
- `User`: account metadata, hashed passwords, and relations to visits.
- `Visit`: belongs to a user and stores visit title, content, and timestamps.

## Testing notes
Tests live next to the code they cover (for example `src/app/(logged-in)/visits/VisitsPagination.test.tsx`) and run in a JSDOM environment via Vitest and Testing Library. Use `npm test` to execute the full suite or `npm test -- --watch` for an interactive loop.
