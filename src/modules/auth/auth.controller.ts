import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ChangePasswordDto, ForgotPasswordDto, LoginCredentialDto, ResetPasswordDto } from './dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard, RefreshTokenGuard } from 'src/guard'
import { ReqUser } from 'src/common/decorator'
import { RequestUser } from 'src/common'
import { Request } from 'express'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() loginCredentialDto: LoginCredentialDto) {
    const { userNameOrEmail, password } = loginCredentialDto
    return await this.authService.adminLogin(userNameOrEmail, password)
  }

  @Post('student/login')
  async studentLogin(@Body() loginCredentialDto: LoginCredentialDto) {
    const { userNameOrEmail, password } = loginCredentialDto
    return await this.authService.studentLogin(userNameOrEmail, password)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email, callBackUrl } = forgotPasswordDto
    return await this.authService.sendForgotPasswordEmail(email, callBackUrl)
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto)
  }

  @Post('change-password')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async changePassword(@ReqUser() user: RequestUser, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.authService.changePassword(user, changePasswordDto)
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['id']
    const refreshToken = req.user['refreshToken']
    return await this.authService.refreshTokens(userId, refreshToken)
  }
}
