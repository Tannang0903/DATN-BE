import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'
export class CreateUserDto {
  @ApiProperty({
    description: 'Example request username for creating user',
    example: 'admin'
  })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({
    description: 'Example request username for creating user',
    example: 'admin@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Example request full name for creating user',
    example: 'admin@gmail.com'
  })
  @IsNotEmpty()
  @IsString()
  fullname: string

  @ApiProperty({
    description: 'Example request image url for creating user',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string

  @ApiProperty({
    description: 'Example request password for creating user',
    example: 'admin123'
  })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({
    description: 'Example request roles Id for creating user',
    example: ['d2b3b40e-4c7e-44e4-a8ea-7030de198615']
  })
  @IsOptional()
  @IsArray()
  rolesId?: string[]
}
