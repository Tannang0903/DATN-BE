import { PrismaService } from '@db'
import { Injectable } from '@nestjs/common'
import { EventCategory } from '@prisma/client'

@Injectable()
export class EventCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (): Promise<EventCategory[]> => {
    return await this.prisma.eventCategory.findMany()
  }
}
