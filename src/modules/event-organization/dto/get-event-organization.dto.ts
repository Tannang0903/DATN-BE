import { IsOrderQueryParam } from '@common/decorator'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { GetAllEventOrganizationsOrderByEnum } from '../event-organization.enum'

export class GetEventOrganizationsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    example: 'name:asc'
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetAllEventOrganizationsOrderByEnum)
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
