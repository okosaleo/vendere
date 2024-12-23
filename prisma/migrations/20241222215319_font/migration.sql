/*
  Warnings:

  - The values [uikit] on the enum `CategoryTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CategoryTypes_new" AS ENUM ('template', 'fonts', 'icon');
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "CategoryTypes_new" USING ("category"::text::"CategoryTypes_new");
ALTER TYPE "CategoryTypes" RENAME TO "CategoryTypes_old";
ALTER TYPE "CategoryTypes_new" RENAME TO "CategoryTypes";
DROP TYPE "CategoryTypes_old";
COMMIT;
