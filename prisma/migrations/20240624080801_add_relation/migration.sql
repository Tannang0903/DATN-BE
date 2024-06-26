-- DropForeignKey
ALTER TABLE "OrganizationInEvent" DROP CONSTRAINT "OrganizationInEvent_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationRepresentativeInEvent" DROP CONSTRAINT "OrganizationRepresentativeInEvent_organization_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentEventAttendance" DROP CONSTRAINT "StudentEventAttendance_event_attendance_info_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentEventAttendance" DROP CONSTRAINT "StudentEventAttendance_student_event_register_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentEventRegister" DROP CONSTRAINT "StudentEventRegister_event_role_id_fkey";

-- DropForeignKey
ALTER TABLE "StudentEventRegister" DROP CONSTRAINT "StudentEventRegister_student_id_fkey";

-- AddForeignKey
ALTER TABLE "OrganizationInEvent" ADD CONSTRAINT "OrganizationInEvent_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "EventOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationRepresentativeInEvent" ADD CONSTRAINT "OrganizationRepresentativeInEvent_organization_contact_id_fkey" FOREIGN KEY ("organization_contact_id") REFERENCES "EventOrganizationContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventAttendance" ADD CONSTRAINT "StudentEventAttendance_event_attendance_info_id_fkey" FOREIGN KEY ("event_attendance_info_id") REFERENCES "EventAttendanceInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventAttendance" ADD CONSTRAINT "StudentEventAttendance_student_event_register_id_fkey" FOREIGN KEY ("student_event_register_id") REFERENCES "StudentEventRegister"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventRegister" ADD CONSTRAINT "StudentEventRegister_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventRegister" ADD CONSTRAINT "StudentEventRegister_event_role_id_fkey" FOREIGN KEY ("event_role_id") REFERENCES "EventRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
