import { Controller, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventActivityService } from './event-activity.service'
import { GetEventActivitiesDto } from './dto'
import { UUIDParam } from '@common/types'

@Controller()
@ApiTags('EventActivity')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class EventActivityController {
  constructor(private readonly eventActivityService: EventActivityService) {}

  @Get('event-categories/:id/activities')
  @HttpCode(HttpStatus.OK)
  async getAllEventActivitiesByCategoryId(@Param() { id }: UUIDParam) {
    return await this.eventActivityService.getByCategoryId(id)
  }

  @Get('event-activities')
  @HttpCode(HttpStatus.OK)
  async getAllEventActivities(@Query() params: GetEventActivitiesDto) {
    return await this.eventActivityService.getAll(params)
  }
}
