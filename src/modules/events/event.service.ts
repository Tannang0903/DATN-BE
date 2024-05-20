import { PrismaService } from '@db'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}
}
