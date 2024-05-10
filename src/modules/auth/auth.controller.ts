import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ChangePasswordDto, ForgotPasswordDto, LoginCredentialDto, ResetPasswordDto } from './dto'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { AccessTokenGuard } from 'src/guard'
import { ReqUser } from 'src/common/decorator'
import { RequestUser } from 'src/common'

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    description: 'Example request body for logging in',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' }
      },
      example: {
        email: 'admin@gmail.com',
        password: 'admin123'
      }
    }
  })
  login(@Body() data: LoginCredentialDto) {
    const { email, password } = data
    return this.authService.login(email, password)
  }

  @Post('forgot-password')
  @ApiBody({
    description: 'Example request body for forgetting password',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' }
      },
      example: {
        email: 'tannang09032002@gmail.com'
      }
    }
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.sendForgotPasswordEmail(forgotPasswordDto.email)
  }

  @Post('reset-password')
  @ApiBody({
    description: 'Example request body for resetting password',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        token: { type: 'string' },
        password: { type: 'string' }
      },
      example: {
        email: 'tannang09032002@gmail.com',
        token: '$2b$10$guWWPiaqSEyznEeMsUwKeulmmBFDTb.M9bBI9wIxPBh/wwrnqeU.K',
        password: '12345678'
      }
    }
  })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Post('change-password')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiBody({
    description: 'Example request body for logging in',
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' }
      },
      example: {
        oldPassword: '12345678',
        newPassword: 'tannang'
      }
    }
  })
  async changePassword(@ReqUser() user: RequestUser, @Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(user, body)
  }
}
