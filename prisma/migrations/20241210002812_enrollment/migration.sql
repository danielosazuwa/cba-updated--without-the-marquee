/*
  Warnings:

  - You are about to drop the column `amount` on the `Course` table. All the data in the column will be lost.
  - Added the required column `userId` to the `CourseInstallments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAddress` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Currency" ADD VALUE 'GBP';

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "amount",
ADD COLUMN     "amount_in_GBP" BIGINT DEFAULT 0,
ADD COLUMN     "amount_in_NGN" BIGINT DEFAULT 0,
ADD COLUMN     "amount_in_USD" BIGINT DEFAULT 0;

-- AlterTable
ALTER TABLE "CourseInstallments" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ipAddress" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CourseInstallments" ADD CONSTRAINT "CourseInstallments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
