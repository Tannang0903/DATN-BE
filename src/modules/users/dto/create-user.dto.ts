import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 50, { message: 'The username length is wrong' })
  username: string

  @IsEmail()
  @IsNotEmpty()
  @Length(5, 50, { message: 'The email length is wrong' })
  email: string

  @IsString()
  @IsNotEmpty()
  @Length(5, 50, { message: 'The password length is wrong' })
  password: string

  @IsOptional()
  @IsArray()
  rolesId?: string[]
}
