import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'username of the user'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  password?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refreshToken?: string
}
