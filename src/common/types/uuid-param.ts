import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UUIDParam {
  @ApiProperty({
    example: 'b9aee9b6-16fa-4bb4-a3ff-d664d5b720eb'
  })
  @IsUUID()
  id: string
}
