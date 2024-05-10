import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/users'
import { PrismaClientExceptionFilter } from './filters'
import { APP_FILTER } from '@nestjs/core'
import { RoleModule } from './modules/roles'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UserModule, RoleModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter
    }
  ]
})
export class AppModule {}
