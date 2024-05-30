/*
  Warnings:

  - You are about to drop the `OrganizationRepInEvent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[identity_id]` on the table `EventOrganization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stutus` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identity_id` to the `EventOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Approved', 'Cancelled', 'Done', 'Expired', 'Happening', 'Pending', 'Rejected', 'Registration', 'Attendance', 'Upcoming', 'ClosedRegistration');

-- DropForeignKey
ALTER TABLE "OrganizationRepInEvent" DROP CONSTRAINT "OrganizationRepInEvent_organization_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationRepInEvent" DROP CONSTRAINT "OrganizationRepInEvent_organization_in_event_id_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stutus" "EventStatus" NOT NULL;

-- AlterTable
ALTER TABLE "EventOrganization" ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "identity_id" UUID NOT NULL;

-- DropTable
DROP TABLE "OrganizationRepInEvent";

-- CreateTable
CREATE TABLE "OrganizationRepresentativeInEvent" (
    "organization_in_event_id" UUID NOT NULL,
    "organization_contact_id" UUID NOT NULL,
    "role" VARCHAR(250) NOT NULL,

    CONSTRAINT "OrganizationRepresentativeInEvent_pkey" PRIMARY KEY ("organization_in_event_id","organization_contact_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventOrganization_identity_id_key" ON "EventOrganization"("identity_id");

-- AddForeignKey
ALTER TABLE "OrganizationRepresentativeInEvent" ADD CONSTRAINT "OrganizationRepresentativeInEvent_organization_in_event_id_fkey" FOREIGN KEY ("organization_in_event_id") REFERENCES "OrganizationInEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationRepresentativeInEvent" ADD CONSTRAINT "OrganizationRepresentativeInEvent_organization_contact_id_fkey" FOREIGN KEY ("organization_contact_id") REFERENCES "EventOrganizationContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganization" ADD CONSTRAINT "EventOrganization_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "IdentityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
