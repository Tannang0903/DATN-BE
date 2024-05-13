import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/database/services'
import { CreateRoleDto } from './dto'
import { IdentityRole } from '@prisma/client'
import { UpdateRoleDto } from './dto/update-role.dto'

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  getById = async (id: string) => {
    return await this.prisma.identityRole.findUniqueOrThrow({
      where: { id }
    })
  }

  getAll = async (): Promise<IdentityRole[]> => {
    return await this.prisma.identityRole.findMany()
  }

  create = async (createRoleDto: CreateRoleDto) => {
    const { name, description } = createRoleDto

    const existedRole = await this.prisma.identityRole.findFirst({
      where: { name }
    })

    if (existedRole) {
      throw new BadRequestException('This role name has been used.')
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

    if (!role) {
      throw new NotFoundException('The requested role does not exist.')
    }

    if (!role.canBeUpdated) {
      throw new BadRequestException('This role cannot be updated.')
    }

    if (role.name !== name) {
      const existedRole = await this.prisma.identityRole.findFirst({
        where: {
          name: name
        }
      })

      if (existedRole) throw new BadRequestException('A role with given name already exists. Please try again.')
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

    if (!role) {
      throw new NotFoundException('The requested role does not exist.')
    }

    if (!role.canBeDeleted) {
      throw new BadRequestException('This role cannot be deleted.')
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
