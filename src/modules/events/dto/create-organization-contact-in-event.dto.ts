import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'

export class OrganizationContactInEventDto {
  @ApiProperty({
    description: 'Example request organization contactId for creating organization contact in event',
    example: 'b6fde84e-5e94-4cc0-9240-6c1219d0c727'
  })
  @IsNotEmpty()
  @IsUUID()
  organizationContactId: string

  @ApiProperty({
    description: 'Example request organizationId for creating organization contact in event',
    example: 'Huynh Tan Nang'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  role: string
}
