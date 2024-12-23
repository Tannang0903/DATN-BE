import { PrismaService } from '@db'
import { Injectable, NotFoundException } from '@nestjs/common'
import { GetEventActivitiesDto } from './dto'
import { Prisma } from '@prisma/client'
import { isEmpty } from 'lodash'

@Injectable()
export class EventActivityService {
  constructor(private readonly prisma: PrismaService) {}

  getByCategoryId = async (id: string) => {
    const whereConditions: Prisma.Enumerable<Prisma.EventActivityWhereInput> = []

    if (id) {
      const category = await this.prisma.eventCategory.findUnique({
        where: { id: id }
      })

      if (isEmpty(category)) {
        throw new NotFoundException({
          message: 'Event category with given id does not exist',
          error: 'EventCategory:000001',
          statusCode: 400
        })
      }

      whereConditions.push({
        eventCategoryId: id
      })
    }

    return await this.prisma.eventActivity.findMany({
      where: {
        AND: whereConditions
      },
      orderBy: {
        name: 'asc'
      }
    })
  }

  getAll = async (params: GetEventActivitiesDto) => {
    const { type } = params

    const whereConditions: Prisma.Enumerable<Prisma.EventActivityWhereInput> = []

    if (type) {
      whereConditions.push({
        eventCategory: {
          type: type
        }
      })
    }

    return await this.prisma.eventActivity.findMany({
      where: {
        AND: whereConditions
      },
      orderBy: {
        name: 'asc'
      }
    })
  }
}
