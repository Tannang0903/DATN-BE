-- AlterTable
ALTER TABLE "EventOrganization" ALTER COLUMN "email" DROP NOT NULL;

-- AlterTable
ALTER TABLE "EventOrganizationContact" ALTER COLUMN "email" DROP NOT NULL;
