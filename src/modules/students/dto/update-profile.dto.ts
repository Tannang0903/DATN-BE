import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Example request email for updating student',
    example: 'tannang09032002@gmail.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({
    description: 'Example request phone for updating student',
    example: '0776974310'
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string

  @ApiPropertyOptional({
    description: 'Example request home town for updating student',
    example: 'Quang Nam'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  hometown?: string

  @ApiPropertyOptional({
    description: 'Example request address for updating student',
    example: '576 Nguyen Tri Phuong'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  address?: string

  @ApiPropertyOptional({
    description: 'Example request image url for updating student',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string
}
