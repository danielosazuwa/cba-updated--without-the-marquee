/*
  Warnings:

  - You are about to drop the column `price` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "price",
ADD COLUMN     "amount" BIGINT DEFAULT 0;
