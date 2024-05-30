import { PrismaService } from '@db'
import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateEventDto, GetEventsDto } from './dto'
import { Event, EventAttendanceInfo, EventRegistrationInfo, EventStatus, Prisma, RegisterStatus } from '@prisma/client'
import { getOrderBy, searchByMode } from '@common/utils'
import { Pagination } from '@common/pagination'
import { isEmpty } from 'lodash'
import { RequestUser, UserRole } from '@common/types'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (params: GetEventsDto) => {
    const { search, sorting } = params

    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const whereConditions: Prisma.Enumerable<Prisma.EventWhereInput> = []

    if (search) {
      whereConditions.push({
        OR: [
          {
            name: searchByMode(search)
          }
        ]
      })
    }

    const orderBy = getOrderBy<Event>({ defaultValue: 'name', order: sorting })

    const [total, events] = await Promise.all([
      this.prisma.event.count({
        where: {
          AND: whereConditions
        }
      }),
      this.prisma.event.findMany({
        where: {
          AND: whereConditions
        },
        select: {
          id: true,
          name: true,
          introduction: true,
          description: true,
          imageUrl: true,
          startAt: true,
          endAt: true,
          type: true,
          fullAddress: true,
          longitude: true,
          latitude: true,
          status: true,
          organizationRepresentative: {
            select: {
              eventOrganization: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  address: true,
                  imageUrl: true
                }
              }
            }
          },
          eventActivity: {
            select: {
              id: true,
              maxScore: true,
              minScore: true,
              name: true,
              eventCategoryId: true
            }
          },
          eventRoles: {
            select: {
              quantity: true,
              studentsEventRegister: {
                select: {
                  id: true,
                  status: true
                }
              }
            }
          },
          eventAttendanceInfos: {
            select: {
              id: true,
              startAt: true,
              endAt: true,
              code: true,
              eventId: true,
              eventsAttendance: {
                select: {
                  studentEventRegisterId: true
                }
              }
            }
          },
          eventRegistrationInfos: {
            select: {
              id: true,

              startAt: true,
              endAt: true,
              eventId: true
            }
          }
        },
        take: pageSize,
        skip: Number((page - 1) * pageSize),
        orderBy: orderBy
      })
    ])

    const listEvents = events.map((event) => {
      return {
        id: event.id,
        name: event.name,
        introduction: event.introduction,
        description: event.introduction,
        imageUrl: event.imageUrl,
        startAt: event.startAt,
        endAt: event.endAt,
        type: event.type,
        status: event.status,
        calculatedStatus: this.getCurrentEventStatus(
          event.startAt,
          event.endAt,
          event.status,
          event.eventAttendanceInfos,
          event.eventRegistrationInfos
        ),
        activity: event.eventActivity,
        representativeOrganization: event.organizationRepresentative?.eventOrganization,
        address: {
          fullAddress: event.fullAddress,
          longitude: event.longitude,
          latitude: event.latitude
        },
        capacity: event.eventRoles.reduce((acc, curr) => acc + curr.quantity, 0),
        registered: event.eventRoles.reduce((acc, curr) => acc + curr.studentsEventRegister.length, 0),
        approvedRegistered: event.eventRoles.reduce(
          (acc, curr) =>
            acc +
            curr.studentsEventRegister.filter(
              (studentRegistered) => studentRegistered.status === RegisterStatus.Approved
            ).length,
          0
        ),
        attended: event.eventAttendanceInfos.reduce(
          (accAttendance, currAttendance) =>
            accAttendance +
            currAttendance.eventsAttendance.reduce((acc, curr) => acc + curr.studentEventRegisterId.length, 0),
          0
        )
      }
    })

    return Pagination.of(page, pageSize, total, listEvents)
  }

  getById = async (id: string) => {
    const event = await this.prisma.event.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        introduction: true,
        description: true,
        imageUrl: true,
        startAt: true,
        endAt: true,
        type: true,
        fullAddress: true,
        longitude: true,
        latitude: true,
        status: true,
        organizationsInEvent: {
          select: {
            eventOrganization: {
              select: {
                id: true,
                name: true,
                description: true,
                email: true,
                phone: true,
                address: true,
                imageUrl: true,
                createdAt: true,
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
                    position: true
                  }
                }
              }
            }
          }
        },
        organizationRepresentative: {
          select: {
            eventOrganization: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                imageUrl: true
              }
            }
          }
        },
        eventActivity: {
          select: {
            id: true,
            maxScore: true,
            minScore: true,
            name: true,
            eventCategoryId: true
          }
        },
        eventRoles: {
          select: {
            id: true,
            name: true,
            description: true,
            isNeedApprove: true,
            quantity: true,
            score: true,
            studentsEventRegister: {
              select: {
                id: true,
                status: true
              }
            }
          }
        },
        eventAttendanceInfos: {
          select: {
            id: true,
            startAt: true,
            endAt: true,
            code: true,
            eventId: true,
            eventsAttendance: {
              select: {
                studentEventRegisterId: true
              }
            }
          }
        },
        eventRegistrationInfos: {
          select: {
            id: true,
            startAt: true,
            endAt: true,
            eventId: true
          }
        }
      }
    })

    if (isEmpty(event)) {
      throw new BadRequestException({
        message: 'Event with given id does not exist',
        error: 'Event:000001',
        statusCode: 400
      })
    }

    const eventResult = {
      id: event.id,
      name: event.name,
      introduction: event.introduction,
      description: event.introduction,
      imageUrl: event.imageUrl,
      startAt: event.startAt,
      endAt: event.endAt,
      type: event.type,
      status: event.status,
      calculatedStatus: this.getCurrentEventStatus(
        event.startAt,
        event.endAt,
        event.status,
        event.eventAttendanceInfos,
        event.eventRegistrationInfos
      ),
      activity: event.eventActivity,
      eventRoles: event.eventRoles.map((role) => {
        return {
          id: role.id,
          name: role.name,
          description: role.description,
          isNeedApprove: role.isNeedApprove,
          score: role.score,
          quantity: role.quantity,
          isRegistered:
            role.studentsEventRegister.length >
            role.studentsEventRegister.filter(
              (studentRegistered) => studentRegistered.status === RegisterStatus.Approved
            ).length,
          registered: role.studentsEventRegister.length,
          approvedRegistered: role.studentsEventRegister.filter(
            (studentRegistered) => studentRegistered.status === RegisterStatus.Approved
          ).length
        }
      }),
      address: {
        fullAddress: event.fullAddress,
        longitude: event.longitude,
        latitude: event.latitude
      },
      eventRegistrationInfos: event.eventRegistrationInfos.map((registration) => {
        return {
          id: registration.id,
          startAt: registration.startAt,
          endAt: registration.endAt,
          status: this.getCurrentEventInfos(registration.startAt, registration.endAt)
        }
      }),
      eventAttendanceInfos: event.eventAttendanceInfos.map((attendance) => {
        return {
          id: attendance.id,
          startAt: attendance.startAt,
          endAt: attendance.endAt,
          code: attendance.code,
          status: this.getCurrentEventInfos(attendance.startAt, attendance.endAt)
        }
      }),
      eventOrganizations: event.organizationsInEvent.map((item) => {
        return {
          id: item.eventOrganization.id,
          name: item.eventOrganization.name,
          description: item.eventOrganization.description,
          email: item.eventOrganization.email,
          phone: item.eventOrganization.phone,
          address: item.eventOrganization.address,
          imageUrl: item.eventOrganization.imageUrl,
          createAt: item.eventOrganization.createdAt,
          eventOrganizationContacts: item.eventOrganization.eventOrganizationContacts.map((contact) => {
            return {
              id: contact.id,
              name: contact.name,
              gender: contact.gender,
              birth: contact.birth,
              email: contact.email,
              phone: contact.phone,
              address: contact.address,
              imageUrl: contact.imageUrl,
              position: contact.position
            }
          })
        }
      }),
      capacity: event.eventRoles.reduce((acc, curr) => acc + curr.quantity, 0),
      registered: event.eventRoles.reduce((acc, curr) => acc + curr.studentsEventRegister.length, 0),
      approvedRegistered: event.eventRoles.reduce(
        (acc, curr) =>
          acc +
          curr.studentsEventRegister.filter((studentRegistered) => studentRegistered.status === RegisterStatus.Approved)
            .length,
        0
      ),
      attended: event.eventAttendanceInfos.reduce(
        (accAttendance, currAttendance) =>
          accAttendance +
          currAttendance.eventsAttendance.reduce((acc, curr) => acc + curr.studentEventRegisterId.length, 0),
        0
      ),
      representativeOrganization: event.organizationRepresentative?.eventOrganization,
      hasOrganizedRegistration: event.eventRegistrationInfos.some((registrationInfo) => {
        const today = new Date()
        return today.getTime() >= registrationInfo.startAt.getTime()
      })
    }

    return eventResult
  }

  create = async (user: RequestUser, data: CreateEventDto) => {
    const {
      name,
      introduction,
      description,
      imageUrl,
      startAt,
      endAt,
      type,
      address,
      eventActivityId,
      eventAttendanceInfos,
      eventRegistrationInfos,
      eventRoles,
      organizationsInEvent,
      organizationRepresentativeId
    } = data

    return await this.prisma.$transaction(async (trx) => {
      const event = await trx.event.create({
        data: {
          name,
          introduction,
          description,
          imageUrl,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
          type,
          fullAddress: address.fullAddress,
          longitude: Number(address.longitude),
          latitude: Number(address.latitude),
          eventActivityId,
          status: user.roles.includes(UserRole.ADMIN) ? EventStatus.Approved : EventStatus.Pending,
          createdBy: user.id
        }
      })

      const createEventAttendancePromises = eventAttendanceInfos.map((attendanceInfo) => {
        return trx.eventAttendanceInfo.create({
          data: {
            startAt: new Date(attendanceInfo.startAt).toISOString(),
            endAt: new Date(attendanceInfo.endAt).toISOString(),
            eventId: event.id
          }
        })
      })

      const createEventRegistrationPromises = eventRegistrationInfos.map((registrationInfo) => {
        return trx.eventRegistrationInfo.create({
          data: {
            startAt: new Date(registrationInfo.startAt).toISOString(),
            endAt: new Date(registrationInfo.endAt).toISOString(),
            eventId: event.id
          }
        })
      })

      const createEventRoles = eventRoles.map((role) =>
        trx.eventRole.create({
          data: {
            name: role.name,
            description: role.description,
            score: Number(role.score),
            quantity: Number(role.quantity),
            isNeedApprove: role.isNeedApprove,
            eventId: event.id
          }
        })
      )

      const createOrganizationInEventPromises = organizationsInEvent.map((organization) =>
        trx.organizationInEvent.create({
          data: {
            organizationId: organization.organizationId,
            role: organization.role,
            eventId: event.id,
            organizationRepresentativesInEvent: {
              createMany: {
                data: organization.organizationRepresentativesInEvent.map(({ organizationContactId, role }) => ({
                  organizationContactId,
                  role
                })),
                skipDuplicates: true
              }
            }
          }
        })
      )

      await Promise.all([
        ...createEventAttendancePromises,
        ...createEventRegistrationPromises,
        ...createEventRoles,
        ...createOrganizationInEventPromises
      ])

      const representative = await trx.organizationInEvent.findUnique({
        where: {
          eventId_organizationId: {
            eventId: event.id,
            organizationId: organizationRepresentativeId
          }
        }
      })

      await trx.event.update({
        where: { id: event.id },
        data: {
          organizationRepresentative: {
            connect: {
              id: representative.id
            }
          }
        }
      })
    })
  }

  getCurrentEventStatus = (
    startAt: Date,
    endAt: Date,
    status: EventStatus,
    eventAttendanceInfos: EventAttendanceInfo[],
    eventRegistrationInfos: EventRegistrationInfo[]
  ) => {
    const now = new Date()
    if (
      status === 'Approved' &&
      startAt <= now &&
      endAt >= now &&
      eventAttendanceInfos.some((attendanceInfo) => attendanceInfo.startAt <= now && attendanceInfo.endAt >= now)
    ) {
      return 'Attendance'
    } else if (status === 'Approved' && startAt <= now && endAt >= now) {
      return 'Happening'
    } else if (
      status === 'Approved' &&
      startAt >= now &&
      eventRegistrationInfos.some(
        (registrationInfo) => now >= registrationInfo.startAt && now <= registrationInfo.endAt
      )
    ) {
      return 'Registration'
    } else if (
      status === 'Approved' &&
      startAt >= now &&
      eventRegistrationInfos.every((registrationInfo) => now >= registrationInfo.endAt)
    ) {
      return 'ClosedRegistration'
    } else if (status === 'Approved' && startAt >= now) {
      return 'Upcoming'
    } else if (status === 'Approved' && endAt <= now) {
      return 'Done'
    } else if (
      status === 'Pending' &&
      eventRegistrationInfos.some((registrationInfo) => registrationInfo.startAt <= now)
    ) {
      return 'Expired'
    }

    return status
  }

  getCurrentEventInfos = (startAt: Date, endAt: Date) => {
    const now = new Date()
    if (startAt <= now && endAt >= now) {
      return 'Happening'
    } else if (startAt >= now) {
      return 'Upcoming'
    } else if (endAt <= now) {
      return 'Done'
    }
  }
}
