/*
  Migration: rename column authorId -> userId on Visit preserving existing data.
  Steps:
    1. Drop old FK constraint (name may differ if previously customized)
    2. Rename column
    3. Recreate FK with new column name
*/

-- 1. Drop old foreign key constraint referencing authorId
ALTER TABLE "public"."Visit" DROP CONSTRAINT IF EXISTS "Visit_authorId_fkey";

-- 2. Rename column (data preserved)
ALTER TABLE "public"."Visit" RENAME COLUMN "authorId" TO "userId";

-- 3. Add new foreign key constraint (adjust ON DELETE as needed: RESTRICT | CASCADE | SET NULL)
ALTER TABLE "public"."Visit" ADD CONSTRAINT "Visit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
