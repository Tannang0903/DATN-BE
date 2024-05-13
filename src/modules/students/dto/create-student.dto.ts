import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength
} from 'class-validator'

export class CreateStudentDto {
  @ApiProperty({
    description: 'Example request code for creating student',
    example: '102200180'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  code: string

  @ApiProperty({
    description: 'Example request fullname for creating student',
    example: 'Huynh Tan Nang'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  fullname: string

  @ApiProperty({
    description: 'Example request gender for creating student',
    example: true
  })
  @IsNotEmpty()
  @IsBoolean()
  gender: boolean

  @ApiProperty({
    description: 'Example request birth for creating student',
    example: '2002-03-09T12:30:45.000Z'
  })
  @IsNotEmpty()
  @IsISO8601()
  birth: Date

  @ApiProperty({
    description: 'Example request home town for creating student',
    example: 'Quang Nam'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  hometown?: string

  @ApiProperty({
    description: 'Example request address for creating student',
    example: '576 Nguyen Tri Phuong'
  })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  address?: string

  @ApiProperty({
    description: 'Example request citizenId for creating student',
    example: '206417831'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  citizenId: string

  @ApiProperty({
    description: 'Example request email for creating student',
    example: 'tannang09032002@gmail.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Example request phone for creating student',
    example: '0776974310'
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  phone: string

  @ApiProperty({
    description: 'Example request homeRoomId for creating student',
    example: 'a1641746-bd02-43c2-9774-91a5fe93d6bc'
  })
  @IsNotEmpty()
  @IsUUID()
  homeRoomId: string

  @ApiProperty({
    description: 'Example request educationProgramId for creating student',
    example: '1de6f513-4d0c-4580-a6b5-6b5f37995222'
  })
  @IsNotEmpty()
  @IsUUID()
  educationProgramId: string

  @ApiProperty({
    description: 'Example request image url for updating student'
  })
  @IsNotEmpty()
  @IsUrl()
  imageUrl?: string
}
