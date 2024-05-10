import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { FacultyController } from './faculty.controller'
import { FacultyService } from './faculty.service'

@Module({
  imports: [DatabaseModule],
  controllers: [FacultyController],
  providers: [FacultyService],
  exports: [FacultyService]
})
export class FacultyModule {}
