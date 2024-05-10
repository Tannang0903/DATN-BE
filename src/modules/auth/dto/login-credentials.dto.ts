import { IsNotEmpty, IsString } from 'class-validator'

export class LoginCredentialDto {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
