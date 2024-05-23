import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { PrismaClientExceptionFilter } from './filters'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { AuthModule } from '@modules/auth'
import { UserModule } from '@modules/users'
import { RoleModule } from '@modules/roles'
import { FacultyModule } from '@modules/faculties'
import { HomeRoomModule } from '@modules/homerooms'
import { EducationProgramModule } from '@modules/education-programs'
import { StudentModule } from '@modules/students'
import { CloudinaryModule } from '@modules/cloudinary'
import { EventModule } from '@modules/events'
import { EventCategoryModule } from '@modules/event-category'
import { EventActivityModule } from '@modules/event-activity'
import { EventOrganizationModule } from '@modules/event-organization'
import { EventOrganizationContactModule } from '@modules/event-organization-contact'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    RoleModule,
    FacultyModule,
    HomeRoomModule,
    EducationProgramModule,
    StudentModule,
    CloudinaryModule,
    EventModule,
    EventCategoryModule,
    EventActivityModule,
    EventOrganizationModule,
    EventOrganizationContactModule
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
