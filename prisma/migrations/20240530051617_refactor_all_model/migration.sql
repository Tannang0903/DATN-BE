/*
  Warnings:

  - You are about to drop the column `type` on the `Proof` table. All the data in the column will be lost.
  - You are about to alter the column `citizenId` on the `Student` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to drop the column `register_at` on the `StudentEventRegister` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `StudentEventRegister` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `StudentEventRegister` table. All the data in the column will be lost.
  - You are about to drop the `EventAttendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RequestEvent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationName` to the `ExternalProof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proofStatus` to the `Proof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proofType` to the `Proof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Proof` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `StudentEventRegister` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `StudentEventRegister` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventAttendance" DROP CONSTRAINT "EventAttendance_event_attendance_info_id_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendance" DROP CONSTRAINT "EventAttendance_student_event_register_id_fkey";

-- DropForeignKey
ALTER TABLE "RequestEvent" DROP CONSTRAINT "RequestEvent_event_activity_id_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdBy" UUID;

-- AlterTable
ALTER TABLE "EventOrganization" ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ExternalProof" ADD COLUMN     "organizationName" TEXT NOT NULL,
ALTER COLUMN "eventName" SET DATA TYPE TEXT,
ALTER COLUMN "address" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Proof" DROP COLUMN "type",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "proofStatus" INTEGER NOT NULL,
ADD COLUMN     "proofType" "ProofType" NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL,
ALTER COLUMN "attendance_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "citizenId" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "StudentEventRegister" DROP COLUMN "register_at",
DROP COLUMN "update_at",
DROP COLUMN "updatedBy",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" UUID NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_by" UUID NOT NULL;

-- DropTable
DROP TABLE "EventAttendance";

-- DropTable
DROP TABLE "RequestEvent";

-- CreateTable
CREATE TABLE "StudentEventAttendance" (
    "id" UUID NOT NULL,
    "event_attendance_info_id" UUID NOT NULL,
    "student_event_register_id" UUID NOT NULL,
    "attendance_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentEventAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialProof" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activity_id" UUID NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SpecialProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentEventAttendance_student_event_register_id_key" ON "StudentEventAttendance"("student_event_register_id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "IdentityUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventAttendance" ADD CONSTRAINT "StudentEventAttendance_event_attendance_info_id_fkey" FOREIGN KEY ("event_attendance_info_id") REFERENCES "EventAttendanceInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventAttendance" ADD CONSTRAINT "StudentEventAttendance_student_event_register_id_fkey" FOREIGN KEY ("student_event_register_id") REFERENCES "StudentEventRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialProof" ADD CONSTRAINT "SpecialProof_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "EventActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
