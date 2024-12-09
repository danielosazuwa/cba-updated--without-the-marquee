/*
  Warnings:

  - Added the required column `slug` to the `lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lesson" ADD COLUMN     "slug" TEXT NOT NULL;
