import { FacultyService } from './faculty.service'
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'

@Controller()
@ApiBearerAuth()
@ApiTags('Faculty')
@UseGuards(AccessTokenGuard)
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get('faculties')
  @HttpCode(HttpStatus.OK)
  async getAllFaculties() {
    return await this.facultyService.getAll()
  }
}
