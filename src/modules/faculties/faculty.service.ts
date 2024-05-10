import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database'

@Injectable()
export class FacultyService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async () => {
    const faculties = this.prisma.faculty.findMany({
      select: {
        id: true,
        name: true
      }
    })
    return faculties
  }
}
