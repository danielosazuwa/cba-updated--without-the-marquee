/*
  Warnings:

  - You are about to alter the column `amount_in_GBP` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `amount_in_NGN` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `amount_in_USD` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "amount_in_GBP" SET DATA TYPE INTEGER,
ALTER COLUMN "amount_in_NGN" SET DATA TYPE INTEGER,
ALTER COLUMN "amount_in_USD" SET DATA TYPE INTEGER;
