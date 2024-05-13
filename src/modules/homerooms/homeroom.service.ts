import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/database'
import { Prisma } from '@prisma/client'
import { GetHomeRoomsDto } from './dto'
import { isEmpty } from 'lodash'

@Injectable()
export class HomeRoomService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (params: GetHomeRoomsDto) => {
    const { facultyId } = params

    const whereConditions: Prisma.Enumerable<Prisma.HomeRoomWhereInput> = []

    if (facultyId) {
      const faculty = await this.prisma.faculty.findUnique({
        where: { id: facultyId }
      })

      if (isEmpty(faculty)) {
        throw new NotFoundException('The home room does not exist')
      }

      whereConditions.push({
        faculty: {
          id: facultyId
        }
      })
    }

    return await this.prisma.homeRoom.findMany({
      where: {
        AND: whereConditions
      }
    })
  }
}