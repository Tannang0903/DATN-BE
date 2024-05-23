import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventOrganizationContactService } from './event-organization-contact.service'
import { Roles } from '@common/decorator'
import { UserRole, UUIDParam } from '@common/types'
import {
  CreateEventOrganizationContactDto,
  EventOrganizationRequestParam,
  GetEventOrganizationContactsDto,
  UpdateEventOrganizationContactDto
} from './dto'

@Controller()
@ApiTags('EventOrganizationContact')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class EventOrganizationContactController {
  constructor(private readonly eventOrganizationContactService: EventOrganizationContactService) {}

  @Get('event-organizations/:id/contacts')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAllEventOrganizationContactsByOrganizationId(
    @Param() { id }: UUIDParam,
    @Query() params: GetEventOrganizationContactsDto
  ) {
    return await this.eventOrganizationContactService.getByOrganizationId(id, params)
  }

  @Post('event-organizations/:id/contacts')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createEventOrganizationContact(
    @Param() { id }: UUIDParam,
    @Body() createEventOrganizationContactDto: CreateEventOrganizationContactDto
  ) {
    return await this.eventOrganizationContactService.create(id, createEventOrganizationContactDto)
  }

  @Put('event-organizations/:id/contacts/:contactId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateEventOrganizationContact(
    @Param() { id, contactId }: EventOrganizationRequestParam,
    @Body() updateEventOrganizationContactDto: UpdateEventOrganizationContactDto
  ) {
    return await this.eventOrganizationContactService.update(id, contactId, updateEventOrganizationContactDto)
  }

  @Delete('event-organizations/:id/contacts/:contactId')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEventOrganizationContact(@Param() { id, contactId }: EventOrganizationRequestParam) {
    return await this.eventOrganizationContactService.delete(id, contactId)
  }
}
