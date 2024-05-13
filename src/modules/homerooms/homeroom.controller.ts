import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { HomeRoomService } from './homeroom.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { GetHomeRoomsDto } from './dto'

@Controller()
@ApiTags('HomeRoom')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class HomeRoomController {
  constructor(private readonly homeRoomService: HomeRoomService) {}

  @Get('homerooms')
  @HttpCode(HttpStatus.OK)
  async getAllHomeRooms(@Query() params: GetHomeRoomsDto) {
    return await this.homeRoomService.getAll(params)
  }
}
