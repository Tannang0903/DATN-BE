import { ApiProperty } from '@nestjs/swagger'
import { Gender } from '@prisma/client'
import { IsEmail, IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

export class CreateEventOrganizationContactDto {
  @ApiProperty({
    description: 'Example request name for creating event organization contact',
    example: 'Huynh Tan Nang'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({
    description: 'Example request gender for creating event organization contact',
    example: Gender.MALE
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender

  @ApiProperty({
    description: 'Example request birth for creating event organization contact',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsISO8601()
  birth: Date

  @ApiProperty({
    description: 'Example request email for creating event organization contact',
    example: 'tannang09032002@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Example request phone for creating event organization contact',
    example: '0776974310'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phone: string

  @ApiProperty({
    description: 'Example request address for creating event organization contact',
    example: '576 Nguyen Tri Phuong'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  address?: string

  @ApiProperty({
    description: 'Example request image url for creating event organization contact',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl?: string

  @ApiProperty({
    description: 'Example request position for creating event organization contact',
    example: 'CEO'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  position?: string
}
