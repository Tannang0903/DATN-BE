/*
  Warnings:

  - You are about to alter the column `name` on the `IdentityRole` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the column `fullname` on the `IdentityUser` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `IdentityUser` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `IdentityUser` table. All the data in the column will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[identity_id]` on the table `EventOrganizationContact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[identity_id]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "fk_verification_token_user";

-- AlterTable
ALTER TABLE "IdentityRole" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "IdentityUser" DROP COLUMN "fullname",
DROP COLUMN "phone",
DROP COLUMN "refresh_token";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "RolePermission";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_verification_token" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventOrganizationContact_identity_id_key" ON "EventOrganizationContact"("identity_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_identity_id_key" ON "Student"("identity_id");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "fk_verification_token_user" FOREIGN KEY ("user_id") REFERENCES "IdentityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
