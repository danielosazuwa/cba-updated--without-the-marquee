/*
  Warnings:

  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD');

-- CreateEnum
CREATE TYPE "PaymentPlans" AS ENUM ('ONE_TIME', 'TWO_TIMES', 'THREE_TIMES');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "amount" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL,
    "amountSettled" DOUBLE PRECISION NOT NULL,
    "stampDuty" DOUBLE PRECISION,
    "transactionId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SingleCourseEnrollment" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "paymentPlan" "PaymentPlans" NOT NULL DEFAULT 'ONE_TIME',
    "isDiscount" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SingleCourseEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseInstallments" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "currentRepeat" INTEGER NOT NULL DEFAULT 0,
    "targetRepeat" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "paymentPlans" "PaymentPlans" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseInstallments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CardDetails" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "firstDigits" TEXT NOT NULL,
    "lastDigits" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "card_type" TEXT NOT NULL,
    "expiry_month" TEXT NOT NULL,
    "expiry_year" TEXT NOT NULL,

    CONSTRAINT "CardDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseInstallmentsToPayments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Payments_userId_transactionId_idx" ON "Payments"("userId", "transactionId");

-- CreateIndex
CREATE INDEX "SingleCourseEnrollment_userId_courseId_paymentId_idx" ON "SingleCourseEnrollment"("userId", "courseId", "paymentId");

-- CreateIndex
CREATE INDEX "CourseInstallments_id_transactionId_idx" ON "CourseInstallments"("id", "transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "_CourseInstallmentsToPayments_AB_unique" ON "_CourseInstallmentsToPayments"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseInstallmentsToPayments_B_index" ON "_CourseInstallmentsToPayments"("B");

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleCourseEnrollment" ADD CONSTRAINT "SingleCourseEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleCourseEnrollment" ADD CONSTRAINT "SingleCourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleCourseEnrollment" ADD CONSTRAINT "SingleCourseEnrollment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseInstallmentsToPayments" ADD CONSTRAINT "_CourseInstallmentsToPayments_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseInstallments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseInstallmentsToPayments" ADD CONSTRAINT "_CourseInstallmentsToPayments_B_fkey" FOREIGN KEY ("B") REFERENCES "Payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
