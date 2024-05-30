/*
  Warnings:

  - A unique constraint covering the columns `[event_id,organization_id]` on the table `OrganizationInEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrganizationInEvent_event_id_organization_id_key" ON "OrganizationInEvent"("event_id", "organization_id");
