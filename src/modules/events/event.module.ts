import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { UserModule } from '../users/users.module'
import { EventController } from './event.controller'
import { EventService } from './event.service'

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
