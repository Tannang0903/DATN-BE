import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsISO8601, IsOptional, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator'

export class UpdateStudentDto {
  @ApiPropertyOptional({
    description: 'Example request code for updating student',
    example: '102200180'
  })
  @IsOptional()
  @IsString()
  @MaxLength(9)
  code?: string

  @ApiPropertyOptional({
    description: 'Example request fullname for updating student',
    example: 'Huynh Tan Nang'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fullname?: string

  @ApiPropertyOptional({
    description: 'Example request gender for updating student',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  gender?: boolean

  @ApiPropertyOptional({
    description: 'Example request birth for updating student',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsOptional()
  @IsISO8601()
  birth?: Date

  @ApiPropertyOptional({
    description: 'Example request home town for updating student',
    example: 'Quang Nam'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  hometown?: string

  @ApiPropertyOptional({
    description: 'Example request address for updating student',
    example: '576 Nguyen Tri Phuong'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  address?: string

  @ApiPropertyOptional({
    description: 'Example request citizenId for updating student',
    example: '206417831'
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  citizenId?: string

  @ApiPropertyOptional({
    description: 'Example request email for updating student',
    example: 'tannang09032002@gmail.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({
    description: 'Example request phone for updating student',
    example: '0776974310'
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  phone?: string

  @ApiPropertyOptional({
    description: 'Example request homeRoomId for updating student',
    example: 'a1641746-bd02-43c2-9774-91a5fe93d6bc'
  })
  @IsOptional()
  @IsUUID()
  homeRoomId?: string

  @ApiPropertyOptional({
    description: 'Example request educationProgramId for updating student',
    example: '1de6f513-4d0c-4580-a6b5-6b5f37995222'
  })
  @IsOptional()
  @IsUUID()
  educationProgramId?: string

  @ApiPropertyOptional({
    description: 'Example request image url for updating student'
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string
}
