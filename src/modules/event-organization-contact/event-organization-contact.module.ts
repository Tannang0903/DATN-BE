import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { EventOrganizationContactController } from './event-organization-contact.controller'
import { EventOrganizationContactService } from './event-organization-contact.service'
import { UserModule } from '@modules/users'
import { EventOrganizationModule } from '@modules/event-organization'
import { RoleModule } from '@modules/roles'

@Module({
  imports: [DatabaseModule, UserModule, EventOrganizationModule, RoleModule],
  controllers: [EventOrganizationContactController],
  providers: [EventOrganizationContactService],
  exports: [EventOrganizationContactService]
})
export class EventOrganizationContactModule {}
