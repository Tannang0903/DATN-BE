import { EducationProgramService } from './education-program.service'
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'

@Controller()
@ApiBearerAuth()
@ApiTags('EducationProgram')
@UseGuards(AccessTokenGuard)
export class EducationProgramController {
  constructor(private readonly educationProgramService: EducationProgramService) {}

  @Get('education-programs')
  @HttpCode(HttpStatus.OK)
  async getAllFaculties() {
    return await this.educationProgramService.getAll()
  }
}
