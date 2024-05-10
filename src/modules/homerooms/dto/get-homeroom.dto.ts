import { IsOptional, IsString } from 'class-validator'

export class GetHomeRoomsDto {
  @IsOptional()
  @IsString()
  facultyId?: string
}
