import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RejectStudentRegisterEventDto {
  @ApiProperty({
    description: 'Example request description for registering event',
    example: 'Đăng kí với vai trò Dẫn chương trình'
  })
  @IsNotEmpty()
  @IsString()
  rejectReason: string
}
