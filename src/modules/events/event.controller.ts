import { Controller, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { EventService } from './event.service'

@Controller()
@ApiTags('Event')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}
}
