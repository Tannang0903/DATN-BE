-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "introduction" SET DATA TYPE TEXT,
ALTER COLUMN "fullAddress" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "EventRole" ALTER COLUMN "name" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OrganizationInEvent" ALTER COLUMN "role" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OrganizationRepresentativeInEvent" ALTER COLUMN "role" SET DATA TYPE TEXT;
