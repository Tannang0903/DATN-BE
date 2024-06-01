import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { EventType } from '@prisma/client'
import { IsArray, IsEnum, IsOptional, IsString, IsUrl, IsUUID, MaxLength, ValidateNested } from 'class-validator'
import { EventAddressDto } from './create-event-address.dto'
import { EventAttendanceInfoDto } from './create-event-attendance-info.dto'
import { EventRegistrationInfoDto } from './create-event-registration-info.dto'
import { EventRoleDto } from './create-event-role.dto'
import { OrganizationInEventDto } from './create-organization-in-event.dto'
import { Type } from 'class-transformer'

export class UpdateEventDto {
  @ApiProperty({
    description: 'Example request name for creating event',
    example: 'DUT Job Fair'
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  name?: string

  @ApiProperty({
    description: 'Example request introduction for creating event',
    example: 'Ngày hội việc làm trường ĐHBK-ĐHĐN'
  })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  introduction?: string

  @ApiProperty({
    description: 'Example request description for creating event',
    example: 'Ngày hội việc làm trường ĐHBK-ĐHĐN'
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'Example request image url for creating event',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string

  @ApiProperty({
    description: 'Example request start at for creating event',
    example: '2024-05-26T12:30:45.000Z'
  })
  @IsOptional()
  @IsString()
  startAt?: string

  @ApiProperty({
    description: 'Example request end at for creating event',
    example: '2024-05-28T12:30:45.000Z'
  })
  @IsOptional()
  @IsString()
  endAt?: string

  @ApiProperty({
    description: 'Example request gender for creating student',
    example: EventType.External
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType

  @ApiProperty({
    description: 'Example request address for creating event'
  })
  @IsOptional()
  address?: EventAddressDto

  @ApiProperty({
    description: 'Example request event activityId for creating event',
    example: 'd2b3b40e-4c8e-44e4-a8ea-7030de198616'
  })
  @IsOptional()
  @IsUUID()
  eventActivityId?: string

  @ApiPropertyOptional({
    description: 'Example request event attendance infos for creating event'
  })
  @IsOptional()
  @Type(() => EventAttendanceInfoDto)
  @ValidateNested({ each: true })
  @IsArray()
  eventAttendanceInfos?: EventAttendanceInfoDto[]

  @ApiProperty({
    description: 'Example request event registration infos for creating event'
  })
  @IsOptional()
  @Type(() => EventRegistrationInfoDto)
  @ValidateNested({ each: true })
  @IsArray()
  eventRegistrationInfos?: EventRegistrationInfoDto[]

  @ApiProperty({
    description: 'Example request event roles for creating event'
  })
  @IsOptional()
  @Type(() => EventRoleDto)
  @ValidateNested({ each: true })
  @IsArray()
  eventRoles?: EventRoleDto[]

  @ApiProperty({
    description: 'Example request organizations in event for creating event'
  })
  @IsOptional()
  @Type(() => OrganizationInEventDto)
  @ValidateNested({ each: true })
  @IsArray()
  organizationsInEvent?: OrganizationInEventDto[]

  @ApiProperty({
    description: 'Example request event representativeId for creating event',
    example: 'd2b3b40e-4c8e-44e4-a8ea-7030de198616'
  })
  @IsOptional()
  @IsUUID()
  organizationRepresentativeId?: string
}
