import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventCategoryService } from './event-category.service'
import { GetEventCategoriesDto } from './dto'

@Controller()
@ApiTags('EventCategory')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class EventCategoryController {
  constructor(private readonly eventCategoryService: EventCategoryService) {}

  @Get('event-categories')
  @HttpCode(HttpStatus.OK)
  async getAllEventCategories(@Query() params: GetEventCategoriesDto) {
    return await this.eventCategoryService.getAll(params)
  }
}
