import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common'
import { HomeRoomService } from './homeroom.service'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
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
  @ApiQuery({ name: 'facultyId', required: false })
  async getAllHomeRooms(@Query() params: GetHomeRoomsDto) {
    return await this.homeRoomService.getAll(params)
  }
}
