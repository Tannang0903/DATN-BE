/*
  Warnings:

  - Changed the type of `proofStatus` on the `Proof` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Proof" DROP COLUMN "proofStatus",
ADD COLUMN     "proofStatus" "ProofStatus" NOT NULL;
