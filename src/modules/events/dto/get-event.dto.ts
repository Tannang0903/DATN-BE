import { IsOrderQueryParam } from '@common/decorator'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { EventType } from '@prisma/client'
import { GetAllEventsOrderByEnum } from '../event.enum'

export class GetEventsDto {
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
  @IsEnum(EventType)
  eventType?: EventType
}
