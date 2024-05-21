import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventActivityService } from './event-activity.service'
import { GetEventActivitiesByCategoryIdDto, GetEventActivitiesDto } from './dto'

@Controller()
@ApiTags('EventActivity')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class EventActivityController {
  constructor(private readonly eventActivityService: EventActivityService) {}

  @Get('event-categories/:id/activities')
  @HttpCode(HttpStatus.OK)
  async getAllEventActivitiesByCategoryId(@Query() params: GetEventActivitiesByCategoryIdDto) {
    return await this.eventActivityService.getByCategoryId(params)
  }

  @Get('event-activities')
  @HttpCode(HttpStatus.OK)
  async getAllEventActivities(@Query() params: GetEventActivitiesDto) {
    return await this.eventActivityService.getAll(params)
  }
}
