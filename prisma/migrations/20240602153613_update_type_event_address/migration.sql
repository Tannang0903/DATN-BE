/*
  Warnings:

  - You are about to alter the column `longitude` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(20,20)`.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "latitude" SET DATA TYPE DECIMAL,
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(20,20);
