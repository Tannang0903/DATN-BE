import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { StatisticController } from './statistic.controller'
import { StatisticService } from './statistic.service'
import { EventModule } from '@modules/events'

@Module({
  imports: [DatabaseModule, EventModule],
  controllers: [StatisticController],
  providers: [StatisticService],
  exports: [StatisticService]
})
export class StatisticModule {}
