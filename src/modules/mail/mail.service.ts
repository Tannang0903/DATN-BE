import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendResetPasswordToken = async (email: string, token: string, callBackUrl: string) => {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Token',
      template: './resetPasswordToken',
      context: {
        token,
        callBackUrl
      }
    })
  }
}
