import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { EventOrganizationController } from './event-organization.controller'
import { EventOrganizationService } from './event-organization.service'

@Module({
  imports: [DatabaseModule],
  controllers: [EventOrganizationController],
  providers: [EventOrganizationService],
  exports: [EventOrganizationService]
})
export class EventOrganizationModule {}
