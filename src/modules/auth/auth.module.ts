import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '../users'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AccessTokenStrategy } from 'src/strategy'
import { MailModule } from '../mail'

@Module({
  imports: [DatabaseModule, UserModule, JwtModule.register({}), PassportModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy]
})
export class AuthModule {}
