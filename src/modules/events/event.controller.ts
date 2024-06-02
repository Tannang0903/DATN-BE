import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventService } from './event.service'
import { ReqUser, Roles } from '@common/decorator'
import { RequestUser, UserRole, UUIDParam } from '@common/types'
import { CreateEventDto, GetEventsDto } from './dto'

@Controller()
@ApiTags('Event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('events/:id')
  @HttpCode(HttpStatus.OK)
  async getEventById(@Param() { id }: UUIDParam) {
    return await this.eventService.getById(id)
  }

  @Get('events')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  async getAllEvents(@ReqUser() user: RequestUser, @Query() params: GetEventsDto) {
    return await this.eventService.getAll(user, params)
  }

  @Get('events-public')
  @HttpCode(HttpStatus.OK)
  async getAllPublicEvents(@ReqUser() user: RequestUser, @Query() params: GetEventsDto) {
    return await this.eventService.getAll(user, params)
  }

  @Post('events')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async createEvent(@ReqUser() user: RequestUser, @Body() createEventDto: CreateEventDto) {
    return await this.eventService.create(user, createEventDto)
  }

  @Put('events/:id')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async updateEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser, @Body() createEventDto: CreateEventDto) {
    return await this.eventService.update(id, user, createEventDto)
  }

  @Post('events/:id/cancel')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async cancelEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser) {
    return await this.eventService.cancel(id, user)
  }

  @Post('events/:id/approve')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async approveEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser) {
    return await this.eventService.approve(id, user)
  }

  @Post('events/:id/reject')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.CREATED)
  async rejectEvent(@Param() { id }: UUIDParam, @ReqUser() user: RequestUser) {
    return await this.eventService.reject(id, user)
  }
}
