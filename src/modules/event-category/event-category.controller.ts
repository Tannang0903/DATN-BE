import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { EventCategoryService } from './event-category.service'
import { GetEventCategoriesDto } from './dto'

@Controller()
@ApiTags('EventCategory')
export class EventCategoryController {
  constructor(private readonly eventCategoryService: EventCategoryService) {}

  @Get('event-categories')
  @HttpCode(HttpStatus.OK)
  async getAllEventCategories(@Query() params: GetEventCategoriesDto) {
    return await this.eventCategoryService.getAll(params)
  }
}
