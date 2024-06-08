/*
  Warnings:

  - You are about to drop the column `studentId` on the `Proof` table. All the data in the column will be lost.
  - Added the required column `student_id` to the `Proof` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proof" DROP COLUMN "studentId",
ADD COLUMN     "student_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Proof" ADD CONSTRAINT "Proof_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
