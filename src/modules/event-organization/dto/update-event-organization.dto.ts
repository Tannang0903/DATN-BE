import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

export class UpdateEventOrganizationDto {
  @ApiProperty({
    description: 'Example request name for updating event organization',
    example: 'Data House Asia'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string

  @ApiProperty({
    description: 'Example request description for updating event organization',
    example: 'Data House Asia is a company'
  })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string

  @ApiProperty({
    description: 'Example request email for updating event organization',
    example: 'tannang09032002@gmail.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({
    description: 'Example request phone for updating event organization',
    example: '0776974310'
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string

  @ApiProperty({
    description: 'Example request address for updating event organization',
    example: '576 Nguyen Tri Phuong'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  address?: string

  @ApiProperty({
    description: 'Example request image url for updating event organization',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string
}
