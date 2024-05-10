import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto'
import { PrismaService } from 'src/database'
import { PaginatedResult, Pagination, RequestUser, compareHash, hashPassword } from 'src/common'
import { Prisma, IdentityUser } from '@prisma/client'
import { RoleService } from '../roles'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService
  ) {}

  getById = async (id: string) => {
    return await this.prisma.identityUser.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        hashedPassword: true,
        roles: {
          select: {
            IdentityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
  }

  getByEmail = async (email: string) => {
    return await this.prisma.identityUser.findUnique({
      where: { email: email },
      select: {
        id: true,
        username: true,
        email: true,
        hashedPassword: true,
        roles: {
          select: {
            IdentityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
  }

  getProfile = async (reqUser: RequestUser) => {
    return await this.prisma.identityUser.findUnique({
      where: { id: reqUser.id },
      select: {
        id: true,
        username: true,
        email: true,
        roles: {
          select: {
            IdentityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
  }

  getAll = async (params: GetUsersDto): Promise<PaginatedResult<IdentityUser[]>> => {
    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const whereConditions: Prisma.Enumerable<Prisma.IdentityUserWhereInput> = []
    if (params.search) {
      whereConditions.push({
        OR: [
          {
            username: {
              contains: params.search
            }
          },
          {
            email: {
              contains: params.search
            }
          }
        ]
      })
    }
    const [total, users] = await Promise.all([
      this.prisma.identityUser.count({
        where: {
          AND: whereConditions
        }
      }),
      this.prisma.identityUser.findMany({
        where: {
          AND: whereConditions
        },
        select: {
          id: true,
          username: true,
          email: true,
          roles: {
            select: {
              IdentityRole: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        take: pageSize,
        skip: Number((page - 1) * pageSize)
      })
    ])

    return Pagination.of(page, pageSize, total, users)
  }

  create = async (createUserDto: CreateUserDto) => {
    const { username, email, password, rolesId } = createUserDto

    const rolesData = await this.roleService.checkRoles(rolesId)

    if (!rolesData) {
      throw new BadRequestException('The roles provided are invalid')
    }

    const userExists = await this.getByEmail(createUserDto.email)

    if (userExists) {
      throw new BadRequestException('User already exists')
    }

    const rolesToAdd = rolesData.length > 0 ? rolesData : await this.roleService.getDefaultRole()

    const hash = await hashPassword(password)

    const user = await this.prisma.identityUser.create({
      data: {
        username: username,
        email: email,
        hashedPassword: hash,
        roles: {
          create: rolesToAdd.map((role) => ({
            roleId: role.id
          }))
        }
      }
    })

    const getRolesOfUser = await this.prisma.userRole.findMany({
      where: {
        userId: user.id
      },
      select: {
        IdentityRole: {
          select: {
            name: true
          }
        }
      }
    })

    return {
      ...user,
      UserRoles: getRolesOfUser
    }
  }

  update = async (id: string, updateUserDto: UpdateUserDto) => {
    const { username, password } = updateUserDto

    const existedUser = await this.prisma.identityUser.findUnique({
      where: { id },
      select: {
        id: true,
        hashedPassword: true
      }
    })

    if (!existedUser) {
      throw new BadRequestException('The user does not exist')
    }

    if (password && compareHash(password, existedUser.hashedPassword)) {
      throw new BadRequestException('The new password must be different from the current one')
    }

    return await this.prisma.identityUser.update({
      where: {
        id
      },
      data: {
        username,
        hashedPassword: password ? await hashPassword(password) : undefined
      }
    })
  }

  delete = async (id: string) => {
    const existedUser = await this.getById(id)

    if (!existedUser) {
      throw new BadRequestException('User does not exist')
    }

    return this.prisma.identityUser.delete({
      where: { id }
    })
  }
}
