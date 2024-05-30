import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateRoleDto {
  @ApiProperty({
    description: 'Example request name for creating role',
    example: 'ADMIN'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  name: string

  @ApiProperty({
    description: 'Example request description for creating role',
    example: 'Quan tri vien'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string
}
