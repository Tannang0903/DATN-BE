import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({
    example: 'tannang09032002@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'Reset password token'
  })
  @IsString()
  @IsNotEmpty()
  token: string

  @ApiProperty({
    description: 'New password'
  })
  @MinLength(6)
  password: string
}
