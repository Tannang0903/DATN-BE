import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RejectProofDto {
  @ApiProperty({
    description: 'Example reject reason for rejecting proof',
    example: 'Đăng kí với vai trò Dẫn chương trình'
  })
  @IsNotEmpty()
  @IsString()
  rejectReason: string
}
