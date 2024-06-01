import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventService } from './event.service'
import { ReqUser, Roles } from '@common/decorator'
import { RequestUser, UserRole, UUIDParam } from '@common/types'
import { CreateEventDto, GetEventsDto } from './dto'

@Controller()
@ApiTags('Event')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('events/:id')
  @HttpCode(HttpStatus.OK)
  async getEventById(@Param() { id }: UUIDParam) {
    return await this.eventService.getById(id)
  }

  @Get('events')
  @HttpCode(HttpStatus.OK)
  async getAllEvents(@Query() params: GetEventsDto) {
    return await this.eventService.getAll(params)
  }

  @Post('events')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async createEvent(@ReqUser() user: RequestUser, @Body() createEventDto: CreateEventDto) {
    return await this.eventService.create(user, createEventDto)
  }

  @Put('events/:id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async updateEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser, @Body() createEventDto: CreateEventDto) {
    return await this.eventService.update(id, user, createEventDto)
  }

  @Post('events/:id/cancel')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async cancelEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser) {
    return await this.eventService.cancel(id, user)
  }

  @Post('events/:id/approve')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async approveEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser) {
    return await this.eventService.approve(id, user)
  }

  @Post('events/:id/reject')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async rejectEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser) {
    return await this.eventService.reject(id, user)
  }
}
