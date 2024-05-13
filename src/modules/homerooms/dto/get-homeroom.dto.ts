import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'

export class GetHomeRoomsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUUID()
  facultyId?: string
}
