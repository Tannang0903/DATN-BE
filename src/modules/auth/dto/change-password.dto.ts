import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Example request new password for changing password',
    example: '12345678'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string

  @ApiProperty({
    description: 'Example request old password for changing password',
    example: '123456789'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  oldPassword: string
}
