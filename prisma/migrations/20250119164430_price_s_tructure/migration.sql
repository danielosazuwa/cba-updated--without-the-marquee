/*
  Warnings:

  - You are about to drop the column `amount_in_GBP` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `amount_in_NGN` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `amount_in_USD` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "amount_in_GBP",
DROP COLUMN "amount_in_NGN",
DROP COLUMN "amount_in_USD",
ADD COLUMN     "price" JSONB;
