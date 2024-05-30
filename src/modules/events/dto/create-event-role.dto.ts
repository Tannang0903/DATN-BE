import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class EventRoleDto {
  @ApiProperty({
    description: 'Example request name role for creating event',
    example: 'Huynh Tan Nang'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  name: string

  @ApiProperty({
    description: 'Example request description role for creating event',
    example: 'Huynh Tan Nang'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Example request score role for creating event',
    example: '576 Nguyen Tri Phuong'
  })
  @IsNotEmpty()
  score: number

  @ApiProperty({
    description: 'Example request quantity role for creating event',
    example: '576 Nguyen Tri Phuong'
  })
  @IsNotEmpty()
  quantity: number

  @ApiProperty({
    description: 'Example request quantity role for creating event',
    example: '576 Nguyen Tri Phuong'
  })
  @IsNotEmpty()
  @IsBoolean()
  isNeedApprove: boolean
}
