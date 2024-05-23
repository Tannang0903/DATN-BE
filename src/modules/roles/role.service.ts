import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/database/services'
import { CreateRoleDto } from './dto'
import { IdentityRole } from '@prisma/client'
import { UpdateRoleDto } from './dto/update-role.dto'
import { isEmpty } from 'lodash'

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  getById = async (id: string) => {
    const role = await this.prisma.identityRole.findUnique({
      where: { id }
    })

    if (isEmpty(role)) {
      throw new NotFoundException({
        message: 'Role does not exists',
        error: 'Role:000001',
        statusCode: 400
      })
    }

    return role
  }

  getByName = async (name: string) => {
    const role = await this.prisma.identityRole.findUnique({
      where: { name }
    })

    if (isEmpty(role)) {
      throw new NotFoundException({
        message: 'Role does not exists',
        error: 'Role:000001',
        statusCode: 400
      })
    }

    return role
  }

  getAll = async (): Promise<IdentityRole[]> => {
    return await this.prisma.identityRole.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  }

  create = async (createRoleDto: CreateRoleDto) => {
    const { name, description } = createRoleDto

    const existedRole = await this.prisma.identityRole.findFirst({
      where: { name }
    })

    if (existedRole) {
      throw new BadRequestException({
        message: 'Role already exists',
        error: 'Role:000002',
        statusCode: 400
      })
    }

    return await this.prisma.identityRole.create({
      data: {
        name: name,
        description: description
      }
    })
  }

  update = async (id: string, updateRoleDto: UpdateRoleDto) => {
    const { name, description } = updateRoleDto

    const role = await this.getById(id)

    if (!role.canBeUpdated) {
      throw new BadRequestException({
        message: 'This role cannot be updated',
        error: 'Role:000003',
        statusCode: 400
      })
    }

    if (role.name !== name) {
      const existedRole = await this.prisma.identityRole.findFirst({
        where: {
          name: name
        }
      })

      if (existedRole) {
        throw new BadRequestException({
          message: 'Role already exists',
          error: 'Role:000002',
          statusCode: 400
        })
      }
    }

    return await this.prisma.identityRole.update({
      where: {
        id: id
      },
      data: {
        name: name,
        description: description
      }
    })
  }

  delete = async (id: string) => {
    const role = await this.getById(id)

    if (!role.canBeDeleted) {
      throw new BadRequestException({
        message: 'This role cannot be deleted',
        error: 'Role:000004',
        statusCode: 400
      })
    }

    return await this.prisma.$transaction(async (trx) => {
      await trx.userRole.deleteMany({ where: { roleId: id } })
      await trx.identityRole.delete({ where: { id: id } })
    })
  }

  getDefaultRole = async () => {
    return await this.prisma.identityRole.findMany({
      where: {
        name: 'STUDENT'
      }
    })
  }

  checkRoles = async (roles: string[]) => {
    if (!roles || roles.length === 0) {
      return []
    }

    const uniqueRoles = [...new Set(roles)]

    if (roles.length !== uniqueRoles.length) {
      return null
    }

    const existedRoles = await this.prisma.identityRole.findMany({
      where: {
        id: {
          in: uniqueRoles
        }
      }
    })

    if (uniqueRoles.length !== existedRoles.length) {
      return null
    }

    return existedRoles
  }
}
