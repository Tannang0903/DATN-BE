/*
  Warnings:

  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "EventActivity" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EventCategory" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Invitation";
