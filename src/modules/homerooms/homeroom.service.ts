import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database'
import { Prisma } from '@prisma/client'
import { GetHomeRoomsDto } from './dto'

@Injectable()
export class HomeRoomService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (params: GetHomeRoomsDto) => {
    const whereConditions: Prisma.Enumerable<Prisma.HomeRoomWhereInput> = []

    if (params.facultyId) {
      whereConditions.push({
        faculty: {
          id: params.facultyId
        }
      })
    }

    const homeRooms = this.prisma.homeRoom.findMany({
      where: {
        AND: whereConditions
      },
      select: {
        id: true,
        name: true,
        faculty: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return homeRooms
  }
}
