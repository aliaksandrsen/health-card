-- Align existing tables with new snake_case mappings without losing data

-- Users table & columns
ALTER TABLE "public"."User" RENAME TO "users";
ALTER TABLE "public"."users" RENAME CONSTRAINT "User_pkey" TO "users_pkey";
ALTER TABLE "public"."users" RENAME COLUMN "emailVerified" TO "email_verified";
ALTER TABLE "public"."users" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."users" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER INDEX "public"."User_email_key" RENAME TO "users_email_key";

-- Visits table & columns
ALTER TABLE "public"."Visit" RENAME TO "visits";
ALTER TABLE "public"."visits" RENAME CONSTRAINT "Visit_pkey" TO "visits_pkey";
ALTER TABLE "public"."visits" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "public"."visits" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "public"."visits" RENAME COLUMN "userId" TO "user_id";

-- Ensure visit content is non-null before enforcing constraint
UPDATE "public"."visits" SET "content" = '' WHERE "content" IS NULL;
ALTER TABLE "public"."visits" ALTER COLUMN "content" SET NOT NULL;

-- Rename foreign key for clarity after column rename
ALTER TABLE "public"."visits" RENAME CONSTRAINT "Visit_userId_fkey" TO "visits_user_id_fkey";

-- Keep sequence names in sync with new tables
ALTER SEQUENCE "public"."User_id_seq" RENAME TO "users_id_seq";
ALTER SEQUENCE "public"."Visit_id_seq" RENAME TO "visits_id_seq";
ALTER TABLE "public"."users" ALTER COLUMN "id" SET DEFAULT nextval('"public"."users_id_seq"'::regclass);
ALTER TABLE "public"."visits" ALTER COLUMN "id" SET DEFAULT nextval('"public"."visits_id_seq"'::regclass);
