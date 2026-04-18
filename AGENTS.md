# Agents Guide

[README.md](README.md) is the primary source for general repository documentation: project overview, setup, common commands, environment variables, and high-level architecture. This file is the source for agent-specific guidance: use it for implementation entry points, repo conventions, and editing patterns.

## Where to start by area

### Authentication

- Better Auth configuration and adapter mapping live in [src/auth.ts](src/auth.ts).
- Session helper for server code lives in [src/lib/auth/get-session.ts](src/lib/auth/get-session.ts).
- Middleware integration lives in [middleware.ts](middleware.ts).
- Protected server code should call `getSession()` and redirect to `/login` when `session?.user` is missing.

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
- Keep database usage on the server side only.
- Server actions should keep the existing pattern: validate auth, validate input with Zod, scope queries by the authenticated user, then redirect on success.

### Database access

- Use the shared Drizzle client from [src/lib/drizzle.ts](src/lib/drizzle.ts).
- Prefer the data-access helpers in [src/lib/db/](src/lib/db/) instead of issuing raw queries from route files.
- Do not create ad-hoc database clients in app code.

### Auth/session assumptions

- `session.user.id` comes from Better Auth session in [src/lib/auth/get-session.ts](src/lib/auth/get-session.ts).
- User-owned queries should continue to scope by that ID.
- Public-vs-protected route behavior is controlled centrally in [middleware.ts](middleware.ts); avoid duplicating route-guard rules in many places.

## Repo conventions

### Runtime environment

- Always use `nvm` to run and switch Node.js versions in this repository.
- Use Node.js `24.14.1` for installs, tests, builds, and other project commands.

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
