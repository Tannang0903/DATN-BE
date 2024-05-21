import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class GetEventActivitiesByCategoryIdDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  categoryId?: string
}
