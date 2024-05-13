import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { UserService } from './users.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { ReqUser, RequestUser } from 'src/common'

@Controller()
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@ReqUser() user: RequestUser) {
    return await this.userService.getProfile(user)
  }
}
