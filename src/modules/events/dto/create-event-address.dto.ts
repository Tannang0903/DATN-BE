import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class EventAddressDto {
  @ApiProperty({
    description: 'Example request full address for creating event',
    example: 'Đại học Bách Khoa'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  fullAddress: string

  @ApiProperty({
    description: 'Example request longitude for creating event',
    example: 16.074160300547344
  })
  @IsNotEmpty()
  longitude: string

  @ApiProperty({
    description: 'Example request latitude for creating event',
    example: 108.15078258893459
  })
  @IsNotEmpty()
  latitude: string
}
