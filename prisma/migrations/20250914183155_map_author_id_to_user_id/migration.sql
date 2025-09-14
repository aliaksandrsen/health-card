/*
  Warnings:

  - You are about to drop the column `published` on the `Visit` table. All the data in the column will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Visit" DROP COLUMN "published";
