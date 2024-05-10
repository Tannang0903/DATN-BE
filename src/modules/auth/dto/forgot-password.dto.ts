import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'tannang09032002@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string
}
