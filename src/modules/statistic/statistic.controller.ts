import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { StatisticService } from './statistic.service'
import { RequestUser } from '@common/types'
import { GetEventsDto } from '@modules/events/dto'
import { ReqUser } from '@common/decorator'
import { EventStatisticDto, ProofStatisticDto } from './dto'

@Controller()
@ApiBearerAuth()
@ApiTags('Statistic')
@UseGuards(AccessTokenGuard)
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getTotalStatistics() {
    return await this.statisticService.getTotalStatistics()
  }

  @Get('events/statistic')
  @HttpCode(HttpStatus.OK)
  async getEventsStatistic(@ReqUser() user: RequestUser, @Query() params: GetEventsDto): Promise<EventStatisticDto> {
    return this.statisticService.getEventStatistics(user, params)
  }

  @Get('proofs/statistic')
  async getProofsStatistic(@ReqUser() user: RequestUser, @Query() params: GetEventsDto): Promise<ProofStatisticDto> {
    return this.statisticService.getProofStatistics(user, params)
  }
}
