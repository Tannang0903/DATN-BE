import { PrismaService } from '@db'
import { Injectable } from '@nestjs/common'
import { EventCategory, Prisma } from '@prisma/client'
import { GetEventCategoriesDto } from './dto'

@Injectable()
export class EventCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (params: GetEventCategoriesDto): Promise<EventCategory[]> => {
    const { type } = params

    const whereConditions: Prisma.Enumerable<Prisma.EventCategoryWhereInput> = []

    if (type) {
      whereConditions.push({
        type
      })
    }

    return await this.prisma.eventCategory.findMany({
      where: {
        AND: whereConditions
      },
      orderBy: {
        name: 'asc'
      }
    })
  }
}
