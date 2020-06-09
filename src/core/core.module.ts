import { Module } from '@nestjs/common'

import { HazelcastClientService } from './hazelcastClient.service'

@Module({
  providers: [HazelcastClientService],
  exports: [HazelcastClientService],
})
export class CoreModule {}
