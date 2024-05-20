import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto, UpdateUserDto } from './dto'
import { PrismaService } from 'src/database'
import { RequestUser, hashPassword } from 'src/common'
import { RoleService } from '../roles'
import { isEmpty } from 'lodash'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private roleService: RoleService
  ) {}

  getById = async (id: string) => {
    const user = await this.prisma.identityUser.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        imageUrl: true,
        hashedPassword: true,
        refreshToken: true,
        roles: {
          select: {
            identityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (isEmpty(user)) {
      throw new BadRequestException({
        message: 'User does not exist',
        error: 'User:000001',
        statusCode: 400
      })
    }

    return user
  }

  getByUserNameOrEmail = async (userNameOrEmail: string) => {
    const user = await this.prisma.identityUser.findFirst({
      where: {
        OR: [
          {
            email: userNameOrEmail
          },
          {
            username: userNameOrEmail
          }
        ]
      },
      select: {
        id: true,
        username: true,
        email: true,
        hashedPassword: true,
        fullname: true,
        imageUrl: true,
        roles: {
          select: {
            identityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (isEmpty(user)) {
      throw new BadRequestException({
        message: 'User does not exist',
        error: 'User:000001',
        statusCode: 400
      })
    }

    return user
  }

  getByEmail = async (email: string) => {
    const user = await this.prisma.identityUser.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        username: true,
        email: true,
        hashedPassword: true,
        roles: {
          select: {
            identityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (isEmpty(user)) {
      throw new BadRequestException({
        message: 'User does not exist',
        error: 'User:000001',
        statusCode: 400
      })
    }

    return user
  }

  getExistedUserByEmail = async (email: string) => {
    const user = await this.prisma.identityUser.findFirst({
      where: {
        email: email
      },
      select: {
        id: true,
        username: true,
        email: true,
        hashedPassword: true,
        fullname: true,
        imageUrl: true,
        roles: {
          select: {
            identityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (user) {
      throw new BadRequestException({
        message: 'User already exist',
        error: 'User:000006',
        statusCode: 400
      })
    }
  }

  getProfile = async (reqUser: RequestUser) => {
    const user = await this.prisma.identityUser.findUnique({
      where: { id: reqUser.id },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        imageUrl: true,
        roles: {
          select: {
            identityRole: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    if (isEmpty(user)) {
      throw new BadRequestException({
        message: 'User does not exist',
        error: 'User:000001',
        statusCode: 400
      })
    }

    return {
      ...user,
      roles: user.roles.map((_) => _.identityRole)
    }
  }

  create = async (createUserDto: CreateUserDto) => {
    const { username, email, password, fullname, imageUrl, rolesId } = createUserDto

    const rolesData = await this.roleService.checkRoles(rolesId)

    if (!rolesData) {
      throw new BadRequestException('The roles provided are invalid')
    }

    await this.getExistedUserByEmail(email)

    const rolesToAdd = rolesData.length > 0 ? rolesData : await this.roleService.getDefaultRole()

    const hashedPassword = await hashPassword(password)

    const user = await this.prisma.identityUser.create({
      data: {
        username: username,
        email: email,
        hashedPassword: hashedPassword,
        fullname: fullname,
        imageUrl: imageUrl,
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
        identityRole: {
          select: {
            name: true
          }
        }
      }
    })

    return {
      ...user,
      roles: getRolesOfUser
    }
  }

  update = async (id: string, updateUserDto: UpdateUserDto) => {
    const { username, email, fullname, imageUrl, refreshToken } = updateUserDto

    return await this.prisma.identityUser.update({
      where: {
        id
      },
      data: {
        username: username,
        email: email,
        fullname: fullname,
        imageUrl: imageUrl,
        refreshToken: refreshToken
      }
    })
  }

  delete = async (id: string) => {
    await this.getById(id)

    return await this.prisma.identityUser.delete({
      where: { id: id }
    })
  }
}
