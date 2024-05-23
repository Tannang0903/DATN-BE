import { PrismaService } from '@db'
import { BadRequestException, Injectable } from '@nestjs/common'
import { isNotEmpty } from 'class-validator'
import { isEmpty } from 'lodash'
import { CreateEventOrganizationDto, GetEventOrganizationsDto, UpdateEventOrganizationDto } from './dto'
import { EventOrganization, Prisma } from '@prisma/client'
import { PaginatedResult, Pagination } from '@common/pagination'
import { getOrderBy, searchByMode } from '@common/utils'

@Injectable()
export class EventOrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  getByEmail = async (email: string) => {
    return await this.prisma.eventOrganization.findUnique({
      where: { email: email }
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
            organizationId: true
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

  getAll = async (params: GetEventOrganizationsDto): Promise<PaginatedResult<EventOrganization[]>> => {
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
              organizationId: true
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

    const eventOrganization = await this.prisma.eventOrganization.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        imageUrl
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
    await this.getById(id)

    return await this.prisma.eventOrganization.delete({
      where: { id }
    })
  }
}
