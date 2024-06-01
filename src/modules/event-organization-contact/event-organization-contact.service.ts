import { PrismaService } from '@db'
import { BadRequestException, Injectable } from '@nestjs/common'
import { isNotEmpty } from 'class-validator'
import { isEmpty } from 'lodash'
import { EventOrganizationContact, Prisma } from '@prisma/client'
import { PaginatedResult, Pagination } from '@common/pagination'
import {
  CreateEventOrganizationContactDto,
  GetEventOrganizationContactsDto,
  UpdateEventOrganizationContactDto
} from './dto'
import { UserService } from '@modules/users'
import { validateBirth } from '@common/utils'
import { EventOrganizationService } from '@modules/event-organization/event-organization.service'
import { RoleService } from '@modules/roles'

@Injectable()
export class EventOrganizationContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly eventOrganizationService: EventOrganizationService,
    private readonly roleService: RoleService
  ) {}

  getByEmail = async (email: string) => {
    return await this.prisma.eventOrganizationContact.findUnique({
      where: { email: email }
    })
  }

  getById = async (id: string) => {
    const eventOrganizationContact = await this.prisma.eventOrganizationContact.findUnique({
      where: { id: id }
    })

    if (isEmpty(eventOrganizationContact)) {
      throw new BadRequestException({
        message: 'Event Organization Contact with the given id does not exist',
        error: 'EventOrganizationContact:000001',
        statusCode: 400
      })
    }

    return eventOrganizationContact
  }

  getByOrganizationId = async (
    id: string,
    params: GetEventOrganizationContactsDto
  ): Promise<PaginatedResult<EventOrganizationContact[]>> => {
    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const whereConditions: Prisma.Enumerable<Prisma.EventOrganizationContactWhereInput> = []

    await this.eventOrganizationService.getById(id)
    whereConditions.push({
      eventOrganization: {
        id: id
      }
    })

    const [total, eventOrganizationContacts] = await Promise.all([
      this.prisma.eventOrganizationContact.count({
        where: {
          AND: whereConditions
        }
      }),
      this.prisma.eventOrganizationContact.findMany({
        where: {
          AND: whereConditions
        },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          gender: true,
          birth: true,
          email: true,
          phone: true,
          position: true,
          address: true,
          eventOrganizationId: true
        },
        take: pageSize,
        skip: Number((page - 1) * pageSize)
      })
    ])

    return Pagination.of(page, pageSize, total, eventOrganizationContacts)
  }

  create = async (id: string, data: CreateEventOrganizationContactDto) => {
    const { name, email, phone, address, imageUrl, birth, gender, position } = data

    await this.eventOrganizationService.getById(id)

    const existedEmail = await this.getByEmail(email)

    if (isNotEmpty(existedEmail)) {
      throw new BadRequestException({
        message: 'Event Organization Contact with the given email has already existed',
        error: 'EventOrganizationContact:000002',
        statusCode: 400
      })
    }

    const validateDob = validateBirth(birth)

    if (!validateDob) {
      throw new BadRequestException({
        message: 'Organization Contact must be more than 18 years old',
        error: 'EventOrganizationContact:000003',
        statusCode: 400
      })
    }

    const role = await this.roleService.getByName('ORGANIZATION CONTACT')

    const user = await this.userService.create({
      username: email,
      email: email,
      password: '12345678',
      fullname: name,
      imageUrl: imageUrl,
      rolesId: [role.id]
    })

    const eventOrganizationContact = await this.prisma.eventOrganizationContact.create({
      data: {
        name,
        email,
        phone,
        address,
        imageUrl,
        birth: new Date(birth),
        gender,
        eventOrganizationId: id,
        position,
        identityId: user.id
      }
    })

    return eventOrganizationContact
  }

  update = async (id: string, contactId: string, data: UpdateEventOrganizationContactDto) => {
    const { name, phone, address, imageUrl, birth, gender, position } = data

    await this.eventOrganizationService.getById(id)

    await this.getById(contactId)

    const validateDob = validateBirth(birth)

    if (!validateDob) {
      throw new BadRequestException({
        message: 'Organization Contact must be more than 18 years old',
        error: 'EventOrganizationContact:000003',
        statusCode: 400
      })
    }

    return await this.prisma.eventOrganizationContact.update({
      where: {
        id: contactId
      },
      data: {
        name,
        phone,
        address,
        imageUrl,
        birth: new Date(birth),
        gender,
        eventOrganizationId: id,
        position
      }
    })
  }

  delete = async (id: string, contactId: string) => {
    await this.eventOrganizationService.getById(id)

    const contact = await this.getById(contactId)

    await this.prisma.eventOrganizationContact.delete({
      where: {
        id: contactId,
        eventOrganization: {
          id: id
        }
      }
    })

    await this.userService.delete(contact.identityId)
  }
}
