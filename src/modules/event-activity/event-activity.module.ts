import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { EventActivityController } from './event-activity.controller'
import { EventActivityService } from './event-activity.service'

@Module({
  imports: [DatabaseModule],
  controllers: [EventActivityController],
  providers: [EventActivityService],
  exports: [EventActivityService]
})
export class EventActivityModule {}
