import { PrismaService } from '@db'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Event, EventStatus, Prisma, RegisterStatus } from '@prisma/client'
import { getCurrentEventInfos, getCurrentEventStatus, getOrderBy, searchByMode } from '@common/utils'
import { Pagination } from '@common/pagination'
import { isEmpty } from 'lodash'
import { RequestUser, UserRole } from '@common/types'
import { CreateEventDto, GetEventsDto, RegisterEventDto, RejectStudentRegisterEventDto, UpdateEventDto } from './dto'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (user: RequestUser, params: GetEventsDto) => {
    const { startDate, endDate, eventType, eventStatus, search, sorting } = params

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

    if (eventType) {
      whereConditions.push({
        type: eventType
      })
    }

    if (startDate && !endDate) {
      whereConditions.push({
        startAt: startDate
      })
    } else if (!startDate && endDate) {
      whereConditions.push({
        endAt: endDate
      })
    } else if (startDate && endDate) {
      whereConditions.push({
        AND: [
          {
            startAt: startDate
          },
          {
            endAt: endDate
          }
        ]
      })
    }

    const orderBy = getOrderBy<Event>({ defaultValue: 'name', order: sorting })

    if (user) {
      if (user.roles.some((role) => role !== UserRole.ADMIN && role !== UserRole.STUDENT)) {
        whereConditions.push({
          createdBy: user.id
        })
      }
    }

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
        calculatedStatus: getCurrentEventStatus(
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

    const filteredByStatusListEvents = eventStatus
      ? listEvents.filter((event) => event.calculatedStatus === eventStatus)
      : listEvents

    const paginatedList = filteredByStatusListEvents.slice(
      Number((page - 1) * pageSize),
      Number((page - 1) * pageSize) + pageSize
    )

    return Pagination.of(page, pageSize, total, paginatedList)
  }

  getAllRegisteredStudent = async (id: string, params: GetEventsDto) => {
    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const [registeredStudents] = await Promise.all([
      this.prisma.studentEventRegister.findMany({
        where: {
          eventRole: {
            eventId: id
          }
        },
        select: {
          id: true,
          rejectReason: true,
          status: true,
          createdAt: true,
          description: true,
          eventRole: {
            select: {
              name: true
            }
          },
          student: {
            select: {
              id: true,
              code: true,
              fullname: true,
              email: true,
              phone: true,
              address: true,
              imageUrl: true,
              homeRoom: {
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

    const listRegisteredStudent = registeredStudents.map((studentRegistered) => {
      return {
        role: studentRegistered.eventRole.name,
        id: studentRegistered.id,
        code: studentRegistered.student.code,
        studentId: studentRegistered.student.id,
        name: studentRegistered.student.fullname,
        email: studentRegistered.student.email,
        phone: studentRegistered.student.phone,
        description: studentRegistered.description,
        rejectReason: studentRegistered.rejectReason,
        status: studentRegistered.status,
        imageUrl: studentRegistered.student.imageUrl,
        homeRoomName: studentRegistered.student.homeRoom.name,
        registeredAt: studentRegistered.createdAt
      }
    })

    return Pagination.of(page, pageSize, registeredStudents.length, listRegisteredStudent)
  }

  getById = async (user: RequestUser, id: string) => {
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
            role: true,
            eventOrganization: {
              select: {
                id: true,
                name: true,
                description: true,
                email: true,
                phone: true,
                address: true,
                imageUrl: true,
                createdAt: true
              }
            },
            organizationRepresentativesInEvent: {
              select: {
                role: true,
                eventOrganizationContact: true
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
                status: true,
                student: {
                  select: {
                    identityId: true
                  }
                }
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
                studentEventRegisterId: true,
                studentEventRegister: {
                  select: {
                    student: {
                      select: {
                        identityId: true
                      }
                    }
                  }
                }
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
      description: event.description,
      imageUrl: event.imageUrl,
      startAt: event.startAt,
      endAt: event.endAt,
      type: event.type,
      status: event.status,
      calculatedStatus: getCurrentEventStatus(
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
          status: getCurrentEventInfos(registration.startAt, registration.endAt)
        }
      }),
      eventAttendanceInfos: event.eventAttendanceInfos.map((attendance) => {
        return {
          id: attendance.id,
          startAt: attendance.startAt,
          endAt: attendance.endAt,
          code: attendance.code,
          status: getCurrentEventInfos(attendance.startAt, attendance.endAt)
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
          role: item.role,
          eventOrganizationContacts: item.organizationRepresentativesInEvent.map((contact) => {
            return {
              id: contact.eventOrganizationContact.id,
              name: contact.eventOrganizationContact.name,
              gender: contact.eventOrganizationContact.gender,
              birth: contact.eventOrganizationContact.birth,
              email: contact.eventOrganizationContact.email,
              phone: contact.eventOrganizationContact.phone,
              address: contact.eventOrganizationContact.address,
              imageUrl: contact.eventOrganizationContact.imageUrl,
              position: contact.eventOrganizationContact.position,
              role: contact.role
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
      }),
      isRegistered: user
        ? event.eventRoles.some((role) =>
            role.studentsEventRegister.some((student) => student.student.identityId === user.id)
          )
        : false,
      isAttendance: user
        ? event.eventAttendanceInfos.some((attendanceInfo) =>
            attendanceInfo.eventsAttendance.some((event) => event.studentEventRegister.student.identityId === user.id)
          )
        : false
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

      return event
    })
  }

  update = async (id: string, user: RequestUser, data: UpdateEventDto) => {
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

    const event = await this.getById(user, id)

    return await this.prisma.$transaction(async (trx) => {
      const updateEvent = await trx.event.update({
        where: { id },
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
          status: user.roles.includes(UserRole.ADMIN) ? EventStatus.Approved : EventStatus.Pending
        }
      })

      await trx.eventAttendanceInfo.deleteMany({ where: { eventId: event.id } })
      const createEventAttendancePromises = eventAttendanceInfos.map((attendanceInfo) => {
        return trx.eventAttendanceInfo.create({
          data: {
            startAt: new Date(attendanceInfo.startAt).toISOString(),
            endAt: new Date(attendanceInfo.endAt).toISOString(),
            eventId: event.id
          }
        })
      })

      await trx.eventRegistrationInfo.deleteMany({ where: { eventId: event.id } })
      const createEventRegistrationPromises = eventRegistrationInfos.map((registrationInfo) => {
        return trx.eventRegistrationInfo.create({
          data: {
            startAt: new Date(registrationInfo.startAt).toISOString(),
            endAt: new Date(registrationInfo.endAt).toISOString(),
            eventId: event.id
          }
        })
      })

      await trx.eventRole.deleteMany({ where: { eventId: event.id } })
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

      await trx.organizationInEvent.deleteMany({ where: { eventId: event.id } })
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

      return updateEvent
    })
  }

  cancel = async (id: string, user: RequestUser) => {
    await this.getById(user, id)

    if (user.roles.includes(UserRole.ADMIN)) {
      await this.prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.Cancelled
        }
      })
    }
  }

  approve = async (id: string, user: RequestUser) => {
    await this.getById(user, id)

    if (user.roles.includes(UserRole.ADMIN)) {
      await this.prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.Approved
        }
      })
    }
  }

  reject = async (id: string, user: RequestUser) => {
    await this.getById(user, id)

    if (user.roles.includes(UserRole.ADMIN)) {
      await this.prisma.event.update({
        where: { id },
        data: {
          status: EventStatus.Rejected
        }
      })
    }
  }

  register = async (user: RequestUser, data: RegisterEventDto) => {
    const { description, eventRoleId } = data

    const eventRole = await this.getEventRoleById(eventRoleId)

    if (eventRole.quantity <= eventRole.studentsEventRegister.length) {
      throw new BadRequestException({
        message: 'Event role is full',
        error: 'EventRole:000002',
        statusCode: 400
      })
    }

    const currentTime = new Date()

    const isRegistrationPeriod = eventRole.event.eventRegistrationInfos.some((info) => {
      const startTime = new Date(info.startAt)
      const endTime = new Date(info.endAt)

      return currentTime >= startTime && currentTime <= endTime
    })

    if (!isRegistrationPeriod) {
      throw new BadRequestException({
        message: 'Registration period is over',
        error: 'EventRole:000003',
        statusCode: 400
      })
    }

    const identityUser = await this.prisma.identityUser.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        student: {
          select: {
            id: true
          }
        }
      }
    })

    const studentRegisteredEvent = await this.prisma.studentEventRegister.findFirst({
      where: {
        studentId: identityUser.student.id,
        eventRole: {
          eventId: eventRole.event.id
        },
        status: EventStatus.Approved
      }
    })

    if (studentRegisteredEvent) {
      throw new BadRequestException({
        message: 'Student has already registered for an event',
        error: 'EventRole:000004',
        statusCode: 400
      })
    }

    if (isEmpty(identityUser)) {
      throw new BadRequestException({
        message: 'User does not exist',
        error: 'User:000001',
        statusCode: 400
      })
    }

    if (eventRole.isNeedApprove) {
      await this.prisma.studentEventRegister.create({
        data: {
          description,
          eventRoleId,
          studentId: identityUser.student.id,
          createdBy: identityUser.id,
          status: RegisterStatus.Pending,
          updatedBy: identityUser.id
        }
      })
    } else {
      await this.prisma.studentEventRegister.create({
        data: {
          description: description,
          status: RegisterStatus.Approved,
          studentId: identityUser.student.id,
          eventRoleId: eventRoleId,
          createdBy: identityUser.id,
          updatedBy: identityUser.id
        }
      })
    }
  }

  getEventRoleById = async (id: string) => {
    const eventRole = await this.prisma.eventRole.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        quantity: true,
        isNeedApprove: true,
        score: true,
        studentsEventRegister: {
          where: {
            status: RegisterStatus.Approved
          },
          select: {
            id: true
          }
        },
        event: {
          select: {
            id: true,
            eventRegistrationInfos: true
          }
        }
      }
    })

    if (isEmpty(eventRole)) {
      throw new BadRequestException({
        message: 'Event role does not exist',
        error: 'EventRole:000001',
        statusCode: 400
      })
    }

    return eventRole
  }

  approveRegister = async (id: string, eventRegisterId: string) => {
    const studentEventRegister = await this.prisma.studentEventRegister.findUnique({
      where: {
        studentId: id,
        id: eventRegisterId
      }
    })

    await this.prisma.studentEventRegister.update({
      where: {
        id: studentEventRegister.id
      },
      data: {
        status: RegisterStatus.Approved
      }
    })
  }

  rejectRegister = async (id: string, eventRegisterId: string, data: RejectStudentRegisterEventDto) => {
    const studentEventRegister = await this.prisma.studentEventRegister.findUnique({
      where: {
        studentId: id,
        id: eventRegisterId
      }
    })

    await this.prisma.studentEventRegister.update({
      where: {
        id: studentEventRegister.id
      },
      data: {
        status: RegisterStatus.Rejected,
        rejectReason: data.rejectReason
      }
    })
  }
}
