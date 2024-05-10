import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class GetUsersDto {
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
