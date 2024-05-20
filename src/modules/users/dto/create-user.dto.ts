import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from 'class-validator'
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 50, { message: 'The username length is wrong' })
  username: string

  @IsNotEmpty()
  @IsEmail()
  @Length(5, 50, { message: 'The email length is wrong' })
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 50, { message: 'The fullname length is wrong' })
  fullname: string

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 50, { message: 'The password length is wrong' })
  password: string

  @IsOptional()
  @IsArray()
  rolesId?: string[]
}
