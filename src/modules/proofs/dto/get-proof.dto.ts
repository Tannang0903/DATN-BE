import { IsOrderQueryParam } from '@common/decorator'
import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProofStatus, ProofType } from '@prisma/client'
import { GetAllProofsOrderByEnum } from '../proof.enum'

export class GetProofsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProofStatus)
  status?: ProofStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(ProofType)
  type?: ProofType

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    example: 'name:asc'
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam('order', GetAllProofsOrderByEnum)
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
