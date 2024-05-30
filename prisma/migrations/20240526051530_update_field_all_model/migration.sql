/*
  Warnings:

  - A unique constraint covering the columns `[organizationRepresentativeId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationRepresentativeId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "organizationRepresentativeId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_organizationRepresentativeId_key" ON "Event"("organizationRepresentativeId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationRepresentativeId_fkey" FOREIGN KEY ("organizationRepresentativeId") REFERENCES "OrganizationInEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
