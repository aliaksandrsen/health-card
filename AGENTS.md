# Agents Guide

## Context
Health Card is a Next.js 15 App Router project that helps users store and review healthcare visits. Authentication relies on Auth.js (NextAuth v5) with a credentials provider backed by Prisma and PostgreSQL. UI components live under `src/components`, and Tailwind CSS 4 utilities drive styling.

## Commands

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server

### Database
- `npx prisma migrate dev` - Run migrations in development
- `npm run migrate:deploy` - Deploy migrations to production
- `npx prisma db seed` - Seed sample data
- `npx prisma generate` - Generate Prisma Client (runs automatically on install)
- `npx prisma studio` - Open Prisma Studio GUI

### Testing
- `npm test` - Run all tests in watch mode
- `npm test -- --run` - Run all tests once
- `npm test -- path/to/file.test.tsx` - Run a single test file
- `npm test -- --ui` - Run tests with UI mode

### Linting & Formatting
- `npm run lint` - Check for lint errors with Biome
- `npm run format` - Format code with Biome
- `npm run typecheck` - Type-check with TypeScript (no emit)

## Code Style Guidelines

### Imports
- Use `@/` path alias for imports from `src/` directory
- Import order (enforced by Biome's organizeImports):
  1. External packages (e.g., `react`, `next`, `zod`)
  2. Internal aliases starting with `@/` (e.g., `@/auth`, `@/lib/prisma`, `@/components/ui/button`)
- Group imports by type: dependencies first, then internal modules
- Example:
  ```tsx
  import { redirect } from "next/navigation";
  import z from "zod";
  import { auth } from "@/auth";
  import prisma from "@/lib/prisma";
  import { Button } from "@/components/ui/button";
  ```

### Formatting
- Use tabs for indentation (configured in Biome)
- No semicolons (Biome default)
- Double quotes for strings
- Tailwind classes must be sorted (enforced by Biome's `useSortedClasses` rule)
- Use `cn()` helper from `@/lib/utils` to compose className strings
- Example: `className={cn(buttonVariants({ variant, size, className }))}`

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig)
- Always provide explicit types for:
  - Function parameters and return types
  - Exported types and interfaces
  - Server action input/output (e.g., `State`, `FetchVisitsInput`)
- Use `type` for object shapes and union types
- Use `interface` sparingly; prefer `type` for consistency
- Leverage type inference for local variables when obvious
- Example:
  ```tsx
  export type State = {
    errors?: {
      title?: string;
      content?: string;
      form?: string;
    };
  };
  ```

### Naming Conventions
- **Files**: camelCase for utilities, PascalCase for components
  - Components: `EditVisitForm.tsx`, `VisitsPagination.tsx`
  - Tests: `EditVisitForm.test.tsx` (colocated with source)
  - Server actions: `actions.ts`
  - Utilities: `utils.ts`, `prisma.ts`
- **Variables/Functions**: camelCase (`createVisit`, `fetchVisits`, `isPending`)
- **Types/Interfaces**: PascalCase (`State`, `FetchVisitsInput`, `NextAuthUser`)
- **Constants**: camelCase for most, UPPER_SNAKE_CASE for env/config constants
- **Components**: PascalCase function declarations (not arrow functions for named exports)
  ```tsx
  function Button({ className, ...props }: ButtonProps) {
    return <button className={cn(className)} {...props} />;
  }
  ```

### React & Next.js Patterns
- Use `"use client"` directive for client components (forms, interactive UI)
- Use `"use server"` directive at top of server action files
- Server actions:
  - Must validate session with `auth()` and redirect to `/login` if unauthorized
  - Accept `FormData` for form submissions
  - Return structured error states (e.g., `{ errors: { field?: string } }`)
  - Use Zod schemas for validation (`visitSchema.safeParse()`)
  - Use `z.treeifyError()` to extract field-specific error messages
- Client components:
  - Use `useActionState` for form state management
  - Use `isPending` to disable buttons during submission
  - Display field errors with `aria-invalid`, `aria-describedby`, and `role="alert"`
- Prefer server components by default; only use `"use client"` when necessary

### Error Handling
- Validate inputs with Zod schemas and return structured errors
- Catch database errors in try/catch blocks and return user-friendly messages
- Example pattern:
  ```tsx
  try {
    await prisma.visit.create({ data: { title, content, userId } });
  } catch {
    return {
      ...prevState,
      errors: { form: "Unable to create the visit right now. Please try again." },
    };
  }
  ```
- Don't expose raw error details to users; log them server-side if needed
- Use `redirect()` for navigation after successful mutations

### Testing
- Place test files next to source files with `.test.tsx` suffix
- Use Vitest + Testing Library (`@testing-library/react`)
- Structure:
  - Import from `vitest`: `describe`, `it`, `expect`, `vi`, `afterEach`
  - Import from Testing Library: `render`, `screen`, `cleanup`, `userEvent`
  - Mock server actions with `vi.mock()` and `vi.mocked()`
- Best practices:
  - **Assign selectors to variables** instead of embedding in `expect`:
    ```tsx
    const titleInput = screen.getByLabelText(/title/i);
    expect(titleInput).toHaveValue("Initial title");
    ```
  - Avoid mocking UI components; keep tests close to integration
  - Use `cleanup()` in `afterEach()` to reset DOM
  - Use `userEvent` for realistic user interactions (prefer over `fireEvent`)
  - Test user-facing behavior, not implementation details

### UI Components
- Use shadcn/ui-inspired primitives from `src/components/ui`
- Leverage Radix UI primitives (`@radix-ui/react-*`) for accessible base components
- Use `class-variance-authority` (cva) for component variants
- Always compose classes with `cn()` helper to merge Tailwind utilities safely
- Example button usage:
  ```tsx
  <Button type="submit" variant="destructive" size="sm" disabled={isPending}>
    {isPending ? "Saving..." : "Save Changes"}
  </Button>
  ```

## Key Workflows

### Authentication
- Handled via server actions in `src/app/(logged-out)` (login, register)
- Configuration split between `auth.config.ts` (shared) and `src/auth.ts` (providers, callbacks)
- Middleware in `middleware.ts` enforces route guards
- Session validation: call `auth()` in server actions/components

### Logged-In Routes
- Routes live in `src/app/(logged-in)`
- Server actions in `src/app/(logged-in)/visits/actions.ts` handle CRUD for visits
- Pagination logic in `src/app/(logged-in)/visits/utils.ts`, consumed by `VisitsPagination.tsx`

### Database Access
- **Always** use the Prisma singleton from `@/lib/prisma`
- Never instantiate new `PrismaClient()` instances (causes connection pool issues)
- Keep Prisma logic server-side only (server components, server actions)

## Important Files & Directories
- `auth.config.ts` - Shared Auth.js config, route callbacks
- `src/auth.ts` - Auth.js handler, credentials provider, session callbacks
- `middleware.ts` - Wires Auth.js into Next.js routing
- `src/lib/prisma.ts` - Prisma Client singleton (import from here)
- `src/lib/utils.ts` - Utility functions (`cn` helper)
- `prisma/schema.prisma` - Database schema for User and Visit models
- `src/app/(logged-in)/visits/actions.ts` - Server actions for visit CRUD
- `src/components/ui/` - Reusable UI primitives (button, card, input, etc.)
- `biome.jsonc` - Biome configuration for linting and formatting

## Environment Variables
Required keys in `.env` (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret for signing tokens
- `NEXTAUTH_URL` - Site origin (e.g., `http://localhost:3000`)

## Dependency Management
- Use `npm` to install packages (keeps `package-lock.json` in sync)
- Run `npm install <package>` to add dependencies
- Prisma Client regenerates automatically via `postinstall` script
