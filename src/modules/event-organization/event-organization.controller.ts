import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventOrganizationService } from './event-organization.service'
import { ReqUser, Roles } from '@common/decorator'
import { RequestUser, UserRole, UUIDParam } from '@common/types'
import { CreateEventOrganizationDto, GetEventOrganizationsDto, UpdateEventOrganizationDto } from './dto'

@Controller()
@ApiTags('EventOrganization')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class EventOrganizationController {
  constructor(private readonly eventOrganizationService: EventOrganizationService) {}

  @Get('event-organizations/:id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.OK)
  async getEventOrganizationById(@Param() { id }: UUIDParam) {
    return await this.eventOrganizationService.getById(id)
  }

  @Get('event-organizations')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZATION)
  @HttpCode(HttpStatus.OK)
  async getAllEventOrganizations(@ReqUser() user: RequestUser, @Query() params: GetEventOrganizationsDto) {
    return await this.eventOrganizationService.getAll(user, params)
  }

  @Post('event-organizations')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createEventOrganization(@Body() createEventOrganizationDto: CreateEventOrganizationDto) {
    return await this.eventOrganizationService.create(createEventOrganizationDto)
  }

  @Put('event-organizations/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateEventOrganization(
    @Param() { id }: UUIDParam,
    @Body() updateEventOrganizationDto: UpdateEventOrganizationDto
  ) {
    return await this.eventOrganizationService.update(id, updateEventOrganizationDto)
  }

  @Delete('event-organizations/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEventOrganization(@Param() { id }: UUIDParam) {
    return await this.eventOrganizationService.delete(id)
  }
}
