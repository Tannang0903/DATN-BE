import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './modules/auth'
import { UserModule } from './modules/users'
import { PrismaClientExceptionFilter } from './filters'
import { APP_FILTER } from '@nestjs/core'
import { RoleModule } from './modules/roles'
import { FacultyModule } from './modules/faculties'
import { HomeRoomModule } from './modules/homerooms'
import { EducationProgramModule } from './modules/education-programs'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    RoleModule,
    FacultyModule,
    HomeRoomModule,
    EducationProgramModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PrismaClientExceptionFilter
    }
  ]
})
export class AppModule {}
