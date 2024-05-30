import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString, IsUUID, MaxLength, ValidateNested } from 'class-validator'
import { OrganizationContactInEventDto } from './create-organization-contact-in-event.dto'
import { Type } from 'class-transformer'

export class OrganizationInEventDto {
  @ApiProperty({
    description: 'Example request organizationId for creating organization in event',
    example: 'b6fde84e-5e94-4cc0-9240-6c1219d0c727'
  })
  @IsNotEmpty()
  @IsUUID()
  organizationId: string

  @ApiProperty({
    description: 'Example request organizationId for creating organization in event',
    example: 'Huynh Tan Nang'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  role: string

  @ApiProperty({
    description: 'Example request organization representative in event for creating organization in event',
    example: 'Huynh Tan Nang'
  })
  @IsNotEmpty()
  @Type(() => OrganizationContactInEventDto)
  @ValidateNested({ each: true })
  @IsArray()
  organizationRepresentativesInEvent: OrganizationContactInEventDto[]
}
