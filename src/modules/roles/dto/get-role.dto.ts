import { Type } from 'class-transformer'
import { IsOptional, IsString, IsNumber } from 'class-validator'

export class GetRolesDto {
  @IsOptional()
  @IsString()
  search?: string

  @IsOptional()
  @IsString()
  order?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number
}
