import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(5, 50, { message: 'The username length is wrong' })
  username?: string

  @IsOptional()
  @IsEmail()
  @Length(5, 50, { message: 'The email length is wrong' })
  email?: string

  @IsOptional()
  @IsString()
  @Length(5, 50, { message: 'The fullname length is wrong' })
  fullname?: string

  @IsOptional()
  @IsUrl()
  imageUrl?: string

  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsString()
  refreshToken?: string
}
