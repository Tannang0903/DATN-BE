import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database'

@Injectable()
export class EducationProgramService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async () => {
    const programs = this.prisma.educationProgram.findMany({
      select: {
        id: true,
        name: true,
        requiredActivityScore: true,
        requiredCredit: true
      }
    })
    return programs
  }
}
