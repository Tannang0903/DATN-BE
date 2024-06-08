import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database'
import { ProofController } from './proof.controller'
import { ProofService } from './proof.service'
import { EventModule } from '@modules/events'

@Module({
  imports: [DatabaseModule, EventModule],
  controllers: [ProofController],
  providers: [ProofService],
  exports: [ProofService]
})
export class ProofModule {}
