import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { EducationProgramController } from './education-program.controller'
import { EducationProgramService } from './education-program.service'

@Module({
  imports: [DatabaseModule],
  controllers: [EducationProgramController],
  providers: [EducationProgramService],
  exports: [EducationProgramService]
})
export class EducationProgramModule {}
