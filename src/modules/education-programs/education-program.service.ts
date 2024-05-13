import { Injectable } from '@nestjs/common'
import { EducationProgram } from '@prisma/client'
import { PrismaService } from 'src/database'

@Injectable()
export class EducationProgramService {
  constructor(private readonly prisma: PrismaService) {}

  getAll = async (): Promise<EducationProgram[]> => {
    return await this.prisma.educationProgram.findMany()
  }
}
