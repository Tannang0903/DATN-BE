/*
  Warnings:

  - You are about to drop the column `organizer_id` on the `EventOrganizationContact` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_event_register_id]` on the table `EventAttendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `StudentEventRegister` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `EventCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `EventOrganizationContact` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategoryType" AS ENUM ('Event', 'Individual');

-- DropForeignKey
ALTER TABLE "EventOrganizationContact" DROP CONSTRAINT "EventOrganizationContact_organizer_id_fkey";

-- AlterTable
ALTER TABLE "EventCategory" ADD COLUMN     "type" "EventCategoryType" NOT NULL;

-- AlterTable
ALTER TABLE "EventOrganizationContact" DROP COLUMN "organizer_id",
ADD COLUMN     "organization_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_student_event_register_id_key" ON "EventAttendance"("student_event_register_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentEventRegister_student_id_key" ON "StudentEventRegister"("student_id");

-- AddForeignKey
ALTER TABLE "EventOrganizationContact" ADD CONSTRAINT "EventOrganizationContact_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "EventOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
