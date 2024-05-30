-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizationRepresentativeId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "organizationRepresentativeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationRepresentativeId_fkey" FOREIGN KEY ("organizationRepresentativeId") REFERENCES "OrganizationInEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
