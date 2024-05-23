import { ApiProperty } from '@nestjs/swagger'
import { Gender } from '@prisma/client'
import { IsEnum, IsISO8601, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

export class UpdateEventOrganizationContactDto {
  @ApiProperty({
    description: 'Example request name for updating event organization contact',
    example: 'Huynh Tan Nang'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({
    description: 'Example request gender for updating event organization contact',
    example: Gender.MALE
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @ApiProperty({
    description: 'Example request birth for updating event organization contact',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsOptional()
  @IsISO8601()
  birth?: Date

  @ApiProperty({
    description: 'Example request phone for updating event organization contact',
    example: '0776974310'
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string

  @ApiProperty({
    description: 'Example request address for updating event organization contact',
    example: '576 Nguyen Tri Phuong'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  address?: string

  @ApiProperty({
    description: 'Example request image url for updating event organization contact',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string

  @ApiProperty({
    description: 'Example request position for updating event organization contact',
    example: 'CEO'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  position?: string
}
