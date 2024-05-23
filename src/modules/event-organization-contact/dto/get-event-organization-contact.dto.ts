import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetEventOrganizationContactsDto {
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
