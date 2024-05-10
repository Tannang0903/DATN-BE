-- CreateEnum
CREATE TYPE "RegisterStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Internal', 'External', 'Hybrid');

-- CreateEnum
CREATE TYPE "ProofType" AS ENUM ('Internal', 'External');

-- CreateTable
CREATE TABLE "IdentityUser" (
    "id" UUID NOT NULL,
    "fullname" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "refresh_token" TEXT,

    CONSTRAINT "pk_identity_user" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityRole" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "can_be_updated" BOOLEAN NOT NULL DEFAULT true,
    "can_be_deleted" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pk_identity_role" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pk_verification_token" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "fullname" VARCHAR(50) NOT NULL,
    "gender" BOOLEAN NOT NULL,
    "birth" TIMESTAMP(3) NOT NULL,
    "hometown" VARCHAR(128),
    "address" VARCHAR(128),
    "imageUrl" TEXT NOT NULL,
    "citizenId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "homeroom_id" UUID NOT NULL,
    "education_program_id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeRoom" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "faculty_id" UUID NOT NULL,

    CONSTRAINT "HomeRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationProgram" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "requiredActivityScore" INTEGER NOT NULL,
    "requiredCredit" INTEGER NOT NULL,

    CONSTRAINT "EducationProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventActivity" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "minScore" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "event_category_id" UUID,

    CONSTRAINT "EventActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCategory" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,

    CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendanceInfo" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" UUID NOT NULL,

    CONSTRAINT "EventAttendanceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistrationInfo" (
    "id" UUID NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event_id" UUID NOT NULL,

    CONSTRAINT "EventRegistrationInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "introduction" VARCHAR(128) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EventType" NOT NULL,
    "fullAddress" VARCHAR(128) NOT NULL,
    "longtitude" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "event_activity_id" UUID,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRole" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "score" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "isNeedApprove" BOOLEAN NOT NULL,
    "event_id" UUID NOT NULL,

    CONSTRAINT "EventRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentEventRegister" (
    "id" UUID NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "status" "RegisterStatus" NOT NULL,
    "register_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "rejectReason" VARCHAR(250),
    "student_id" UUID NOT NULL,
    "event_role_id" UUID NOT NULL,

    CONSTRAINT "StudentEventRegister_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendance" (
    "id" UUID NOT NULL,
    "event_attendance_info_id" UUID NOT NULL,
    "student_event_register_id" UUID NOT NULL,
    "attendance_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationInEvent" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "role" VARCHAR(250) NOT NULL,

    CONSTRAINT "OrganizationInEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationRepInEvent" (
    "organization_in_event_id" UUID NOT NULL,
    "organization_contact_id" UUID NOT NULL,
    "role" VARCHAR(250) NOT NULL,

    CONSTRAINT "OrganizationRepInEvent_pkey" PRIMARY KEY ("organization_in_event_id","organization_contact_id")
);

-- CreateTable
CREATE TABLE "EventOrganization" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(250),
    "email" TEXT NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "address" VARCHAR(128),
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "EventOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOrganizationContact" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "gender" BOOLEAN,
    "birth" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "address" VARCHAR(128),
    "imageUrl" TEXT NOT NULL,
    "position" TEXT,
    "organizer_id" UUID NOT NULL,
    "identity_id" UUID NOT NULL,

    CONSTRAINT "EventOrganizationContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequestEvent" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "introduction" VARCHAR(128),
    "description" VARCHAR(250) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EventType" NOT NULL,
    "fullAddress" VARCHAR(250) NOT NULL,
    "longtitude" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "organizationName" TEXT NOT NULL,
    "organizationDescription" TEXT,
    "organizationEmail" TEXT NOT NULL,
    "organizationPhone" TEXT NOT NULL,
    "organizationAddress" TEXT,
    "organizationContactName" TEXT NOT NULL,
    "organizationContactGender" BOOLEAN,
    "organizationContactBirth" TIMESTAMP(3),
    "organizationContactEmail" TEXT NOT NULL,
    "organizationContactPhone" TEXT NOT NULL,
    "event_activity_id" UUID,

    CONSTRAINT "RequestEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "code" TEXT NOT NULL,
    "referenceId" TEXT,
    "type" "ProofType",

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Proof" (
    "id" UUID NOT NULL,
    "description" VARCHAR(250),
    "type" "ProofType",
    "imageUrl" TEXT,
    "attendance_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalProof" (
    "id" UUID NOT NULL,
    "eventName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activity_id" UUID NOT NULL,
    "role" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ExternalProof_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalProof" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "InternalProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdentityUser_email_key" ON "IdentityUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityRole_name_key" ON "IdentityRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Student_code_key" ON "Student"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Student_citizenId_key" ON "Student"("citizenId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_name_key" ON "Faculty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HomeRoom_name_key" ON "HomeRoom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationProgram_name_key" ON "EducationProgram"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendanceInfo_code_key" ON "EventAttendanceInfo"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EventOrganization_email_key" ON "EventOrganization"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventOrganizationContact_email_key" ON "EventOrganizationContact"("email");

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "fk_verification_token_user" FOREIGN KEY ("user_id") REFERENCES "IdentityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "fk_user_to_role_user" FOREIGN KEY ("user_id") REFERENCES "IdentityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "fk_user_to_role_role" FOREIGN KEY ("role_id") REFERENCES "IdentityRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "IdentityRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_homeroom_id_fkey" FOREIGN KEY ("homeroom_id") REFERENCES "HomeRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_education_program_id_fkey" FOREIGN KEY ("education_program_id") REFERENCES "EducationProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "IdentityUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeRoom" ADD CONSTRAINT "HomeRoom_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventActivity" ADD CONSTRAINT "EventActivity_event_category_id_fkey" FOREIGN KEY ("event_category_id") REFERENCES "EventCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendanceInfo" ADD CONSTRAINT "EventAttendanceInfo_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistrationInfo" ADD CONSTRAINT "EventRegistrationInfo_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_event_activity_id_fkey" FOREIGN KEY ("event_activity_id") REFERENCES "EventActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRole" ADD CONSTRAINT "EventRole_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventRegister" ADD CONSTRAINT "StudentEventRegister_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentEventRegister" ADD CONSTRAINT "StudentEventRegister_event_role_id_fkey" FOREIGN KEY ("event_role_id") REFERENCES "EventRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendance" ADD CONSTRAINT "EventAttendance_event_attendance_info_id_fkey" FOREIGN KEY ("event_attendance_info_id") REFERENCES "EventAttendanceInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendance" ADD CONSTRAINT "EventAttendance_student_event_register_id_fkey" FOREIGN KEY ("student_event_register_id") REFERENCES "StudentEventRegister"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationInEvent" ADD CONSTRAINT "OrganizationInEvent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationInEvent" ADD CONSTRAINT "OrganizationInEvent_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "EventOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationRepInEvent" ADD CONSTRAINT "OrganizationRepInEvent_organization_in_event_id_fkey" FOREIGN KEY ("organization_in_event_id") REFERENCES "OrganizationInEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationRepInEvent" ADD CONSTRAINT "OrganizationRepInEvent_organization_contact_id_fkey" FOREIGN KEY ("organization_contact_id") REFERENCES "EventOrganizationContact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizationContact" ADD CONSTRAINT "EventOrganizationContact_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "EventOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizationContact" ADD CONSTRAINT "EventOrganizationContact_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "IdentityUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestEvent" ADD CONSTRAINT "RequestEvent_event_activity_id_fkey" FOREIGN KEY ("event_activity_id") REFERENCES "EventActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalProof" ADD CONSTRAINT "ExternalProof_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "EventActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalProof" ADD CONSTRAINT "InternalProof_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalProof" ADD CONSTRAINT "InternalProof_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "EventRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
