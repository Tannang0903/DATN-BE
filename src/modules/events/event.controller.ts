import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventService } from './event.service'
import { GuestRoute, ReqUser, Roles } from '@common/decorator'
import { RequestUser, UserRole, UUIDParam } from '@common/types'
import {
  AttendanceEventDto,
  CreateEventDto,
  GetEventsDto,
  RegisterEventDto,
  RejectStudentRegisterEventDto
} from './dto'
import { EventRegisterStudentParam } from '@modules/event-organization-contact/dto'

@Controller()
@ApiTags('Event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('events/:id')
  @HttpCode(HttpStatus.OK)
  @GuestRoute()
  @UseGuards(AccessTokenGuard)
  async getEventById(@ReqUser() user: RequestUser, @Param() { id }: UUIDParam) {
    return await this.eventService.getById(user, id)
  }

  @Get('events')
  @HttpCode(HttpStatus.OK)
  @GuestRoute()
  @UseGuards(AccessTokenGuard)
  async getAllEvents(@ReqUser() user: RequestUser, @Query() params: GetEventsDto) {
    return await this.eventService.getAll(user, params)
  }

  @Get('events/:id/registered-students')
  @HttpCode(HttpStatus.OK)
  async getAllRegisteredStudent(@Param() { id }: UUIDParam, @Query() params: GetEventsDto) {
    return await this.eventService.getAllRegisteredStudent(id, params)
  }

  @Get('events/:id/attendance-students')
  @HttpCode(HttpStatus.OK)
  async getAllAttendanceStudent(@Param() { id }: UUIDParam, @Query() params: GetEventsDto) {
    return await this.eventService.getAllAttendanceStudent(id, params)
  }

  @Get(`/students/:id/attendance-events`)
  @Roles(UserRole.STUDENT, UserRole.ADMIN)
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async getAllAttendanceByStudent(@Param() { id }: UUIDParam) {
    return await this.eventService.getAllAttendanceByStudentId(id)
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

  @Post('/events/register')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async registerEvent(@ReqUser() user: RequestUser, @Body() registerEventDto: RegisterEventDto) {
    return await this.eventService.register(user, registerEventDto)
  }

  @Post('/events/event-attendances')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async attendEvent(@ReqUser() user: RequestUser, @Body() attendanceEventDto: AttendanceEventDto) {
    return await this.eventService.attendance(user, attendanceEventDto)
  }

  @Post('/students/:id/event-registers/:eventRegisterId/approve')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async approveRegisterStudent(@Param() { id, eventRegisterId }: EventRegisterStudentParam) {
    return await this.eventService.approveRegister(id, eventRegisterId)
  }

  @Post('/students/:id/event-registers/:eventRegisterId/reject')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async rejectRegisterStudent(
    @Param() { id, eventRegisterId }: EventRegisterStudentParam,
    @Body() data: RejectStudentRegisterEventDto
  ) {
    return await this.eventService.rejectRegister(id, eventRegisterId, data)
  }
}
