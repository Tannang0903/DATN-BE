import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { HomeRoomController } from './homeroom.controller'
import { HomeRoomService } from './homeroom.service'

@Module({
  imports: [DatabaseModule],
  controllers: [HomeRoomController],
  providers: [HomeRoomService],
  exports: [HomeRoomService]
})
export class HomeRoomModule {}
