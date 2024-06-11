import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class AttendanceEventDto {
  @ApiProperty({
    description: 'Example request code for attendance event',
    example: 'Đăng kí với vai trò Dẫn chương trình'
  })
  @IsNotEmpty()
  @IsString()
  code: string

  @ApiProperty({
    description: 'Example request latitude for attendance event',
    example: 16.074160300547344
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number

  @ApiProperty({
    description: 'Example request longitude for attendance event',
    example: 108.15078258893459
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number
}
