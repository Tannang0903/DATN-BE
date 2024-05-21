import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { EventCategoryController } from './event-category.controller'
import { EventCategoryService } from './event-category.service'

@Module({
  imports: [DatabaseModule],
  controllers: [EventCategoryController],
  providers: [EventCategoryService],
  exports: [EventCategoryService]
})
export class EventCategoryModule {}
