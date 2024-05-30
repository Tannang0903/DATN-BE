import { Prisma } from '@prisma/client'

export type EventEntity = Prisma.EventGetPayload<{
  select: {
    id: true
    name: true
    introduction: true
    description: true
    imageUrl: true
    startAt: true
    endAt: true
    type: true
    fullAddress: true
    longitude: true
    latitude: true
    status: true
    organizationRepresentative: {
      select: {
        eventOrganization: {
          select: {
            id: true
            name: true
            email: true
            phone: true
            address: true
            imageUrl: true
          }
        }
      }
    }
    eventActivity: {
      select: {
        id: true
        maxScore: true
        minScore: true
        name: true
        eventCategoryId: true
      }
    }
    eventRoles: {
      select: {
        quantity: true
        studentsEventRegister: {
          select: {
            id: true
            status: true
          }
        }
      }
    }
    eventAttendanceInfos: {
      select: {
        startAt: true
        endAt: true
        eventsAttendance: {
          select: {
            studentEventRegisterId: true
          }
        }
      }
    }
    eventRegistrationInfos: {
      select: {
        startAt: true
        endAt: true
      }
    }
  }
}>
