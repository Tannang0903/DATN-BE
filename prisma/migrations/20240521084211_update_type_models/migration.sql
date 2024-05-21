/*
  Warnings:

  - You are about to alter the column `eventName` on the `ExternalProof` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `address` on the `ExternalProof` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE "EventRole" ALTER COLUMN "name" SET DATA TYPE VARCHAR(128),
ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ExternalProof" ALTER COLUMN "eventName" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(128);

-- AlterTable
ALTER TABLE "StudentEventRegister" ALTER COLUMN "description" SET DATA TYPE TEXT,
ALTER COLUMN "rejectReason" SET DATA TYPE TEXT;
