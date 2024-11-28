-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_adminId_fkey";

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "adminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
