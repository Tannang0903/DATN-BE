import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ChangePasswordDto, ForgotPasswordDto, LoginCredentialDto, ResetPasswordDto } from './dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { ReqUser } from 'src/common/decorator'
import { RequestUser } from 'src/common'

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginCredentialDto: LoginCredentialDto) {
    const { email, password } = loginCredentialDto
    return await this.authService.login(email, password)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto
    return await this.authService.sendForgotPasswordEmail(email)
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
}
