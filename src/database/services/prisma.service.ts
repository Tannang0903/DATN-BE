import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query'> implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  private logger = new Logger(PrismaService.name)

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' }
      ],
      errorFormat: 'colorless'
    })
    this.$on('query', (e) => {
      this.logger.debug(`query: ${e.query}, params: ${e.params}, duration: ${e.duration}ms`)
    })
  }
}
