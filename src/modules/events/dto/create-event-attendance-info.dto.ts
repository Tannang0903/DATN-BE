import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class EventAttendanceInfoDto {
  @ApiProperty({
    description: 'Example request start at  for creating event attendance info',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsString()
  startAt: string

  @ApiProperty({
    description: 'Example request end at for creating event attendance info',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsString()
  endAt: string
}
