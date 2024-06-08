-- AlterEnum
ALTER TYPE "ProofType" ADD VALUE 'Special';

-- AddForeignKey
ALTER TABLE "InternalProof" ADD CONSTRAINT "InternalProof_id_fkey" FOREIGN KEY ("id") REFERENCES "Proof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalProof" ADD CONSTRAINT "ExternalProof_id_fkey" FOREIGN KEY ("id") REFERENCES "Proof"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialProof" ADD CONSTRAINT "SpecialProof_id_fkey" FOREIGN KEY ("id") REFERENCES "Proof"("id") ON DELETE CASCADE ON UPDATE CASCADE;
