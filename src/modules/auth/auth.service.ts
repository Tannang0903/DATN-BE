import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database'
import { UserService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AdminRole, RequestUser, compareHash, hashPassword } from 'src/common'
import { ResetPasswordDto, getUsersPayload } from './dto'
import { MailService } from '../mail'
import { ChangePasswordDto } from './dto/change-password.dto'
import { isEmpty } from 'lodash'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService
  ) {}

  getTokens = async (userData: getUsersPayload) => {
    const user = {
      username: userData.username,
      email: userData.email,
      roles: userData.roles.map((role) => role.identityRole.name)
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userData.id,
          session: await hashPassword(Date.now().toString()),
          ...user
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '7d'
        }
      ),
      this.jwtService.signAsync(
        {
          id: userData.id,
          ...user
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d'
        }
      )
    ])

    return {
      accessToken,
      refreshToken
    }
  }

  verifyToken = async (token: string) => {
    const claims = await this.jwtService.verifyAsync<RequestUser>(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET')
    })

    const user = await this.userService.getById(claims.id)

    if (user) return claims
  }

  updateRefreshToken = async (userId: string, refreshToken: string) => {
    const hashedRefreshToken = await hashPassword(refreshToken)
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken
    })
  }

  adminLogin = async (userNameOrEmail: string, password: string) => {
    const user = await this.userService.getByUserNameOrEmail(userNameOrEmail)

    const isValidRole = user.roles.some((role) => Object.keys(AdminRole).includes(role.identityRole.name))
    if (!isValidRole) {
      throw new BadRequestException({
        message: 'User does not exist',
        error: 'User:000001',
        statusCode: 400
      })
    }

    const passwordMatches = await compareHash(password, user.hashedPassword)
    if (!passwordMatches) {
      throw new BadRequestException({
        message: 'Password is incorrect',
        error: 'User:000002',
        statusCode: 400
      })
    }

    const tokens = await this.getTokens(user)

    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  studentLogin = async (userNameOrEmail: string, password: string) => {
    const user = await this.userService.getByUserNameOrEmail(userNameOrEmail)

    const isValidRole = user.roles.some((role) => !Object.keys(AdminRole).includes(role.identityRole.name))
    if (!isValidRole) {
      throw new BadRequestException({
        message: 'User does not exist',
        error: 'User:000001',
        statusCode: 400
      })
    }

    const passwordMatches = await compareHash(password, user.hashedPassword)
    if (!passwordMatches) {
      throw new BadRequestException({
        message: 'Password is incorrect',
        error: 'User:000002',
        statusCode: 400
      })
    }

    const tokens = await this.getTokens(user)

    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }

  sendForgotPasswordEmail = async (email: string, callBackUrl: string) => {
    const user = await this.userService.getByEmail(email)

    const existedToken = await this.prisma.verificationToken.findFirst({
      where: {
        userId: user.id
      }
    })

    const newToken = {
      token: await hashPassword(new Date().toISOString()),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      userId: user.id
    }

    if (isEmpty(existedToken)) {
      await this.prisma.verificationToken.create({
        data: newToken
      })
    } else {
      await this.prisma.verificationToken.update({
        where: {
          id: existedToken.id
        },
        data: newToken
      })
    }

    await this.mailService.sendResetPasswordToken(user.email, newToken.token, callBackUrl)
  }

  resetPassword = async (resetPasswordDto: ResetPasswordDto) => {
    const { email, token, password } = resetPasswordDto

    await this.userService.getByEmail(email)

    const resetToken = await this.prisma.verificationToken.findFirst({
      where: {
        AND: [
          { token },
          {
            identityUser: {
              email: email
            }
          }
        ]
      }
    })

    if (isEmpty(resetToken) || Date.now() > resetToken.expiresAt.getTime()) {
      throw new BadRequestException({
        message: 'Access token is still valid',
        error: 'InvalidToken',
        statusCode: 400
      })
    }

    await this.prisma.$transaction(async (trx) => {
      await trx.identityUser.update({
        where: {
          email
        },
        data: {
          hashedPassword: await hashPassword(password)
        }
      })
      await trx.verificationToken.delete({
        where: { id: resetToken.id }
      })
    })
  }

  changePassword = async (reqUser: RequestUser, changePasswordDto: ChangePasswordDto) => {
    const { oldPassword, newPassword } = changePasswordDto

    if (oldPassword === newPassword) {
      throw new BadRequestException({
        message: 'You are input the same password',
        error: 'User:000003',
        statusCode: 400
      })
    }

    const user = await this.userService.getById(reqUser.id)

    const isOldPassword = await compareHash(oldPassword, user.hashedPassword)

    if (!isOldPassword) {
      throw new BadRequestException({
        message: 'You have inputted a wrong password',
        error: 'User:000004',
        statusCode: 400
      })
    }

    const hashedPassword = await hashPassword(newPassword)

    await this.prisma.identityUser.update({
      where: {
        id: reqUser.id
      },
      data: {
        hashedPassword: hashedPassword
      }
    })
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.getById(userId)

    if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied')

    const refreshTokenMatches = await compareHash(refreshToken, user.refreshToken)

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(user)

    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return tokens
  }
}
