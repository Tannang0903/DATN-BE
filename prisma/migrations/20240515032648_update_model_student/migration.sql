/*
  Warnings:

  - Added the required column `gender` to the `EventOrganizationContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationContactGender` to the `RequestEvent` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "EventOrganizationContact" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "RequestEvent" DROP COLUMN "organizationContactGender",
ADD COLUMN     "organizationContactGender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;
