-- DropForeignKey
ALTER TABLE "EventOrganizationContact" DROP CONSTRAINT "EventOrganizationContact_identity_id_fkey";

-- AddForeignKey
ALTER TABLE "EventOrganizationContact" ADD CONSTRAINT "EventOrganizationContact_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "IdentityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
