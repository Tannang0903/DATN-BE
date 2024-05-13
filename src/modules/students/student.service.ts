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
    return await this.prisma.student.findUnique({
      where: { id: id }
    })
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
        throw new NotFoundException('The home room does not exist')
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
        throw new NotFoundException('The home room does not exist')
      } else {
        const homeRooms = await this.prisma.homeRoom.findMany({
          where: {
            facultyId: faculty.id
          },
          select: {
            id: true
          }
        })

        if (isEmpty(homeRooms)) {
          throw new NotFoundException('The home room does not exist')
        }

        const homeRoomIds = homeRooms.map((homeRoom) => homeRoom.id)

        whereConditions.push({
          homeRoomId: {
            in: homeRoomIds
          }
        })
      }
    }

    if (educationProgramId) {
      const program = await this.prisma.educationProgram.findUnique({
        where: { id: educationProgramId }
      })

      if (isEmpty(program)) {
        throw new NotFoundException('The home room does not exist')
      }

      whereConditions.push({
        educationProgramId
      })
    }

    if (gender !== undefined) {
      whereConditions.push({
        gender: Boolean(gender)
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
      homeRoomId,
      educationProgramId,
      imageUrl
    } = data

    const validateDob = validateBirth(birth)

    if (!validateDob) {
      throw new BadRequestException('User must be more than 18 years old')
    }

    const existedEmail = await this.getByEmail(email)

    if (isNotEmpty(existedEmail)) {
      throw new BadRequestException('The username has already been used')
    }

    const existedCode = await this.getByCode(code)

    if (isNotEmpty(existedCode)) {
      throw new BadRequestException('The code has already been used')
    }

    const existedCitizenId = await this.getByCitizenId(citizenId)

    if (isNotEmpty(existedCitizenId)) {
      throw new BadRequestException('The citizenId has already been used')
    }

    const user = await this.userService.create({
      username: code,
      email: email,
      password: code
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
      homeRoomId,
      educationProgramId,
      imageUrl
    } = data

    const existedStudent = await this.getById(id)

    if (isEmpty(existedStudent.id)) {
      throw new BadRequestException('The student does not exist')
    }

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
        homeRoomId,
        educationProgramId
      }
    })
  }

  delete = async (id: string) => {
    const existedStudent = await this.getById(id)

    if (!existedStudent) {
      throw new BadRequestException('Student does not exist')
    }

    return await this.prisma.student.delete({
      where: { id }
    })
  }
}
