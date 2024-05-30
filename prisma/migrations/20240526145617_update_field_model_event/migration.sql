-- DropForeignKey
ALTER TABLE "EventAttendanceInfo" DROP CONSTRAINT "EventAttendanceInfo_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventRegistrationInfo" DROP CONSTRAINT "EventRegistrationInfo_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventRole" DROP CONSTRAINT "EventRole_event_id_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationInEvent" DROP CONSTRAINT "OrganizationInEvent_event_id_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationRepresentativeInEvent" DROP CONSTRAINT "OrganizationRepresentativeInEvent_organization_in_event_id_fkey";

-- AddForeignKey
ALTER TABLE "EventAttendanceInfo" ADD CONSTRAINT "EventAttendanceInfo_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistrationInfo" ADD CONSTRAINT "EventRegistrationInfo_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRole" ADD CONSTRAINT "EventRole_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationInEvent" ADD CONSTRAINT "OrganizationInEvent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationRepresentativeInEvent" ADD CONSTRAINT "OrganizationRepresentativeInEvent_organization_in_event_id_fkey" FOREIGN KEY ("organization_in_event_id") REFERENCES "OrganizationInEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
