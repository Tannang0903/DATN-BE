/*
  Warnings:

  - Added the required column `fullname` to the `IdentityUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `IdentityUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_identity_id_fkey";

-- AlterTable
ALTER TABLE "IdentityUser" ADD COLUMN     "fullname" VARCHAR(50) NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "IdentityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
