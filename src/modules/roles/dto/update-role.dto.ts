import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Example request name for updating role',
    example: 'ADMIN'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({
    description: 'Example request description for updating role',
    example: 'Quan tri vien'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string
}
