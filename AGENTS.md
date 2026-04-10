# Agents Guide

[README.md](README.md) is the primary source for general repository documentation: project overview, setup, common commands, environment variables, and high-level architecture. This file is the source for agent-specific guidance: use it for implementation entry points, repo conventions, and editing patterns.

## Where to start by area

### Authentication

- Route authorization rules live in [auth.config.ts](auth.config.ts).
- Auth.js provider wiring, bcrypt password verification, and session/JWT enrichment live in [src/auth.ts](src/auth.ts).
- Middleware integration lives in [middleware.ts](middleware.ts).
- Protected server code should call `auth()` and redirect to `/login` when `session?.user` is missing.

### Visits domain

- Visit CRUD is centralized in [src/app/(logged-in)/visits/actions.ts](<src/app/(logged-in)/visits/actions.ts>).
- Visit pages, pagination UI, and route-local components live under [src/app/(logged-in)/visits/](<src/app/(logged-in)/visits/>).
- When changing visit behavior, check both the route files and colocated tests before editing.

### Shared UI

- Reusable primitives live in [src/components/ui/](src/components/ui/).
- Cross-route components live in [src/components/](src/components/).
- Authenticated shell components such as the header live alongside the logged-in layout in [src/app/(logged-in)/components/](<src/app/(logged-in)/components/>).

## Implementation rules

### Server and client boundaries

- Prefer Server Components by default.
- Add `"use client"` only for interactive UI, browser-only hooks, or form state that must run on the client.
- Keep Prisma usage on the server side only.
- Server actions should keep the existing pattern: validate auth, validate input with Zod, scope queries by the authenticated user, then redirect on success.

### Prisma

- Always import the shared Prisma client from [src/lib/prisma.ts](src/lib/prisma.ts).
- Do not create ad-hoc `new PrismaClient()` instances.
- This repo uses `@prisma/adapter-pg` through `PrismaPg`, so follow the existing setup instead of switching connection styles.

### Auth/session assumptions

- `session.user.id` is populated in the NextAuth callbacks in [src/auth.ts](src/auth.ts).
- User-owned queries should continue to scope by that ID.
- Public-vs-protected route behavior is controlled centrally in [auth.config.ts](auth.config.ts); avoid duplicating route-guard rules in many places.

## Repo conventions

### Imports and paths

- Use the `@/` alias for imports from `src/`.
- Keep imports compatible with the existing `simple-import-sort` ESLint setup.

### Formatting

- Prettier uses tabs, semicolons, and double quotes.
- Tailwind class ordering is handled by `prettier-plugin-tailwindcss`.
- Use `cn()` from [src/lib/utils.ts](src/lib/utils.ts) when composing class names.

### TypeScript

- The project uses strict TypeScript.
- Prefer `type` aliases over `interface` unless there is a specific reason not to.
- Match existing explicit typing around exported server action state and props.

### Component/file patterns

- Components use PascalCase filenames.
- Route-local mutations usually live in `actions.ts`.
- Tests are colocated with implementation using `*.test.tsx`.

## Testing guidance

- Vitest runs in `jsdom`; setup is in [vitest.setup.ts](vitest.setup.ts).
- Follow existing test patterns in:
  - [src/app/(logged-out)/login/page.test.tsx](<src/app/(logged-out)/login/page.test.tsx>)
  - [src/app/(logged-in)/page.test.tsx](<src/app/(logged-in)/page.test.tsx>)
  - [src/components/VisitPreviewCard.test.tsx](src/components/VisitPreviewCard.test.tsx)
- Prefer testing user-visible behavior over implementation details.
- When editing route-level forms or server-action-backed UI, update colocated tests in the same area.

## CI-aware workflow

- CI runs `pnpm typecheck`, `pnpm lint`, `pnpm test:coverage`, and `pnpm build` from [.github/workflows/ci.yml](.github/workflows/ci.yml).
- SonarQube also runs in CI, so keep coverage and static-analysis cleanliness in mind when changing behavior.

## Documentation hierarchy

- Put primary project documentation in [README.md](README.md).
- Keep this file focused on agent-specific guidance that would be noisy or overly implementation-oriented in the README.
- Keep [CLAUDE.md](CLAUDE.md) thin and layered on top of this file.
