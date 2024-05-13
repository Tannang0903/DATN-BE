import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { StudentService } from './student.service'
import { Roles } from '@common/decorator'
import { UserRole, UUIDParam } from '@common/types'
import { CreateStudentDto } from './dto/create-student.dto'
import { GetStudentsDto } from './dto'
import { UpdateStudentDto } from './dto/update-student.dto'

@Controller()
@ApiTags('Student')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('students/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getStudentById(@Param() { id }: UUIDParam) {
    return await this.studentService.getById(id)
  }

  @Get('students')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getAllStudents(@Query() params: GetStudentsDto) {
    return await this.studentService.getAll(params)
  }

  @Post('students')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto)
  }

  @Put('students/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStudent(@Param() { id }: UUIDParam, @Body() updateStudentDto: UpdateStudentDto) {
    return await this.studentService.update(id, updateStudentDto)
  }
}
