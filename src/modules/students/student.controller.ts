import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { StudentService } from './student.service'
import { ReqUser, Roles } from '@common/decorator'
import { RequestUser, UserRole, UUIDParam } from '@common/types'
import { CreateStudentDto, GetStudentsDto, UpdateStudentDto } from './dto'

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

  @Delete('students/:id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeStudent(@Param() { id }: UUIDParam) {
    return await this.studentService.delete(id)
  }

  @Put('profile/student')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfileStudent(@ReqUser() user: RequestUser, @Body() updateStudentDto: UpdateStudentDto) {
    return await this.studentService.updateProfile(user, updateStudentDto)
  }

  @Get('students/:id/education-program')
  @Roles(UserRole.ADMIN, UserRole.STUDENT)
  @HttpCode(HttpStatus.OK)
  async getEducationProgramResult(@Param() { id }: UUIDParam) {
    return await this.studentService.getEducationProgramResult(id)
  }
}
