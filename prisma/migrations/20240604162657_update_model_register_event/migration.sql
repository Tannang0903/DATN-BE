-- DropIndex
DROP INDEX "StudentEventRegister_student_id_key";

-- AlterTable
ALTER TABLE "StudentEventRegister" ALTER COLUMN "updated_by" DROP NOT NULL;
