import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Example request email for resetting password',
    example: 'tannang09032002@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Example request token for resetting password',
    example: '$2b$10$guWWPiaqSEyznEeMsUwKeulmmBFDTb.M9bBI9wIxPBh/wwrnqeU.K'
  })
  @IsNotEmpty()
  @IsString()
  token: string

  @ApiProperty({
    description: 'Example request password for resetting password',
    example: '12345678'
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string
}
