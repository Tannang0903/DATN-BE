import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class ProofExternalDto {
  @ApiProperty({
    description: 'Example request event name for making proof external',
    example: 'DUT Job FAIR'
  })
  @IsNotEmpty()
  @IsString()
  eventName: string

  @ApiProperty({
    description: 'Example request event address for making proof external',
    example: 'Da Nang'
  })
  @IsNotEmpty()
  @IsString()
  address: string

  @ApiProperty({
    description: 'Example request organization name for making proof external',
    example: 'DataHouse'
  })
  @IsNotEmpty()
  @IsString()
  organizationName: string

  @ApiProperty({
    description: 'Example request start at for making proof external',
    example: '2024-05-26T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsString()
  startAt: string

  @ApiProperty({
    description: 'Example request end at for making proof external',
    example: '2024-05-28T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsString()
  endAt: string

  @ApiProperty({
    description: 'Example request attendance at for making proof external',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsString()
  attendanceAt: string

  @ApiProperty({
    description: 'Example request event role for making proof external',
    example: '2024-05-28T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsString()
  role: string

  @ApiProperty({
    description: 'Example request score role for making proof external',
    example: '576 Nguyen Tri Phuong'
  })
  @IsNotEmpty()
  score: number

  @ApiProperty({
    description: 'Example request activity id for making proof external',
    example: '206417831'
  })
  @IsNotEmpty()
  @IsString()
  activityId: string

  @ApiProperty({
    description: 'Example request description for making proof internal',
    example: '206417831'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Example request image url for making proof external',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string
}
