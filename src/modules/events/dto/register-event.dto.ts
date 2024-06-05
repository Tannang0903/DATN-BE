import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export class RegisterEventDto {
  @ApiProperty({
    description: 'Example request description for registering event',
    example: 'Đăng kí với vai trò Dẫn chương trình'
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Example request event roleId for registering event',
    example: 'd2b3b40e-4c8e-44e4-a8ea-7030de198616'
  })
  @IsNotEmpty()
  @IsUUID()
  eventRoleId: string
}
