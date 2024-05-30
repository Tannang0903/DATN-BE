/*
  Warnings:

  - You are about to drop the column `stutus` on the `Event` table. All the data in the column will be lost.
  - Added the required column `status` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "stutus",
ADD COLUMN     "status" "EventStatus" NOT NULL;
