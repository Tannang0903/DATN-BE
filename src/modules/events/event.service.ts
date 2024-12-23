import { PrismaService } from '@db'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Event, EventStatus, Prisma, RegisterStatus } from '@prisma/client'
import { getCurrentEventInfos, getCurrentEventStatus, getOrderBy, searchByMode } from '@common/utils'
import { Pagination } from '@common/pagination'
import { isEmpty } from 'lodash'
import { RequestUser, UserRole } from '@common/types'
import {
  AttendanceEventDto,
  CreateEventDto,
  GetEventsDto,
  RegisterEventDto,
  EventAttendanceInfoDto,
  EventRegistrationInfoDto,
  RejectStudentRegisterEventDto,
  UpdateEventDto
} from './dto'
import { GetAllEventsOrderByEnum } from './event.enum'
import * as qrCode from 'qrcode'
import * as geolib from 'geolib'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (user: RequestUser, params: GetEventsDto) => {
    const { startDate, endDate, eventType, eventStatus, search, sorting, isPaging } = params

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
        startAt: {
          gte: new Date(startDate)
        }
      })
    } else if (!startDate && endDate) {
      whereConditions.push({
        endAt: {
          lte: new Date(endDate)
        }
      })
    } else if (startDate && endDate) {
      whereConditions.push({
        AND: [
          {
            startAt: {
              gte: new Date(startDate)
            }
          },
          {
            endAt: {
              lte: new Date(endDate)
            }
          }
        ]
      })
    }

    const mappedOrder = {
      [GetAllEventsOrderByEnum.REPRESENTATIVE_ORGANIZATION]: 'organizationRepresentative.eventOrganization.name'
    }

    const orderBy = getOrderBy<Event>({ defaultValue: 'name', order: sorting, mappedOrder })

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
              qrcode: true,
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

    const result =
      isPaging === false
        ? filteredByStatusListEvents
        : filteredByStatusListEvents.slice(Number((page - 1) * pageSize), Number((page - 1) * pageSize) + pageSize)

    return Pagination.of(page, pageSize, total, result)
  }

  getAllRegisteredStudent = async (eventId: string, params: GetEventsDto) => {
    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const [registeredStudents] = await Promise.all([
      this.prisma.studentEventRegister.findMany({
        where: {
          eventRole: {
            eventId
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

  getAllAttendanceStudent = async (eventId: string, params: GetEventsDto) => {
    const pageSize = params.pageSize ? params.pageSize : 10
    const page = params.page ? params.page : 1

    const [attendanceStudents] = await Promise.all([
      this.prisma.studentEventAttendance.findMany({
        where: {
          eventAttendanceInfo: {
            eventId
          }
        },
        select: {
          id: true,
          attendanceAt: true,
          studentEventRegister: {
            select: {
              eventRole: {
                select: {
                  name: true,
                  score: true
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
            }
          }
        },
        take: pageSize,
        skip: Number((page - 1) * pageSize)
      })
    ])

    const listRegisteredStudent = attendanceStudents.map((studentAttendance) => {
      return {
        id: studentAttendance.studentEventRegister.student.id,
        code: studentAttendance.studentEventRegister.student.code,
        name: studentAttendance.studentEventRegister.student.fullname,
        email: studentAttendance.studentEventRegister.student.email,
        phone: studentAttendance.studentEventRegister.student.phone,
        imageUrl: studentAttendance.studentEventRegister.student.imageUrl,
        role: studentAttendance.studentEventRegister.eventRole.name,
        homeRoomName: studentAttendance.studentEventRegister.student.homeRoom.name,
        score: studentAttendance.studentEventRegister.eventRole.score,
        attendanceAt: studentAttendance.attendanceAt
      }
    })

    return Pagination.of(page, pageSize, listRegisteredStudent.length, listRegisteredStudent)
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
            qrcode: true,
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
          status: getCurrentEventInfos(attendance.startAt, attendance.endAt),
          qrCode: attendance.qrcode
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

  getAllAttendanceByStudentId = async (studentId: string) => {
    const attendanceStudents = await this.prisma.studentEventAttendance.findMany({
      where: {
        studentEventRegister: {
          student: {
            id: studentId
          }
        }
      },
      select: {
        eventAttendanceInfo: {
          select: {
            event: {
              select: {
                name: true,
                organizationRepresentative: {
                  select: {
                    eventOrganization: {
                      select: {
                        name: true
                      }
                    }
                  }
                },
                startAt: true,
                endAt: true
              }
            }
          }
        },
        studentEventRegister: {
          select: {
            eventRole: {
              select: {
                name: true,
                score: true
              }
            }
          }
        },
        attendanceAt: true
      }
    })

    return attendanceStudents.map((attend) => {
      return {
        name: attend.eventAttendanceInfo.event.name,
        representativeOrganization: {
          name: attend.eventAttendanceInfo.event.organizationRepresentative.eventOrganization.name
        },
        startAt: attend.eventAttendanceInfo.event.startAt,
        endAt: attend.eventAttendanceInfo.event.endAt,
        role: attend.studentEventRegister.eventRole.name,
        score: attend.studentEventRegister.eventRole.score,
        attendanceAt: attend.attendanceAt
      }
    })
  }

  createAttendanceInfoDto = async (eventAttendanceInfo: EventAttendanceInfoDto) => {
    const code = Math.random().toString(36).substring(2, 15)
    const link = `http://52.163.115.250:4173/events/attendance?code=${code}`
    const qrCodeUrl = await qrCode.toDataURL(link)
    return {
      ...eventAttendanceInfo,
      code,
      qrCode: qrCodeUrl
    }
  }

  validateAttendanceInfo = (eventAttendanceInfos: EventAttendanceInfoDto[], startAt: string, endAt: string) => {
    // Event attendance times are overlapping
    for (let i = 0; i < eventAttendanceInfos.length; i++) {
      for (let j = i + 1; j < eventAttendanceInfos.length; j++) {
        const startA = new Date(eventAttendanceInfos[i].startAt).getTime()
        const endA = new Date(eventAttendanceInfos[i].endAt).getTime()
        const startB = new Date(eventAttendanceInfos[j].startAt).getTime()
        const endB = new Date(eventAttendanceInfos[j].endAt).getTime()

        if (startA < endB && startB < endA) {
          throw new BadRequestException({
            message: 'Event attendance times are overlapping',
            error: 'EventAttendance:000001',
            statusCode: 400
          })
        }
      }
    }

    // Attendance times must be within event times
    const eventStartAt = new Date(startAt).getTime()
    const eventEndAt = new Date(endAt).getTime()

    eventAttendanceInfos.every((info) => {
      const attendanceStartAt = new Date(info.startAt).getTime()
      const attendanceEndAt = new Date(info.endAt).getTime()
      if (!(attendanceStartAt >= eventStartAt && attendanceEndAt <= eventEndAt)) {
        throw new BadRequestException({
          message: 'Attendance times must be within event times',
          error: 'EventAttendance:000002',
          statusCode: 400
        })
      }
    })
  }

  validateRegistrationInfo = (eventRegistrationInfos: EventRegistrationInfoDto[], startAt: string) => {
    // Event registration times are overlapping
    for (let i = 0; i < eventRegistrationInfos.length; i++) {
      for (let j = i + 1; j < eventRegistrationInfos.length; j++) {
        const startA = new Date(eventRegistrationInfos[i].startAt).getTime()
        const endA = new Date(eventRegistrationInfos[i].endAt).getTime()
        const startB = new Date(eventRegistrationInfos[j].startAt).getTime()
        const endB = new Date(eventRegistrationInfos[j].endAt).getTime()

        if (startA < endB && startB < endA) {
          throw new BadRequestException({
            message: 'Event registration times are overlapping',
            error: 'EventRegistration:000001',
            statusCode: 400
          })
        }
      }
    }

    // Registration times must be before event start time
    const eventStartAt = new Date(startAt).getTime()

    eventRegistrationInfos.forEach((info) => {
      const registrationEndAt = new Date(info.endAt).getTime()
      if (!(registrationEndAt <= eventStartAt)) {
        throw new BadRequestException({
          message: 'Registration times must end before event start time',
          error: 'EventRegistration:000002',
          statusCode: 400
        })
      }
    })
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

    this.validateAttendanceInfo(eventAttendanceInfos, startAt, endAt)

    this.validateRegistrationInfo(eventRegistrationInfos, startAt)

    const createAttendanceInfosDto = await Promise.all(eventAttendanceInfos.map(this.createAttendanceInfoDto))

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

      const createEventAttendancePromises = createAttendanceInfosDto.map((attendanceInfo) => {
        return trx.eventAttendanceInfo.create({
          data: {
            startAt: new Date(attendanceInfo.startAt).toISOString(),
            endAt: new Date(attendanceInfo.endAt).toISOString(),
            eventId: event.id,
            code: `http://localhost:4000/events/attendance?code=${attendanceInfo.code}`,
            qrcode: attendanceInfo.qrCode
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

    this.validateAttendanceInfo(eventAttendanceInfos, startAt, endAt)

    this.validateRegistrationInfo(eventRegistrationInfos, startAt)

    const createAttendanceInfosDto = await Promise.all(eventAttendanceInfos.map(this.createAttendanceInfoDto))

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
      const createEventAttendancePromises = createAttendanceInfosDto.map((attendanceInfo) => {
        return trx.eventAttendanceInfo.create({
          data: {
            startAt: new Date(attendanceInfo.startAt).toISOString(),
            endAt: new Date(attendanceInfo.endAt).toISOString(),
            eventId: event.id,
            code: attendanceInfo.code,
            qrcode: attendanceInfo.qrCode
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
        error: 'Event:000002',
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
        error: 'Student:000006',
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

  attendance = async (user: RequestUser, data: AttendanceEventDto) => {
    const eventAttendanceInfo = await this.prisma.eventAttendanceInfo.findUnique({
      where: {
        code: data.code
      },
      select: {
        id: true,
        code: true,
        eventId: true,
        event: {
          select: {
            latitude: true,
            longitude: true
          }
        }
      }
    })

    const listAttendancesPeriod = await this.prisma.eventAttendanceInfo.findMany({
      where: {
        eventId: eventAttendanceInfo.eventId
      },
      select: {
        startAt: true,
        endAt: true
      }
    })

    const currentTime = new Date()

    const isAttendancePeriod = listAttendancesPeriod.some((info) => {
      const startTime = new Date(info.startAt)
      const endTime = new Date(info.endAt)

      return currentTime >= startTime && currentTime <= endTime
    })

    if (!isAttendancePeriod) {
      throw new BadRequestException({
        message: 'Attendance period is over',
        error: 'Event:000003',
        statusCode: 400
      })
    }

    if (eventAttendanceInfo) {
      const studentEventRegister = await this.prisma.studentEventRegister.findFirst({
        where: {
          student: {
            identityId: user.id
          },
          eventRole: {
            eventId: eventAttendanceInfo.eventId
          },
          status: RegisterStatus.Approved
        }
      })

      const ListAttendanceStudent = await this.prisma.studentEventAttendance.findMany()

      if (studentEventRegister) {
        const isAttendancePeriod = ListAttendanceStudent.some((attendance) => {
          return attendance.studentEventRegisterId.includes(studentEventRegister.id)
        })

        if (isAttendancePeriod) {
          throw new BadRequestException({
            message: 'Student has already attended the event',
            error: 'Student:000007',
            statusCode: 400
          })
        }

        const distance = geolib.getDistance(
          {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude)
          },
          {
            latitude: eventAttendanceInfo.event.latitude.toNumber(),
            longitude: eventAttendanceInfo.event.longitude.toNumber()
          }
        )

        if (distance > 200) {
          throw new BadRequestException({
            message: 'You need attendance in event address',
            error: 'Student:000008',
            statusCode: 400
          })
        }

        await this.prisma.studentEventAttendance.create({
          data: {
            studentEventRegisterId: studentEventRegister.id,
            eventAttendanceInfoId: eventAttendanceInfo.id
          }
        })
      } else {
        throw new BadRequestException({
          message: 'Student has not registered for the event',
          error: 'Student:000009',
          statusCode: 400
        })
      }
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
