import { Module } from '@nestjs/common'
import { UserService } from './users.service'
import { UserController } from './users.controller'
import { DatabaseModule } from 'src/database'
import { RoleModule } from '../roles/role.module'

@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
