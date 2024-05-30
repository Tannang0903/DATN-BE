/*
  Warnings:

  - You are about to drop the column `longtitude` on the `Event` table. All the data in the column will be lost.
  - Added the required column `longitude` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "longtitude",
ADD COLUMN     "longitude" INTEGER NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "EventAttendanceInfo" ALTER COLUMN "code" DROP NOT NULL;
