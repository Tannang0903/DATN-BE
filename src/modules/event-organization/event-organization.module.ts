import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { EventOrganizationController } from './event-organization.controller'
import { EventOrganizationService } from './event-organization.service'
import { UserModule } from '@modules/users'
import { RoleModule } from '@modules/roles'

@Module({
  imports: [DatabaseModule, UserModule, RoleModule],
  controllers: [EventOrganizationController],
  providers: [EventOrganizationService],
  exports: [EventOrganizationService]
})
export class EventOrganizationModule {}
