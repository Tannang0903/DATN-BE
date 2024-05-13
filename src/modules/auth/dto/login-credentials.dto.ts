import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class LoginCredentialDto {
  @ApiProperty({
    description: 'Example request email for logging in',
    example: 'admin@gmail.com'
  })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({
    description: 'Example request password for logging in',
    example: 'admin123'
  })
  @IsNotEmpty()
  @IsString()
  password: string
}
