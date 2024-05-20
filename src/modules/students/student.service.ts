import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/database'
import { CreateStudentDto } from './dto/create-student.dto'
import { validateBirth } from '@common/utils/helpers'
import { isNotEmpty } from 'class-validator'
import { UserService } from '@modules/users'
import { GetStudentsDto } from './dto'
import { PaginatedResult, Pagination } from '@common/pagination'
import { Prisma, Student } from '@prisma/client'
import { getOrderBy, searchByMode } from '@common/utils'
import { isEmpty } from 'lodash'
import { UpdateStudentDto } from './dto/update-student.dto'

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  getById = async (id: string) => {
    const student = this.prisma.student.findUnique({
      where: { id: id }
    })

    if (isEmpty(student)) {
      throw new BadRequestException({
        message: 'Student with given id does not exist',
        error: 'Student:000001',
        statusCode: 400
      })
    }

    return student
  }

  getByCode = async (code: string) => {
    return await this.prisma.student.findUnique({
      where: { code: code }
    })
  }

  getByCitizenId = async (citizenId: string) => {
    return await this.prisma.student.findUnique({
      where: { citizenId: citizenId }
    })
  }

  getByEmail = async (email: string) => {
    return await this.prisma.student.findUnique({
      where: { email: email }
    })
  }

  getAll = async (params: GetStudentsDto): Promise<PaginatedResult<Student[]>> => {
    const { search, sorting, homeRoomId, facultyId, educationProgramId, gender } = params

    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const whereConditions: Prisma.Enumerable<Prisma.StudentWhereInput> = []

    if (search) {
      whereConditions.push({
        OR: [
          {
            fullname: searchByMode(search)
          },
          {
            email: searchByMode(search)
          }
        ]
      })
    }

    if (homeRoomId) {
      const homeRoom = await this.prisma.homeRoom.findUnique({
        where: { id: homeRoomId }
      })

      if (isEmpty(homeRoom)) {
        throw new NotFoundException({
          message: 'Home room with given id does not exist',
          error: 'HomeRoom:000001',
          statusCode: 400
        })
      }

      whereConditions.push({
        homeRoomId
      })
    }

    if (facultyId) {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id: facultyId }
      })

      if (isEmpty(faculty)) {
        throw new NotFoundException({
          message: 'Faculty with given id does not exist',
          error: 'Faculty:000001',
          statusCode: 400
        })
      } else {
        const homeRooms = await this.prisma.homeRoom.findMany({
          where: {
            facultyId: faculty.id
          },
          select: {
            id: true
          }
        })

        if (homeRooms.length > 0) {
          const homeRoomIds = homeRooms.map((homeRoom) => homeRoom.id)

          whereConditions.push({
            homeRoomId: {
              in: homeRoomIds
            }
          })
        }
      }
    }

    if (educationProgramId) {
      const program = await this.prisma.educationProgram.findUnique({
        where: { id: educationProgramId }
      })

      if (isEmpty(program)) {
        throw new NotFoundException({
          message: 'Education program with given id does not exist',
          error: 'EducationProgram:000001',
          statusCode: 400
        })
      }

      whereConditions.push({
        educationProgramId
      })
    }

    if (gender) {
      whereConditions.push({
        gender: gender
      })
    }

    const orderBy = getOrderBy<Student>({ defaultValue: 'code', order: sorting })

    const [total, students] = await Promise.all([
      this.prisma.student.count({
        where: {
          AND: whereConditions
        }
      }),
      this.prisma.student.findMany({
        where: {
          AND: whereConditions
        },
        select: {
          id: true,
          code: true,
          fullname: true,
          gender: true,
          birth: true,
          hometown: true,
          address: true,
          imageUrl: true,
          citizenId: true,
          email: true,
          phone: true,
          identityId: true,
          homeRoom: {
            select: {
              id: true,
              name: true,
              facultyId: true
            }
          },
          faculty: {
            select: {
              id: true,
              name: true
            }
          },
          educationProgram: {
            select: {
              id: true,
              name: true
            }
          }
        },
        take: pageSize,
        skip: Number((page - 1) * pageSize),
        orderBy: orderBy
      })
    ])

    return Pagination.of(page, pageSize, total, students)
  }

  create = async (data: CreateStudentDto) => {
    const {
      code,
      fullname,
      gender,
      birth,
      hometown,
      address,
      citizenId,
      email,
      phone,
      facultyId,
      homeRoomId,
      educationProgramId,
      imageUrl
    } = data

    const existedCode = await this.getByCode(code)

    if (isNotEmpty(existedCode)) {
      throw new BadRequestException({
        message: 'Student with the given code has already existed',
        error: 'Student:000002',
        statusCode: 400
      })
    }

    const existedCitizenId = await this.getByCitizenId(citizenId)

    if (isNotEmpty(existedCitizenId)) {
      throw new BadRequestException({
        message: 'Student with the given citizen identifier has already exist',
        error: 'Student:000003',
        statusCode: 400
      })
    }

    const existedEmail = await this.getByEmail(email)

    if (isNotEmpty(existedEmail)) {
      throw new BadRequestException({
        message: 'Student with the given email has already existed',
        error: 'Student:000004',
        statusCode: 400
      })
    }

    const validateDob = validateBirth(birth)

    if (!validateDob) {
      throw new BadRequestException({
        message: 'Student must be more than 18 years old',
        error: 'Student:000005',
        statusCode: 400
      })
    }

    const user = await this.userService.create({
      username: code,
      email: email,
      password: code,
      fullname: fullname,
      imageUrl: imageUrl
    })

    const student = await this.prisma.student.create({
      data: {
        code,
        fullname,
        gender,
        birth: new Date(birth),
        hometown,
        address,
        imageUrl,
        citizenId,
        email,
        phone,
        facultyId,
        homeRoomId,
        educationProgramId,
        identityId: user.id
      }
    })

    return student
  }

  update = async (id: string, data: UpdateStudentDto) => {
    const {
      code,
      fullname,
      gender,
      birth,
      hometown,
      address,
      citizenId,
      email,
      phone,
      facultyId,
      homeRoomId,
      educationProgramId,
      imageUrl
    } = data

    const student = await this.getById(id)

    const isChangeCode = student.code !== code
    if (isChangeCode) {
      const existedCode = await this.getByCode(code)

      if (isNotEmpty(existedCode)) {
        throw new BadRequestException({
          message: 'Student with the given code has already existed',
          error: 'Student:000002',
          statusCode: 400
        })
      }
    }

    const isChangeCitizenId = student.citizenId !== citizenId
    if (isChangeCitizenId) {
      const existedCitizenId = await this.getByCitizenId(citizenId)

      if (isNotEmpty(existedCitizenId)) {
        throw new BadRequestException({
          message: 'Student with the given citizen identifier has already exist',
          error: 'Student:000003',
          statusCode: 400
        })
      }
    }

    const isChangeEmail = student.email !== email
    if (isChangeEmail) {
      const existedEmail = await this.getByEmail(email)

      if (isNotEmpty(existedEmail)) {
        throw new BadRequestException({
          message: 'Student with the given email has already existed',
          error: 'Student:000004',
          statusCode: 400
        })
      }
    }

    const validateDob = validateBirth(birth)

    if (!validateDob) {
      throw new BadRequestException({
        message: 'Student must be more than 18 years old',
        error: 'Student:000005',
        statusCode: 400
      })
    }

    const user = await this.userService.getByUserNameOrEmail(student.email)

    await this.userService.update(user.id, {
      username: code,
      email: email,
      fullname: fullname,
      imageUrl: imageUrl
    })

    return await this.prisma.student.update({
      where: {
        id
      },
      data: {
        code,
        fullname,
        gender,
        birth: new Date(birth),
        hometown,
        address,
        imageUrl,
        citizenId,
        email,
        phone,
        facultyId,
        homeRoomId,
        educationProgramId
      }
    })
  }

  delete = async (id: string) => {
    await this.getById(id)

    return await this.prisma.student.delete({
      where: { id }
    })
  }
}
