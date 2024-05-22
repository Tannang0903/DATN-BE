import { Injectable } from '@nestjs/common'
import { Faculty } from '@prisma/client'
import { PrismaService } from 'src/database'

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (): Promise<Faculty[]> => {
    return await this.prisma.faculty.findMany({
      orderBy: {
        name: 'asc'
      }
    })
  }
}
