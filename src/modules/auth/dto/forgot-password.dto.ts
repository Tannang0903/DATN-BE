import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Example request email for forgetting password',
    example: 'tannang09032002@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Example request call back url for forgetting password',
    example: 'tannang09032002@gmail.com'
  })
  @IsNotEmpty()
  @IsString()
  callBackUrl: string
}
