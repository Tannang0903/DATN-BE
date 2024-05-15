import { IsOrderQueryParam } from '@common/decorator'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'
import { GetAllStudentsOrderByEnum } from '../student.enum'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '@prisma/client'

export class GetStudentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    example: 'code:asc'
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetAllStudentsOrderByEnum)
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
  @IsString()
  @IsUUID()
  homeRoomId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  facultyId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  educationProgramId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender
}
