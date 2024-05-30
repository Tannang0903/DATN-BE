import { ApiPropertyOptional } from '@nestjs/swagger'
import { EventCategoryType } from '@prisma/client'
import { IsEnum, IsOptional } from 'class-validator'

export class GetEventCategoriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EventCategoryType)
  type?: EventCategoryType
}
