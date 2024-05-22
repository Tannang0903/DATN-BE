import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator'

export class CreateEventOrganizationDto {
  @ApiProperty({
    description: 'Example request name for creating event organization',
    example: 'Data House Asia'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({
    description: 'Example request description for creating event organization',
    example: 'Data House Asia is a company'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  description?: string

  @ApiProperty({
    description: 'Example request email for creating event organization',
    example: 'tannang09032002@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Example request phone for creating event organization',
    example: '0776974310'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phone: string

  @ApiProperty({
    description: 'Example request address for creating event organization',
    example: '576 Nguyen Tri Phuong'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  address: string

  @ApiProperty({
    description: 'Example request image url for creating event organization',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string
}
