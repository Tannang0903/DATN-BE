import { PrismaService } from '@db'
import { BadRequestException, Injectable } from '@nestjs/common'
import { isNotEmpty } from 'class-validator'
import { isEmpty } from 'lodash'
import { CreateEventOrganizationDto, GetEventOrganizationsDto, UpdateEventOrganizationDto } from './dto'
import { EventOrganization, Prisma } from '@prisma/client'
import { PaginatedResult, Pagination } from '@common/pagination'
import { getOrderBy, searchByMode } from '@common/utils'
import { UserService } from '@modules/users'
import { RoleService } from '@modules/roles'
import { RequestUser } from '@common/types'

@Injectable()
export class EventOrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  getByEmail = async (email: string) => {
    return await this.prisma.eventOrganization.findUnique({
      where: { email: email }
    })
  }

  getByName = async (name: string) => {
    return this.prisma.eventOrganization.findFirst({
      where: {
        name: name
      }
    })
  }

  getById = async (id: string) => {
    const eventOrganization = await this.prisma.eventOrganization.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        description: true,
        email: true,
        phone: true,
        address: true,
        imageUrl: true,
        identityId: true,
        eventOrganizationContacts: {
          select: {
            id: true,
            name: true,
            gender: true,
            birth: true,
            email: true,
            phone: true,
            address: true,
            imageUrl: true,
            position: true,
            eventOrganizationId: true
          }
        }
      }
    })

    if (isEmpty(eventOrganization)) {
      throw new BadRequestException({
        message: 'Event Organization with the given id does not exist',
        error: 'EventOrganization:000001',
        statusCode: 400
      })
    }

    return eventOrganization
  }

  getAll = async (
    user: RequestUser,
    params: GetEventOrganizationsDto
  ): Promise<PaginatedResult<EventOrganization[]>> => {
    const { search, sorting } = params

    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const whereConditions: Prisma.Enumerable<Prisma.EventOrganizationWhereInput> = []

    if (search) {
      whereConditions.push({
        OR: [
          {
            name: searchByMode(search)
          },
          {
            email: searchByMode(search)
          }
        ]
      })
    }

    if (!user.roles.includes('ADMIN')) {
      whereConditions.push({
        email: user.email
      })
    }

    const orderBy = getOrderBy<EventOrganization>({ defaultValue: 'name', order: sorting })

    const [total, eventOrganizations] = await Promise.all([
      this.prisma.eventOrganization.count({
        where: {
          AND: whereConditions
        }
      }),
      this.prisma.eventOrganization.findMany({
        where: {
          AND: whereConditions
        },
        select: {
          id: true,
          name: true,
          description: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true,
          eventOrganizationContacts: {
            select: {
              id: true,
              name: true,
              gender: true,
              birth: true,
              email: true,
              phone: true,
              address: true,
              imageUrl: true,
              position: true,
              eventOrganizationId: true
            }
          }
        },
        take: pageSize,
        skip: Number((page - 1) * pageSize),
        orderBy: orderBy
      })
    ])

    return Pagination.of(page, pageSize, total, eventOrganizations)
  }

  create = async (data: CreateEventOrganizationDto) => {
    const { name, description, email, phone, address, imageUrl } = data

    const existedEmail = await this.getByEmail(email)

    if (isNotEmpty(existedEmail)) {
      throw new BadRequestException({
        message: 'Event Organization with the given email has already existed',
        error: 'EventOrganization:000002',
        statusCode: 400
      })
    }

    const existedName = await this.getByName(name)

    if (isNotEmpty(existedName)) {
      throw new BadRequestException({
        message: 'Event Organization with the given name has already existed',
        error: 'EventOrganization:000003',
        statusCode: 400
      })
    }

    const role = await this.roleService.getByName('ORGANIZATION')

    const user = await this.userService.create({
      username: email,
      email: email,
      password: '12345678',
      fullname: name,
      imageUrl: imageUrl,
      rolesId: [role.id]
    })

    const eventOrganization = await this.prisma.eventOrganization.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        imageUrl,
        identityId: user.id
      }
    })

    return eventOrganization
  }

  update = async (id: string, data: UpdateEventOrganizationDto) => {
    const { name, description, phone, address, imageUrl } = data

    return await this.prisma.eventOrganization.update({
      where: {
        id
      },
      data: {
        name,
        description,
        phone,
        address,
        imageUrl
      }
    })
  }

  delete = async (id: string) => {
    const organization = await this.getById(id)

    await this.prisma.eventOrganization.delete({
      where: { id }
    })

    await this.userService.delete(organization.identityId)
  }
}
