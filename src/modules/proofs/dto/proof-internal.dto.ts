import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUrl } from 'class-validator'

export class ProofInternalDto {
  @ApiProperty({
    description: 'Example request eventId for making proof internal',
    example: '206417831'
  })
  @IsNotEmpty()
  @IsString()
  eventId: string

  @ApiProperty({
    description: 'Example request eventRoleId for making proof internal',
    example: '206417831'
  })
  @IsNotEmpty()
  @IsString()
  eventRoleId: string

  @ApiProperty({
    description: 'Example request description for making proof internal',
    example: '206417831'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Example request image url for making proof internal',
    example: 'http://cb.dut.udn.vn/ImageSV/20/102200180.jpg'
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string

  @ApiProperty({
    description: 'Example request attendance at for making proof internal',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsString()
  attendanceAt: string
}
