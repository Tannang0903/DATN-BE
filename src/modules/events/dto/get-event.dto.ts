import { IsOrderQueryParam } from '@common/decorator'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { EventStatus, EventType } from '@prisma/client'
import { GetAllEventsOrderByEnum } from '../event.enum'
import { RecurringFilterType } from '@modules/statistic'

export class GetEventsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDate?: string

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

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? value === 'true' : true))
  @IsBoolean()
  isPaging?: boolean

  type?: RecurringFilterType
}
