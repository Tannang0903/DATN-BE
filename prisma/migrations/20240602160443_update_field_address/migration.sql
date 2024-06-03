/*
  Warnings:

  - You are about to alter the column `latitude` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(30,20)`.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(30,20),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(30,20);
