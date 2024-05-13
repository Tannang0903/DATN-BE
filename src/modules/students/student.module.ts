import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { StudentController } from './student.controller'
import { StudentService } from './student.service'
import { UserModule } from '../users/users.module'

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService]
})
export class StudentModule {}
