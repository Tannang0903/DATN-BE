import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database'
import { EventStatisticDto, EventStatisticRecordDto, ProofStatisticDto, ProofStatisticRecordDto } from './dto'
import { EventStatus, ProofStatus } from '@prisma/client'
import { EventService } from '@modules/events'
import { RequestUser } from '@common/types'
import { GetEventsDto } from '@modules/events/dto'
import { RecurringFilterType } from './statistic.enum'

@Injectable()
export class StatisticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService
  ) {}

  getTotalStatistics = async () => {
    const totalStudents = await this.prisma.student.count()
    const totalEvents = await this.prisma.event.count()
    const totalOrganizations = await this.prisma.eventOrganization.count()
    const totalProofs = await this.prisma.proof.count()

    return {
      totalStudents: totalStudents,
      totalEvents: totalEvents,
      totalOrganizations: totalOrganizations,
      totalProofs: totalProofs
    }
  }

  getEventStatistics = async (user: RequestUser, dto: GetEventsDto): Promise<EventStatisticDto> => {
    const statisticStatuses = [
      EventStatus.Attendance,
      EventStatus.Happening,
      EventStatus.Registration,
      EventStatus.ClosedRegistration,
      EventStatus.Upcoming,
      EventStatus.Done,
      EventStatus.Expired,
      EventStatus.Rejected,
      EventStatus.Cancelled,
      EventStatus.Pending
    ]

    const dateTime = new Date()

    const { startAt, endAt } = this.getTimeFrame(dto.type, dateTime, new Date(dto.startDate), new Date(dto.endDate))

    const total = await this.prisma.event.count({
      where: {
        startAt: {
          gte: startAt
        },
        endAt: {
          lte: endAt
        }
      }
    })

    const { data: events } = await this.eventService.getAll(user, dto)

    const data: EventStatisticRecordDto[] = await Promise.all(
      statisticStatuses.map(async (status) => {
        const count = events.filter((event: any) => status === event.calculatedStatus)?.length

        return { status, count }
      })
    )

    return { total, data }
  }

  async getProofStatistics(user: RequestUser, dto: GetEventsDto): Promise<ProofStatisticDto> {
    const statisticStatuses = [ProofStatus.Pending, ProofStatus.Approved, ProofStatus.Rejected]

    const dateTime = new Date()

    const { startAt, endAt } = this.getTimeFrame(dto.type, dateTime, new Date(dto.startDate), new Date(dto.endDate))
    const total = await this.prisma.proof.count({
      where: {
        createdAt: {
          gte: startAt,
          lte: endAt
        }
      }
    })

    const data: ProofStatisticRecordDto[] = await Promise.all(
      statisticStatuses.map(async (status) => {
        const count = await this.prisma.proof.count({
          where: {
            proofStatus: status,
            createdAt: {
              gte: startAt,
              lte: endAt
            }
          }
        })

        return { status, count }
      })
    )

    return { total, data }
  }

  getTimeFrame = (type: RecurringFilterType, dateTime: Date, startAt?: Date, endAt?: Date) => {
    switch (type) {
      case RecurringFilterType.Today:
        return {
          startAt: new Date(dateTime.setHours(0, 0, 0, 0)),
          endAt: new Date(dateTime.setHours(23, 59, 59, 999))
        }
      case RecurringFilterType.ThisMonth:
        const startOfMonth = new Date(dateTime.getFullYear(), dateTime.getMonth(), 1)
        const endOfMonth = new Date(dateTime.getFullYear(), dateTime.getMonth() + 1, 0)
        return {
          startAt: new Date(startOfMonth.setHours(0, 0, 0, 0)),
          endAt: new Date(endOfMonth.setHours(23, 59, 59, 999))
        }
      case RecurringFilterType.ThisYear:
        const startOfYear = new Date(dateTime.getFullYear(), 0, 1)
        const endOfYear = new Date(dateTime.getFullYear(), 11, 31)
        return {
          startAt: new Date(startOfYear.setHours(0, 0, 0, 0)),
          endAt: new Date(endOfYear.setHours(23, 59, 59, 999))
        }
      case RecurringFilterType.Custom:
        return { startAt, endAt }
      default:
        return { startAt: dateTime, endAt: dateTime }
    }
  }
}
