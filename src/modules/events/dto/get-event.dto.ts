import { IsOrderQueryParam } from '@common/decorator'
import { Type } from 'class-transformer'
import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { EventStatus, EventType } from '@prisma/client'
import { GetAllEventsOrderByEnum } from '../event.enum'

export class GetEventsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  startDate?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  endDate?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EventStatus)
  eventStatus?: EventStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    example: 'name:asc'
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetAllEventsOrderByEnum)
  sorting?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number
}
